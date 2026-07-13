import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactForm from '@/components/ContactForm';

describe('ContactForm Component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders all form input fields and submit button', () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Work Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Form/i })).toBeInTheDocument();
  });

  test('successfully submits valid details, displays success alert with unique Receipt ID', async () => {
    render(<ContactForm />);
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Work Email/i), { target: { value: 'john.doe@enterprise.com' } });
    fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'Acme Corp' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'We need cloud migration services' } });
    
    // Trigger validation and submission
    fireEvent.click(screen.getByRole('button', { name: /Submit Form/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Thank you, our team will contact you shortly/i)).toBeInTheDocument();
      expect(screen.getByText(/Receipt ID:/i)).toBeInTheDocument();
    });
  });

  test('validates missing required email field', async () => {
    render(<ContactForm />);
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'Acme Corp' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'We need support' } });
    
    // Trigger blur on email to trigger Formik validation
    fireEvent.blur(screen.getByLabelText(/Work Email/i));
    
    fireEvent.click(screen.getByRole('button', { name: /Submit Form/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
    });
  });

  test('validates invalid email format', async () => {
    render(<ContactForm />);
    
    const emailInput = screen.getByLabelText(/Work Email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email-format' } });
    fireEvent.blur(emailInput);
    
    fireEvent.click(screen.getByRole('button', { name: /Submit Form/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  test('blocks submission with disposable or personal email domains', async () => {
    render(<ContactForm />);
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    const emailInput = screen.getByLabelText(/Work Email/i);
    fireEvent.change(emailInput, { target: { value: 'john.doe@gmail.com' } });
    fireEvent.blur(emailInput);
    fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'Acme Corp' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'We need support' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Submit Form/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Corporate email addresses only/i)).toBeInTheDocument();
    });
  });

  test('emulates rate limiting by blocking the 6th consecutive submission', async () => {
    render(<ContactForm />);
    
    const submitButton = screen.getByRole('button', { name: /Submit Form/i });
    
    // Simulate 5 submits directly by repeating clicks and waiting for submit completion
    for (let i = 0; i < 5; i++) {
      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/Work Email/i), { target: { value: 'john.doe@enterprise.com' } });
      fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'Acme Corp' } });
      fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: `Support message ${i}` } });
      
      fireEvent.click(submitButton);
      
      // Wait for submit button to be re-enabled indicating form is ready again
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    }

    // 6th submission should trigger the rate limit message
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Work Email/i), { target: { value: 'john.doe@enterprise.com' } });
    fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'Acme Corp' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Support message 6' } });
    
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Too many requests. Please try again in a minute./i)).toBeInTheDocument();
    });
  });
});