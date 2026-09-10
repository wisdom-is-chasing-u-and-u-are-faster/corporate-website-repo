from datetime import datetime, timedelta, date
from typing import Dict, List, Optional, Any
import uuid

# In-Memory Datastore initialized with PostgreSQL 16 seed state
BRANDS = {
    "b0000000-0000-0000-0000-000000000001": {
        "brand_id": "b0000000-0000-0000-0000-000000000001",
        "brand_name": "AURA LUXE Cosmetics",
        "slug": "aura-luxe",
        "description": "Luxury clean high-performance complexion and skincare formulas"
    },
    "b0000000-0000-0000-0000-000000000002": {
        "brand_id": "b0000000-0000-0000-0000-000000000002",
        "brand_name": "VELVET NOIR Complexion",
        "slug": "velvet-noir",
        "description": "Inclusive shade ranges tailored for high-concurrency viral drops"
    }
}

PRODUCTS = {
    "1d43ffbb-7432-4467-8e6d-d7790bcf5d61": {
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "brand_id": "b0000000-0000-0000-0000-000000000001",
        "title": "Luminous Radiance Serum Foundation",
        "slug": "luminous-radiance-serum-foundation",
        "description": "A 50-shade weightless foundation with hydrating hyaluronic acid and photoluminescent micro-pigments.",
        "base_price": 48.00,
        "is_active": True
    },
    "2e43ffbb-7432-4467-8e6d-d7790bcf5d62": {
        "product_id": "2e43ffbb-7432-4467-8e6d-d7790bcf5d62",
        "brand_id": "b0000000-0000-0000-0000-000000000002",
        "title": "Soft-Focus Velvet Concealer",
        "slug": "soft-focus-velvet-concealer",
        "description": "Full-coverage crease-proof complexion perfecting concealer in 20 harmonized shades.",
        "base_price": 32.00,
        "is_active": True
    }
}

VARIANTS: Dict[str, Dict[str, Any]] = {
    # Fair Range
    "d9b2d63d-a233-4f16-92f7-bc6024beee01": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee01",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-100W",
        "shade_name": "100W Fair Alabaster Warm",
        "shade_hex_code": "#fae7d0",
        "shade_undertone": "WARM",
        "shade_depth": "FAIR",
        "finish_type": "DEWY",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    "d9b2d63d-a233-4f16-92f7-bc6024beee02": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee02",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-105C",
        "shade_name": "105C Fair Porcelain Cool",
        "shade_hex_code": "#f7ded0",
        "shade_undertone": "COOL",
        "shade_depth": "FAIR",
        "finish_type": "DEWY",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    "d9b2d63d-a233-4f16-92f7-bc6024beee03": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee03",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-110N",
        "shade_name": "110N Fair Ivory Neutral",
        "shade_hex_code": "#f9e4d4",
        "shade_undertone": "NEUTRAL",
        "shade_depth": "FAIR",
        "finish_type": "MATTE",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    "d9b2d63d-a233-4f16-92f7-bc6024beee04": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee04",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-115O",
        "shade_name": "115O Fair Chiffon Olive",
        "shade_hex_code": "#f2deb8",
        "shade_undertone": "OLIVE",
        "shade_depth": "FAIR",
        "finish_type": "NATURAL",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    "d9b2d63d-a233-4f16-92f7-bc6024beee05": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee05",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-120W",
        "shade_name": "120W Fair Bisque Warm",
        "shade_hex_code": "#f5dcc1",
        "shade_undertone": "WARM",
        "shade_depth": "FAIR",
        "finish_type": "SATIN",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    # Light Range
    "d9b2d63d-a233-4f16-92f7-bc6024beee06": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee06",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-130W",
        "shade_name": "130W Light Warm Vanilla",
        "shade_hex_code": "#edd0b4",
        "shade_undertone": "WARM",
        "shade_depth": "LIGHT",
        "finish_type": "DEWY",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    "d9b2d63d-a233-4f16-92f7-bc6024beee07": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee07",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-135C",
        "shade_name": "135C Light Cool Rose",
        "shade_hex_code": "#ebcbb8",
        "shade_undertone": "COOL",
        "shade_depth": "LIGHT",
        "finish_type": "MATTE",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    "d9b2d63d-a233-4f16-92f7-bc6024beee08": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee08",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-140N",
        "shade_name": "140N Light Neutral Crepe",
        "shade_hex_code": "#eecfb3",
        "shade_undertone": "NEUTRAL",
        "shade_depth": "LIGHT",
        "finish_type": "NATURAL",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    "d9b2d63d-a233-4f16-92f7-bc6024beee09": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee09",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-145O",
        "shade_name": "145O Light Olive Nude",
        "shade_hex_code": "#e4c89e",
        "shade_undertone": "OLIVE",
        "shade_depth": "LIGHT",
        "finish_type": "SATIN",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    "d9b2d63d-a233-4f16-92f7-bc6024beee10": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee10",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-150W",
        "shade_name": "150W Light Warm Sand",
        "shade_hex_code": "#e5c3a3",
        "shade_undertone": "WARM",
        "shade_depth": "LIGHT",
        "finish_type": "DEWY",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    # Medium Range
    "d9b2d63d-a233-4f16-92f7-bc6024beee11": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee11",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-200W",
        "shade_name": "200W Medium Golden Wheat",
        "shade_hex_code": "#dcba98",
        "shade_undertone": "WARM",
        "shade_depth": "MEDIUM",
        "finish_type": "DEWY",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    "d9b2d63d-a233-4f16-92f7-bc6024beee12": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee12",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-210C",
        "shade_name": "210C Medium Cool Petal",
        "shade_hex_code": "#d8b29c",
        "shade_undertone": "COOL",
        "shade_depth": "MEDIUM",
        "finish_type": "MATTE",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    "d9b2d63d-a233-4f16-92f7-bc6024beee13": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee13",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-220N",
        "shade_name": "220N Medium Neutral Amber",
        "shade_hex_code": "#d3ab8a",
        "shade_undertone": "NEUTRAL",
        "shade_depth": "MEDIUM",
        "finish_type": "NATURAL",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    "d9b2d63d-a233-4f16-92f7-bc6024beee14": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee14",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-225O",
        "shade_name": "225O Medium Olive Biscotti",
        "shade_hex_code": "#c9a376",
        "shade_undertone": "OLIVE",
        "shade_depth": "MEDIUM",
        "finish_type": "SATIN",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    "d9b2d63d-a233-4f16-92f7-bc6024beee15": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee15",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-230W",
        "shade_name": "230W Medium Honey Warm",
        "shade_hex_code": "#c68642",
        "shade_undertone": "WARM",
        "shade_depth": "MEDIUM",
        "finish_type": "DEWY",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    "d9b2d63d-a233-4f16-92f7-bc6024beee16": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee16",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-240N",
        "shade_name": "240N Medium Golden Beige",
        "shade_hex_code": "#c29b77",
        "shade_undertone": "NEUTRAL",
        "shade_depth": "MEDIUM",
        "finish_type": "MATTE",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    "d9b2d63d-a233-4f16-92f7-bc6024beee17": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee17",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-250O",
        "shade_name": "250O Medium Warm Ochre",
        "shade_hex_code": "#b88d5e",
        "shade_undertone": "OLIVE",
        "shade_depth": "MEDIUM",
        "finish_type": "NATURAL",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    # Tan Range
    "d9b2d63d-a233-4f16-92f7-bc6024beee18": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee18",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-300W",
        "shade_name": "300W Tan Warm Caramel",
        "shade_hex_code": "#a8784d",
        "shade_undertone": "WARM",
        "shade_depth": "TAN",
        "finish_type": "DEWY",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    "d9b2d63d-a233-4f16-92f7-bc6024beee19": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee19",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-310C",
        "shade_name": "310C Tan Cool Cinnamon",
        "shade_hex_code": "#9f6a4d",
        "shade_undertone": "COOL",
        "shade_depth": "TAN",
        "finish_type": "MATTE",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    "d9b2d63d-a233-4f16-92f7-bc6024beee20": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee20",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-320N",
        "shade_name": "320N Tan Neutral Pecan",
        "shade_hex_code": "#976541",
        "shade_undertone": "NEUTRAL",
        "shade_depth": "TAN",
        "finish_type": "SATIN",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    "d9b2d63d-a233-4f16-92f7-bc6024beee21": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee21",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-330O",
        "shade_name": "330O Tan Deep Olive",
        "shade_hex_code": "#8b5d38",
        "shade_undertone": "OLIVE",
        "shade_depth": "TAN",
        "finish_type": "NATURAL",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    "d9b2d63d-a233-4f16-92f7-bc6024beee22": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee22",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-340W",
        "shade_name": "340W Tan Warm Chestnut",
        "shade_hex_code": "#855434",
        "shade_undertone": "WARM",
        "shade_depth": "TAN",
        "finish_type": "DEWY",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    # Deep Range
    "d9b2d63d-a233-4f16-92f7-bc6024beee23": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee23",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-400W",
        "shade_name": "400W Deep Warm Bronze",
        "shade_hex_code": "#6b4026",
        "shade_undertone": "WARM",
        "shade_depth": "DEEP",
        "finish_type": "DEWY",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    "d9b2d63d-a233-4f16-92f7-bc6024beee24": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee24",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-410C",
        "shade_name": "410C Deep Cool Espresso",
        "shade_hex_code": "#5f3521",
        "shade_undertone": "COOL",
        "shade_depth": "DEEP",
        "finish_type": "MATTE",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    "d9b2d63d-a233-4f16-92f7-bc6024beee25": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee25",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-420N",
        "shade_name": "420N Deep Neutral Cacao",
        "shade_hex_code": "#532d1c",
        "shade_undertone": "NEUTRAL",
        "shade_depth": "DEEP",
        "finish_type": "NATURAL",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    "d9b2d63d-a233-4f16-92f7-bc6024beee26": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee26",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-430O",
        "shade_name": "430O Deep Rich Ebony",
        "shade_hex_code": "#442217",
        "shade_undertone": "OLIVE",
        "shade_depth": "DEEP",
        "finish_type": "SATIN",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    "d9b2d63d-a233-4f16-92f7-bc6024beee27": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee27",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-440W",
        "shade_name": "440W Deep Warm Obsidian",
        "shade_hex_code": "#381c13",
        "shade_undertone": "WARM",
        "shade_depth": "DEEP",
        "finish_type": "DEWY",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": False,
        "in_stock": True
    },
    # Discontinued variant for replacement testing
    "d9b2d63d-a233-4f16-92f7-bc6024beee28": {
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee28",
        "product_id": "1d43ffbb-7432-4467-8e6d-d7790bcf5d61",
        "sku": "AL-FDN-DISC-01",
        "shade_name": "Legacy 219N Amber (Discontinued)",
        "shade_hex_code": "#d4ac8b",
        "shade_undertone": "NEUTRAL",
        "shade_depth": "MEDIUM",
        "finish_type": "MATTE",
        "fill_volume_ml": 30.00,
        "retail_price": 48.00,
        "is_discontinued": True,
        "recommended_replacement_id": "d9b2d63d-a233-4f16-92f7-bc6024beee13",
        "in_stock": False
    }
}

INVENTORY: Dict[str, Dict[str, int]] = {
    v_id: {"available": 1500, "reserved": 0}
    for v_id, v in VARIANTS.items() if not v["is_discontinued"]
}

RESERVATIONS: Dict[str, Dict[str, Any]] = {}
ORDERS: Dict[str, Dict[str, Any]] = {}
OUTBOX_EVENTS: List[Dict[str, Any]] = []

SUBSCRIPTIONS: Dict[str, Dict[str, Any]] = {
    "7f918074-b5a8-4bb5-9e48-ec8d5e1281df": {
        "subscription_id": "7f918074-b5a8-4bb5-9e48-ec8d5e1281df",
        "customer_id": "a0000000-0000-0000-0000-000000000002",
        "variant_id": "d9b2d63d-a233-4f16-92f7-bc6024beee15",
        "replenishment_frequency_days": 60,
        "discount_percentage": 15.00,
        "status": "ACTIVE",
        "previous_billing_date": (date.today() - timedelta(days=30)).isoformat(),
        "next_billing_date": (date.today() + timedelta(days=30)).isoformat(),
        "payment_token": "pm_card_visa_tok_live_001924",
        "shipping_address": {
            "street_1": "456 Market St",
            "city": "San Francisco",
            "state_province": "CA",
            "postal_code": "94105",
            "country_iso2": "US"
        }
    }
}
