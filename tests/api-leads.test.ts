import leadsApiHandler from '@/pages/api/v1/leads';
import adminLeadsApiHandler from '@/pages/api/v1/admin/leads';
import { LeadSubmissionSchema } from '@/lib/validation';

// Helper mock request and response
function createMockReqRes(method: string, body?: any) {
  const req: any = {
    method,
    body: body || {},
    headers: {},
  };
  const res: any = {
    statusCode: 200,
    headers: {},
    setHeader(key: string, val: any) {
      this.headers[key] = val;
    },
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(data: any) {
      this.jsonData = data;
      return this;
    },
  };
  return { req, res };
}

describe('Backend API Endpoints for Lead Capture & Admin Retrieval', () => {
  it('validates server-side lead payload using Zod schema (CONSTRAINT-009, REQ-F-005)', () => {
    const invalidPayload = {
      name: 'A',
      email: 'not-an-email',
      company: '',
      serviceTrack: 'invalid-track',
      message: 'short',
      privacyConsent: false,
    };

    const result = LeadSubmissionSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
  });

  it('provides public API endpoint POST /api/v1/leads and returns email confirmation response (REQ-F-008, REQ-F-006)', async () => {
    const validLead = {
      name: 'Alex Mercer',
      email: 'alex.mercer@innovate-cloud.com',
      company: 'Innovate Cloud Systems',
      serviceTrack: 'cloud-migration',
      message: 'Requesting cloud migration assessment for multi-tenant microservices platform.',
      privacyConsent: true,
    };

    const { req, res } = createMockReqRes('POST', validLead);
    await leadsApiHandler(req, res);

    expect(res.statusCode).toBe(201);
    expect(res.jsonData.status).toBe('SUCCESS');
    expect(res.jsonData.emailConfirmation).toBeDefined();
    expect(res.jsonData.emailConfirmation.recipient).toBe(validLead.email);
    expect(res.jsonData.emailConfirmation.dispatched).toBe(true);
  });

  it('provides secure API endpoint GET /api/v1/admin/leads for retrieving leads (REQ-F-009)', async () => {
    const { req, res } = createMockReqRes('GET');
    await adminLeadsApiHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.jsonData.status).toBe('SUCCESS');
    expect(Array.isArray(res.jsonData.leads)).toBe(true);
    expect(res.jsonData.leads.length).toBeGreaterThanOrEqual(1);
  });
});
