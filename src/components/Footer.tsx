import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer bg-[#FFF8F9] dark:bg-[#1F2937] py-12 border-t border-gray-200 dark:border-gray-800 transition-colors">
      <div className="container mx-auto px-6 max-w-[1440px]">
        <div className="footer-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="footer-column">
            <h5 className="font-bold uppercase tracking-wider text-sm text-gray-500 dark:text-gray-400 mb-4 font-sans">
              Shop
            </h5>
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              <li>
                <Link href="/product-catalog?category=Skincare" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Skincare
                </Link>
              </li>
              <li>
                <Link href="/product-catalog?category=Makeup" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Makeup
                </Link>
              </li>
              <li>
                <Link href="/product-catalog?category=Lip Care" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Lip Care
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h5 className="font-bold uppercase tracking-wider text-sm text-gray-500 dark:text-gray-400 mb-4 font-sans">
              About
            </h5>
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              <li><a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Clean Ingredients</a></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Sustainability</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h5 className="font-bold uppercase tracking-wider text-sm text-gray-500 dark:text-gray-400 mb-4 font-sans">
              Support
            </h5>
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              <li><a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h5 className="font-bold uppercase tracking-wider text-sm text-gray-500 dark:text-gray-400 mb-4 font-sans">
              Newsletter
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Subscribe for 10% off your first order and exclusive access to new drops.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                className="form-input flex-1 px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 text-sm"
                placeholder="Your email"
                required
              />
              <button type="submit" className="btn btn-primary px-4 py-2 text-sm font-semibold text-white rounded-md bg-gradient-to-r from-[#F9A8B6] to-[#D4AF7A]">
                Go
              </button>
            </form>
          </div>
        </div>
        <div className="footer-bottom mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400 gap-4">
          <p>&copy; {new Date().getFullYear()} Aura Cosmetics. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Clean Beauty</span>
            <span>•</span>
            <span>Cruelty-Free</span>
            <span>•</span>
            <span>Vegan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
