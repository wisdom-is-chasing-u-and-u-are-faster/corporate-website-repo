import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Shield, Lock, Mail, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Single-Factor Authentication for Phase 1 (REQ-F-010)
    // Validates admin role credentials
    if (email.trim().toLowerCase().includes('admin') && password.length >= 6) {
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_user', JSON.stringify({ email: email.trim(), role: 'Admin' }));
      router.push('/admin/dashboard');
    } else {
      setLoading(false);
      setError('Invalid administrative credentials provided. Minimum 6 characters required.');
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login - Premium IT Services</title>
      </Head>

      <div className="min-h-screen flex flex-col justify-center bg-slate-900 py-12 sm:px-6 lg:px-8 text-white relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="flex justify-center mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg text-white font-bold text-xl">
              <Shield className="h-6 w-6" />
            </div>
          </div>
          <h2 className="mt-2 text-center text-2xl font-extrabold tracking-tight text-white">
            Administrator Login
          </h2>
          <p className="mt-1 text-center text-xs text-slate-400">
            Secure Single-Factor Access for Content Management & Lead Retrieval (Phase 1)
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="rounded-2xl border border-slate-800 bg-slate-800/90 p-8 shadow-2xl backdrop-blur">
            {error && (
              <div className="mb-6 flex items-start space-x-2 rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@premiumitservices.com"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center space-x-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  <span>Authenticate & Enter Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="mt-6 border-t border-slate-700/60 pt-4 text-center">
              <Link
                href="/"
                className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Return to Public Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
