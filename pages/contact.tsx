import Layout from '@/components/Layout';
import ContactForm from '@/components/ContactForm';

interface ContactPageProps {
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

export default function ContactPage({ theme, toggleTheme }: ContactPageProps) {
  return (
    <Layout theme={theme} toggleTheme={toggleTheme}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-primary)]">
              Connect with our <span className="text-gradient">Enterprise Experts</span>
            </h1>
            <p className="text-lg text-[var(--color-text-subtle)]">
              Our team of cloud architects, systems integrators, and software engineers are ready to bring your monolithic migration, headless designs, or support structures to life.
            </p>
            <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
              <div>
                <h4 className="font-bold text-[var(--color-primary)] text-sm uppercase tracking-wider">Corporate Headquarters</h4>
                <p className="text-sm text-[var(--color-text-subtle)] mt-1">100 Enterprise Way, Suite 400, Tech City, CA 94016</p>
              </div>
              <div>
                <h4 className="font-bold text-[var(--color-primary)] text-sm uppercase tracking-wider">Sales & Partnerships</h4>
                <p className="text-sm text-[var(--color-text-subtle)] mt-1">enterprise-sales@itservicescorp.com</p>
              </div>
              <div>
                <h4 className="font-bold text-[var(--color-primary)] text-sm uppercase tracking-wider">General Support Response</h4>
                <p className="text-sm text-[var(--color-text-subtle)] mt-1">We guarantee response within 2 business hours for SLA accounts.</p>
              </div>
            </div>
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </Layout>
  );
}