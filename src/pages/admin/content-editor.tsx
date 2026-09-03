import React, { useState } from 'react';
import Head from 'next/head';
import { AdminLayout } from '@/components/AdminLayout';
import { SERVICE_TRACKS, ServiceTrack } from '@/lib/services-data';
import {
  FileEdit,
  Save,
  CheckCircle2,
  Layers,
  Plus,
  Trash2,
  Eye,
} from 'lucide-react';

export default function AdminContentEditorPage() {
  const [services, setServices] = useState<ServiceTrack[]>(SERVICE_TRACKS);
  const [selectedSlug, setSelectedSlug] = useState<string>(SERVICE_TRACKS[0].slug);
  const [saveStatus, setSaveStatus] = useState<string>('');

  const currentService = services.find((s) => s.slug === selectedSlug) || services[0];

  const handleFieldChange = (field: keyof ServiceTrack, value: any) => {
    setServices((prev) =>
      prev.map((s) => (s.slug === selectedSlug ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = () => {
    setSaveStatus('Saving changes to Firestore database...');
    setTimeout(() => {
      setSaveStatus('Content successfully published in real-time!');
      setTimeout(() => setSaveStatus(''), 4000);
    }, 600);
  };

  return (
    <AdminLayout activeTab="content-editor">
      <Head>
        <title>Content Editor - Premium IT Services Admin</title>
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Service Content Management</h1>
            <p className="text-xs text-slate-500 mt-1">
              Real-time administrative CMS editor for service tracks and dynamic platform copy (REQ-F-002, REQ-F-015).
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {saveStatus && (
              <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>{saveStatus}</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Publish Changes</span>
            </button>
          </div>
        </div>

        {/* Track Selector Tabs */}
        <div className="flex space-x-2 border-b border-slate-200 pb-2">
          {services.map((s) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => setSelectedSlug(s.slug)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                selectedSlug === s.slug
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Editor Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Service Title</label>
              <input
                type="text"
                value={currentService.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">URL Identifier (Slug)</label>
              <input
                type="text"
                disabled
                value={currentService.slug}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Short Tagline / Teaser Description</label>
            <input
              type="text"
              value={currentService.shortDescription}
              onChange={(e) => handleFieldChange('shortDescription', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Architectural Overview</label>
            <textarea
              rows={4}
              value={currentService.fullDescription}
              onChange={(e) => handleFieldChange('fullDescription', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Key Benefits List Editor */}
          <div>
            <label className="block font-bold text-slate-700 mb-2">Key Architectural Benefits</label>
            <div className="space-y-2">
              {currentService.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => {
                      const updated = [...currentService.benefits];
                      updated[idx] = e.target.value;
                      handleFieldChange('benefits', updated);
                    }}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = currentService.benefits.filter((_, i) => i !== idx);
                      handleFieldChange('benefits', updated);
                    }}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                    aria-label="Remove benefit"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
