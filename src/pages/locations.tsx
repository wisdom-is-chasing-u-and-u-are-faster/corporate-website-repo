import React from 'react';
import Head from 'next/head';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InteractiveMap } from '@/components/InteractiveMap';
import { Globe, MapPin, Building, Shield } from 'lucide-react';

export default function LocationsPage() {
  return (
    <>
      <Head>
        <title>Our Locations - Premium IT Services</title>
        <meta
          name="description"
          content="Worldwide office locations across North America, EMEA, APAC, and LATAM. Find your regional delivery center."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />

        <main className="flex-1">
          {/* Hero */}
          <section className="bg-slate-900 py-16 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
              <div className="inline-flex items-center space-x-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300 mb-4">
                <Globe className="h-3.5 w-3.5" />
                <span>Worldwide Delivery Hubs</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                Our Global Presence
              </h1>
              <p className="mt-4 text-base text-slate-300 leading-relaxed">
                Operating high-availability engineering delivery centers across 4 continents to provide continuous follow-the-sun enterprise support.
              </p>
            </div>
          </section>

          {/* Interactive Map & Directory Component */}
          <section className="py-16 bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <InteractiveMap />
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
