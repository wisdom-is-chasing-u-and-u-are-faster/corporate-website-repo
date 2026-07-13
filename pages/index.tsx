import Layout from '@/components/Layout';
import Link from 'next/link';

interface HomePageProps {
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

export default function HomePage({ theme, toggleTheme }: HomePageProps) {
  return (
    <Layout theme={theme} toggleTheme={toggleTheme}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-[var(--color-success-bg)] text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200">
            <span>🚀 Fully Approved Design — Variant A</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[var(--color-primary)]">
            Decoupled, Headless <br />
            <span className="text-gradient">Enterprise Digital Delivery</span>
          </h1>
          <p className="text-xl text-[var(--color-text-subtle)] max-w-2xl mx-auto">
            Experience ultra-low latency, optimized SEO rankings, and localized headless CMS structures tailored for Fortune 500 digital storefronts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/services" className="w-full sm:w-auto bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] px-8 py-4 rounded-xl font-bold shadow-lg text-lg text-center transition-all">
              Explore Our Services
            </Link>
            <Link href="/contact" className="w-full sm:w-auto border border-[var(--color-border)] hover:bg-[var(--color-background)] px-8 py-4 rounded-xl font-bold text-lg text-center transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}