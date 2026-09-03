import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  Users,
  FileEdit,
  ShieldAlert,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Building,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'leads' | 'content-editor';
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const authStatus = localStorage.getItem('admin_authenticated');
    if (authStatus !== 'true') {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-xs text-slate-500 font-medium">
        Verifying administrative authorization...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center space-x-2 px-2 py-3 mb-6 border-b border-slate-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
              A
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Admin Portal</h2>
              <span className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider">
                Enterprise CMS
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            <Link
              href="/admin/dashboard"
              className={`flex items-center space-x-3 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/leads"
              className={`flex items-center space-x-3 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'leads'
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Captured Leads</span>
            </Link>

            <Link
              href="/admin/content-editor"
              className={`flex items-center space-x-3 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'content-editor'
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <FileEdit className="h-4 w-4" />
              <span>Content Editor</span>
            </Link>
          </nav>
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="px-2">
            <p className="text-[11px] font-semibold text-slate-800">Administrator</p>
            <p className="text-[10px] text-slate-500 truncate">admin@premiumitservices.com</p>
          </div>
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-50"
          >
            <span className="flex items-center space-x-2">
              <Building className="h-3.5 w-3.5" />
              <span>Public Website</span>
            </span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
};
