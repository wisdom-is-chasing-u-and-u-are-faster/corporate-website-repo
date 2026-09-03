import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  Layers,
  Cpu,
  Shield,
  Activity,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

const PRODUCTS = [
  {
    id: 'cloud-forge',
    title: 'CloudForge Orchestrator',
    tagline: 'Autonomous multi-cloud IaC provisioning and migration acceleration platform.',
    description: 'CloudForge provides blueprint templates, automated security policies, and continuous drift detection for GCP, AWS, and Azure.',
    icon: <Cpu className="h-6 w-6 text-blue-600" />,
    features: [
      'Terraform & OpenTofu automated generator',
      'Zero-trust GCP Service Account least-privilege enforcer',
      'Automated disaster recovery testing',
      'Real-time cost anomaly alert engine'
    ]
  },
  {
    id: 'data-nexus',
    title: 'DataNexus Intelligence Hub',
    tagline: 'Enterprise data ingestion, PII masking, and analytical pipeline platform.',
    description: 'High-throughput stream processing with automated PII masking scripts for compliant data warehousing in BigQuery and Snowflake.',
    icon: <Activity className="h-6 w-6 text-emerald-600" />,
    features: [
      'Automated PII masking in dev & test environments',
      'Kafka & Pub/Sub multi-region streaming',
      'Sub-200ms query latency indexing',
      'Granular column-level Firestore and BigQuery access rules'
    ]
  },
  {
    id: 'genai-agent-core',
    title: 'GenAI Agent Core',
    tagline: 'Production-ready framework for secure enterprise cognitive agent workflows.',
    description: 'Deploy domain-adapted LLM workflows, RAG knowledge stores, and tool-calling agent orchestrators with full audit trails.',
    icon: <Sparkles className="h-6 w-6 text-purple-600" />,
    features: [
      'Enterprise RAG with hybrid semantic search',
      'Built-in rate limiting and token consumption guards',
      'Multi-model LLM gateway with failover',
      'SOC2 and HIPAA compliant data boundary'
    ]
  }
];

export default function ProductsPage() {
  return (
    <>
      <Head>
        <title>Products & Accelerators - Premium IT Services</title>
        <meta
          name="description"
          content="Explore our enterprise-grade product accelerators for cloud orchestration, data pipelines, and GenAI agents."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />

        <main className="flex-1">
          {/* Hero */}
          <section className="bg-slate-900 py-16 sm:py-20 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
              <div className="inline-flex items-center space-x-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300 mb-4">
                <Layers className="h-3.5 w-3.5" />
                <span>Enterprise Product Accelerators</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                Our Products & Platforms
              </h1>
              <p className="mt-4 text-base text-slate-300 leading-relaxed">
                Pre-built, battle-tested software accelerators engineered to slash time-to-market for modern digital enterprises.
              </p>
            </div>
          </section>

          {/* Product List */}
          <section className="py-20 bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {PRODUCTS.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
                        {prod.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-1">{prod.title}</h3>
                      <p className="text-xs font-semibold text-blue-600 mb-4">{prod.tagline}</p>
                      <p className="text-xs text-slate-600 leading-relaxed mb-6">{prod.description}</p>

                      <div className="space-y-2.5 mb-6">
                        {prod.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                            <CheckCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      <Link
                        href="/contact"
                        className="w-full inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                      >
                        Request Demo & Evaluation
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
