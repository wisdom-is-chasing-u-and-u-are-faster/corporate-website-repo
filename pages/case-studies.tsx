import Layout from '@/components/Layout';
import Link from 'next/link';

interface CaseStudiesPageProps {
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

const caseStudies = [
  { title: 'Global Retailer Headless Shift', client: 'Acme Retail', metric: '45% Conversion Increase', desc: 'Transitioning a monolithic Magento storefront to Next.js SSG on a global Edge CDN, improving mobile performance scores to 96+.' },
  { title: 'Serverless CRM Automation', client: 'Alpha Logistics', metric: '1.2s Ingestion Latency', desc: 'Implementing decoupled AWS Lambda and EventBridge messaging blocks to route secure client leads into HubSpot CRM asynchronously.' }
];

export default function CaseStudiesPage({ theme, toggleTheme }: CaseStudiesPageProps) {
  return (
    <Layout theme={theme} toggleTheme={toggleTheme}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-primary)]">
            Our Proven <span className="text-gradient">Success Stories</span>
          </h1>
          <p className="text-lg text-[var(--color-text-subtle)] max-w-2xl mx-auto">
            Discover how leading enterprises achieve exceptional performance SLAs, conversion improvements, and bank-grade security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {caseStudies.map((cs, idx) => (
            <div key={idx} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8 hover:shadow-lg transition-all space-y-4">
              <span className="text-xs font-bold text-[var(--color-accent-dark)] uppercase tracking-wider">{cs.client}</span>
              <h3 className="text-2xl font-bold text-[var(--color-primary)]">{cs.title}</h3>
              <p className="text-sm font-semibold text-emerald-600 bg-emerald-50 dark:bg-opacity-10 dark:text-emerald-400 px-3 py-1 rounded-full inline-block">{cs.metric}</p>
              <p className="text-[var(--color-text-subtle)] leading-relaxed">{cs.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}