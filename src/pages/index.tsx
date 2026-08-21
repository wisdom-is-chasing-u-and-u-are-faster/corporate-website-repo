import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ServiceCard } from '@/components/ServiceCard';
import { SERVICE_TRACKS } from '@/lib/services-data';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe2,
  Server,
  Award,
  CheckCircle,
} from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Home - Premium IT Services</title>
        <meta
          name="description"
          content="Accelerate your enterprise digital transformation across Cloud Migration, App Development, Data Analytics, and AI."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-slate-900 py-20 sm:py-28 text-white">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl space-y-6">
                <div className="inline-flex items-center space-x-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                  <Zap className="h-3.5 w-3.5 text-blue-400" />
                  <span>Enterprise Digital Engineering Platform</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                  Accelerate Your Growth with{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                    World-Class IT Solutions
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                  We architect high-performance, resilient cloud architectures, bespoke enterprise applications, intelligent data platforms, and autonomous GenAI systems.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-blue-500 transition-colors"
                  >
                    <span>Schedule Architecture Consultation</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    Explore Products & Solutions
                  </Link>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="mt-16 grid grid-cols-2 gap-6 border-t border-slate-800 pt-8 sm:grid-cols-4">
                <div>
                  <p className="text-3xl font-extrabold text-blue-400">99.95%</p>
                  <p className="text-xs text-slate-400 mt-1">Platform SLA & Uptime</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-white">40%+</p>
                  <p className="text-xs text-slate-400 mt-1">Cost Reduction via Cloud</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-indigo-400">&lt; 15 min</p>
                  <p className="text-xs text-slate-400 mt-1">Disaster Recovery RTO</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-emerald-400">SOC2</p>
                  <p className="text-xs text-slate-400 mt-1">Type II Certified Security</p>
                </div>
              </div>
            </div>
          </section>

          {/* Core Service Tracks Section (REQ-F-001) */}
          <section className="py-20 bg-slate-50 border-b border-slate-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Strategic Capabilities
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
                  Core Service Tracks
                </h2>
                <p className="text-sm text-slate-600 mt-3">
                  Comprehensive end-to-end IT engineering expertise structured across four strategic practice areas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {SERVICE_TRACKS.map((service) => (
                  <ServiceCard key={service.slug} service={service} />
                ))}
              </div>
            </div>
          </section>

          {/* Why Enterprises Choose Us */}
          <section className="py-20 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Enterprise Excellence
                  </span>
                  <h2 className="text-3xl font-extrabold text-slate-900">
                    Engineered for Security, Resilience, and Extreme Scale
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Our platform implementations strictly adhere to modern cloud-native standards, automated Infrastructure-as-Code with Terraform, zero-trust GCP architecture, and full WCAG 2.1 AA accessibility compliance.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-start space-x-3">
                      <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">End-to-End Encryption</h4>
                        <p className="text-xs text-slate-600">TLS 1.3 in transit and AES-256 multi-region at rest.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Server className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Google Cloud Native Deployment</h4>
                        <p className="text-xs text-slate-600">Autoscaling Cloud Run containers backed by Google Cloud CDN and Firestore.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Globe2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Global Engineering Presence</h4>
                        <p className="text-xs text-slate-600">Distributed hubs across North America, EMEA, APAC, and LATAM.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-900 p-8 text-white shadow-xl">
                  <h3 className="text-lg font-bold mb-4 text-blue-400">Architecture Guarantees</h3>
                  <div className="space-y-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                      <p className="font-bold text-slate-200">Lighthouse Score ≥ 95</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">Incremental Static Regeneration (ISR) with optimized asset streaming.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                      <p className="font-bold text-slate-200">Core Web Vitals LCP &lt; 1.5s</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">Edge cached through Cloud CDN with Time to First Byte &lt; 200ms.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                      <p className="font-bold text-slate-200">Blue-Green Production Deployments</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">Automated canary routing and instant rollbacks with zero user impact.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Banner */}
          <section className="bg-blue-600 py-16 text-white text-center">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Ready to transform your IT architecture?
              </h2>
              <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto">
                Consult with our solutions architects to evaluate your cloud roadmap, application portfolio, and data strategy.
              </p>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-blue-600 shadow-md hover:bg-blue-50 transition-colors"
                >
                  Get in Touch Today
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
