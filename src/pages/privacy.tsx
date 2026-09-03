import React from 'react';
import Head from 'next/head';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Premium IT Services</title>
        <meta
          name="description"
          content="Privacy policy outlining GDPR, CCPA, and data processing standards for Premium IT Services."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />

        <main className="flex-1">
          {/* Hero */}
          <section className="bg-slate-900 py-16 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
              <div className="inline-flex items-center space-x-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300 mb-4">
                <Shield className="h-3.5 w-3.5" />
                <span>GDPR & CCPA Compliant</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                Privacy Policy
              </h1>
              <p className="mt-4 text-base text-slate-300 leading-relaxed">
                Last Updated: August 21, 2026. Your privacy and corporate data security are paramount to our operations.
              </p>
            </div>
          </section>

          {/* Privacy Content */}
          <section className="py-16 bg-slate-50">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm space-y-8 text-xs text-slate-700 leading-relaxed">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>1. Introduction</span>
                  </h2>
                  <p>
                    Premium IT Services Platform ("we", "our", or "us") operates digital platforms, consultation portals, and enterprise software engineering services. This Privacy Policy informs you of our policies regarding the collection, use, encryption, and disclosure of personal data when you use our website, submit lead inquiries, or access our administrative portal.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-blue-600" />
                    <span>2. Information We Collect</span>
                  </h2>
                  <p className="mb-2">We collect information that you directly provide when submitting consultation requests:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li>Full name and professional contact information (corporate email, telephone).</li>
                    <li>Organization name, job role, and industry domain.</li>
                    <li>Technical requirements, infrastructure specifications, and service track interest.</li>
                    <li>System telemetry, session cookies, and IP metadata for rate-limiting security and fraud detection.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    <span>3. How We Use Your Information</span>
                  </h2>
                  <p className="mb-2">Collected information is strictly used for:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li>Evaluating enterprise solution requirements and preparing architectural proposals.</li>
                    <li>Transmitting automated email confirmations and status updates regarding your inquiries.</li>
                    <li>Preventing malicious submissions via automated duplicate scanning and rate limiting.</li>
                    <li>Complying with statutory data protection mandates (GDPR, CCPA, SOC2 Type II).</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-3">4. Data Encryption & Security Standards</h2>
                  <p>
                    All data transmitted through our web interfaces and API endpoints is strictly encrypted using TLS 1.3 protocol. At rest, database entries in Google Cloud Firestore and GCS backups are encrypted using AES-256 multi-region keys. We implement automated PII masking in non-production environments to guarantee data privacy.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-3">5. Cookie Management & Your Rights</h2>
                  <p>
                    Under GDPR and CCPA, you retain the right to access, rectify, port, or request erasure of your personal data at any time. You can modify your cookie preferences using the interactive cookie consent banner at the bottom of our pages or contact our Data Protection Officer at{' '}
                    <span className="font-semibold text-blue-600">privacy@premiumitservices.com</span>.
                  </p>
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
