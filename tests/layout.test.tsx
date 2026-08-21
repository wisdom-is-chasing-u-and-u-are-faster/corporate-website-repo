import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

describe('Layout Components Verification', () => {
  it('renders header with navigation links and branding for all pages', () => {
    render(<Header />);
    expect(screen.getByText(/Premium IT/i)).toBeInTheDocument();
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Products/i)).toBeInTheDocument();
    expect(screen.getByText(/Locations/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact/i)).toBeInTheDocument();
  });

  it('renders footer with corporate compliance and service links', () => {
    render(<Footer />);
    expect(screen.getByText(/Strategic Services/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Policy \(GDPR \/ CCPA\)/i)).toBeInTheDocument();
    expect(screen.getByText(/TLS 1.3 & AES-256/i)).toBeInTheDocument();
  });
});
