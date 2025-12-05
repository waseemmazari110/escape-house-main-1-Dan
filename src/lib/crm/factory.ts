// CRM Service Factory
// Initializes the correct CRM service based on configuration

import { TreadSoftService } from './treadsoft-service';
import { ICRMService, CRMConfig } from './types';

export class CRMServiceFactory {
  private static instance: ICRMService | null = null;

  static initialize(config: CRMConfig): ICRMService {
    if (!config.enabled) {
      console.warn('CRM integration is disabled');
      return new MockCRMService();
    }

    switch (config.provider) {
      case 'treadsoft':
        this.instance = new TreadSoftService(config);
        break;
      case 'custom':
        this.instance = new TreadSoftService(config); // Use TreadSoft as base
        break;
      default:
        console.warn(`Unknown CRM provider: ${config.provider}, using mock service`);
        this.instance = new MockCRMService();
    }

    return this.instance;
  }

  static getInstance(): ICRMService {
    if (!this.instance) {
      // Initialize with environment variables
      const config: CRMConfig = {
        provider: (process.env.CRM_PROVIDER as any) || 'treadsoft',
        apiUrl: process.env.CRM_API_URL || '',
        apiKey: process.env.CRM_API_KEY || '',
        apiSecret: process.env.CRM_API_SECRET,
        webhookSecret: process.env.CRM_WEBHOOK_SECRET,
        enabled: process.env.CRM_ENABLED === 'true',
      };

      this.instance = this.initialize(config);
    }

    return this.instance;
  }
}

// Mock CRM Service for development/testing
class MockCRMService implements ICRMService {
  async createContact(contact: any) {
    console.log('[Mock CRM] Create contact:', contact.email);
    return {
      success: true,
      crmId: `mock-contact-${Date.now()}`,
      message: 'Mock contact created',
      timestamp: new Date(),
    };
  }

  async updateContact(crmId: string, contact: any) {
    console.log('[Mock CRM] Update contact:', crmId);
    return {
      success: true,
      crmId,
      message: 'Mock contact updated',
      timestamp: new Date(),
    };
  }

  async getContact(crmId: string) {
    console.log('[Mock CRM] Get contact:', crmId);
    return null;
  }

  async deleteContact(crmId: string) {
    console.log('[Mock CRM] Delete contact:', crmId);
    return {
      success: true,
      crmId,
      message: 'Mock contact deleted',
      timestamp: new Date(),
    };
  }

  async createProperty(property: any) {
    console.log('[Mock CRM] Create property:', property.name);
    return {
      success: true,
      crmId: `mock-property-${Date.now()}`,
      message: 'Mock property created',
      timestamp: new Date(),
    };
  }

  async updateProperty(crmId: string, property: any) {
    console.log('[Mock CRM] Update property:', crmId);
    return {
      success: true,
      crmId,
      message: 'Mock property updated',
      timestamp: new Date(),
    };
  }

  async getProperty(crmId: string) {
    console.log('[Mock CRM] Get property:', crmId);
    return null;
  }

  async deleteProperty(crmId: string) {
    console.log('[Mock CRM] Delete property:', crmId);
    return {
      success: true,
      crmId,
      message: 'Mock property deleted',
      timestamp: new Date(),
    };
  }

  async createEnquiry(enquiry: any) {
    console.log('[Mock CRM] Create enquiry:', enquiry.subject);
    return {
      success: true,
      crmId: `mock-enquiry-${Date.now()}`,
      message: 'Mock enquiry created',
      timestamp: new Date(),
    };
  }

  async updateEnquiry(crmId: string, enquiry: any) {
    console.log('[Mock CRM] Update enquiry:', crmId);
    return {
      success: true,
      crmId,
      message: 'Mock enquiry updated',
      timestamp: new Date(),
    };
  }

  async createBooking(booking: any) {
    console.log('[Mock CRM] Create booking');
    return {
      success: true,
      crmId: `mock-booking-${Date.now()}`,
      message: 'Mock booking created',
      timestamp: new Date(),
    };
  }

  async updateBooking(crmId: string, booking: any) {
    console.log('[Mock CRM] Update booking:', crmId);
    return {
      success: true,
      crmId,
      message: 'Mock booking updated',
      timestamp: new Date(),
    };
  }

  async validateConnection() {
    console.log('[Mock CRM] Validate connection');
    return true;
  }
}

export { MockCRMService };
