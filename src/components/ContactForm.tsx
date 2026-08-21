import React, { useState } from 'react';
import { useFormik } from 'formik';
import Link from 'next/link';
import { ClientLeadValidationSchema } from '../lib/validation';
import { CheckCircle, AlertCircle, Loader2, Send } from 'lucide-react';

interface FormValues {
  name: string;
  email: string;
  company: string;
  serviceTrack: string;
  message: string;
  privacyConsent: boolean;
}

export const ContactForm: React.FC = () => {
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
      email: '',
      company: '',
      serviceTrack: 'cloud-migration',
      message: '',
      privacyConsent: false,
    },
    validationSchema: ClientLeadValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setSubmissionStatus('loading');
      setStatusMessage('');

      try {
        const response = await fetch('/api/v1/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (response.ok && data.status === 'SUCCESS') {
          setSubmissionStatus('success');
          setStatusMessage('Thank you! Your inquiry has been received. An automated confirmation email has been dispatched.');
          resetForm();
        } else {
          setSubmissionStatus('error');
          setStatusMessage(data.message || 'Submission failed. Please verify your details.');
        }
      } catch (err: any) {
        setSubmissionStatus('error');
        setStatusMessage('Network error occurred while submitting lead data. Please try again.');
      }
    },
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900">Request a Technical Consultation</h3>
        <p className="text-xs text-slate-500 mt-1">
          Connect with our enterprise engineering practice leads. We respond within 1 business day.
        </p>
      </div>

      {submissionStatus === 'success' && (
        <div className="mb-6 flex items-start space-x-3 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-xs">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Inquiry Transmitted Successfully</p>
            <p className="mt-0.5">{statusMessage}</p>
          </div>
        </div>
      )}

      {submissionStatus === 'error' && (
        <div className="mb-6 flex items-start space-x-3 rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-800 text-xs">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Submission Error</p>
            <p className="mt-0.5">{statusMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-4 text-xs">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block font-semibold text-slate-700 mb-1">
            Full Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Jane Doe"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className={`w-full rounded-lg border px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 ${
              formik.touched.name && formik.errors.name
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
            }`}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="mt-1 text-rose-600 font-medium">{formik.errors.name}</p>
          )}
        </div>

        {/* Corporate Email & Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block font-semibold text-slate-700 mb-1">
              Corporate Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="jane@company.com"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`w-full rounded-lg border px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 ${
                formik.touched.email && formik.errors.email
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-rose-600 font-medium">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="company" className="block font-semibold text-slate-700 mb-1">
              Organization / Company *
            </label>
            <input
              id="company"
              name="company"
              type="text"
              placeholder="Acme Corp"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.company}
              className={`w-full rounded-lg border px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 ${
                formik.touched.company && formik.errors.company
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
              }`}
            />
            {formik.touched.company && formik.errors.company && (
              <p className="mt-1 text-rose-600 font-medium">{formik.errors.company}</p>
            )}
          </div>
        </div>

        {/* Service Track Selection */}
        <div>
          <label htmlFor="serviceTrack" className="block font-semibold text-slate-700 mb-1">
            Service Track of Interest *
          </label>
          <select
            id="serviceTrack"
            name="serviceTrack"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.serviceTrack}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            <option value="cloud-migration">Cloud Migration</option>
            <option value="app-development">App Development</option>
            <option value="data-analytics">Data Analytics</option>
            <option value="artificial-intelligence">Artificial Intelligence</option>
            <option value="other">Other Strategic Advisory</option>
          </select>
        </div>

        {/* Project Message */}
        <div>
          <label htmlFor="message" className="block font-semibold text-slate-700 mb-1">
            Project Scope & Goals *
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Please describe your architecture, timeline, and current infrastructure requirements..."
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.message}
            className={`w-full rounded-lg border px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 ${
              formik.touched.message && formik.errors.message
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
            }`}
          />
          {formik.touched.message && formik.errors.message && (
            <p className="mt-1 text-rose-600 font-medium">{formik.errors.message}</p>
          )}
        </div>

        {/* Privacy Policy Consent Checkbox (REQ-F-013) */}
        <div className="pt-2">
          <label className="flex items-start space-x-2 cursor-pointer">
            <input
              id="privacyConsent"
              name="privacyConsent"
              type="checkbox"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              checked={formik.values.privacyConsent}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-slate-600 text-[11px] leading-relaxed">
              I acknowledge and agree to the{' '}
              <Link href="/privacy" className="text-blue-600 underline hover:text-blue-700">
                Privacy Policy
              </Link>{' '}
              and consent to processing of my contact information under GDPR / CCPA standards. *
            </span>
          </label>
          {formik.touched.privacyConsent && formik.errors.privacyConsent && (
            <p className="mt-1 text-rose-600 font-medium">{formik.errors.privacyConsent}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={submissionStatus === 'loading'}
            className="w-full inline-flex items-center justify-center space-x-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {submissionStatus === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Transmitting Inquiry...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Submit Consultation Request</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
