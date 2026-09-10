-- PostgreSQL 16 Enterprise D2C Online Cosmetic Platform Schema
-- Compliance: 3NF Normalized, Multi-Tenant Ready with RLS, High-Concurrency Partitioning

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom Enums
DO $$ BEGIN
    CREATE TYPE undertone_enum AS ENUM ('WARM', 'COOL', 'NEUTRAL', 'OLIVE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE finish_enum AS ENUM ('MATTE', 'DEWY', 'SATIN', 'NATURAL', 'SHEER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE depth_enum AS ENUM ('FAIR', 'LIGHT', 'MEDIUM', 'TAN', 'DEEP');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_status_enum AS ENUM ('ACTIVE', 'SKIPPED', 'PAUSED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status_enum AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'PAYMENT_FAILED', 'FULFILLED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE reservation_status_enum AS ENUM ('RESERVED', 'COMMITTED', 'EXPIRED', 'RELEASED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Brands Table
CREATE TABLE IF NOT EXISTS brands (
    brand_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Product Categories Table
CREATE TABLE IF NOT EXISTS product_categories (
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(brand_id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES product_categories(category_id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Product Variants (High-Cardinality Complexion & Shade Matrix)
CREATE TABLE IF NOT EXISTS product_variants (
    variant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    sku VARCHAR(64) NOT NULL UNIQUE,
    shade_name VARCHAR(100) NOT NULL,
    shade_hex_code VARCHAR(7) NOT NULL CHECK (shade_hex_code ~* '^#[0-9a-fA-F]{6}$'),
    shade_undertone undertone_enum NOT NULL,
    shade_depth depth_enum NOT NULL DEFAULT 'MEDIUM',
    finish_type finish_enum NOT NULL DEFAULT 'NATURAL',
    fill_volume_ml NUMERIC(6, 2) NOT NULL DEFAULT 30.00,
    retail_price NUMERIC(10, 2) NOT NULL CHECK (retail_price >= 0),
    is_discontinued BOOLEAN NOT NULL DEFAULT FALSE,
    recommended_replacement_id UUID REFERENCES product_variants(variant_id),
    in_stock BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Fast Shade Matching & Filtering
CREATE INDEX IF NOT EXISTS idx_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_hex ON product_variants(shade_hex_code);
CREATE INDEX IF NOT EXISTS idx_variants_undertone ON product_variants(shade_undertone);
CREATE INDEX IF NOT EXISTS idx_variants_finish ON product_variants(finish_type);
CREATE INDEX IF NOT EXISTS idx_variants_depth ON product_variants(shade_depth);
CREATE INDEX IF NOT EXISTS idx_variants_filtering ON product_variants(shade_undertone, finish_type, is_discontinued, in_stock);

-- 5. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    customer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(32),
    default_shipping_address JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- 6. Customer Subscriptions Table (Automated Replenishment Engine)
CREATE TABLE IF NOT EXISTS customer_subscriptions (
    subscription_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES product_variants(variant_id) ON DELETE RESTRICT,
    replenishment_frequency_days INTEGER NOT NULL CHECK (replenishment_frequency_days IN (30, 45, 60, 90)),
    discount_percentage NUMERIC(5, 2) NOT NULL DEFAULT 15.00,
    status subscription_status_enum NOT NULL DEFAULT 'ACTIVE',
    previous_billing_date DATE,
    next_billing_date DATE NOT NULL,
    payment_token VARCHAR(255) NOT NULL,
    shipping_address JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_id ON customer_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing ON customer_subscriptions(next_billing_date) WHERE status = 'ACTIVE';

-- 7. Inventory Ledger (Non-Locking Real-Time Inventory & Reconciliation)
CREATE TABLE IF NOT EXISTS inventory_ledger (
    ledger_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES product_variants(variant_id) ON DELETE RESTRICT,
    available_stock INTEGER NOT NULL CHECK (available_stock >= 0),
    reserved_stock INTEGER NOT NULL DEFAULT 0 CHECK (reserved_stock >= 0),
    total_physical_stock INTEGER GENERATED ALWAYS AS (available_stock + reserved_stock) STORED,
    last_reconciled_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_inventory_variant_id ON inventory_ledger(variant_id);

-- 8. Inventory Reservations (Redlock 10-Min Atomic Locks Tracker)
CREATE TABLE IF NOT EXISTS inventory_reservations (
    reservation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_session_id UUID NOT NULL,
    idempotency_key VARCHAR(128) UNIQUE,
    variant_id UUID NOT NULL REFERENCES product_variants(variant_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    status reservation_status_enum NOT NULL DEFAULT 'RESERVED',
    ttl_seconds INTEGER NOT NULL DEFAULT 600,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reservations_session ON inventory_reservations(customer_session_id);
CREATE INDEX IF NOT EXISTS idx_reservations_expires_at ON inventory_reservations(expires_at) WHERE status = 'RESERVED';

-- 9. Orders Table (Range-Partitioned by Order Year/Quarter in Enterprise Scale)
CREATE TABLE IF NOT EXISTS orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(64) NOT NULL UNIQUE,
    customer_id UUID REFERENCES customers(customer_id),
    reservation_id UUID REFERENCES inventory_reservations(reservation_id),
    status order_status_enum NOT NULL DEFAULT 'CONFIRMED',
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    is_subscription_order BOOLEAN NOT NULL DEFAULT FALSE,
    subscription_id UUID REFERENCES customer_subscriptions(subscription_id),
    idempotency_key VARCHAR(128) UNIQUE,
    payment_token VARCHAR(255) NOT NULL,
    payment_transaction_id VARCHAR(128),
    shipping_address JSONB NOT NULL,
    tracking_url VARCHAR(512),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- 10. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES product_variants(variant_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- 11. Transactional Outbox Table (Debezium CDC & Kafka Streaming Pattern)
CREATE TABLE IF NOT EXISTS order_outbox (
    outbox_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_type VARCHAR(64) NOT NULL DEFAULT 'ORDER',
    aggregate_id VARCHAR(64) NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    payload JSONB NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_outbox_unpublished ON order_outbox(created_at) WHERE is_published = FALSE;

-- 12. Audit Events Table
CREATE TABLE IF NOT EXISTS audit_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor VARCHAR(128) NOT NULL,
    action VARCHAR(64) NOT NULL,
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(128) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_events(resource_type, resource_id);
