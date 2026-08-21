import { LeadSubmission } from './validation';

export interface LeadRecord extends LeadSubmission {
  id: string;
  createdAt: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'DUPLICATE' | 'CLOSED';
  flaggedDuplicate?: boolean;
}

// Initial demo leads for admin viewer
const initialLeads: LeadRecord[] = [
  {
    id: 'lead-101',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@enterprise-logistics.com',
    company: 'Enterprise Logistics Corp',
    serviceTrack: 'cloud-migration',
    message: 'Seeking comprehensive GCP migration assessment for legacy banking infrastructure.',
    privacyConsent: true,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'NEW',
    flaggedDuplicate: false,
  },
  {
    id: 'lead-102',
    name: 'Michael Chang',
    email: 'mchang@healthtech-innovations.io',
    company: 'HealthTech Innovations',
    serviceTrack: 'artificial-intelligence',
    message: 'Looking to integrate HIPAA-compliant GenAI RAG pipelines for clinician notes.',
    privacyConsent: true,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'QUALIFIED',
    flaggedDuplicate: false,
  },
  {
    id: 'lead-103',
    name: 'Elena Rostova',
    email: 'elena@fintech-global.eu',
    company: 'Fintech Global Payments',
    serviceTrack: 'app-development',
    message: 'Need high-throughput Next.js frontend with sub-second LCP and multi-region failover.',
    privacyConsent: true,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'CONTACTED',
    flaggedDuplicate: false,
  },
];

class LeadsStore {
  private leads: LeadRecord[] = [...initialLeads];

  public getAllLeads(): LeadRecord[] {
    return [...this.leads];
  }

  public addLead(data: LeadSubmission): LeadRecord {
    // Scan for duplicates (REQ-F-011)
    const isDuplicate = this.leads.some(
      (l) => l.email.toLowerCase() === data.email.toLowerCase() && l.serviceTrack === data.serviceTrack
    );

    const newLead: LeadRecord = {
      ...data,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: isDuplicate ? 'DUPLICATE' : 'NEW',
      flaggedDuplicate: isDuplicate,
    };

    this.leads.unshift(newLead);
    return newLead;
  }

  public updateLeadStatus(id: string, status: LeadRecord['status']): LeadRecord | null {
    const lead = this.leads.find((l) => l.id === id);
    if (!lead) return null;
    lead.status = status;
    return lead;
  }
}

// Global singleton instance for server runtime
export const leadsStore = new LeadsStore();
