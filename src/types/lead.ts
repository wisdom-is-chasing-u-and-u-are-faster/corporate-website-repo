/**
 * Domain types and interfaces for the Lead Capture Engine.
 * Supports ARCH-393: Implement Secure Lead Capture Engine with Server-Side Validation & Firestore Integration
 */

export interface LeadSubmission {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
  phone?: string;
}

export type LeadStatus = "new" | "contacted" | "qualified" | "closed";

export interface LeadRecord extends LeadSubmission {
  id: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface ValidationErrorItem {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrorItem[];
}

export interface LeadServiceResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: LeadRecord;
  errors?: ValidationErrorItem[];
}
