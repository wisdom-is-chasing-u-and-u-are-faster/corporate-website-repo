import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminLoginPage from '@/pages/admin/login';
import AdminDashboardPage from '@/pages/admin/dashboard';
import AdminLeadsPage from '@/pages/admin/leads';
import AdminContentEditorPage from '@/pages/admin/content-editor';

// Mock Next router
const mockPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: mockPush,
      pathname: '/admin/dashboard',
    };
  },
}));

describe('Authenticated Administrative Portal and Real-Time Content Management', () => {
  beforeEach(() => {
    mockPush.mockClear();
    localStorage.setItem('admin_authenticated', 'true');
    localStorage.setItem('admin_user', JSON.stringify({ email: 'admin@premiumitservices.com', role: 'SuperAdmin' }));
  });

  it('provides single-factor authentication login interface for administrative users (REQ-F-010)', () => {
    localStorage.removeItem('admin_authenticated');
    render(<AdminLoginPage />);
    expect(screen.getByRole('heading', { name: /Administrator Login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('admin@premiumitservices.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Authenticate & Enter Portal/i })).toBeInTheDocument();
  });

  it('renders admin dashboard with operational metrics and quick actions (REQ-F-002)', () => {
    render(<AdminDashboardPage />);
    expect(screen.getByRole('heading', { name: /Enterprise Operations Dashboard/i })).toBeInTheDocument();
    expect(screen.getByText('Total Leads')).toBeInTheDocument();
    expect(screen.getByText('Captured Leads Management')).toBeInTheDocument();
    expect(screen.getByText('Real-Time Content Editor')).toBeInTheDocument();
  });

  it('allows authorized users to view captured lead data in administrative portal (REQ-F-003)', async () => {
    render(<AdminLeadsPage />);
    expect(screen.getByRole('heading', { name: /Captured Lead Inquiries/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search by name, company, or email/i)).toBeInTheDocument();
  });

  it('provides real-time content management editor for service tracks and dynamic copy (REQ-F-002, REQ-F-015)', () => {
    render(<AdminContentEditorPage />);
    expect(screen.getByRole('heading', { name: /Service Content Management/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Publish Changes/i })).toBeInTheDocument();
  });
});
