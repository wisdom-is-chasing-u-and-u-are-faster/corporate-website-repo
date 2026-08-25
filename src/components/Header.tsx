import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface HeaderProps {
  cartCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ cartCount = 0 }) => {
  const router = useRouter();

  return (
    <header className="site-header fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
      <div className="container mx-auto px-6 max-w-[1440px] flex items-center justify-between h-16">
        <Link href="/" className="logo text-2xl font-bold font-serif text-gray-900 dark:text-white">
          Aura<span className="logo-accent text-[#F9A8B6]">.</span>
        </Link>
        <nav className="main-nav hidden md:block" aria-label="Main navigation">
          <ul className="flex items-center gap-8 list-none m-0 p-0">
            <li>
              <Link
                href="/"
                className={`font-semibold transition-colors duration-200 py-2 relative ${
                  router.pathname === "/"
                    ? "text-[#111827] dark:text-white font-bold"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/product-catalog"
                className={`font-semibold transition-colors duration-200 py-2 relative ${
                  router.pathname === "/product-catalog"
                    ? "text-[#111827] dark:text-white font-bold"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className={`font-semibold transition-colors duration-200 py-2 relative ${
                  router.pathname === "/admin"
                    ? "text-[#111827] dark:text-white font-bold"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Admin
              </Link>
            </li>
          </ul>
        </nav>
        <div className="header-actions flex items-center gap-5">
          <Link href="/product-catalog" className="icon-btn text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </Link>
          <Link href="/checkout" className="icon-btn text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors relative" aria-label="Shopping Cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#E97188] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <Link href="/admin" className="icon-btn text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="User Profile">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
};
