// Base CRM Service with generic HTTP client
import { CRMConfig, CRMSyncResult, ICRMService } from './types';

export abstract class BaseCRMService implements ICRMService {
  protected config: CRMConfig;
  
  constructor(config: CRMConfig) {
    this.config = config;
  }

  protected async makeRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    data?: any
  ): Promise<any> {
    if (!this.config.enabled) {
      return { success: false, error: 'CRM integration is disabled' };
    }

    try {
      const url = `${this.config.apiUrl}${endpoint}`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      };

      // Add API secret if provided (for some CRM systems)
      if (this.config.apiSecret) {
        headers['X-API-Secret'] = this.config.apiSecret;
      }

      const options: RequestInit = {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      };

      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`CRM API error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`CRM request failed:`, error);
      throw error;
    }
  }

  protected createSuccessResult(crmId: string, message?: string): CRMSyncResult {
    return {
      success: true,
      crmId,
      message: message || 'Operation completed successfully',
      timestamp: new Date(),
    };
  }

  protected createErrorResult(error: string): CRMSyncResult {
    return {
      success: false,
      error,
      timestamp: new Date(),
    };
  }

  // Abstract methods that must be implemented by specific CRM adapters
  abstract createContact(contact: any): Promise<CRMSyncResult>;
  abstract updateContact(crmId: string, contact: any): Promise<CRMSyncResult>;
  abstract getContact(crmId: string): Promise<any>;
  abstract deleteContact(crmId: string): Promise<CRMSyncResult>;
  abstract createProperty(property: any): Promise<CRMSyncResult>;
  abstract updateProperty(crmId: string, property: any): Promise<CRMSyncResult>;
  abstract getProperty(crmId: string): Promise<any>;
  abstract deleteProperty(crmId: string): Promise<CRMSyncResult>;
  abstract createEnquiry(enquiry: any): Promise<CRMSyncResult>;
  abstract updateEnquiry(crmId: string, enquiry: any): Promise<CRMSyncResult>;
  abstract createBooking(booking: any): Promise<CRMSyncResult>;
  abstract updateBooking(crmId: string, booking: any): Promise<CRMSyncResult>;
  abstract validateConnection(): Promise<boolean>;
}
