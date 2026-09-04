-- ============================================================================
-- Enterprise Database Schema Architecture (DDL)
-- Project: Direct-to-Consumer (D2C) Online Cosmetic Store Platform ("Aura Cosmetics")
-- Document ID: ARCH-DBAD-2026-002
-- Target Database: Google Cloud SQL PostgreSQL v15 / v16
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables for clean schema generation
DROP TABLE IF EXISTS outbox_events CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS merchants CASCADE;

-- 1. Merchants Table
CREATE TABLE merchants (
    merchant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users / Customers Table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'ADMIN', 'INVENTORY_MANAGER', 'SUPPORT')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Categories Table (Hierarchical Taxonomy)
CREATE TABLE categories (
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    parent_category_id UUID REFERENCES categories(category_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Products Table (Catalog Specifications)
CREATE TABLE products (
    product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES merchants(merchant_id) ON DELETE RESTRICT,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0.00),
    weight_grams INT NOT NULL CHECK (weight_grams > 0),
    category VARCHAR(100) NOT NULL,
    skin_type VARCHAR(50) NOT NULL DEFAULT 'All' CHECK (skin_type IN ('All', 'Oily', 'Dry', 'Combination', 'Sensitive')),
    ingredients TEXT,
    image_url TEXT,
    product_attributes JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Product Categories Junction Table
CREATE TABLE product_categories (
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- 6. Inventory Table (Atomic Availability Balances & Concurrency Safeguards)
CREATE TABLE inventory (
    product_id UUID PRIMARY KEY REFERENCES products(product_id) ON DELETE CASCADE,
    quantity_available INT NOT NULL CHECK (quantity_available >= 0),
    safety_stock_threshold INT NOT NULL DEFAULT 10 CHECK (safety_stock_threshold >= 0),
    reserved_quantity INT NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Persistent Shopping Carts Table
CREATE TABLE carts (
    cart_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    guest_session_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Cart Items Table
CREATE TABLE cart_items (
    cart_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES carts(cart_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0 AND quantity <= 10),
    added_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_cart_product UNIQUE (cart_id, product_id)
);

-- 9. Orders Table (Partitioned by Range on created_at)
CREATE TABLE orders (
    order_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    guest_email VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED', 'SUSPENDED_RECONCILIATION')),
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0.00),
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (subtotal >= 0.00),
    shipping_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (shipping_fee >= 0.00),
    tax DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (tax >= 0.00),
    shipping_address_line1 VARCHAR(255) NOT NULL,
    shipping_address_line2 VARCHAR(255),
    shipping_city VARCHAR(100) NOT NULL,
    shipping_state VARCHAR(100) NOT NULL,
    shipping_postal_code VARCHAR(20) NOT NULL,
    shipping_country VARCHAR(100) NOT NULL,
    tracking_number VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (order_id, created_at)
) PARTITION BY RANGE (created_at);

-- 10. Order Partitions (Quarterly)
CREATE TABLE orders_y2026q1 PARTITION OF orders
    FOR VALUES FROM ('2026-01-01 00:00:00+00') TO ('2026-04-01 00:00:00+00');
CREATE TABLE orders_y2026q2 PARTITION OF orders
    FOR VALUES FROM ('2026-04-01 00:00:00+00') TO ('2026-07-01 00:00:00+00');
CREATE TABLE orders_y2026q3 PARTITION OF orders
    FOR VALUES FROM ('2026-07-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');
CREATE TABLE orders_y2026q4 PARTITION OF orders
    FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');

-- 11. Order Items Table (Partitioned by Range on order_created_at)
CREATE TABLE order_items (
    order_item_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL,
    order_created_at TIMESTAMPTZ NOT NULL,
    product_id UUID REFERENCES products(product_id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    price_per_unit DECIMAL(10, 2) NOT NULL CHECK (price_per_unit >= 0.00),
    PRIMARY KEY (order_item_id, order_created_at),
    FOREIGN KEY (order_id, order_created_at) REFERENCES orders(order_id, created_at) ON DELETE CASCADE
) PARTITION BY RANGE (order_created_at);

CREATE TABLE order_items_y2026q1 PARTITION OF order_items
    FOR VALUES FROM ('2026-01-01 00:00:00+00') TO ('2026-04-01 00:00:00+00');
CREATE TABLE order_items_y2026q2 PARTITION OF order_items
    FOR VALUES FROM ('2026-04-01 00:00:00+00') TO ('2026-07-01 00:00:00+00');
CREATE TABLE order_items_y2026q3 PARTITION OF order_items
    FOR VALUES FROM ('2026-07-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');
CREATE TABLE order_items_y2026q4 PARTITION OF order_items
    FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');

-- 12. Payments Table (Tokenized Gateway Audit Logs)
CREATE TABLE payments (
    payment_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL,
    order_created_at TIMESTAMPTZ NOT NULL,
    gateway VARCHAR(50) NOT NULL CHECK (gateway IN ('RAZORPAY', 'PAYPAL')),
    gateway_transaction_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('SUCCESS', 'FAILED', 'PENDING', 'REFUNDED')),
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0.00),
    refunded_amount DECIMAL(10, 2) DEFAULT 0.00 CHECK (refunded_amount >= 0.00),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (payment_id, created_at),
    FOREIGN KEY (order_id, order_created_at) REFERENCES orders(order_id, created_at) ON DELETE RESTRICT
) PARTITION BY RANGE (created_at);

CREATE TABLE payments_y2026q1 PARTITION OF payments
    FOR VALUES FROM ('2026-01-01 00:00:00+00') TO ('2026-04-01 00:00:00+00');
CREATE TABLE payments_y2026q2 PARTITION OF payments
    FOR VALUES FROM ('2026-04-01 00:00:00+00') TO ('2026-07-01 00:00:00+00');
CREATE TABLE payments_y2026q3 PARTITION OF payments
    FOR VALUES FROM ('2026-07-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');
CREATE TABLE payments_y2026q4 PARTITION OF payments
    FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');

-- 13. Transactional Outbox Pattern Table (Pub/Sub Event Queue)
CREATE TABLE outbox_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_type VARCHAR(100) NOT NULL,
    aggregate_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed BOOLEAN NOT NULL DEFAULT FALSE
);

-- ============================================================================
-- HIGH PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_skin_type ON products(skin_type);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_attributes_gin ON products USING gin(product_attributes);
CREATE INDEX idx_inventory_low_stock ON inventory(quantity_available) WHERE quantity_available <= safety_stock_threshold;
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- ============================================================================
-- AUTOMATED TRIGGERS & PROCEDURES
-- ============================================================================
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_users_timestamp BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trigger_update_products_timestamp BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trigger_update_inventory_timestamp BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trigger_update_orders_timestamp BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- Row Level Security (RLS) Policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY customer_order_isolation_policy ON orders
    FOR ALL
    USING (user_id::text = current_setting('app.current_user_id', true) OR current_setting('app.current_role', true) IN ('ADMIN', 'INVENTORY_MANAGER'));
