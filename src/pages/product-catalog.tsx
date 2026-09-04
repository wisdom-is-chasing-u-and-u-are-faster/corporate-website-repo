import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ProductCard } from "../components/ProductCard";
import { Product } from "../types";

export default function ProductCatalogPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [selectedSkinType, setSelectedSkinType] = useState<string>("All Skin Types");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Sync with URL query parameters
  useEffect(() => {
    if (router.query.category && typeof router.query.category === "string") {
      setSelectedCategory(router.query.category);
    }
    if (router.query.skin_type && typeof router.query.skin_type === "string") {
      setSelectedSkinType(router.query.skin_type);
    }
  }, [router.query]);

  // Load products based on filters (REQ-F-004)
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== "All Categories") {
      params.append("category", selectedCategory);
    }
    if (selectedSkinType && selectedSkinType !== "All Skin Types") {
      params.append("skin_type", selectedSkinType);
    }
    if (searchQuery) {
      params.append("search", searchQuery);
    }

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load catalog", err);
        setLoading(false);
      });
  }, [selectedCategory, selectedSkinType, searchQuery]);

  // Load cart from LocalStorage (REQ-F-006)
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("aura_cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        const totalQty = parsed.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
        setCartCount(totalQty);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleAddToCart = (product: Product) => {
    try {
      const savedCart = localStorage.getItem("aura_cart");
      const cart = savedCart ? JSON.parse(savedCart) : [];
      const existing = cart.find((item: any) => item.product_id === product.product_id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem("aura_cart", JSON.stringify(cart));
      const totalQty = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(totalQty);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#111827] text-[#111827] dark:text-white">
      <Header cartCount={cartCount} />

      <main id="main-content" className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-[1440px]">
          {/* TITLE & HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-5xl font-bold font-serif mb-3 tracking-tight">
              Shop The Collection
            </h1>
            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400">
              Find your next favorite, crafted with care and pure botanical ingredients.
            </p>
          </div>

          {/* FILTER TOOLBAR (REQ-F-004) */}
          <div className="flex gap-4 mb-10 flex-wrap justify-center items-center bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            {/* Search Input */}
            <div className="w-full sm:w-auto flex-1 max-w-xs">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input w-full px-4 py-2 text-sm border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700"
              />
            </div>

            {/* Category Filter */}
            <div className="w-full sm:w-auto">
              <label htmlFor="filter-category" className="sr-only">Filter by Category</label>
              <select
                id="filter-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-input px-4 py-2 text-sm border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700"
              >
                <option value="All Categories">All Categories</option>
                <option value="Skincare">Skincare</option>
                <option value="Makeup">Makeup</option>
                <option value="Lip Care">Lip Care</option>
                <option value="Body Care">Body Care</option>
              </select>
            </div>

            {/* Skin Type Filter */}
            <div className="w-full sm:w-auto">
              <label htmlFor="filter-skintype" className="sr-only">Filter by Skin Type</label>
              <select
                id="filter-skintype"
                value={selectedSkinType}
                onChange={(e) => setSelectedSkinType(e.target.value)}
                className="form-input px-4 py-2 text-sm border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700"
              >
                <option value="All Skin Types">All Skin Types</option>
                <option value="Oily">Oily</option>
                <option value="Dry">Dry</option>
                <option value="Combination">Combination</option>
                <option value="Sensitive">Sensitive</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            {(selectedCategory !== "All Categories" || selectedSkinType !== "All Skin Types" || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory("All Categories");
                  setSelectedSkinType("All Skin Types");
                  setSearchQuery("");
                }}
                className="btn btn-secondary px-4 py-2 text-sm rounded-lg"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* PRODUCT GRID */}
          {loading ? (
            <div className="text-center py-16 text-gray-400">Loading catalog...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">No products match your selected filters.</p>
              <button
                onClick={() => {
                  setSelectedCategory("All Categories");
                  setSelectedSkinType("All Skin Types");
                  setSearchQuery("");
                }}
                className="btn btn-primary px-6 py-2.5 rounded-lg text-white"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.product_id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
