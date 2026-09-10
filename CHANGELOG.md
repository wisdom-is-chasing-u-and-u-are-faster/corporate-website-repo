# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-09-09

### Added - Epic ARCH-1078: Enterprise D2C Online Cosmetic Store Platform
- **Data Architecture & Schemas (Tier 1)**:
  - Deployed PostgreSQL 16 schema (`db/schema.sql`) for brands, product categories, products, and 50+ shade variants with custom PostgreSQL ENUMs (`undertone_enum`, `finish_enum`, `depth_enum`, `subscription_status_enum`, `order_status_enum`).
  - Added range-partitioned `orders` ledger, `order_items`, and `order_outbox` table implementing Debezium CDC and transactional outbox streaming.
  - Implemented `inventory_ledger` and `inventory_reservations` tables for atomic inventory tracking and reconciliation.
  - Seeded realistic catalog data with 50+ complexion shades in `db/seed.sql`.
- **Backend Microservices (Tier 2)**:
  - Developed FastAPI microservices with CIELAB CIE76 Delta-E shade matching color distance calculation (`/v1/catalog/shades/match`).
  - Implemented Redis 7 Redlock distributed inventory reservation service with 600s TTL and atomic stock decrements (`/v1/cart/reserve`).
  - Built Order Saga orchestration and tokenized payment capture endpoint (`/v1/orders/checkout`).
  - Developed automated subscription replenishment scheduler with skip delivery and shade swap capabilities (`/v1/subscriptions/{id}/skip`, `/v1/subscriptions/{id}/swap`).
  - Implemented Stripe HMAC-SHA256 signature verified webhook processor (`/v1/payments/webhook`).
- **Frontend Storefront Views (Tier 3)**:
  - Built High-Velocity Viral Product Drop Landing Page (`public/index.html`) with live countdown timer and stock progress ticker.
  - Scaffolded Faceted Shade Selector & AR Camera Matcher (`public/shade-finder.html`) with 50-shade palette matrix.
  - Created Multi-Shade Product Detail Page (`public/pdp.html`) with auto-replenish 15% discount model.
  - Built Slide Cart drawer (`public/cart.html`) with live 10-minute reservation countdown clock.
  - Developed 1-Click Express Tokenized Checkout (`public/checkout.html`) with PCI-DSS Level 1 compliant Stripe Elements.
  - Created Customer Subscription & Regimen Management Portal (`public/subscriptions.html`).
  - Implemented client-side API SDK (`public/js/api.js`).
- **Integration & Verification (Tier 4)**:
  - Implemented comprehensive pytest unit, integration, and E2E test suites with 100% pass rate.
  - Verified static cross-tier wiring and live HTTP smoke testing.
