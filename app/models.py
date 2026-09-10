from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field, field_validator
import re

class UndertoneEnum(str, Enum):
    WARM = "WARM"
    COOL = "COOL"
    NEUTRAL = "NEUTRAL"
    OLIVE = "OLIVE"

class FinishEnum(str, Enum):
    MATTE = "MATTE"
    DEWY = "DEWY"
    SATIN = "SATIN"
    NATURAL = "NATURAL"
    SHEER = "SHEER"

class DepthEnum(str, Enum):
    FAIR = "FAIR"
    LIGHT = "LIGHT"
    MEDIUM = "MEDIUM"
    TAN = "TAN"
    DEEP = "DEEP"

class SubscriptionStatusEnum(str, Enum):
    ACTIVE = "ACTIVE"
    SKIPPED = "SKIPPED"
    PAUSED = "PAUSED"
    CANCELLED = "CANCELLED"

class OrderStatusEnum(str, Enum):
    CONFIRMED = "CONFIRMED"
    PROCESSING = "PROCESSING"
    PAYMENT_FAILED = "PAYMENT_FAILED"
    FULFILLED = "FULFILLED"
    CANCELLED = "CANCELLED"

class ShadeMatchRequest(BaseModel):
    shade_hex_code: str = Field(...)
    undertone: UndertoneEnum = Field(...)
    finish_type: Optional[FinishEnum] = Field(default=FinishEnum.DEWY)
    product_category_id: Optional[str] = None

    @field_validator('shade_hex_code')
    @classmethod
    def validate_hex(cls, v: str) -> str:
        if not re.match(r"^#[0-9a-fA-F]{6}$", v):
            raise ValueError("INVALID_HEX_FORMAT")
        return v.lower()

class MatchedVariant(BaseModel):
    variant_id: str
    product_id: str
    sku: str
    product_title: str
    shade_name: str
    shade_hex_code: str
    shade_undertone: str
    shade_depth: str
    finish_type: str
    retail_price: float
    match_confidence_percentage: float
    in_stock: bool
    is_discontinued: bool = False
    recommended_replacement_id: Optional[str] = None

class ShadeMatchResponse(BaseModel):
    matched_variants: List[MatchedVariant]

class CartReservationItem(BaseModel):
    variant_id: str
    quantity: int = Field(..., ge=1, le=5)

class ReservationRequest(BaseModel):
    customer_session_id: str
    items: List[CartReservationItem]

class ReservationResponse(BaseModel):
    reservation_id: str
    customer_session_id: str
    status: str
    ttl_seconds: int = 600
    expires_at: str
    items: List[Dict[str, Any]]

class Address(BaseModel):
    street_1: str
    street_2: Optional[str] = None
    city: str
    state_province: str
    postal_code: str
    country_iso2: str = "US"

class CheckoutRequest(BaseModel):
    reservation_id: str
    payment_token: str
    shipping_address: Address
    is_subscription_order: bool = False
    replenishment_frequency_days: Optional[int] = None

class CheckoutResponse(BaseModel):
    order_id: str
    order_number: str
    status: OrderStatusEnum
    total_amount: float
    currency: str = "USD"
    tracking_url: str

class SubscriptionStatusResponse(BaseModel):
    subscription_id: str
    status: SubscriptionStatusEnum
    replenishment_frequency_days: int
    discount_percentage: float
    previous_billing_date: Optional[str] = None
    next_billing_date: str
    variant_id: str
    shade_name: Optional[str] = None

class SwapShadeRequest(BaseModel):
    new_variant_id: str

class WebhookRequest(BaseModel):
    id: str
    type: str
    data: Dict[str, Any] = {}
