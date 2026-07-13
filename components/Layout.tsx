import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

export default function Layout({ children, theme, toggleTheme }: LayoutProps) {
  const router = useRouter();
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
      setCookieConsent(consent === 'true');
    } else {
      setCookieConsent(false); // Show if not set
    }
  }, []);

  const handleCookieAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setCookieConsent(true);
  };

  const handleCookieDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    setCookieConsent(true); // Close the banner anyway
  };

  // Determine if we are inside the Client Portal (dashboard, login, details)
  const isPortal = router.pathname.startsWith('/portal') || router.pathname.startsWith('/login') || router.pathname === '/ticket-details';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text)]">
      {/* SKIP TO MAIN CONTENT */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-[var(--color-accent)] text-[var(--color-primary)] px-4 py-2 rounded">
        Skip to main content
      </a>

      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--color-surface)] bg-opacity-80 border-b border-[var(--color-border)] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-[var(--color-primary)]">
            <span className="text-gradient">IT Services</span>
          </Link>

          {!isPortal ? (
            <>
              {/* Marketing Main Navigation */}
              <nav className="hidden md:flex space-x-8 text-sm font-medium">
                <Link href="/services" className={`hover:text-[var(--color-accent)] transition-colors ${router.pathname === '/services' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-subtle)]'}`}>
                  Services
                </Link>
                <Link href="/case-studies" className={`hover:text-[var(--color-accent)] transition-colors ${router.pathname === '/case-studies' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-subtle)]'}`}>
                  Case Studies
                </Link>
                <Link href="/blog" className={`hover:text-[var(--color-accent)] transition-colors ${router.pathname === '/blog' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-subtle)]'}`}>
                  Blog
                </Link>
                <Link href="/contact" className={`hover:text-[var(--color-accent)] transition-colors ${router.pathname === '/contact' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-subtle)]'}`}>
                  Contact
                </Link>
              </nav>

              <div className="hidden md:flex items-center space-x-4">
                {/* Theme toggle */}
                <button onClick={toggleTheme} className="p-2 rounded-lg bg-[var(--color-background)] hover:bg-[var(--color-border)] transition-colors" aria-label="Toggle Theme">
                  {theme === 'dark' ? '☀️' : '🌙'}
                </button>
                <Link href="/login" className="text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors">
                  Client Portal
                </Link>
                <Link href="/contact" className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                  Get Started
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Portal Header */}
              <nav className="hidden md:flex space-x-8 text-sm font-medium">
                <span className="text-[var(--color-text-subtle)] font-semibold">B2B Portal: <strong className="text-[var(--color-primary)]">Acme Corp</strong></span>
              </nav>
              <div className="flex items-center space-x-4">
                <button onClick={toggleTheme} className="p-2 rounded-lg bg-[var(--color-background)] hover:bg-[var(--color-border)] transition-colors" aria-label="Toggle Theme">
                  {theme === 'dark' ? '☀️' : '🌙'}
                </button>
                <Link href="/" className="text-sm font-semibold text-[var(--color-danger)] hover:underline transition-colors">
                  Log Out
                </Link>
              </div>
            </>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg bg-[var(--color-background)] hover:bg-[var(--color-border)] transition-colors" aria-label="Toggle Theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button onClick={() => setMobileNavOpen(!mobileMenuOpen)} className="p-2 rounded-lg bg-[var(--color-background)] hover:bg-[var(--color-border)] text-[var(--color-text)] transition-colors" aria-label="Toggle Mobile Menu">
              ☰
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && !isPortal && (
          <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] py-4 px-4 space-y-3 flex flex-col">
            <Link href="/services" onClick={() => setMobileNavOpen(false)} className="text-sm font-medium text-[var(--color-text-subtle)] hover:text-[var(--color-accent)]">
              Services
            </Link>
            <Link href="/case-studies" onClick={() => setMobileNavOpen(false)} className="text-sm font-medium text-[var(--color-text-subtle)] hover:text-[var(--color-accent)]">
              Case Studies
            </Link>
            <Link href="/blog" onClick={() => setMobileNavOpen(false)} className="text-sm font-medium text-[var(--color-text-subtle)] hover:text-[var(--color-accent)]">
              Blog
            </Link>
            <Link href="/contact" onClick={() => setMobileNavOpen(false)} className="text-sm font-medium text-[var(--color-text-subtle)] hover:text-[var(--color-accent)]">
              Contact
            </Link>
            <hr className="border-[var(--color-border)]" />
            <Link href="/login" onClick={() => setMobileNavOpen(false)} className="text-sm font-medium text-[var(--color-text-subtle)] hover:text-[var(--color-accent)]">
              Client Portal
            </Link>
            <Link href="/contact" onClick={() => setMobileNavOpen(false)} className="bg-[var(--color-primary)] text-white text-center py-2 rounded-lg text-sm font-semibold">
              Get Started
            </Link>
          </div>
        )}
      </header>

      {/* MAIN */}
      <main id="main" className="flex-grow">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-[var(--color-primary)]">IT Services</h4>
            <p className="text-sm text-[var(--color-text-subtle)]">
              High-performance headless corporate solutions built for durability, performance, and scale.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--color-primary)] mb-4">Solutions</h4>
            <ul className="space-y-2 text-sm text-[var(--color-text-subtle)]">
              <li><Link href="/services" className="hover:underline">Cloud Migration</Link></li>
              <li><Link href="/services" className="hover:underline">Managed Services</Link></li>
              <li><Link href="/services" className="hover:underline">Cybersecurity</Link></li>
              <li><Link href="/services" className="hover:underline">Data Analytics</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--color-primary)] mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-[var(--color-text-subtle)]">
              <li><Link href="/case-studies" className="hover:underline">Case Studies</Link></li>
              <li><Link href="/blog" className="hover:underline">Blog</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--color-primary)] mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-[var(--color-text-subtle)]">
              <li><span className="hover:underline cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:underline cursor-pointer">GDPR Compliance</span></li>
              <li><span className="hover:underline cursor-pointer">CCPA Consent</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-text-subtle)]">
          © {new Date().getFullYear()} IT Services Corporate Website. All rights reserved.
        </div>
      </footer>

      {/* GDPR / CCPA COOKIE CONSENT BANNER */}
      {cookieConsent === false && (
        <div id="cookie-banner" className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-surface)] border-t border-[var(--color-border)] p-4 shadow-xl transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-sm text-[var(--color-text-subtle)]">
              We use cookies to enhance your experience, monitor website performance, and validate lead data in compliance with GDPR and CCPA regulations. By continuing, you consent to our cookie policy.
            </div>
            <div className="flex items-center space-x-3 shrink-0">
              <button onClick={handleCookieDecline} className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-xs font-semibold text-[var(--color-text-subtle)] hover:bg-[var(--color-background)] transition-colors">
                Decline
              </button>
              <button onClick={handleCookieAccept} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-xs font-semibold hover:bg-[var(--color-primary-dark)] transition-colors">
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}