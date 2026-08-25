import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ProductCard } from "../components/ProductCard";
import { Product } from "../types";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Fetch featured products from cached catalog API (REQ-F-003)
    fetch("/api/products?limit=4")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data);
        }
      })
      .catch((err) => console.error("Failed to load products", err));

    // Load cart from LocalStorage (REQ-F-006)
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

      <main id="main-content" className="flex-1 pt-16">
        {/* HERO SECTION */}
        <section className="hero text-center py-24 bg-[#FFF8F9] dark:bg-[#1F2937] transition-colors">
          <div className="container mx-auto px-6 max-w-[1440px]">
            <p className="eyebrow font-bold uppercase tracking-widest text-[#B88B4A] dark:text-[#D4AF7A] text-sm mb-4">
              Pure Ingredients, Radiant Results
            </p>
            <h1 className="text-4xl sm:text-6xl font-black font-serif max-w-2xl mx-auto mb-6 tracking-tight">
              Discover Your <span className="text-gradient">Natural Glow</span>
            </h1>
            <p className="subtitle text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed font-sans">
              Experience luxurious, clean beauty with our collection of high-performance skincare and cosmetics. Made for the modern minimalist.
            </p>
            <div className="cta-group flex justify-center gap-4 flex-wrap">
              <Link href="/product-catalog" className="btn btn-primary px-8 py-3.5 text-base font-semibold text-white rounded-lg bg-gradient-to-r from-[#F9A8B6] to-[#D4AF7A] shadow-md hover:shadow-lg transition-all">
                Shop The Collection
              </Link>
              <Link href="/product-catalog" className="btn btn-secondary px-8 py-3.5 text-base font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                Learn Our Story
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-[1440px]">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-serif mb-3">Featured Products</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400">A selection of our community favorites.</p>
            </div>

            <div className="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.product_id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/product-catalog" className="btn btn-secondary px-8 py-3 font-semibold rounded-lg">
                View All Products &rarr;
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
