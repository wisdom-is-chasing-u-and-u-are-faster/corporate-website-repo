import { LeadEngineService } from "../src/services/leadService";
import { IFirestoreClient } from "../src/services/firestoreService";
import { LeadSubmission } from "../src/types/lead";

describe("LeadEngineService End-to-End Orchestrator Suite", () => {
  let mockStorage: Map<string, Record<string, unknown>>;
  let mockClient: IFirestoreClient;
  let service: LeadEngineService;

  beforeEach(() => {
    mockStorage = new Map();
    mockClient = {
      collection: (collectionName: string) => ({
        doc: (docId?: string) => {
          const id = docId || "generated-id";
          return {
            set: async (data: Record<string, unknown>) => {
              mockStorage.set(`${collectionName}/${id}`, data);
              return { writeTime: new Date() };
            },
            get: async () => {
              const data = mockStorage.get(`${collectionName}/${id}`);
              return {
                exists: !!data,
                data: () => data
              };
            }
          };
        }
      })
    };
    service = new LeadEngineService(mockClient, "leads");
  });

  it("should successfully process a valid corporate lead submission (AC-1, AC-4, AC-5)", async () => {
    const rawPayload: LeadSubmission = {
      name: "Arthur Dent",
      email: "arthur.dent@megadodo-pub.co.uk",
      company: "Megadodo Publications",
      service: "Digital Experience & Modern Web Platforms",
      message: "We need high performance web services deployed on Cloud Run."
    };

    const response = await service.processLeadCapture(rawPayload);

    expect(response.success).toBe(true);
    expect(response.statusCode).toBe(201);
    expect(response.data).toBeDefined();
    expect(response.data?.status).toBe("new");
    expect(response.data?.email).toBe("arthur.dent@megadodo-pub.co.uk");

    // Verify storage in Firestore mock
    if (response.data?.id) {
      const stored = await service.getLead(response.data.id);
      expect(stored).not.toBeNull();
      expect(stored?.company).toBe("Megadodo Publications");
    }
  });

  it("should return 400 Bad Request with field errors when validation fails (AC-2, AC-5)", async () => {
    const invalidPayload = {
      name: "Arthur Dent",
      email: "arthur.dent@gmail.com", // Generic domain
      company: "", // Missing
      service: "Cloud",
      message: "" // Missing
    };

    const response = await service.processLeadCapture(invalidPayload);

    expect(response.success).toBe(false);
    expect(response.statusCode).toBe(400);
    expect(response.errors).toBeDefined();
    expect(response.errors?.length).toBeGreaterThanOrEqual(3);
    expect(response.errors?.some((e) => e.field === "email")).toBe(true);
    expect(response.errors?.some((e) => e.field === "company")).toBe(true);
    expect(response.errors?.some((e) => e.field === "message")).toBe(true);
  });

  it("should sanitize malicious content during processing (AC-3)", async () => {
    const dirtyPayload: LeadSubmission = {
      name: "<script>alert('pwn')</script> Bruce Wayne",
      email: "bruce.wayne@wayneenterprises.com",
      company: "<b>Wayne Enterprises</b>",
      service: "Cloud Security Solutions",
      message: "Need advanced <iframe src='malicious.site'></iframe> cloud defense."
    };

    const response = await service.processLeadCapture(dirtyPayload);

    expect(response.success).toBe(true);
    expect(response.statusCode).toBe(201);
    expect(response.data?.name).not.toContain("<script>");
    expect(response.data?.company).not.toContain("<b>");
    expect(response.data?.message).not.toContain("<iframe");
  });

  it("should return 500 when database persistence throws an unexpected error (AC-5)", async () => {
    const crashingClient: IFirestoreClient = {
      collection: () => ({
        doc: () => ({
          set: async () => {
            throw new Error("Firestore unreachable");
          },
          get: async () => ({
            exists: false,
            data: () => undefined
          })
        })
      })
    };

    const crashingService = new LeadEngineService(crashingClient);
    const validPayload: LeadSubmission = {
      name: "Clark Kent",
      email: "clark@dailyplanet.com",
      company: "Daily Planet",
      service: "Media Publishing Solutions",
      message: "Looking for cloud scalability."
    };

    const response = await crashingService.processLeadCapture(validPayload);

    expect(response.success).toBe(false);
    expect(response.statusCode).toBe(500);
    expect(response.message).toContain("error occurred");
    expect(response.errors?.some((e) => e.field === "server")).toBe(true);
  });
});
