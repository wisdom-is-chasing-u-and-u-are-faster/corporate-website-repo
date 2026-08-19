import { LeadSubmission, LeadRecord, ValidationResult, LeadServiceResponse } from "../src/types/lead";

describe("Domain Types & Contracts", () => {
  it("should conform to LeadSubmission contract", () => {
    const submission: LeadSubmission = {
      name: "John Doe",
      email: "john.doe@enterprise.com",
      company: "Acme Corp",
      service: "Cloud Transformation",
      message: "Looking for enterprise cloud architecture consulting.",
      phone: "+1-555-0199"
    };

    expect(submission.name).toBe("John Doe");
    expect(submission.email).toBe("john.doe@enterprise.com");
    expect(submission.company).toBe("Acme Corp");
    expect(submission.service).toBe("Cloud Transformation");
    expect(submission.message).toContain("cloud");
    expect(submission.phone).toBe("+1-555-0199");
  });

  it("should conform to LeadRecord contract with metadata and status", () => {
    const record: LeadRecord = {
      id: "uuid-1234",
      name: "Jane Smith",
      email: "jane@techcorp.io",
      company: "TechCorp",
      service: "DevOps Consulting",
      message: "Need CI/CD pipeline modernization.",
      status: "new",
      createdAt: "2026-08-19T10:00:00.000Z",
      updatedAt: "2026-08-19T10:00:00.000Z",
      metadata: { source: "web-contact-form" }
    };

    expect(record.id).toBe("uuid-1234");
    expect(record.status).toBe("new");
    expect(record.createdAt).toBeDefined();
    expect(record.metadata?.source).toBe("web-contact-form");
  });

  it("should conform to ValidationResult contract", () => {
    const validResult: ValidationResult = { isValid: true, errors: [] };
    const invalidResult: ValidationResult = {
      isValid: false,
      errors: [{ field: "email", message: "Invalid email" }]
    };

    expect(validResult.isValid).toBe(true);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors.length).toBe(1);
  });

  it("should conform to LeadServiceResponse contract", () => {
    const response: LeadServiceResponse = {
      success: true,
      statusCode: 201,
      message: "Lead created",
      data: {
        id: "1",
        name: "A",
        email: "a@b.com",
        company: "B",
        service: "C",
        message: "D",
        status: "new",
        createdAt: "now",
        updatedAt: "now"
      }
    };

    expect(response.success).toBe(true);
    expect(response.statusCode).toBe(201);
  });
});
