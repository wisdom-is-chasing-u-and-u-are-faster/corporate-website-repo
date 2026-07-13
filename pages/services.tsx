import Layout from '@/components/Layout';
import Link from 'next/link';

interface ServicesPageProps {
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

const servicesData = [
  { id: 'cloud-migration', title: 'Cloud Migration & Infrastructure', desc: 'Secure, zero-downtime database and monolithic software shifts into modern serverless architectures.' },
  { id: 'cybersecurity', title: 'Enterprise Cybersecurity & Audits', desc: 'Continuous vulnerability scanning, automated pen testing, compliance checks, and OWASP alignment.' },
  { id: 'managed-services', title: '24/7 Managed SRE Support', desc: 'Active uptime monitoring, Incident management, and direct integration with Jira Service Management.' },
  { id: 'data-analytics', title: 'Data Analytics & Pipelines', desc: 'Transform raw database transactions and user logs into real-time business dashboards and forecasting models.' },
];

export default function ServicesPage({ theme, toggleTheme }: ServicesPageProps) {
  return (
    <Layout theme={theme} toggleTheme={toggleTheme}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-primary)]">
            Our Enterprise <span className="text-gradient">Service Offerings</span>
          </h1>
          <p className="text-lg text-[var(--color-text-subtle)] max-w-2xl mx-auto">
            Leverage bleeding-edge technical delivery frameworks engineered to maximize performance, scalability, and security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicesData.map((svc) => (
            <div key={svc.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8 hover:shadow-lg transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[var(--color-primary)]">{svc.title}</h3>
                <p className="text-[var(--color-text-subtle)]">{svc.desc}</p>
              </div>
              <div className="pt-6">
                <Link href={`/services/${svc.id}`} className="text-[var(--color-accent-dark)] hover:text-[var(--color-accent)] font-semibold flex items-center space-x-1.5 hover:underline">
                  <span>Learn More</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}