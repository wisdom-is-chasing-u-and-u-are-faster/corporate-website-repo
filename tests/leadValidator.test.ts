import { LeadValidator, isCorporateEmail, sanitizeString, BLOCKED_EMAIL_DOMAINS } from "../src/validators/leadValidator";
import { LeadSubmission } from "../src/types/lead";

describe("LeadValidator & Sanitization Suite", () => {
  describe("BLOCKED_EMAIL_DOMAINS", () => {
    it("should include major webmail providers", () => {
      expect(BLOCKED_EMAIL_DOMAINS.has("gmail.com")).toBe(true);
      expect(BLOCKED_EMAIL_DOMAINS.has("yahoo.com")).toBe(true);
      expect(BLOCKED_EMAIL_DOMAINS.has("hotmail.com")).toBe(true);
    });
  });

  describe("sanitizeString", () => {
    it("should strip HTML tags and encode dangerous characters", () => {
      const malicious = "<script>alert('xss')</script>Hello & welcome";
      const clean = sanitizeString(malicious);
      expect(clean).not.toContain("<script>");
      expect(clean).toContain("&amp;");
    });

    it("should handle empty or non-string inputs safely", () => {
      expect(sanitizeString(null)).toBe("");
      expect(sanitizeString(undefined)).toBe("");
      expect(sanitizeString(123 as unknown as string)).toBe("");
    });
  });

  describe("isCorporateEmail", () => {
    it("should accept valid corporate domain emails", () => {
      expect(isCorporateEmail("alex@persistent.com")).toBe(true);
      expect(isCorporateEmail("cto@enterprise-solutions.co.uk")).toBe(true);
      expect(isCorporateEmail("lead@fintech-innovations.org")).toBe(true);
    });

    it("should reject generic and freemail provider domains", () => {
      expect(isCorporateEmail("john@gmail.com")).toBe(false);
      expect(isCorporateEmail("sarah@yahoo.com")).toBe(false);
      expect(isCorporateEmail("user@hotmail.com")).toBe(false);
      expect(isCorporateEmail("test@outlook.com")).toBe(false);
      expect(isCorporateEmail("dev@aol.com")).toBe(false);
      expect(isCorporateEmail("anon@protonmail.com")).toBe(false);
      expect(isCorporateEmail("temp@mailinator.com")).toBe(false);
    });

    it("should reject invalid email formats", () => {
      expect(isCorporateEmail("plainaddress")).toBe(false);
      expect(isCorporateEmail("@missingusername.com")).toBe(false);
      expect(isCorporateEmail("user@.com")).toBe(false);
      expect(isCorporateEmail("")).toBe(false);
    });
  });

  describe("LeadValidator.validate", () => {
    const validPayload: LeadSubmission = {
      name: "Marcus Vance",
      email: "marcus.vance@vancetech.com",
      company: "Vance Technologies",
      service: "Cloud Migration & Modernization",
      message: "We need an architectural review for migrating on-prem workloads to Google Cloud Run.",
      phone: "+1-800-555-0199"
    };

    it("should pass validation for a well-formed corporate lead", () => {
      const result = LeadValidator.validate(validPayload);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject when name is missing or empty", () => {
      const result = LeadValidator.validate({ ...validPayload, name: "" });
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === "name")).toBe(true);
    });

    it("should reject when email is a generic webmail address (AC-2)", () => {
      const result = LeadValidator.validate({ ...validPayload, email: "marcus@gmail.com" });
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === "email" && e.message.includes("corporate"))).toBe(true);
    });

    it("should reject when company is missing", () => {
      const result = LeadValidator.validate({ ...validPayload, company: "" });
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === "company")).toBe(true);
    });

    it("should reject when service is missing", () => {
      const result = LeadValidator.validate({ ...validPayload, service: "" });
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === "service")).toBe(true);
    });

    it("should reject when message is missing", () => {
      const result = LeadValidator.validate({ ...validPayload, message: "" });
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === "message")).toBe(true);
    });

    it("should sanitize payload fields properly", () => {
      const dirty = {
        name: "<b>Marcus</b> ",
        email: " MARCUS.VANCE@VANCETECH.COM ",
        company: "Vance Tech <script>",
        service: "Cloud Transformation",
        message: "Need <i>help</i> ASAP"
      };

      const sanitized = LeadValidator.sanitize(dirty);
      expect(sanitized.name).toBe("Marcus");
      expect(sanitized.email).toBe("marcus.vance@vancetech.com");
      expect(sanitized.company).not.toContain("<script>");
      expect(sanitized.message).not.toContain("<i>");
    });
  });
});
