import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-400 text-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 font-bold text-white">
                P
              </div>
              <span className="text-lg font-bold text-white">
                Premium IT <span className="text-blue-400">Services</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Architecting high-performance digital platforms across Cloud Migration, App Development, Data Analytics, and AI.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Strategic Services
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services/cloud-migration" className="hover:text-white transition-colors">
                  Cloud Migration
                </Link>
              </li>
              <li>
                <Link href="/services/app-development" className="hover:text-white transition-colors">
                  App Development
                </Link>
              </li>
              <li>
                <Link href="/services/data-analytics" className="hover:text-white transition-colors">
                  Data Analytics
                </Link>
              </li>
              <li>
                <Link href="/services/artificial-intelligence" className="hover:text-white transition-colors">
                  Artificial Intelligence
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Company
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Products & Platforms
                </Link>
              </li>
              <li>
                <Link href="/locations" className="hover:text-white transition-colors">
                  Worldwide Locations
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-white transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Compliance & Legal
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy (GDPR / CCPA)
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Security Standard: SOC2 Type II</span>
              </li>
              <li>
                <span className="text-slate-400">Encryption: TLS 1.3 & AES-256</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Premium IT Services Platform. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/locations" className="hover:text-white">
              Offices
            </Link>
            <Link href="/contact" className="hover:text-white">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
