-- ============================================================================
-- Enterprise Database Seed Data (DML)
-- Project: Direct-to-Consumer (D2C) Online Cosmetic Store Platform ("Aura Cosmetics")
-- Document ID: ARCH-DBAD-2026-002
-- ============================================================================

-- 1. Insert Merchant
INSERT INTO merchants (merchant_id, business_name, contact_email, is_active)
VALUES 
    ('a1111111-1111-1111-1111-111111111111', 'Aura Cosmetics Inc.', 'operations@auracosmetics.com', true)
ON CONFLICT (merchant_id) DO NOTHING;

-- 2. Insert Users (Admin, Inventory Manager, Customers)
INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone_number, role)
VALUES 
    ('u1111111-1111-1111-1111-111111111111', 'elena.stock@auracosmetics.com', crypt('AdminPass2026!', gen_salt('bf')), 'Elena', 'Rostova', '+13105550100', 'INVENTORY_MANAGER'),
    ('u2222222-2222-2222-2222-222222222222', 'sophia.trendsetter@gmail.com', crypt('CustomerPass2026!', gen_salt('bf')), 'Sophia', 'Chen', '+13105550199', 'CUSTOMER'),
    ('u3333333-3333-3333-3333-333333333333', 'marcus.buyer@gmail.com', crypt('GiftPass2026!', gen_salt('bf')), 'Marcus', 'Sterling', '+14155550144', 'CUSTOMER')
ON CONFLICT (email) DO NOTHING;

-- 3. Insert Product Categories
INSERT INTO categories (category_id, name, slug, parent_category_id)
VALUES 
    ('c1111111-1111-1111-1111-111111111111', 'Skincare', 'skincare', NULL),
    ('c2222222-2222-2222-2222-222222222222', 'Makeup', 'makeup', NULL),
    ('c3333333-3333-3333-3333-333333333333', 'Lip Care', 'lip-care', NULL),
    ('c4444444-4444-4444-4444-444444444444', 'Body Care', 'body-care', NULL)
ON CONFLICT (slug) DO NOTHING;

-- 4. Insert Products (Matching Variant A Mockup and Catalog Specs)
INSERT INTO products (product_id, merchant_id, sku, name, description, price, weight_grams, category, skin_type, ingredients, image_url, product_attributes, is_active)
VALUES 
    (
        'p1111111-1111-1111-1111-111111111111',
        'a1111111-1111-1111-1111-111111111111',
        'SKU-H-101',
        'Radiant Hydration Serum',
        'A powerful, plant-derived serum to quench thirsty skin. Hyaluronic Acid and Vitamin B5 work in synergy to attract and lock in moisture, leaving your skin plump, dewy, and radiant all day long.',
        65.00,
        50,
        'Skincare',
        'Dry',
        'Aqua (Water), Sodium Hyaluronate, Panthenol (Vitamin B5), Glycerin, Rosa Damascena Flower Water, Phenoxyethanol, Ethylhexylglycerin.',
        'https://i.ibb.co/LQrM2r2/cosmetic-mockup-1.png',
        '{"finish": "dewy", "paraben_free": true, "vegan": true}'::jsonb,
        true
    ),
    (
        'p2222222-2222-2222-2222-222222222222',
        'a1111111-1111-1111-1111-111111111111',
        'SKU-L-205',
        'Velvet Matte Lipstick',
        'Long-lasting hydrating matte lipstick with organic shea butter and rich mineral pigments.',
        32.00,
        35,
        'Lip Care',
        'All',
        'Ricinus Communis (Castor) Seed Oil, Organic Shea Butter, Candelilla Wax, Tocopherol (Vitamin E), Iron Oxides.',
        'https://i.ibb.co/qNbP61k/cosmetic-mockup-2.png',
        '{"finish": "matte", "paraben_free": true, "shade": "Ruby"}'::jsonb,
        true
    ),
    (
        'p3333333-3333-3333-3333-333333333333',
        'a1111111-1111-1111-1111-111111111111',
        'SKU-C-301',
        'Melt-Away Cleansing Balm',
        'Gentle nourishing cleansing balm that dissolves waterproof makeup and impurities without stripping natural oils.',
        45.00,
        100,
        'Skincare',
        'Sensitive',
        'Caprylic/Capric Triglyceride, Jojoba Oil, Sunflower Seed Wax, Chamomile Extract, Squalane.',
        'https://i.ibb.co/VMyh26h/cosmetic-mockup-3.png',
        '{"finish": "clean", "hypoallergenic": true}'::jsonb,
        true
    ),
    (
        'p4444444-4444-4444-4444-444444444444',
        'a1111111-1111-1111-1111-111111111111',
        'SKU-P-404',
        'Glow-Up Primer SPF 30',
        'Illuminating mineral primer providing broad-spectrum UV protection and a smooth canvas for makeup.',
        48.00,
        60,
        'Makeup',
        'Combination',
        'Zinc Oxide (Non-Nano), Niacinamide, Aloe Barbadensis Leaf Juice, Green Tea Extract.',
        'https://i.ibb.co/Gvxv3p4/cosmetic-mockup-4.png',
        '{"spf": 30, "finish": "radiant"}'::jsonb,
        true
    ),
    (
        'p5555555-5555-5555-5555-555555555555',
        'a1111111-1111-1111-1111-111111111111',
        'SKU-T-501',
        'Clarifying BHA Pore Toner',
        'Exfoliating salicylic acid toner formulated for oily and acne-prone skin to refine pores and balance sebum.',
        38.00,
        150,
        'Skincare',
        'Oily',
        'Salicylic Acid 2%, Tea Tree Water, Witch Hazel Extract, Centella Asiatica.',
        'https://i.ibb.co/LQrM2r2/cosmetic-mockup-1.png',
        '{"active": "Salicylic Acid", "alcohol_free": true}'::jsonb,
        true
    )
ON CONFLICT (sku) DO NOTHING;

-- 5. Link Product Categories
INSERT INTO product_categories (product_id, category_id)
VALUES 
    ('p1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111'),
    ('p2222222-2222-2222-2222-222222222222', 'c3333333-3333-3333-3333-333333333333'),
    ('p3333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111'),
    ('p4444444-4444-4444-4444-444444444444', 'c2222222-2222-2222-2222-222222222222'),
    ('p5555555-5555-5555-5555-555555555555', 'c1111111-1111-1111-1111-111111111111')
ON CONFLICT DO NOTHING;

-- 6. Insert Inventory Levels with Default Safety Threshold (10)
INSERT INTO inventory (product_id, quantity_available, safety_stock_threshold, reserved_quantity)
VALUES 
    ('p1111111-1111-1111-1111-111111111111', 142, 10, 0),
    ('p2222222-2222-2222-2222-222222222222', 8, 10, 0), -- Low Stock Trigger (< 10)
    ('p3333333-3333-3333-3333-333333333333', 56, 10, 0),
    ('p4444444-4444-4444-4444-444444444444', 85, 10, 0),
    ('p5555555-5555-5555-5555-555555555555', 24, 10, 0)
ON CONFLICT (product_id) DO UPDATE 
SET quantity_available = EXCLUDED.quantity_available,
    safety_stock_threshold = EXCLUDED.safety_stock_threshold;
