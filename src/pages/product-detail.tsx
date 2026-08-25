import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Product } from "../types";

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<(Product & { quantity_available?: number; is_low_stock?: boolean }) | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    const targetId = typeof id === "string" ? id : "p1111111-1111-1111-1111-111111111111";
    fetch(`/api/products/${targetId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProduct(data.data);
        }
      })
      .catch((err) => console.error(err));

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
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    try {
      const savedCart = localStorage.getItem("aura_cart");
      const cart = savedCart ? JSON.parse(savedCart) : [];
      const existing = cart.find((item: any) => item.product_id === product.product_id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({ ...product, quantity });
      }
      localStorage.setItem("aura_cart", JSON.stringify(cart));
      const totalQty = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(totalQty);
      setAddedMessage(true);
      setTimeout(() => setAddedMessage(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#111827]">
        <Header cartCount={cartCount} />
        <div className="flex-1 flex items-center justify-center text-gray-500">Loading product details...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#111827] text-[#111827] dark:text-white">
      <Header cartCount={cartCount} />

      <main id="main-content" className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-[1440px]">
          {/* BREADCRUMB */}
          <nav className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            <Link href="/" className="hover:underline">Home</Link> /{" "}
            <Link href="/product-catalog" className="hover:underline">Shop</Link> /{" "}
            <span className="text-gray-900 dark:text-white font-medium">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* IMAGE COLUMN */}
            <div className="card-image rounded-2xl bg-[#F9FAFB] dark:bg-gray-800 p-8 shadow-lg flex items-center justify-center border border-gray-200 dark:border-gray-700">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full max-w-md h-auto aspect-square object-contain"
              />
            </div>

            {/* PRODUCT INFO COLUMN */}
            <div>
              <div className="flex gap-2 mb-3">
                <span className="badge badge-primary bg-pink-100 text-pink-800 dark:bg-pink-900/60 dark:text-pink-300 font-bold px-3 py-1 rounded-full text-xs uppercase">
                  {product.category}
                </span>
                {product.skin_type && product.skin_type !== "All" && (
                  <span className="badge bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 font-semibold px-3 py-1 rounded-full text-xs">
                    {product.skin_type} Skin
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold font-serif mb-2">{product.name}</h1>
              <p className="text-2xl font-serif text-[#B88B4A] dark:text-[#D4AF7A] font-bold mb-4">
                ${product.price.toFixed(2)}
              </p>

              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6 font-sans">
                {product.description}
              </p>

              {/* QUANTITY & ACTIONS */}
              <div className="form-group mb-6">
                <label htmlFor="quantity" className="form-label block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    id="quantity"
                    className="form-input w-24 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-center font-semibold"
                    value={quantity}
                    min={1}
                    max={10}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                  />
                  {product.is_low_stock && (
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      Only few left in stock!
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary flex-1 py-3.5 px-6 font-semibold text-white rounded-lg bg-gradient-to-r from-[#F9A8B6] to-[#D4AF7A] shadow-md hover:shadow-lg transition-all text-center"
                >
                  Add to Cart
                </button>
                <Link
                  href="/checkout"
                  onClick={handleAddToCart}
                  className="btn btn-secondary py-3.5 px-6 font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  Buy Now (Single Page Checkout)
                </Link>
              </div>

              {addedMessage && (
                <div className="p-3 mb-6 bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300 rounded-lg text-sm font-medium flex items-center gap-2">
                  ✓ Added {quantity} item(s) to your cart!
                </div>
              )}

              {/* INGREDIENTS */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                <h5 className="font-bold font-sans text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Full Ingredients
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-mono">
                  {product.ingredients}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
