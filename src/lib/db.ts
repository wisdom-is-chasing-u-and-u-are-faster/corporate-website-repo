import { Product, InventoryItem, StockReservation, Order, PaymentRecord, AlertNotification, ReconciliationReport } from "../types";

export class InMemoryDatabase {
  public products: Map<string, Product> = new Map();
  public inventory: Map<string, InventoryItem> = new Map();
  public reservations: Map<string, StockReservation> = new Map();
  public orders: Map<string, Order> = new Map();
  public payments: Map<string, PaymentRecord> = new Map();
  public alerts: AlertNotification[] = [];
  public reconciliationReports: ReconciliationReport[] = [];

  constructor() {
    this.seed();
  }

  public seed() {
    this.products.clear();
    this.inventory.clear();
    this.reservations.clear();
    this.orders.clear();
    this.payments.clear();
    this.alerts = [];

    const initialProducts: Product[] = [
      {
        product_id: "p1111111-1111-1111-1111-111111111111",
        sku: "SKU-H-101",
        name: "Radiant Hydration Serum",
        description: "A powerful, plant-derived serum to quench thirsty skin. Hyaluronic Acid and Vitamin B5 work in synergy to attract and lock in moisture, leaving your skin plump, dewy, and radiant all day long.",
        price: 65.0,
        weight_grams: 50,
        category: "Skincare",
        skin_type: "Dry",
        ingredients: "Aqua (Water), Sodium Hyaluronate, Panthenol (Vitamin B5), Glycerin, Rosa Damascena Flower Water, Phenoxyethanol, Ethylhexylglycerin.",
        image_url: "https://i.ibb.co/LQrM2r2/cosmetic-mockup-1.png",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        product_id: "p2222222-2222-2222-2222-222222222222",
        sku: "SKU-L-205",
        name: "Velvet Matte Lipstick",
        description: "Long-lasting hydrating matte lipstick with organic shea butter and rich mineral pigments.",
        price: 32.0,
        weight_grams: 35,
        category: "Lip Care",
        skin_type: "All",
        ingredients: "Ricinus Communis (Castor) Seed Oil, Organic Shea Butter, Candelilla Wax, Tocopherol (Vitamin E), Iron Oxides.",
        image_url: "https://i.ibb.co/qNbP61k/cosmetic-mockup-2.png",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        product_id: "p3333333-3333-3333-3333-333333333333",
        sku: "SKU-C-301",
        name: "Melt-Away Cleansing Balm",
        description: "Gentle nourishing cleansing balm that dissolves waterproof makeup and impurities without stripping natural oils.",
        price: 45.0,
        weight_grams: 100,
        category: "Skincare",
        skin_type: "Sensitive",
        ingredients: "Caprylic/Capric Triglyceride, Jojoba Oil, Sunflower Seed Wax, Chamomile Extract, Squalane.",
        image_url: "https://i.ibb.co/VMyh26h/cosmetic-mockup-3.png",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        product_id: "p4444444-4444-4444-4444-444444444444",
        sku: "SKU-P-404",
        name: "Glow-Up Primer SPF 30",
        description: "Illuminating mineral primer providing broad-spectrum UV protection and a smooth canvas for makeup.",
        price: 48.0,
        weight_grams: 60,
        category: "Makeup",
        skin_type: "Combination",
        ingredients: "Zinc Oxide (Non-Nano), Niacinamide, Aloe Barbadensis Leaf Juice, Green Tea Extract.",
        image_url: "https://i.ibb.co/Gvxv3p4/cosmetic-mockup-4.png",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        product_id: "p5555555-5555-5555-5555-555555555555",
        sku: "SKU-T-501",
        name: "Clarifying BHA Pore Toner",
        description: "Exfoliating salicylic acid toner formulated for oily and acne-prone skin to refine pores and balance sebum.",
        price: 38.0,
        weight_grams: 150,
        category: "Skincare",
        skin_type: "Oily",
        ingredients: "Salicylic Acid 2%, Tea Tree Water, Witch Hazel Extract, Centella Asiatica.",
        image_url: "https://i.ibb.co/LQrM2r2/cosmetic-mockup-1.png",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const p of initialProducts) {
      this.products.set(p.product_id, p);
    }

    const initialInventory: InventoryItem[] = [
      {
        product_id: "p1111111-1111-1111-1111-111111111111",
        quantity_available: 142,
        safety_stock_threshold: 10,
        reserved_quantity: 0,
        updated_at: new Date().toISOString()
      },
      {
        product_id: "p2222222-2222-2222-2222-222222222222",
        quantity_available: 8, // Low Stock (< 10)
        safety_stock_threshold: 10,
        reserved_quantity: 0,
        updated_at: new Date().toISOString()
      },
      {
        product_id: "p3333333-3333-3333-3333-333333333333",
        quantity_available: 56,
        safety_stock_threshold: 10,
        reserved_quantity: 0,
        updated_at: new Date().toISOString()
      },
      {
        product_id: "p4444444-4444-4444-4444-444444444444",
        quantity_available: 85,
        safety_stock_threshold: 10,
        reserved_quantity: 0,
        updated_at: new Date().toISOString()
      },
      {
        product_id: "p5555555-5555-5555-5555-555555555555",
        quantity_available: 24,
        safety_stock_threshold: 10,
        reserved_quantity: 0,
        updated_at: new Date().toISOString()
      }
    ];

    for (const inv of initialInventory) {
      this.inventory.set(inv.product_id, inv);
    }
  }
}

// Global Singleton Instance
export const db = new InMemoryDatabase();
