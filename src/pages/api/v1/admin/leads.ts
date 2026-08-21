import type { NextApiRequest, NextApiResponse } from 'next';
import { leadsStore } from '@/lib/leads-store';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      status: 'ERROR',
      message: `Method ${req.method} Not Allowed. Use GET.`,
    });
  }

  try {
    // In production, verify Firebase Auth / JWT header (REQ-N-010)
    const allLeads = leadsStore.getAllLeads();

    return res.status(200).json({
      status: 'SUCCESS',
      total: allLeads.length,
      leads: allLeads,
    });
  } catch (error: any) {
    console.error('API /admin/leads error:', error);
    return res.status(500).json({
      status: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve administrative lead inquiries.',
    });
  }
}
