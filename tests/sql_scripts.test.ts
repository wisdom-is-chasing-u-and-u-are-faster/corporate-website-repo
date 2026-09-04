import * as fs from "fs";
import * as path from "path";

describe("Step 2: SQL DDL & DML Schema Verification", () => {
  const ddlPath = path.resolve(__dirname, "../sql/schema_ddl.sql");
  const dmlPath = path.resolve(__dirname, "../sql/seed_dml.sql");

  it("should contain complete schema_ddl.sql with all tables and constraints", () => {
    expect(fs.existsSync(ddlPath)).toBe(true);
    const ddlContent = fs.readFileSync(ddlPath, "utf-8");

    expect(ddlContent).toContain("CREATE TABLE merchants");
    expect(ddlContent).toContain("CREATE TABLE users");
    expect(ddlContent).toContain("CREATE TABLE categories");
    expect(ddlContent).toContain("CREATE TABLE products");
    expect(ddlContent).toContain("CREATE TABLE product_categories");
    expect(ddlContent).toContain("CREATE TABLE inventory");
    expect(ddlContent).toContain("CREATE TABLE carts");
    expect(ddlContent).toContain("CREATE TABLE cart_items");
    expect(ddlContent).toContain("CREATE TABLE orders");
    expect(ddlContent).toContain("CREATE TABLE order_items");
    expect(ddlContent).toContain("CREATE TABLE payments");
    expect(ddlContent).toContain("CREATE TABLE outbox_events");
    expect(ddlContent).toContain("idx_products_sku");
    expect(ddlContent).toContain("idx_inventory_low_stock");
    expect(ddlContent).toContain("customer_order_isolation_policy");
  });

  it("should contain seed_dml.sql with initial catalog and users", () => {
    expect(fs.existsSync(dmlPath)).toBe(true);
    const dmlContent = fs.readFileSync(dmlPath, "utf-8");

    expect(dmlContent).toContain("INSERT INTO merchants");
    expect(dmlContent).toContain("INSERT INTO users");
    expect(dmlContent).toContain("INSERT INTO categories");
    expect(dmlContent).toContain("INSERT INTO products");
    expect(dmlContent).toContain("INSERT INTO inventory");
    expect(dmlContent).toContain("Radiant Hydration Serum");
    expect(dmlContent).toContain("Velvet Matte Lipstick");
  });
});
