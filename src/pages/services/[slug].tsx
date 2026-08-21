import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SERVICE_TRACKS, getServiceBySlug, ServiceTrack } from '@/lib/services-data';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Award,
  BarChart,
  Layers,
  ChevronLeft,
} from 'lucide-react';

interface ServiceDetailPageProps {
  service: ServiceTrack;
}

export default function ServiceDetailPage({ service }: ServiceDetailPageProps) {
  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Service not found.</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{service.title} - Premium IT Services</title>
        <meta name="description" content={service.shortDescription} />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />

        <main className="flex-1">
          {/* Breadcrumb & Hero */}
          <section className="bg-slate-900 py-16 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
              <Link
                href="/"
                className="inline-flex items-center text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Home
              </Link>
              <div className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-400/30">
                Strategic Service Track
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                {service.title}
              </h1>
              <p className="text-base text-slate-300 max-w-3xl leading-relaxed">
                {service.fullDescription}
              </p>
            </div>
          </section>

          {/* Key Capabilities & Benefits Grid */}
          <section className="py-16 bg-slate-50 border-b border-slate-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Core Capabilities */}
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <Layers className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Core Capabilities</h2>
                  </div>
                  <ul className="space-y-4 text-sm text-slate-700">
                    {service.capabilities.map((cap, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <span className="font-medium">{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Architectural Benefits */}
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                      <BarChart className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Key Benefits</h2>
                  </div>
                  <ul className="space-y-4 text-sm text-slate-700">
                    {service.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-medium">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Case Study */}
          <section className="py-16 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                    <Award className="h-4 w-4" />
                    <span>Featured Enterprise Case Study</span>
                  </div>
                  <h3 className="text-2xl font-bold">{service.caseStudy.client}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {service.caseStudy.summary}
                  </p>
                  <div className="pt-2">
                    <span className="inline-block rounded-lg bg-blue-600/30 border border-blue-400/40 px-3 py-1.5 text-xs font-bold text-blue-200 font-mono">
                      Impact: {service.caseStudy.metrics}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-blue-500 transition-colors"
                  >
                    <span>Request Practice Blueprint</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = SERVICE_TRACKS.map((track) => ({
    params: { slug: track.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      service,
    },
  };
};
