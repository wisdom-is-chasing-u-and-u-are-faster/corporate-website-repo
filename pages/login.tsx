import Layout from '@/components/Layout';
import Link from 'next/link';

interface LoginPageProps {
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

export default function LoginPage({ theme, toggleTheme }: LoginPageProps) {
  return (
    <Layout theme={theme} toggleTheme={toggleTheme}>
      <div className="max-w-md mx-auto px-4 py-24">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-xl space-y-6 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-[var(--color-primary)]">Client Portal Login</h2>
            <p className="text-sm text-[var(--color-text-subtle)]">
              Welcome back! Access your enterprise support dashboards and live ticket status.
            </p>
          </div>

          <div className="bg-[var(--color-background)] p-4 rounded-xl text-sm text-[var(--color-text-subtle)] border border-[var(--color-border)]">
            <strong className="text-[var(--color-primary)] font-semibold">Single Sign-On (SSO) Enabled</strong>
            <p className="mt-1 text-xs">Authentication is secure and managed via your enterprise Identity Provider (IdP) with MFA enforced.</p>
          </div>

          <div className="pt-4">
            <Link href="/portal-dashboard" className="block w-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] py-4 rounded-xl font-bold shadow-md transition-colors text-center">
              Log In with SSO
            </Link>
          </div>

          <div className="text-xs text-[var(--color-text-subtle)]">
            Authorized portal users only. Access is monitored and logged in compliance with HIPAA and SOC2 regulations.
          </div>
        </div>
      </div>
    </Layout>
  );
}