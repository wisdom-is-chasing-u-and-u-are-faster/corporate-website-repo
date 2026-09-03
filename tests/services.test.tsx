import React from 'react';
import { render, screen } from '@testing-library/react';
import ServiceDetailPage from '@/pages/services/[slug]';
import { SERVICE_TRACKS } from '@/lib/services-data';

describe('Dynamic Service Detail Page Implementation', () => {
  it('renders dynamic service detail page for Cloud Migration track with full capabilities', () => {
    const cloudTrack = SERVICE_TRACKS.find((s) => s.slug === 'cloud-migration')!;
    render(<ServiceDetailPage service={cloudTrack} />);

    expect(screen.getByRole('heading', { name: 'Cloud Migration', level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Core Capabilities/i)).toBeInTheDocument();
    expect(screen.getByText(/Key Benefits/i)).toBeInTheDocument();
    expect(screen.getByText(/Cloud Architecture & Readiness Assessment/i)).toBeInTheDocument();
  });

  it('renders dynamic service detail page for Artificial Intelligence track with case study', () => {
    const aiTrack = SERVICE_TRACKS.find((s) => s.slug === 'artificial-intelligence')!;
    render(<ServiceDetailPage service={aiTrack} />);

    expect(screen.getByRole('heading', { name: 'Artificial Intelligence', level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Enterprise Case Study/i)).toBeInTheDocument();
    expect(screen.getByText(/Insurance Conglomerate/i)).toBeInTheDocument();
  });
});
