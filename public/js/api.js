/**
 * AURA LUXE Cosmetics — Unified Client-Side API SDK
 * Connects frontend UI views to backend REST endpoints.
 */

const API_BASE = window.location.origin;

const API = {
  // 1. Health check
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  },

  // 2. Catalog & Shade Matcher
  async matchShade(hexCode, undertone, finishType = 'DEWY') {
    const res = await fetch(`${API_BASE}/v1/catalog/shades/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shade_hex_code: hexCode,
        undertone: undertone,
        finish_type: finishType
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Shade matching failed');
    }
    return await res.json();
  },

  async getProduct(slug = 'luminous-radiance-serum-foundation') {
    const res = await fetch(`${API_BASE}/v1/catalog/products/${slug}`);
    if (!res.ok) throw new Error('Product not found');
    return await res.json();
  },

  async listVariants(filter = {}) {
    const params = new URLSearchParams(filter);
    const res = await fetch(`${API_BASE}/v1/catalog/variants?${params.toString()}`);
    return await res.json();
  },

  // 3. Cart & Inventory Reservation (10-min Redlock TTL)
  async reserveCart(sessionId, items, idempotencyKey = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }
    const res = await fetch(`${API_BASE}/v1/cart/reserve`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        customer_session_id: sessionId,
        items: items
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Cart reservation failed');
    }
    return await res.json();
  },

  // 4. Order Checkout Saga & Payment
  async checkout(reservationId, paymentToken, address, isSub = false, freq = 60, idempotencyKey = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }
    const res = await fetch(`${API_BASE}/v1/orders/checkout`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        reservation_id: reservationId,
        payment_token: paymentToken,
        shipping_address: address,
        is_subscription_order: isSub,
        replenishment_frequency_days: freq
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Checkout failed');
    }
    return await res.json();
  },

  // 5. Subscription Management
  async getSubscription(subId = '7f918074-b5a8-4bb5-9e48-ec8d5e1281df') {
    const res = await fetch(`${API_BASE}/v1/subscriptions/${subId}`);
    if (!res.ok) throw new Error('Subscription not found');
    return await res.json();
  },

  async skipSubscription(subId = '7f918074-b5a8-4bb5-9e48-ec8d5e1281df') {
    const res = await fetch(`${API_BASE}/v1/subscriptions/${subId}/skip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Skip delivery failed');
    return await res.json();
  },

  async swapSubscriptionShade(subId, newVariantId) {
    const res = await fetch(`${API_BASE}/v1/subscriptions/${subId}/swap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ new_variant_id: newVariantId })
    });
    if (!res.ok) throw new Error('Swap shade failed');
    return await res.json();
  }
};

window.API = API;
