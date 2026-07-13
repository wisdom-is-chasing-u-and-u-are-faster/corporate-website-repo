import Layout from '@/components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface TicketDetailsPageProps {
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

const initialTickets: Record<string, { id: string; subject: string; status: string; description: string; comments: { author: string; time: string; body: string }[] }> = {
  'TS-8841': {
    id: 'TS-8841',
    subject: 'Monolithic DB CPU Spike',
    status: 'Resolved',
    description: 'We observed a sustained CPU utilization spike (>95%) on the main monolithic database server from 14:00 to 15:30 UTC. Read replication lag exceeded our SLA thresholds.',
    comments: [
      { author: 'Jane Developer (SRE)', time: '2 hours ago', body: 'The database CPU utilization has returned to normal. We traced the query bottleneck to an unindexed query on the leads table. Index was successfully applied on production.' },
      { author: 'Mark Systems Admin (Acme)', time: '1 hour ago', body: 'Confirmed. CPU utilization is steady around 12% and replica replication lag is back under 50ms. Marking this as resolved. Thank you!' }
    ]
  },
  'TS-8842': {
    id: 'TS-8842',
    subject: 'JWT Scope Validation Failure',
    status: 'In Progress',
    description: 'B2B API gateway returns 403 Forbidden even when valid access tokens are provided. The authorization log reports scope check failure for tickets:read.',
    comments: [
      { author: 'Jane Developer (SRE)', time: '1 day ago', body: 'Looking into this. It appears the Auth0 tenant configuration does not include tickets:read scope inside the default access token claims. Modifying the tenant mapping script now.' }
    ]
  },
  'TS-8843': {
    id: 'TS-8843',
    subject: 'Rate Limit Endpoint Blockages',
    status: 'Pending',
    description: 'Our automated test pipelines hit 429 Too Many Requests when submitting validated lead tests continuously, which is completely expected but we need rate-limiting metrics reporting.',
    comments: []
  }
};

export default function TicketDetailsPage({ theme, toggleTheme }: TicketDetailsPageProps) {
  const router = useRouter();
  const { id } = router.query;
  const ticketId = (id as string) || 'TS-8841';

  const [ticketData, setTicketData] = useState(initialTickets);
  const [newComment, setNewComment] = useState('');

  const ticket = ticketData[ticketId] || ticketData['TS-8841'];

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const updatedComments = [
      ...ticket.comments,
      {
        author: 'Mark Systems Admin (Acme)',
        time: 'Just now',
        body: newComment.trim()
      }
    ];

    setTicketData({
      ...ticketData,
      [ticketId]: {
        ...ticket,
        comments: updatedComments
      }
    });

    setNewComment('');
  };

  return (
    <Layout theme={theme} toggleTheme={toggleTheme}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <Link href="/portal-dashboard" className="text-sm font-semibold text-[var(--color-accent-dark)] hover:underline flex items-center space-x-1">
          <span>← Back to Dashboard</span>
        </Link>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[var(--color-border)]">
            <div>
              <span className="text-xs font-bold text-[var(--color-accent-dark)] font-mono">{ticket.id}</span>
              <h1 className="text-2xl font-extrabold text-[var(--color-primary)] mt-1">{ticket.subject}</h1>
            </div>
            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                ticket.status === 'Resolved' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : ticket.status === 'In Progress'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-800'
              }`}>
                {ticket.status}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">Description</h4>
            <p className="text-sm text-[var(--color-text)] leading-relaxed bg-[var(--color-background)] p-4 rounded-xl border border-[var(--color-border)]">
              {ticket.description}
            </p>
          </div>

          <div className="space-y-6 pt-6 border-t border-[var(--color-border)]">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">Conversation History</h4>
            
            {ticket.comments.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No comments filed yet. Enter your query below.</p>
            ) : (
              <div className="space-y-4">
                {ticket.comments.map((c, idx) => (
                  <div key={idx} className="bg-[var(--color-background)] p-4 rounded-xl border border-[var(--color-border)] space-y-2">
                    <div className="flex justify-between items-center text-xs text-[var(--color-text-subtle)]">
                      <span className="font-bold text-[var(--color-primary)]">{c.author}</span>
                      <span>{c.time}</span>
                    </div>
                    <p className="text-sm text-[var(--color-text)] leading-relaxed">{c.body}</p>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddComment} className="space-y-3 pt-4">
              <label htmlFor="comment" className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">
                Add Comment
              </label>
              <textarea
                id="comment"
                rows={3}
                className="w-full px-4 py-3 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                placeholder="Reply to SRE engineers..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                type="submit"
                className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors"
              >
                Post Comment
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}