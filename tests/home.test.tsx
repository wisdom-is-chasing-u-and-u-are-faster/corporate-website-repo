import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '@/pages/index';

describe('Home Page and Four Strategic Service Tracks', () => {
  it('displays the hero section and core headline matching approved mockup', () => {
    render(<HomePage />);
    expect(
      screen.getByRole('heading', {
        name: /Accelerate Your Growth with World-Class IT Solutions/i,
      })
    ).toBeInTheDocument();
  });

  it('displays content for four strategic service tracks: Cloud Migration, App Development, Data Analytics, and Artificial Intelligence (REQ-F-001)', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: 'Cloud Migration' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'App Development' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Data Analytics' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Artificial Intelligence' })).toBeInTheDocument();
  });

  it('renders enterprise performance architecture metrics and SLA guarantees', () => {
    render(<HomePage />);
    expect(screen.getByText('99.95%')).toBeInTheDocument();
    expect(screen.getByText(/Platform SLA & Uptime/i)).toBeInTheDocument();
    expect(screen.getByText('< 15 min')).toBeInTheDocument();
  });
});
