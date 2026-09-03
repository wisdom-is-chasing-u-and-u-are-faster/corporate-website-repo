import React from 'react';
import Head from 'next/head';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ContactForm } from '@/components/ContactForm';
import { Mail, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact Us - Premium IT Services</title>
        <meta
          name="description"
          content="Initiate a consultation with our enterprise architects across Cloud Migration, App Development, Data Analytics, and AI."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />

        <main className="flex-1">
          {/* Hero */}
          <section className="bg-slate-900 py-16 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
              <div className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-400/30 mb-4">
                Enterprise Engagement
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                Contact Us
              </h1>
              <p className="mt-4 text-base text-slate-300 leading-relaxed">
                Let's discuss your organization's engineering challenges, digital roadmap, and modern architecture priorities.
              </p>
            </div>
          </section>

          {/* Form & Direct Contact Info Grid */}
          <section className="py-16 bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Contact Info */}
                <div className="lg:col-span-5 space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Direct Contact Channels</h2>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Our enterprise practice leads are available across global timezones for immediate architecture briefings.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs text-slate-700">
                    <div className="flex items-start space-x-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <Mail className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-900">Enterprise Solutions Email</p>
                        <p className="text-slate-600">contact@premiumitservices.com</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Automated confirmation & tracking on submission</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <Phone className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-900">Global Operations Hotline</p>
                        <p className="text-slate-600">+1 (212) 555-0199 (US & Global)</p>
                        <p className="text-slate-600">+44 20 7946 0920 (EMEA)</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-900">Service Level Commitment</p>
                        <p className="text-slate-600">Technical team response &lt; 24 hours</p>
                        <p className="text-slate-600">Critical incident response 15 min SLA</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-900">Data Protection & NDA</p>
                        <p className="text-slate-600">Strict adherence to GDPR, CCPA, and SOC2 confidentiality protocols.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Formik Contact Form */}
                <div className="lg:col-span-7">
                  <ContactForm />
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
