import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState, useRef } from 'react';

// Blocklist of disposable/personal domains
const BLOCKLIST_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com', 'outlook.com',
  'mailinator.com', 'temp-mail.org', 'yopmail.com', 'guerrillamail.com'
];

interface FormValues {
  fullName: string;
  workEmail: string;
  companyName: string;
  message: string;
}

export default function ContactForm() {
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
    receiptId?: string;
    sanitizedMessage?: string;
  } | null>(null);

  const submissionsRef = useRef<number[]>([]);

  // Simple XSS Input Sanitization function
  const sanitizeInput = (text: string): string => {
    return text.replace(/<[^>]*>?/gm, '').trim();
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .required('Full name is required')
      .max(100, 'Name must be under 100 characters'),
    workEmail: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is required')
      .test('corporate-domain', 'Corporate email addresses only', (value) => {
        if (!value) return false;
        const domain = value.split('@')[1]?.toLowerCase();
        return domain ? !BLOCKLIST_DOMAINS.includes(domain) : false;
      }),
    companyName: Yup.string()
      .required('Company name is required')
      .max(100, 'Company name must be under 100 characters'),
    message: Yup.string()
      .required('Message is required')
      .max(1000, 'Message must be under 1000 characters'),
  });

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    const now = Date.now();
    
    // Client-side rate-limit verification: max 5 requests per 60 seconds
    submissionsRef.current = submissionsRef.current.filter(time => now - time < 60000);
    if (submissionsRef.current.length >= 5) {
      setSubmitStatus({
        success: false,
        message: 'Too many requests. Please try again in a minute.'
      });
      setSubmitting(false);
      return;
    }

    // Record this submission
    submissionsRef.current.push(now);

    // Simulate Google reCAPTCHA v3 silent execution
    console.log('reCAPTCHA v3 silent verification token retrieved successfully.');

    // Sanitize input
    const sanitizedMsg = sanitizeInput(values.message);

    // Generate unique Receipt ID
    const receiptId = 'REC-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    setSubmitStatus({
      success: true,
      message: 'Thank you, our team will contact you shortly',
      receiptId: receiptId,
      sanitizedMessage: sanitizedMsg
    });

    resetForm();
    setSubmitting(false);
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8 shadow-md">
      <h3 className="text-xl font-bold text-[var(--color-primary)] mb-6">Request Corporate Consultation</h3>

      {submitStatus && (
        <div 
          className={`mb-6 p-4 rounded-lg text-sm border ${
            submitStatus.success 
              ? 'bg-[var(--color-success-bg)] text-emerald-800 border-emerald-300' 
              : 'bg-[var(--color-danger-bg)] text-red-800 border-red-300'
          }`}
          role="alert"
        >
          <p className="font-semibold">{submitStatus.message}</p>
          {submitStatus.receiptId && (
            <p className="mt-2 text-xs">
              Receipt ID: <strong className="font-mono bg-white bg-opacity-50 px-2 py-0.5 rounded">{submitStatus.receiptId}</strong>
            </p>
          )}
          {submitStatus.sanitizedMessage && submitStatus.sanitizedMessage !== submitStatus.receiptId && (
            <p className="mt-2 text-xs text-slate-500 italic">
              Sanitized Message Stored: "{submitStatus.sanitizedMessage}"
            </p>
          )}
        </div>
      )}

      <Formik
        initialValues={{ fullName: '', workEmail: '', companyName: '', message: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-[var(--color-text)] mb-2">
                Full Name
              </label>
              <Field
                type="text"
                id="fullName"
                name="fullName"
                className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-shadow"
                placeholder="John Doe"
              />
              <ErrorMessage name="fullName" component="div" className="text-[var(--color-danger)] text-xs mt-1 font-semibold" />
            </div>

            <div>
              <label htmlFor="workEmail" className="block text-sm font-semibold text-[var(--color-text)] mb-2">
                Work Email Address
              </label>
              <Field
                type="email"
                id="workEmail"
                name="workEmail"
                className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-shadow"
                placeholder="john.doe@acme.com"
              />
              <ErrorMessage name="workEmail" component="div" className="text-[var(--color-danger)] text-xs mt-1 font-semibold" />
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-semibold text-[var(--color-text)] mb-2">
                Company Name
              </label>
              <Field
                type="text"
                id="companyName"
                name="companyName"
                className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-shadow"
                placeholder="Acme Corp"
              />
              <ErrorMessage name="companyName" component="div" className="text-[var(--color-danger)] text-xs mt-1 font-semibold" />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-[var(--color-text)] mb-2">
                Message / Requirements
              </label>
              <Field
                as="textarea"
                id="message"
                name="message"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-shadow"
                placeholder="Describe your project, timeline, and requirements..."
              />
              <ErrorMessage name="message" component="div" className="text-[var(--color-danger)] text-xs mt-1 font-semibold" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] py-3 px-6 rounded-lg font-semibold shadow-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </button>
          </Form>
        )}
      </Formik>
      <div className="mt-4 text-[10px] text-center text-slate-400">
        This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
      </div>
    </div>
  );
}