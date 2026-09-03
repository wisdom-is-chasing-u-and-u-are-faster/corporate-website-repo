import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContactForm } from '@/components/ContactForm';
import ContactPage from '@/pages/contact';

describe('Secure Lead Capture Form and Client-Side Validation', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders lead capture form fields with privacy policy acknowledgment checkbox (REQ-F-005, REQ-F-013)', () => {
    render(<ContactPage />);
    expect(screen.getByRole('heading', { name: /Contact Us/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Corporate Email \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Organization \/ Company \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Service Track of Interest \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Project Scope & Goals \*/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('validates client-side required fields with Formik and Yup schema', async () => {
    render(<ContactForm />);
    const submitBtn = screen.getByRole('button', { name: /Submit Consultation Request/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Corporate email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Company name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Project description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/You must acknowledge and accept the privacy policy/i)).toBeInTheDocument();
    });
  });

  it('submits valid lead data to the backend API successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'SUCCESS',
        message: 'Lead captured successfully',
        leadId: 'lead-test-123',
      }),
    });

    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/Full Name \*/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/Corporate Email \*/i), { target: { value: 'jane@enterprise.com' } });
    fireEvent.change(screen.getByLabelText(/Organization \/ Company \*/i), { target: { value: 'Enterprise Inc' } });
    fireEvent.change(screen.getByLabelText(/Project Scope & Goals \*/i), { target: { value: 'Detailed cloud migration architecture scope needed.' } });
    fireEvent.click(screen.getByRole('checkbox'));

    const submitBtn = screen.getByRole('button', { name: /Submit Consultation Request/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/leads',
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(screen.getByText(/Inquiry Transmitted Successfully/i)).toBeInTheDocument();
    });
  });
});
