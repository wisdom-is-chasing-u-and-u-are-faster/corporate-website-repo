import Layout from '@/components/Layout';
import Link from 'next/link';

interface BlogPageProps {
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

const blogPosts = [
  { title: 'The Architect Guide to Next.js ISR (Incremental Static Regeneration)', date: 'June 12, 2026', author: 'Soham Rangdal', summary: 'Learn how to serve real-time localized CMS changes to a global CDN without incurring heavy continuous rendering bills.' },
  { title: 'Securing Edge APIs: Rate-Limiting and JWT Scopes', date: 'May 28, 2026', author: 'John Doe', summary: 'Best practices for securing serverless functions from bot spam and structuring API tokens for B2B portal integrations.' }
];

export default function BlogPage({ theme, toggleTheme }: BlogPageProps) {
  return (
    <Layout theme={theme} toggleTheme={toggleTheme}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-primary)]">
            Our Technical <span className="text-gradient">Engineering Blog</span>
          </h1>
          <p className="text-lg text-[var(--color-text-subtle)] max-w-2xl mx-auto">
            Deep-dives, architecture blueprints, and best practices shared directly by our core software engineers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post, idx) => (
            <div key={idx} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs text-[var(--color-text-subtle)]">{post.date} • By {post.author}</span>
                <h3 className="text-2xl font-bold text-[var(--color-primary)]">{post.title}</h3>
                <p className="text-[var(--color-text-subtle)] leading-relaxed">{post.summary}</p>
              </div>
              <div className="pt-6">
                <span className="text-[var(--color-accent-dark)] font-semibold cursor-pointer hover:underline">Read Full Article →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}