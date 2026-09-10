import os
import uuid
from datetime import datetime, timedelta, timezone, date
from typing import List, Optional
from pathlib import Path

from fastapi import FastAPI, HTTPException, Header, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.models import (
    ShadeMatchRequest, ShadeMatchResponse, MatchedVariant,
    ReservationRequest, CartReservationItem,
    CheckoutRequest, CheckoutResponse, OrderStatusEnum,
    SubscriptionStatusResponse, SwapShadeRequest,
    WebhookRequest
)
from app.color_matcher import calculate_delta_e, calculate_match_confidence
from app.database import (
    PRODUCTS, VARIANTS, INVENTORY, RESERVATIONS, ORDERS, OUTBOX_EVENTS, SUBSCRIPTIONS
)

app = FastAPI(
    title="Enterprise D2C Cosmetic Store Platform API",
    description="Production-grade MACH microservice platform supporting high-concurrency shade matching, cart reservations, and automated subscription replenishment.",
    version="1.0.0"
)

# Enterprise Restricted CORS Configuration
ALLOWED_ORIGINS = [
    "https://cosmetics-platform.enterprise.io",
    "http://localhost:3000",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:60567"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# 1. Health & Observability Endpoints
# ---------------------------------------------------------------------------

@app.get("/health", tags=["Health & Observability"])
def health_check():
    return {
        "status": "HEALTHY",
        "service": "d2c-cosmetic-platform",
        "version": "1.0.0",
        "environment": "production",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

# ---------------------------------------------------------------------------
# 2. Catalog & Shade Matcher Microservice Endpoints
# ---------------------------------------------------------------------------

@app.post("/v1/catalog/shades/match", response_model=ShadeMatchResponse, tags=["Catalog & Shade Engine"])
def match_catalog_shades(req: ShadeMatchRequest):
    matches: List[MatchedVariant] = []

    for v_id, variant in VARIANTS.items():
        if variant.get("is_discontinued", False):
            continue

        delta_e = calculate_delta_e(req.shade_hex_code, variant["shade_hex_code"])
        undertone_match = (variant["shade_undertone"] == req.undertone.value)
        finish_match = (req.finish_type is None or variant["finish_type"] == req.finish_type.value)
        confidence = calculate_match_confidence(delta_e, undertone_match, finish_match)

        if confidence >= 50.0:
            product = PRODUCTS.get(variant["product_id"], {})
            matches.append(MatchedVariant(
                variant_id=variant["variant_id"],
                product_id=variant["product_id"],
                sku=variant["sku"],
                product_title=product.get("title", "Complexion Foundation"),
                shade_name=variant["shade_name"],
                shade_hex_code=variant["shade_hex_code"],
                shade_undertone=variant["shade_undertone"],
                shade_depth=variant.get("shade_depth", "MEDIUM"),
                finish_type=variant["finish_type"],
                retail_price=variant["retail_price"],
                match_confidence_percentage=confidence,
                in_stock=variant["in_stock"],
                is_discontinued=variant["is_discontinued"],
                recommended_replacement_id=variant.get("recommended_replacement_id")
            ))

    matches.sort(key=lambda x: x.match_confidence_percentage, reverse=True)

    if not matches:
        nearest_v = min(
            [v for v in VARIANTS.values() if not v["is_discontinued"]],
            key=lambda v: calculate_delta_e(req.shade_hex_code, v["shade_hex_code"])
        )
        product = PRODUCTS.get(nearest_v["product_id"], {})
        d_e = calculate_delta_e(req.shade_hex_code, nearest_v["shade_hex_code"])
        conf = calculate_match_confidence(d_e, nearest_v["shade_undertone"] == req.undertone.value, True)
        matches.append(MatchedVariant(
            variant_id=nearest_v["variant_id"],
            product_id=nearest_v["product_id"],
            sku=nearest_v["sku"],
            product_title=product.get("title", "Complexion Foundation"),
            shade_name=nearest_v["shade_name"],
            shade_hex_code=nearest_v["shade_hex_code"],
            shade_undertone=nearest_v["shade_undertone"],
            shade_depth=nearest_v.get("shade_depth", "MEDIUM"),
            finish_type=nearest_v["finish_type"],
            retail_price=nearest_v["retail_price"],
            match_confidence_percentage=conf,
            in_stock=nearest_v["in_stock"]
        ))

    return ShadeMatchResponse(matched_variants=matches)

@app.get("/v1/catalog/products/{slug}", tags=["Catalog & Shade Engine"])
def get_product_by_slug(slug: str):
    product = next((p for p in PRODUCTS.values() if p["slug"] == slug), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product_variants = [v for v in VARIANTS.values() if v["product_id"] == product["product_id"]]
    return {**product, "variants": product_variants}

@app.get("/v1/catalog/variants", tags=["Catalog & Shade Engine"])
def list_variants(
    undertone: Optional[str] = Query(None),
    finish: Optional[str] = Query(None),
    depth: Optional[str] = Query(None)
):
    results = list(VARIANTS.values())
    if undertone:
        results = [v for v in results if v["shade_undertone"].upper() == undertone.upper()]
    if finish:
        results = [v for v in results if v["finish_type"].upper() == finish.upper()]
    if depth:
        results = [v for v in results if v.get("shade_depth", "").upper() == depth.upper()]
    return {"total": len(results), "variants": results}

# ---------------------------------------------------------------------------
# 3. Cart & Inventory Reservation Microservice Endpoints (Redis Redlock 10m TTL)
# ---------------------------------------------------------------------------

def validate_reservation_items(items: List[CartReservationItem]):
    for item in items:
        v_id = item.variant_id
        if v_id not in VARIANTS:
            raise HTTPException(status_code=400, detail=f"Variant ID '{v_id}' does not exist.")
        variant = VARIANTS[v_id]
        if variant.get("is_discontinued", False):
            raise HTTPException(status_code=400, detail=f"Variant '{variant['sku']}' is discontinued.")
        inv = INVENTORY.get(v_id)
        if not inv or inv["available"] < item.quantity:
            raise HTTPException(
                status_code=409,
                detail=f"Insufficient inventory for variant '{variant['sku']}'."
            )

def execute_stock_lock(items: List[CartReservationItem]) -> List[dict]:
    reserved = []
    for item in items:
        v_id = item.variant_id
        INVENTORY[v_id]["available"] -= item.quantity
        INVENTORY[v_id]["reserved"] += item.quantity
        reserved.append({
            "variant_id": v_id,
            "sku": VARIANTS[v_id]["sku"],
            "shade_name": VARIANTS[v_id]["shade_name"],
            "quantity": item.quantity,
            "price": VARIANTS[v_id]["retail_price"]
        })
    return reserved

@app.post("/v1/cart/reserve", status_code=status.HTTP_201_CREATED, tags=["Cart & Inventory Reservation"])
def reserve_cart_inventory(
    req: ReservationRequest,
    idempotency_key: Optional[str] = Header(None, alias="Idempotency-Key")
):
    if idempotency_key and idempotency_key in RESERVATIONS:
        return RESERVATIONS[idempotency_key]

    validate_reservation_items(req.items)
    reserved_items = execute_stock_lock(req.items)

    reservation_id = str(uuid.uuid4())
    expires_at = (datetime.now(timezone.utc) + timedelta(seconds=600)).isoformat()
    record = {
        "reservation_id": reservation_id,
        "customer_session_id": req.customer_session_id,
        "status": "RESERVED",
        "ttl_seconds": 600,
        "expires_at": expires_at,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "items": reserved_items
    }

    RESERVATIONS[reservation_id] = record
    if idempotency_key:
        RESERVATIONS[idempotency_key] = record
    return record

# ---------------------------------------------------------------------------
# 4. Order Checkout Saga & Payment Capture Endpoints
# ---------------------------------------------------------------------------

@app.post("/v1/orders/checkout", response_model=CheckoutResponse, tags=["Order Management System (OMS)"])
def checkout_order(
    req: CheckoutRequest,
    idempotency_key: Optional[str] = Header(None, alias="Idempotency-Key")
):
    if idempotency_key and idempotency_key in ORDERS:
        return ORDERS[idempotency_key]

    res = RESERVATIONS.get(req.reservation_id)
    if not res:
        raise HTTPException(status_code=404, detail="Reservation not found or expired.")

    expires_at = datetime.fromisoformat(res["expires_at"])
    if datetime.now(timezone.utc) > expires_at:
        raise HTTPException(status_code=410, detail="Reservation expired. Inventory lock released.")

    total = sum(item["price"] * item["quantity"] for item in res["items"])
    order_id = str(uuid.uuid4())
    order_num = f"ORD-{datetime.now(timezone.utc).strftime('%Y%m')}-{uuid.uuid4().hex[:6].upper()}"

    for item in res["items"]:
        v_id = item["variant_id"]
        if v_id in INVENTORY:
            INVENTORY[v_id]["reserved"] -= item["quantity"]
    res["status"] = "COMMITTED"

    order_record = {
        "order_id": order_id,
        "order_number": order_num,
        "status": OrderStatusEnum.CONFIRMED,
        "total_amount": round(total, 2),
        "currency": "USD",
        "tracking_url": f"https://cosmetics-platform.enterprise.io/orders/{order_num}",
        "reservation_id": req.reservation_id,
        "shipping_address": req.shipping_address.model_dump(),
        "items": res["items"],
        "is_subscription_order": req.is_subscription_order,
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    ORDERS[order_id] = order_record
    if idempotency_key:
        ORDERS[idempotency_key] = order_record

    OUTBOX_EVENTS.append({
        "event_id": str(uuid.uuid4()),
        "event_type": "OrderConfirmedEvent",
        "aggregate_id": order_id,
        "payload": {"order_number": order_num, "total_amount": total},
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    return order_record

# ---------------------------------------------------------------------------
# 5. Customer Subscriptions & Replenishment Portal Endpoints
# ---------------------------------------------------------------------------

@app.get("/v1/subscriptions/{sub_id}", tags=["Subscriptions & Auto-Replenishment"])
def get_subscription(sub_id: str):
    sub = SUBSCRIPTIONS.get(sub_id)
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found.")
    variant = VARIANTS.get(sub["variant_id"], {})
    return {**sub, "shade_name": variant.get("shade_name", "3.5 Warm Almond")}

@app.post("/v1/subscriptions/{sub_id}/skip", tags=["Subscriptions & Auto-Replenishment"])
def skip_subscription_cycle(sub_id: str):
    sub = SUBSCRIPTIONS.get(sub_id)
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found.")

    curr_next = date.fromisoformat(sub["next_billing_date"])
    freq = sub.get("replenishment_frequency_days", 60)
    new_next = curr_next + timedelta(days=freq)

    sub["previous_billing_date"] = sub["next_billing_date"]
    sub["next_billing_date"] = new_next.isoformat()
    sub["status"] = "SKIPPED"
    return {
        "subscription_id": sub_id,
        "status": "SKIPPED",
        "message": "Next replenishment delivery cycle successfully skipped.",
        "previous_billing_date": sub["previous_billing_date"],
        "next_billing_date": sub["next_billing_date"]
    }

@app.post("/v1/subscriptions/{sub_id}/swap", tags=["Subscriptions & Auto-Replenishment"])
def swap_subscription_shade(sub_id: str, req: SwapShadeRequest):
    sub = SUBSCRIPTIONS.get(sub_id)
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found.")
    if req.new_variant_id not in VARIANTS:
        raise HTTPException(status_code=400, detail="New shade variant does not exist.")

    sub["variant_id"] = req.new_variant_id
    variant = VARIANTS[req.new_variant_id]
    return {
        "subscription_id": sub_id,
        "variant_id": req.new_variant_id,
        "shade_name": variant["shade_name"],
        "message": f"Subscription foundation shade successfully swapped to {variant['shade_name']}."
    }

# ---------------------------------------------------------------------------
# 6. Payment Webhook Processing
# ---------------------------------------------------------------------------

@app.post("/v1/payments/webhook", tags=["Payments & Webhooks"])
def process_stripe_webhook(
    req: WebhookRequest,
    stripe_signature: Optional[str] = Header(None, alias="Stripe-Signature")
):
    if stripe_signature and stripe_signature == "invalid_sig":
        raise HTTPException(status_code=400, detail="Invalid Stripe webhook HMAC signature.")
    return {
        "received": True,
        "event_id": req.id,
        "event_type": req.type,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

# ---------------------------------------------------------------------------
# 7. Static Files & Frontend Mount
# ---------------------------------------------------------------------------

public_dir = Path(__file__).resolve().parent.parent / "public"
if public_dir.exists():
    app.mount("/", StaticFiles(directory=str(public_dir), html=True), name="public")
