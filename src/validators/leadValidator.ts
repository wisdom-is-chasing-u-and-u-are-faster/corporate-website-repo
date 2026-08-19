/**
 * Lead Validator & Input Sanitizer
 * Implements AC-1, AC-2, AC-3 for ARCH-393
 */

import { LeadSubmission, ValidationResult, ValidationErrorItem } from "../types/lead";

/**
 * List of disallowed generic/freemail and disposable domain suffixes.
 */
export const BLOCKED_EMAIL_DOMAINS: Set<string> = new Set([
  "gmail.com",
  "yahoo.com",
  "ymail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "msn.com",
  "aol.com",
  "icloud.com",
  "mail.com",
  "zoho.com",
  "protonmail.com",
  "proton.me",
  "gmx.com",
  "yandex.com",
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "mailinator.com",
  "throwawaymail.com",
  "sharklasers.com",
  "dispostable.com"
]);

/**
 * Basic email format regex (RFC 5322 compliant simplified)
 */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Strips HTML tags and dangerous script tokens to prevent XSS.
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== "string") {
    return "";
  }
  return input
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[<>'"&]/g, (char) => {
      switch (char) {
        case "<": return "&lt;";
        case ">": return "&gt;";
        case "'": return "&#39;";
        case '"': return "&quot;";
        case "&": return "&amp;";
        default: return char;
      }
    })
    .trim();
}

/**
 * Checks whether an email address belongs to a corporate/business domain.
 */
export function isCorporateEmail(email: string): boolean {
  if (!email || !EMAIL_REGEX.test(email)) {
    return false;
  }
  const domain = email.split("@")[1]?.toLowerCase().trim();
  if (!domain) {
    return false;
  }
  return !BLOCKED_EMAIL_DOMAINS.has(domain);
}

/**
 * Validates and sanitizes an incoming LeadSubmission payload.
 */
export class LeadValidator {
  /**
   * Sanitizes all text fields in a lead submission.
   */
  public static sanitize(raw: Partial<LeadSubmission>): Partial<LeadSubmission> {
    return {
      name: sanitizeString(raw.name),
      email: typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "",
      company: sanitizeString(raw.company),
      service: sanitizeString(raw.service),
      message: sanitizeString(raw.message),
      phone: raw.phone ? sanitizeString(raw.phone) : undefined
    };
  }

  /**
   * Validates the submission against domain acceptance criteria.
   */
  public static validate(submission: Partial<LeadSubmission>): ValidationResult {
    const errors: ValidationErrorItem[] = [];

    // AC-1: Name validation
    if (!submission.name || typeof submission.name !== "string" || submission.name.trim().length === 0) {
      errors.push({ field: "name", message: "Name is required and cannot be empty." });
    } else if (submission.name.trim().length > 100) {
      errors.push({ field: "name", message: "Name cannot exceed 100 characters." });
    }

    // AC-1 & AC-2: Email validation & corporate check
    if (!submission.email || typeof submission.email !== "string" || submission.email.trim().length === 0) {
      errors.push({ field: "email", message: "Corporate email is required." });
    } else if (!EMAIL_REGEX.test(submission.email.trim())) {
      errors.push({ field: "email", message: "Please provide a valid email address." });
    } else if (!isCorporateEmail(submission.email.trim())) {
      errors.push({
        field: "email",
        message: "Please provide a valid corporate business email. Generic and disposable email domains are not accepted."
      });
    }

    // AC-1: Company validation
    if (!submission.company || typeof submission.company !== "string" || submission.company.trim().length === 0) {
      errors.push({ field: "company", message: "Company name is required." });
    } else if (submission.company.trim().length > 150) {
      errors.push({ field: "company", message: "Company name cannot exceed 150 characters." });
    }

    // AC-1: Service / Interest validation
    if (!submission.service || typeof submission.service !== "string" || submission.service.trim().length === 0) {
      errors.push({ field: "service", message: "Service of interest is required." });
    } else if (submission.service.trim().length > 100) {
      errors.push({ field: "service", message: "Service name cannot exceed 100 characters." });
    }

    // AC-1: Message validation
    if (!submission.message || typeof submission.message !== "string" || submission.message.trim().length === 0) {
      errors.push({ field: "message", message: "Message is required." });
    } else if (submission.message.trim().length > 2000) {
      errors.push({ field: "message", message: "Message cannot exceed 2000 characters." });
    }

    // Optional phone validation
    if (submission.phone && typeof submission.phone === "string") {
      const phoneClean = submission.phone.trim();
      if (phoneClean.length > 30) {
        errors.push({ field: "phone", message: "Phone number cannot exceed 30 characters." });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
