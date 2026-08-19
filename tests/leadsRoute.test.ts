import request from "supertest";
import { createApp } from "../src/app";
import { LeadEngineService } from "../src/services/leadService";
import { IFirestoreClient } from "../src/services/firestoreService";

describe("POST /api/leads Express Integration Suite", () => {
  let mockStorage: Map<string, Record<string, unknown>>;
  let mockClient: IFirestoreClient;
  let leadService: LeadEngineService;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    mockStorage = new Map();
    mockClient = {
      collection: (collectionName: string) => ({
        doc: (docId?: string) => {
          const id = docId || "mock-doc-id";
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

    leadService = new LeadEngineService(mockClient, "leads");
    app = createApp({ leadService });
  });

  it("POST /api/leads should return 201 Created on valid corporate lead submission (AC-1, AC-3)", async () => {
    const payload = {
      name: "Elena Rostova",
      email: "elena.rostova@globalfintech.ch",
      company: "Global Fintech Solutions AG",
      service: "Enterprise Cloud Migration",
      message: "Looking for GCP cloud run deployment services and high throughput architecture.",
      phone: "+41-44-668-1800"
    };

    const response = await request(app)
      .post("/api/leads")
      .send(payload)
      .set("Accept", "application/json");

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain("Lead captured successfully");
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.status).toBe("new");
    expect(response.body.data.email).toBe("elena.rostova@globalfintech.ch");
  });

  it("POST /api/leads should return 400 Bad Request when email is a generic webmail address (AC-2, AC-4)", async () => {
    const payload = {
      name: "Elena Rostova",
      email: "elena.rostova@gmail.com", // Generic domain
      company: "Global Fintech Solutions AG",
      service: "Cloud Architecture",
      message: "Please contact me about migration."
    };

    const response = await request(app)
      .post("/api/leads")
      .send(payload)
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors.some((e: { field: string }) => e.field === "email")).toBe(true);
  });

  it("POST /api/leads should return 400 Bad Request when required fields are missing (AC-4)", async () => {
    const invalidPayload = {
      name: "",
      email: "",
      company: "",
      service: "",
      message: ""
    };

    const response = await request(app)
      .post("/api/leads")
      .send(invalidPayload)
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.length).toBeGreaterThanOrEqual(4);
  });

  it("POST /api/leads should return 500 when backend service encounters an unexpected failure (AC-5)", async () => {
    const failingClient: IFirestoreClient = {
      collection: () => ({
        doc: () => ({
          set: async () => {
            throw new Error("Simulated Firestore failure");
          },
          get: async () => ({
            exists: false,
            data: () => undefined
          })
        })
      })
    };

    const failingService = new LeadEngineService(failingClient);
    const crashingApp = createApp({ leadService: failingService });

    const payload = {
      name: "Valid User",
      email: "user@enterprise-corp.com",
      company: "Enterprise Corp",
      service: "Cloud Consulting",
      message: "Need consulting."
    };

    const response = await request(crashingApp)
      .post("/api/leads")
      .send(payload)
      .set("Accept", "application/json");

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.statusCode).toBe(500);
    expect(response.body.errors).toBeDefined();
  });
});
