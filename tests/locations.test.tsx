import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LocationsPage from '@/pages/locations';
import { InteractiveMap } from '@/components/InteractiveMap';

describe('Interactive Worldwide Office Locations Map Component', () => {
  it('features dynamic interactive map displaying company worldwide office locations (REQ-F-007, CONSTRAINT-007)', () => {
    render(<LocationsPage />);
    expect(screen.getByRole('heading', { name: /Our Global Presence/i })).toBeInTheDocument();
    expect(screen.getByText(/Interactive Global Operations Map/i)).toBeInTheDocument();
    expect(screen.getAllByText('New York').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('London').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Singapore').length).toBeGreaterThanOrEqual(1);
  });

  it('filters office locations by geographic region', () => {
    render(<InteractiveMap />);
    const emeaButton = screen.getByRole('button', { name: 'EMEA' });
    fireEvent.click(emeaButton);

    expect(screen.getAllByText('London').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Frankfurt').length).toBeGreaterThanOrEqual(1);
  });
});
