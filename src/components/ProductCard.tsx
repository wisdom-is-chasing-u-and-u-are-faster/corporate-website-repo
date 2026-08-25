import React from "react";
import Link from "next/link";
import { Product } from "../types";

interface ProductCardProps {
  product: Product & { quantity_available?: number; is_low_stock?: boolean };
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="product-card card bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col">
      <Link href={`/product-detail?id=${product.product_id}`} className="block flex-1">
        <div className="card-image bg-[#F9FAFB] dark:bg-gray-700/50 aspect-square flex items-center justify-center p-6 relative">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-4/5 h-auto object-contain transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          {product.is_low_stock && (
            <span className="badge badge-warning absolute top-3 right-3 bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full">
              Low Stock
            </span>
          )}
          {product.skin_type && product.skin_type !== "All" && (
            <span className="badge badge-primary absolute top-3 left-3 bg-pink-100 text-pink-800 dark:bg-pink-900/60 dark:text-pink-300 text-xs font-semibold px-2.5 py-1 rounded-full">
              {product.skin_type} Skin
            </span>
          )}
        </div>
        <div className="card-body p-5 text-center">
          <h5 className="font-semibold text-base text-gray-900 dark:text-white line-clamp-1 mb-1 font-sans">
            {product.name}
          </h5>
          <p className="price text-gray-500 dark:text-gray-400 font-medium font-serif text-lg">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <button
          onClick={() => onAddToCart && onAddToCart(product)}
          className="btn btn-secondary w-full py-2.5 text-sm font-semibold rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
