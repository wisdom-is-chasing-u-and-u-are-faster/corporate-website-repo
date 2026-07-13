import Layout from '@/components/Layout';
import Link from 'next/link';

interface PortalDashboardPageProps {
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

const mockTickets = [
  { id: 'TS-8841', subject: 'Monolithic DB CPU Spike', status: 'Resolved', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', updated: '2 hours ago' },
  { id: 'TS-8842', subject: 'JWT Scope Validation Failure', status: 'In Progress', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', updated: '1 day ago' },
  { id: 'TS-8843', subject: 'Rate Limit Endpoint Blockages', status: 'Pending', badge: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400', updated: '3 days ago' },
];

export default function PortalDashboardPage({ theme, toggleTheme }: PortalDashboardPageProps) {
  return (
    <Layout theme={theme} toggleTheme={toggleTheme}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[var(--color-border)]">
          <div>
            <span className="text-xs font-bold text-[var(--color-accent-dark)] uppercase tracking-wider">Enterprise B2B Client Portal</span>
            <h1 className="text-3xl font-extrabold text-[var(--color-primary)]">Acme Corp Dashboard</h1>
          </div>
          <div className="text-sm text-[var(--color-text-subtle)] text-right">
            Account Status: <span className="text-emerald-600 font-bold">Active SLA Platinum</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-[var(--color-primary)]">Active Support Tickets (Jira Service Management)</h3>
            <button className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] px-4 py-2 rounded-lg text-xs font-bold transition-colors">
              + File Support Ticket
            </button>
          </div>

          <div className="overflow-x-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm">
            <table className="w-full min-w-[600px] text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">Ticket ID</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">Subject</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {mockTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-[var(--color-background)] transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-[var(--color-accent-dark)]">
                      <Link href={`/ticket-details?id=${t.id}`} className="hover:underline">
                        {t.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[var(--color-text)]">
                      <Link href={`/ticket-details?id=${t.id}`} className="hover:underline">
                        {t.subject}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${t.badge}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text-subtle)]">{t.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}