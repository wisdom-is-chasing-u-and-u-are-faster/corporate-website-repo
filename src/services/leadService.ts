/**
 * Core Lead Capture Engine Service
 * Implements end-to-end orchestration for ARCH-393
 */

import { LeadSubmission, LeadServiceResponse } from "../types/lead";
import { LeadValidator } from "../validators/leadValidator";
import { FirestoreService, IFirestoreClient } from "./firestoreService";

export class LeadEngineService {
  private firestoreService: FirestoreService;

  constructor(customFirestoreClient?: IFirestoreClient, collectionName: string = "leads") {
    this.firestoreService = new FirestoreService(customFirestoreClient, collectionName);
  }

  /**
   * Processes an incoming lead submission: sanitizes, validates, and stores in Firestore.
   */
  public async processLeadCapture(
    rawPayload: Partial<LeadSubmission>,
    metadata?: Record<string, unknown>
  ): Promise<LeadServiceResponse> {
    try {
      // Step 1: Input Sanitization (AC-3)
      const sanitized = LeadValidator.sanitize(rawPayload);

      // Step 2: Input & Corporate Email Validation (AC-1, AC-2)
      const validation = LeadValidator.validate(sanitized);
      if (!validation.isValid) {
        return {
          success: false,
          statusCode: 400,
          message: "Validation failed for lead submission.",
          errors: validation.errors
        };
      }

      // Step 3: Firestore Persistence (AC-4)
      const validSubmission = sanitized as LeadSubmission;
      const createdRecord = await this.firestoreService.createLead(validSubmission, metadata);

      // Step 4: Successful Response (AC-5)
      return {
        success: true,
        statusCode: 201,
        message: "Lead captured successfully.",
        data: createdRecord
      };
    } catch (error) {
      // Robust error handling (AC-5)
      const errorMessage = error instanceof Error ? error.message : "Internal server error processing lead";
      return {
        success: false,
        statusCode: 500,
        message: "An error occurred while processing lead capture.",
        errors: [{ field: "server", message: errorMessage }]
      };
    }
  }

  /**
   * Helper to retrieve a lead by ID.
   */
  public async getLead(id: string) {
    return this.firestoreService.getLeadById(id);
  }
}
