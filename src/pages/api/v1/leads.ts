import type { NextApiRequest, NextApiResponse } from 'next';
import { LeadSubmissionSchema } from '@/lib/validation';
import { leadsStore } from '@/lib/leads-store';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      status: 'ERROR',
      message: `Method ${req.method} Not Allowed. Use POST.`,
    });
  }

  try {
    // 1. Server-side validation via Zod (CONSTRAINT-009, REQ-F-005)
    const validationResult = LeadSubmissionSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({
        status: 'VALIDATION_ERROR',
        message: 'Invalid lead submission data provided.',
        errors,
      });
    }

    // 2. Persist lead data into store (REQ-F-008, REQ-F-011)
    const savedLead = leadsStore.addLead(validationResult.data);

    // 3. Automated email confirmation simulation (REQ-F-006)
    const confirmationDispatch = {
      recipient: savedLead.email,
      subject: 'Confirmation: Your Consultation Request with Premium IT Services',
      timestamp: new Date().toISOString(),
      dispatched: true,
    };

    return res.status(201).json({
      status: 'SUCCESS',
      message: 'Lead captured successfully and confirmation email dispatched.',
      leadId: savedLead.id,
      emailConfirmation: confirmationDispatch,
      leadStatus: savedLead.status,
    });
  } catch (error: any) {
    console.error('API /leads error:', error);
    return res.status(500).json({
      status: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to process lead submission.',
    });
  }
}
