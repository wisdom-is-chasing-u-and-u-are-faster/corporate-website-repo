import { FirestoreService, IFirestoreClient } from "../src/services/firestoreService";
import { LeadSubmission } from "../src/types/lead";

describe("FirestoreService Persistence Suite", () => {
  let mockStorage: Map<string, Record<string, unknown>>;
  let mockClient: IFirestoreClient;

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
  });

  it("should create and persist a lead record with status 'new' and timestamps (AC-4)", async () => {
    const service = new FirestoreService(mockClient, "leads");
    const submission: LeadSubmission = {
      name: "Diana Prince",
      email: "diana@themyscira-enterprises.com",
      company: "Themyscira Enterprises",
      service: "Enterprise Security Architecture",
      message: "Requesting consultation for cloud security compliance.",
      phone: "+1-202-555-0143"
    };

    const result = await service.createLead(submission, { campaign: "q3-cloud-promo" });

    expect(result.id).toBeDefined();
    expect(result.status).toBe("new");
    expect(result.name).toBe("Diana Prince");
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
    expect(result.metadata?.campaign).toBe("q3-cloud-promo");

    const retrieved = await service.getLeadById(result.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.email).toBe("diana@themyscira-enterprises.com");
  });

  it("should handle error when Firestore operations fail", async () => {
    const failingClient: IFirestoreClient = {
      collection: () => ({
        doc: () => ({
          set: async () => {
            throw new Error("Simulated Firestore quota exceeded");
          },
          get: async () => {
            throw new Error("Simulated network timeout");
          }
        })
      })
    };

    const failingService = new FirestoreService(failingClient, "leads");
    const submission: LeadSubmission = {
      name: "Test User",
      email: "test@corp.com",
      company: "Corp",
      service: "Service",
      message: "Message"
    };

    await expect(failingService.createLead(submission)).rejects.toThrow("Failed to save lead in Firestore");
    await expect(failingService.getLeadById("123")).rejects.toThrow("Failed to retrieve lead from Firestore");
  });
});
