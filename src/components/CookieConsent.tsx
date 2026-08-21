import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, ShieldCheck, X } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-slate-900/95 backdrop-blur border-t border-slate-700 text-white shadow-2xl"
    >
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start space-x-3 text-sm">
          <Cookie className="h-6 w-6 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-white">We value your privacy</p>
            <p className="text-xs text-slate-300 mt-0.5">
              We use essential and analytical cookies to ensure security, optimize performance, and comply with GDPR/CCPA regulations. Read our{' '}
              <Link href="/privacy" className="text-blue-400 underline hover:text-blue-300">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            type="button"
            onClick={handleDecline}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Decline Non-Essential
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 shadow-sm transition-colors"
          >
            Accept All Cookies
          </button>
        </div>
      </div>
    </aside>
  );
};
