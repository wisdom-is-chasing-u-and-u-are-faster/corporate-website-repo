import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Shield, ChevronRight } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-sm">
              P
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Premium IT <span className="text-blue-600">Services</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <div className="relative group">
            <button className="flex items-center space-x-1 hover:text-blue-600 py-2">
              <span>Services</span>
            </button>
            <div className="absolute left-0 top-full hidden w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg group-hover:block group-focus-within:block">
              <Link href="/services/cloud-migration" className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600">
                Cloud Migration
              </Link>
              <Link href="/services/app-development" className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600">
                App Development
              </Link>
              <Link href="/services/data-analytics" className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600">
                Data Analytics
              </Link>
              <Link href="/services/artificial-intelligence" className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600">
                Artificial Intelligence
              </Link>
            </div>
          </div>
          <Link href="/products" className="hover:text-blue-600 transition-colors">
            Products
          </Link>
          <Link href="/locations" className="hover:text-blue-600 transition-colors">
            Locations
          </Link>
          <Link href="/contact" className="hover:text-blue-600 transition-colors">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/admin/login"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Admin Portal</span>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
          >
            Home
          </Link>
          <div className="px-3 py-1 font-semibold text-xs text-slate-400 uppercase tracking-wider">
            Services
          </div>
          <div className="pl-4 space-y-1">
            <Link
              href="/services/cloud-migration"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-1.5 text-sm text-slate-600 hover:text-blue-600"
            >
              Cloud Migration
            </Link>
            <Link
              href="/services/app-development"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-1.5 text-sm text-slate-600 hover:text-blue-600"
            >
              App Development
            </Link>
            <Link
              href="/services/data-analytics"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-1.5 text-sm text-slate-600 hover:text-blue-600"
            >
              Data Analytics
            </Link>
            <Link
              href="/services/artificial-intelligence"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-1.5 text-sm text-slate-600 hover:text-blue-600"
            >
              Artificial Intelligence
            </Link>
          </div>
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
          >
            Products
          </Link>
          <Link
            href="/locations"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
          >
            Locations
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
          >
            Contact
          </Link>
          <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 hover:text-blue-600"
            >
              <Shield className="h-4 w-4" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
