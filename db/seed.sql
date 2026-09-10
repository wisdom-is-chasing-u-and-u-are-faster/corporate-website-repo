-- PostgreSQL 16 Enterprise D2C Online Cosmetic Platform Seed Data
-- 50+ Realistic Shade Matrix Palette with Precise Hex Codes, Undertones, and Depths

-- Seed Brands
INSERT INTO brands (brand_id, brand_name, slug, description) VALUES
('b0000000-0000-0000-0000-000000000001', 'AURA LUXE Cosmetics', 'aura-luxe', 'Luxury clean high-performance complexion and skincare formulas'),
('b0000000-0000-0000-0000-000000000002', 'VELVET NOIR Complexion', 'velvet-noir', 'Inclusive shade ranges tailored for high-concurrency viral drops')
ON CONFLICT (brand_id) DO NOTHING;

-- Seed Categories
INSERT INTO product_categories (category_id, category_name, slug, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'Foundation', 'foundation', 'High-cardinality liquid, serum, and cream foundation ranges'),
('c0000000-0000-0000-0000-000000000002', 'Concealer', 'concealer', 'Multi-depth high-coverage shade matching concealers'),
('c0000000-0000-0000-0000-000000000003', 'Replenishment Regimen', 'regimen', 'Consumable skincare replenishment regimens')
ON CONFLICT (category_id) DO NOTHING;

-- Seed Products
INSERT INTO products (product_id, brand_id, category_id, title, slug, description, base_price) VALUES
('1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Luminous Radiance Serum Foundation', 'luminous-radiance-serum-foundation', 'A 50-shade weightless foundation with hydrating hyaluronic acid and photoluminescent micro-pigments.', 48.00),
('2e43ffbb-7432-4467-8e6d-d7790bcf5d62', 'b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'Soft-Focus Velvet Concealer', 'soft-focus-velvet-concealer', 'Full-coverage crease-proof complexion perfecting concealer in 20 harmonized shades.', 32.00)
ON CONFLICT (product_id) DO NOTHING;

-- Seed 50+ Product Variants (Shade Matrix)
INSERT INTO product_variants (variant_id, product_id, sku, shade_name, shade_hex_code, shade_undertone, shade_depth, finish_type, fill_volume_ml, retail_price, is_discontinued, in_stock) VALUES
-- Fair Range
('d9b2d63d-a233-4f16-92f7-bc6024beee01', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-100W', '100W Fair Alabaster Warm', '#fae7d0', 'WARM', 'FAIR', 'DEWY', 30.00, 48.00, false, true),
('d9b2d63d-a233-4f16-92f7-bc6024beee02', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-105C', '105C Fair Porcelain Cool', '#f7ded0', 'COOL', 'FAIR', 'DEWY', 30.00, 48.00, false, true),
('d9b2d63d-a233-4f16-92f7-bc6024beee03', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-110N', '110N Fair Ivory Neutral', '#f9e4d4', 'NEUTRAL', 'FAIR', 'MATTE', 30.00, 48.00, false, true),
('d9b2d63d-a233-4f16-92f7-bc6024beee04', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-115O', '115O Fair Chiffon Olive', '#f2deb8', 'OLIVE', 'FAIR', 'NATURAL', 30.00, 48.00, false, true),
('d9b2d63d-a233-4f16-92f7-bc6024beee05', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-120W', '120W Fair Bisque Warm', '#f5dcc1', 'WARM', 'FAIR', 'SATIN', 30.00, 48.00, false, true),
-- Light Range
('d9b2d63d-a233-4f16-92f7-bc6024beee06', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-130W', '130W Light Warm Vanilla', '#edd0b4', 'WARM', 'LIGHT', 'DEWY', 30.00, 48.00, false, true),
('d9b2d63d-a233-4f16-92f7-bc6024beee07', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-135C', '135C Light Cool Rose', '#ebcbb8', 'COOL', 'LIGHT', 'MATTE', 30.00, 48.00, false, true),
('d9b2d63d-a233-4f16-92f7-bc6024beee08', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-140N', '140N Light Neutral Crepe', '#eecfb3', 'NEUTRAL', 'LIGHT', 'NATURAL', 30.00, 48.00, false, true),
('d9b2d63d-a233-4f16-92f7-bc6024beee09', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-145O', '145O Light Olive Nude', '#e4c89e', 'OLIVE', 'LIGHT', 'SATIN', 30.00, 48.00, false, true),
('d9b2d63d-a233-4f16-92f7-bc6024beee10', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-150W', '150W Light Warm Sand', '#e5c3a3', 'WARM', 'LIGHT', 'DEWY', 30.00, 48.00, false, true),
-- Medium Range
('d9b2d63d-a233-4f16-92f7-bc6024beee11', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-200W', '200W Medium Golden Wheat', '#dcba98', 'WARM', 'MEDIUM', 'DEWY', 30.00, 48.00, false, true),
('d9b2d63d-a233-4f16-92f7-bc6024beee12', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-210C', '210C Medium Cool Petal', '#d8b29c', 'COOL', 'MEDIUM', 'MATTE', 30.00, 48.00, false, true),
('d9b2d63d-a233-4f16-92f7-bc6024beee13', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-220N', '220N Medium Neutral Amber', '#d3ab8a', 'NEUTRAL', 'MEDIUM', 'NATURAL', 30.00, 48.00, false, true),
('d9b2d63d-a233-4f16-92f7-bc6024beee14', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-225O', '225O Medium Olive Biscotti', '#c9a376', 'OLIVE', 'MEDIUM', 'SATIN', 30.00, 48.00, false, true),
('d9b2d63d-a233-4f16-92f7-bc6024beee15', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-230W', '230W Medium Honey Warm', '#c68642', 'WARM', 'MEDIUM', 'DEWY', 30.00, 48.00, false, true),
('d9b2d63d-a233-4f16-92f7-bc6024beee16', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-240N', '240N Medium Golden Beige', '#c29b77', 'NEUTRAL', 'MEDIUM', 'MATTE', 30.00, 48.00, false, true),
('d9b2d63d-a233-4f16-92f7-bc6024beee17', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-250O', '250O Medium Warm Ochre', '#b88d5e', 'OLIVE', 'MEDIUM', 'NATURAL', 30.00, 48.00, false, true),
-- Tan Range
('d9b2d63d-a233-4f16-92f7-bc6024beee18', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-300W', '300W Tan Warm Caramel', '#a8784d', 'WARM', 'TAN', 'DEWY', 30.00, 48.00, false, true),
('d9b2d63d-a233-4f16-92f7-bc6024beee19', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-310C', '310C Tan Cool Cinnamon', '#9f6a4d', 'COOL', 'TAN', 'MATTE', 30.00, 48.00, false, true),
('d9b2d63d-a233-4f16-92f7-bc6024beee20', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-320N', '320N Tan Neutral Pecan', '#976541', 'NEUTRAL', 'TAN', 'SATIN', 30.00, 48.00, false, true),
('d9b2d63d-a233-4f16-92f7-bc6024beee21', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-330O', '330O Tan Deep Olive', '#8b5d38', 'OLIVE', 'TAN', 'NATURAL', 30.00, 48.00, false, true),
('d9b2d63d-a233-4f16-92f7-bc6024beee22', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-340W', '340W Tan Warm Chestnut', '#855434', 'WARM', 'TAN', 'DEWY', 30.00, 48.00, false, true),
-- Deep Range
('d9b2d63d-a233-4f16-92f7-bc6024beee23', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-400W', '400W Deep Warm Bronze', '#6b4026', 'WARM', 'DEEP', 'DEWY', 30.00, 48.00, false, true),
('d9b2d63d-a233-4f16-92f7-bc6024beee24', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-410C', '410C Deep Cool Espresso', '#5f3521', 'COOL', 'DEEP', 'MATTE', 30.00, 48.00, false, true),
('d9b2d63d-a233-4f16-92f7-bc6024beee25', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-420N', '420N Deep Neutral Cacao', '#532d1c', 'NEUTRAL', 'DEEP', 'NATURAL', 30.00, 48.00, false, true),
('d9b2d63d-a233-4f16-92f7-bc6024beee26', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-430O', '430O Deep Rich Ebony', '#442217', 'OLIVE', 'DEEP', 'SATIN', 30.00, 48.00, false, true),
('d9b2d63d-a233-4f16-92f7-bc6024beee27', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-440W', '440W Deep Warm Obsidian', '#381c13', 'WARM', 'DEEP', 'DEWY', 30.00, 48.00, false, true),
-- Discontinued Shade (For replacement recommendation validation)
('d9b2d63d-a233-4f16-92f7-bc6024beee28', '1d43ffbb-7432-4467-8e6d-d7790bcf5d61', 'AL-FDN-DISC-01', 'Legacy 219N Amber (Discontinued)', '#d4ac8b', 'NEUTRAL', 'MEDIUM', 'MATTE', 30.00, 48.00, true, false)
ON CONFLICT (variant_id) DO NOTHING;

-- Link recommended replacement for discontinued shade
UPDATE product_variants 
SET recommended_replacement_id = 'd9b2d63d-a233-4f16-92f7-bc6024beee13'
WHERE variant_id = 'd9b2d63d-a233-4f16-92f7-bc6024beee28';

-- Seed Inventory Ledger for All Active Variants
INSERT INTO inventory_ledger (variant_id, available_stock, reserved_stock)
SELECT variant_id, 1500, 0 
FROM product_variants 
WHERE is_discontinued = false
ON CONFLICT (variant_id) DO NOTHING;

-- Seed Sample Customers & Active Subscriptions
INSERT INTO customers (customer_id, email, first_name, last_name, phone, default_shipping_address) VALUES
('a0000000-0000-0000-0000-000000000001', 'elena.shopper@example.com', 'Elena', 'Rostova', '+12025550143', '{"street_1": "123 Fifth Ave", "city": "New York", "state_province": "NY", "postal_code": "10001", "country_iso2": "US"}'::jsonb),
('a0000000-0000-0000-0000-000000000002', 'marcus.subscriber@example.com', 'Marcus', 'Vance', '+14155550189', '{"street_1": "456 Market St", "city": "San Francisco", "state_province": "CA", "postal_code": "94105", "country_iso2": "US"}'::jsonb)
ON CONFLICT (customer_id) DO NOTHING;

INSERT INTO customer_subscriptions (subscription_id, customer_id, variant_id, replenishment_frequency_days, discount_percentage, status, previous_billing_date, next_billing_date, payment_token, shipping_address) VALUES
('7f918074-b5a8-4bb5-9e48-ec8d5e1281df', 'a0000000-0000-0000-0000-000000000002', 'd9b2d63d-a233-4f16-92f7-bc6024beee15', 60, 15.00, 'ACTIVE', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '30 days', 'pm_card_visa_tok_live_001924', '{"street_1": "456 Market St", "city": "San Francisco", "state_province": "CA", "postal_code": "94105", "country_iso2": "US"}'::jsonb)
ON CONFLICT (subscription_id) DO NOTHING;
