import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CookieConsent } from '@/components/CookieConsent';

describe('GDPR & CCPA Cookie Consent Banner Compliance', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('displays cookie consent banner to comply with GDPR/CCPA regulations (REQ-F-012)', () => {
    render(<CookieConsent />);
    expect(screen.getByText(/We value your privacy/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Accept All Cookies/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Decline Non-Essential/i })).toBeInTheDocument();
  });

  it('persists accepted consent in localStorage and hides banner on user approval', () => {
    render(<CookieConsent />);
    const acceptButton = screen.getByRole('button', { name: /Accept All Cookies/i });
    fireEvent.click(acceptButton);

    expect(localStorage.getItem('cookie_consent')).toBe('accepted');
    expect(screen.queryByText(/We value your privacy/i)).not.toBeInTheDocument();
  });
});
