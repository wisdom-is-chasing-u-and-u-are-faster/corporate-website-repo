import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AdminLayout } from '@/components/AdminLayout';
import { LeadRecord } from '@/lib/leads-store';
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building,
  Mail,
  FileSpreadsheet,
} from 'lucide-react';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterService, setFilterService] = useState('ALL');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      if (typeof window !== 'undefined' && typeof fetch === 'function') {
        const res = await fetch('/api/v1/admin/leads');
        if (res && res.ok) {
          const data = await res.json();
          setLeads(data.leads || []);
        }
      }
    } catch (err) {
      // In test/SSR environments without network, fallback silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterService === 'ALL' || lead.serviceTrack === filterService;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout activeTab="leads">
      <Head>
        <title>Captured Leads - Premium IT Services Admin</title>
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Captured Lead Inquiries</h1>
            <p className="text-xs text-slate-500 mt-1">
              Secure administrative access to inbound enterprise consultation requests (REQ-F-003, REQ-F-009).
            </p>
          </div>
          <button
            type="button"
            onClick={fetchLeads}
            className="inline-flex items-center space-x-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            <span>Refresh Table</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-xs">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, company, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="rounded-lg border border-slate-300 py-2 px-3 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Service Tracks</option>
              <option value="cloud-migration">Cloud Migration</option>
              <option value="app-development">App Development</option>
              <option value="data-analytics">Data Analytics</option>
              <option value="artificial-intelligence">Artificial Intelligence</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Leads Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Prospect & Organization</th>
                  <th className="px-6 py-3.5">Service Track</th>
                  <th className="px-6 py-3.5">Inquiry Details</th>
                  <th className="px-6 py-3.5">Submitted</th>
                  <th className="px-6 py-3.5">Status & Validation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      {loading ? 'Retrieving encrypted lead records...' : 'No matching leads found.'}
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{lead.name}</div>
                        <div className="flex items-center space-x-1 text-slate-500 text-[11px] mt-0.5">
                          <Building className="h-3 w-3" />
                          <span>{lead.company}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-slate-500 text-[11px]">
                          <Mail className="h-3 w-3" />
                          <span className="font-mono">{lead.email}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-block rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 border border-blue-100">
                          {lead.serviceTrack}
                        </span>
                      </td>

                      <td className="px-6 py-4 max-w-xs">
                        <p className="line-clamp-2 text-slate-600 text-[11px] leading-relaxed">
                          {lead.message}
                        </p>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-[11px]">
                        {new Date(lead.createdAt).toLocaleDateString()} ·{' '}
                        {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          {lead.flaggedDuplicate ? (
                            <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              <AlertTriangle className="h-3 w-3" />
                              <span>DUPLICATE SCAN FLAGGED</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>VALIDATED & CONFIRMED</span>
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono">Status: {lead.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
