/**
 * Google Cloud Firestore Persistence Service
 * Implements AC-4, AC-5 for ARCH-393
 */

import { Firestore } from "@google-cloud/firestore";
import { LeadSubmission, LeadRecord } from "../types/lead";
import { randomUUID } from "crypto";

export interface IFirestoreClient {
  collection(collectionPath: string): {
    doc(documentPath?: string): {
      set(data: Record<string, unknown>): Promise<unknown>;
      get(): Promise<{ exists: boolean; data(): Record<string, unknown> | undefined }>;
    };
  };
}

export class FirestoreService {
  private firestore: IFirestoreClient;
  private collectionName: string;

  constructor(customClient?: IFirestoreClient, collectionName: string = "leads") {
    this.collectionName = collectionName;
    if (customClient) {
      this.firestore = customClient;
    } else {
      this.firestore = new Firestore();
    }
  }

  /**
   * Persists a validated lead submission to the Firestore 'leads' collection.
   */
  public async createLead(leadData: LeadSubmission, metadata?: Record<string, unknown>): Promise<LeadRecord> {
    try {
      const id = randomUUID();
      const now = new Date().toISOString();

      const record: LeadRecord = {
        id,
        name: leadData.name,
        email: leadData.email,
        company: leadData.company,
        service: leadData.service,
        message: leadData.message,
        phone: leadData.phone,
        status: "new",
        createdAt: now,
        updatedAt: now,
        metadata: metadata || {}
      };

      const docRef = this.firestore.collection(this.collectionName).doc(id);
      await docRef.set({ ...record });

      return record;
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "Unknown Firestore persistence error";
      throw new Error(`Failed to save lead in Firestore: ${errMessage}`);
    }
  }

  /**
   * Retrieves a lead record by ID from Firestore.
   */
  public async getLeadById(id: string): Promise<LeadRecord | null> {
    try {
      const docRef = this.firestore.collection(this.collectionName).doc(id);
      const snapshot = await docRef.get();
      if (!snapshot.exists) {
        return null;
      }
      return snapshot.data() as unknown as LeadRecord;
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "Unknown Firestore retrieval error";
      throw new Error(`Failed to retrieve lead from Firestore: ${errMessage}`);
    }
  }
}
