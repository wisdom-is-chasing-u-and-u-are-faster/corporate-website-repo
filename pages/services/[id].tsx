import Layout from '@/components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface ServiceDetailPageProps {
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

const servicesData: Record<string, { title: string; desc: string; detail: string }> = {
  'cloud-migration': {
    title: 'Cloud Migration & Infrastructure',
    desc: 'Secure, zero-downtime database and monolithic software shifts into modern serverless architectures.',
    detail: 'We specialize in migrating enterprise legacy systems to modern headless environments. Our certified solutions engineers leverage AWS Lambda, Amazon DynamoDB, and Next.js ISR (Incremental Static Regeneration) to reduce operational infrastructure bills while improving performance SLAs up to 99.99% uptime.'
  },
  'cybersecurity': {
    title: 'Enterprise Cybersecurity & Audits',
    desc: 'Continuous vulnerability scanning, automated pen testing, compliance checks, and OWASP alignment.',
    detail: 'Security is at the heart of our decoupled Jamstack deliveries. By pre-rendering static assets and establishing read-only endpoints, we completely block common exploit paths such as SQL injections and Cross-Site Scripting (XSS). Additionally, all in-transit communications are strictly locked to TLS 1.3.'
  },
  'managed-services': {
    title: '24/7 Managed SRE Support',
    desc: 'Active uptime monitoring, Incident management, and direct integration with Jira Service Management.',
    detail: 'Our managed operations teams maintain constant vigilance over client-facing services. We integrate deeply with enterprise CRM tools (e.g., Salesforce) and Jira Service Management. Active client portal users can query live status boards and view real-time ticket logs straight from our platform.'
  },
  'data-analytics': {
    title: 'Data Analytics & Pipelines',
    desc: 'Transform raw database transactions and user logs into real-time business dashboards and forecasting models.',
    detail: 'Harness the value of corporate behavioral and transactional metrics. We implement high-throughput data pipes using Apache Kafka and Amazon Kinesis to ingest, validate, mask, and analyze gigabytes of logging records in seconds, keeping executive suites informed via clean dashboards.'
  }
};

export default function ServiceDetailPage({ theme, toggleTheme }: ServiceDetailPageProps) {
  const router = useRouter();
  const { id } = router.query;

  const service = servicesData[id as string] || servicesData['cloud-migration'];

  return (
    <Layout theme={theme} toggleTheme={toggleTheme}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/services" className="text-sm font-semibold text-[var(--color-accent-dark)] hover:underline mb-8 inline-block">
          ← Back to Services
        </Link>
        <div className="space-y-8">
          <h1 className="text-4xl font-extrabold text-[var(--color-primary)]">
            {service.title}
          </h1>
          <p className="text-xl text-[var(--color-text-subtle)] font-medium leading-relaxed">
            {service.desc}
          </p>
          <div className="prose dark:prose-invert max-w-none text-base text-[var(--color-text)] leading-relaxed space-y-6 pt-6 border-t border-[var(--color-border)]">
            <p>{service.detail}</p>
            <p>
              Whether you are looking to modernise existing applications or launch a fresh digital experience, our team provides the full-stack engineering expertise necessary to satisfy strict performance objectives, compliance constraints, and business latency requirements.
            </p>
          </div>
          <div className="pt-8">
            <Link href="/contact" className="inline-block bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] px-6 py-3 rounded-lg font-bold shadow-md transition-colors">
              Schedule A Technical Consultation
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}