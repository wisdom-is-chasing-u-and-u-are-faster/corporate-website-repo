import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { AdminLayout } from '@/components/AdminLayout';
import {
  Users,
  FileEdit,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <AdminLayout activeTab="dashboard">
      <Head>
        <title>Admin Dashboard - Premium IT Services</title>
      </Head>

      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Enterprise Operations Dashboard</h1>
            <p className="text-xs text-slate-500 mt-1">
              Real-time telemetry, lead inquiries pipeline, and CMS content status.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>GCP Cloud Run: Healthy</span>
            </span>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Leads</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900">42</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +18% this week
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Services</span>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900">4</p>
            <p className="text-[11px] text-slate-500 mt-1">Cloud, Apps, Data, AI</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Locations</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900">7</p>
            <p className="text-[11px] text-slate-500 mt-1">Global Delivery Hubs</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Response</span>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900">4.2h</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">Within SLA (&lt; 24h)</p>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Captured Leads Management</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Inspect incoming enterprise client inquiries, filter by service track, flag duplicates, and trigger status updates.
              </p>
            </div>
            <Link
              href="/admin/leads"
              className="inline-flex items-center justify-center space-x-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
            >
              <span>View Captured Leads</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <FileEdit className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Real-Time Content Editor</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Update service track descriptions, bullet points, and case studies dynamically across the public website.
              </p>
            </div>
            <Link
              href="/admin/content-editor"
              className="inline-flex items-center justify-center space-x-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
            >
              <span>Open Content Management</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
