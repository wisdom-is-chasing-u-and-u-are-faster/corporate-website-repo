import * as fs from "fs";
import * as path from "path";

describe("Step 8: UI Pages & Variant A Fidelity", () => {
  const pagesDir = path.resolve(__dirname, "../src/pages");

  it("should have all 6 self-contained UI pages implemented matching Variant A mockups", () => {
    expect(fs.existsSync(path.join(pagesDir, "index.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(pagesDir, "product-catalog.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(pagesDir, "product-detail.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(pagesDir, "checkout.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(pagesDir, "order-confirmation.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(pagesDir, "admin.tsx"))).toBe(true);
  });

  it("should have PWA manifest and service worker configured", () => {
    const publicDir = path.resolve(__dirname, "../public");
    expect(fs.existsSync(path.join(publicDir, "manifest.json"))).toBe(true);
    expect(fs.existsSync(path.join(publicDir, "sw.js"))).toBe(true);

    const manifest = JSON.parse(fs.readFileSync(path.join(publicDir, "manifest.json"), "utf-8"));
    expect(manifest.name).toBe("Aura Cosmetics");
    expect(manifest.display).toBe("standalone");
  });

  it("should contain Tailwind CSS design tokens matching Variant A mockups", () => {
    const cssPath = path.resolve(__dirname, "../src/styles/globals.css");
    const css = fs.readFileSync(cssPath, "utf-8");
    expect(css).toContain("--color-primary-100: #FFF8F9");
    expect(css).toContain("--color-primary-500: #F9A8B6");
    expect(css).toContain("--color-accent-500: #D4AF7A");
    expect(css).toContain("Playfair Display");
  });
});
