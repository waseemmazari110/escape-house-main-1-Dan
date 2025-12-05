// CRM Integration Types
// Supports TreadSoft and generic CRM systems

export interface CRMConfig {
  provider: 'treadsoft' | 'salesforce' | 'hubspot' | 'zoho' | 'custom';
  apiUrl: string;
  apiKey: string;
  apiSecret?: string;
  webhookSecret?: string;
  enabled: boolean;
}

export interface CRMContact {
  id?: string;
  crmId?: string; // ID in the CRM system
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName?: string;
  role: 'owner' | 'guest' | 'admin';
  membershipStatus?: 'active' | 'pending' | 'inactive';
  source?: string;
  customFields?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CRMProperty {
  id?: string;
  crmId?: string;
  ownerId: string;
  ownerCrmId?: string;
  name: string;
  address: string;
  city?: string;
  country?: string;
  postcode?: string;
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  pricePerNight?: number;
  status: 'draft' | 'pending' | 'published' | 'archived';
  customFields?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CRMEnquiry {
  id?: string;
  crmId?: string;
  contactId: string;
  contactCrmId?: string;
  propertyId?: string;
  propertyCrmId?: string;
  subject: string;
  message: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source?: string;
  customFields?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CRMBooking {
  id?: string;
  crmId?: string;
  contactId: string;
  contactCrmId?: string;
  propertyId: string;
  propertyCrmId?: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  customFields?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CRMSyncResult {
  success: boolean;
  crmId?: string;
  message?: string;
  error?: string;
  timestamp: Date;
}

export interface CRMSyncLog {
  id?: number;
  entityType: 'contact' | 'property' | 'enquiry' | 'booking';
  entityId: string;
  crmId?: string;
  action: 'create' | 'update' | 'delete';
  status: 'success' | 'failed' | 'pending';
  request?: any;
  response?: any;
  error?: string;
  createdAt: Date;
}

export interface ICRMService {
  // Contact operations
  createContact(contact: CRMContact): Promise<CRMSyncResult>;
  updateContact(crmId: string, contact: Partial<CRMContact>): Promise<CRMSyncResult>;
  getContact(crmId: string): Promise<CRMContact | null>;
  deleteContact(crmId: string): Promise<CRMSyncResult>;
  
  // Property operations
  createProperty(property: CRMProperty): Promise<CRMSyncResult>;
  updateProperty(crmId: string, property: Partial<CRMProperty>): Promise<CRMSyncResult>;
  getProperty(crmId: string): Promise<CRMProperty | null>;
  deleteProperty(crmId: string): Promise<CRMSyncResult>;
  
  // Enquiry operations
  createEnquiry(enquiry: CRMEnquiry): Promise<CRMSyncResult>;
  updateEnquiry(crmId: string, enquiry: Partial<CRMEnquiry>): Promise<CRMSyncResult>;
  
  // Booking operations
  createBooking(booking: CRMBooking): Promise<CRMSyncResult>;
  updateBooking(crmId: string, booking: Partial<CRMBooking>): Promise<CRMSyncResult>;
  
  // Validation
  validateConnection(): Promise<boolean>;
}
