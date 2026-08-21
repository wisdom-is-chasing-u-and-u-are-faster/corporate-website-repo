import { z } from 'zod';
import * as Yup from 'yup';

// Server-Side Zod Validation Schema (REQ-F-005, CONSTRAINT-009)
export const LeadSubmissionSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z
    .string()
    .email('Please enter a valid email address')
    .refine((val) => !val.endsWith('@tempmail.com') && !val.endsWith('@mailinator.com'), {
      message: 'Please provide a valid corporate email address',
    }),
  company: z.string().min(2, 'Company name must be at least 2 characters').max(100),
  serviceTrack: z.enum(
    ['cloud-migration', 'app-development', 'data-analytics', 'artificial-intelligence', 'other'],
    { errorMap: () => ({ message: 'Please select a valid service track' }) }
  ),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: 'You must acknowledge the privacy policy to proceed',
  }),
});

export type LeadSubmission = z.infer<typeof LeadSubmissionSchema>;

// Client-Side Yup Validation Schema (REQ-F-005, REQ-F-013, CONSTRAINT-008)
export const ClientLeadValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Name is too long')
    .required('Full name is required'),
  email: Yup.string()
    .email('Please enter a valid corporate email address')
    .required('Corporate email is required'),
  company: Yup.string()
    .min(2, 'Company name must be at least 2 characters')
    .required('Company name is required'),
  serviceTrack: Yup.string()
    .required('Please select a service track')
    .oneOf(
      ['cloud-migration', 'app-development', 'data-analytics', 'artificial-intelligence', 'other'],
      'Invalid service track selected'
    ),
  message: Yup.string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message is too long')
    .required('Project description is required'),
  privacyConsent: Yup.boolean()
    .oneOf([true], 'You must acknowledge and accept the privacy policy')
    .required('Privacy policy agreement is required'),
});
