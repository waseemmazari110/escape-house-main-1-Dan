// TreadSoft CRM Service Implementation
// Adapter for TreadSoft CRM system

import { BaseCRMService } from './base-service';
import {
  CRMConfig,
  CRMContact,
  CRMProperty,
  CRMEnquiry,
  CRMBooking,
  CRMSyncResult,
} from './types';

export class TreadSoftService extends BaseCRMService {
  constructor(config: CRMConfig) {
    super(config);
  }

  async validateConnection(): Promise<boolean> {
    try {
      const result = await this.makeRequest('/api/v1/health', 'GET');
      return result.status === 'ok';
    } catch (error) {
      console.error('TreadSoft connection validation failed:', error);
      return false;
    }
  }

  async createContact(contact: CRMContact): Promise<CRMSyncResult> {
    try {
      // Map to TreadSoft contact format
      const treadSoftContact = {
        first_name: contact.firstName,
        last_name: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        company: contact.companyName,
        contact_type: contact.role,
        membership_status: contact.membershipStatus || 'pending',
        source: contact.source || 'website',
        custom_fields: contact.customFields || {},
      };

      const response = await this.makeRequest('/api/v1/contacts', 'POST', treadSoftContact);
      
      return this.createSuccessResult(
        response.id || response.contact_id,
        'Contact created in TreadSoft'
      );
    } catch (error: any) {
      return this.createErrorResult(error.message);
    }
  }

  async updateContact(crmId: string, contact: Partial<CRMContact>): Promise<CRMSyncResult> {
    try {
      const updateData: any = {};
      
      if (contact.firstName) updateData.first_name = contact.firstName;
      if (contact.lastName) updateData.last_name = contact.lastName;
      if (contact.email) updateData.email = contact.email;
      if (contact.phone) updateData.phone = contact.phone;
      if (contact.companyName) updateData.company = contact.companyName;
      if (contact.role) updateData.contact_type = contact.role;
      if (contact.membershipStatus) updateData.membership_status = contact.membershipStatus;
      if (contact.customFields) updateData.custom_fields = contact.customFields;

      const response = await this.makeRequest(
        `/api/v1/contacts/${crmId}`,
        'PUT',
        updateData
      );

      return this.createSuccessResult(crmId, 'Contact updated in TreadSoft');
    } catch (error: any) {
      return this.createErrorResult(error.message);
    }
  }

  async getContact(crmId: string): Promise<CRMContact | null> {
    try {
      const response = await this.makeRequest(`/api/v1/contacts/${crmId}`, 'GET');
      
      // Map TreadSoft response to our format
      return {
        crmId: response.id || response.contact_id,
        firstName: response.first_name,
        lastName: response.last_name,
        email: response.email,
        phone: response.phone,
        companyName: response.company,
        role: response.contact_type,
        membershipStatus: response.membership_status,
        customFields: response.custom_fields,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    } catch (error) {
      console.error('Failed to get contact from TreadSoft:', error);
      return null;
    }
  }

  async deleteContact(crmId: string): Promise<CRMSyncResult> {
    try {
      await this.makeRequest(`/api/v1/contacts/${crmId}`, 'DELETE');
      return this.createSuccessResult(crmId, 'Contact deleted from TreadSoft');
    } catch (error: any) {
      return this.createErrorResult(error.message);
    }
  }

  async createProperty(property: CRMProperty): Promise<CRMSyncResult> {
    try {
      const treadSoftProperty = {
        owner_id: property.ownerCrmId || property.ownerId,
        name: property.name,
        address: property.address,
        city: property.city,
        country: property.country,
        postcode: property.postcode,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        max_guests: property.maxGuests,
        price_per_night: property.pricePerNight,
        status: property.status,
        custom_fields: property.customFields || {},
      };

      const response = await this.makeRequest('/api/v1/properties', 'POST', treadSoftProperty);
      
      return this.createSuccessResult(
        response.id || response.property_id,
        'Property created in TreadSoft'
      );
    } catch (error: any) {
      return this.createErrorResult(error.message);
    }
  }

  async updateProperty(crmId: string, property: Partial<CRMProperty>): Promise<CRMSyncResult> {
    try {
      const updateData: any = {};
      
      if (property.name) updateData.name = property.name;
      if (property.address) updateData.address = property.address;
      if (property.city) updateData.city = property.city;
      if (property.country) updateData.country = property.country;
      if (property.postcode) updateData.postcode = property.postcode;
      if (property.bedrooms) updateData.bedrooms = property.bedrooms;
      if (property.bathrooms) updateData.bathrooms = property.bathrooms;
      if (property.maxGuests) updateData.max_guests = property.maxGuests;
      if (property.pricePerNight) updateData.price_per_night = property.pricePerNight;
      if (property.status) updateData.status = property.status;
      if (property.customFields) updateData.custom_fields = property.customFields;

      await this.makeRequest(`/api/v1/properties/${crmId}`, 'PUT', updateData);
      
      return this.createSuccessResult(crmId, 'Property updated in TreadSoft');
    } catch (error: any) {
      return this.createErrorResult(error.message);
    }
  }

  async getProperty(crmId: string): Promise<CRMProperty | null> {
    try {
      const response = await this.makeRequest(`/api/v1/properties/${crmId}`, 'GET');
      
      return {
        crmId: response.id || response.property_id,
        ownerId: response.owner_id,
        ownerCrmId: response.owner_crm_id,
        name: response.name,
        address: response.address,
        city: response.city,
        country: response.country,
        postcode: response.postcode,
        bedrooms: response.bedrooms,
        bathrooms: response.bathrooms,
        maxGuests: response.max_guests,
        pricePerNight: response.price_per_night,
        status: response.status,
        customFields: response.custom_fields,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    } catch (error) {
      console.error('Failed to get property from TreadSoft:', error);
      return null;
    }
  }

  async deleteProperty(crmId: string): Promise<CRMSyncResult> {
    try {
      await this.makeRequest(`/api/v1/properties/${crmId}`, 'DELETE');
      return this.createSuccessResult(crmId, 'Property deleted from TreadSoft');
    } catch (error: any) {
      return this.createErrorResult(error.message);
    }
  }

  async createEnquiry(enquiry: CRMEnquiry): Promise<CRMSyncResult> {
    try {
      const treadSoftEnquiry = {
        contact_id: enquiry.contactCrmId || enquiry.contactId,
        property_id: enquiry.propertyCrmId || enquiry.propertyId,
        subject: enquiry.subject,
        message: enquiry.message,
        status: enquiry.status || 'new',
        source: enquiry.source || 'website',
        custom_fields: enquiry.customFields || {},
      };

      const response = await this.makeRequest('/api/v1/enquiries', 'POST', treadSoftEnquiry);
      
      return this.createSuccessResult(
        response.id || response.enquiry_id,
        'Enquiry created in TreadSoft'
      );
    } catch (error: any) {
      return this.createErrorResult(error.message);
    }
  }

  async updateEnquiry(crmId: string, enquiry: Partial<CRMEnquiry>): Promise<CRMSyncResult> {
    try {
      const updateData: any = {};
      
      if (enquiry.subject) updateData.subject = enquiry.subject;
      if (enquiry.message) updateData.message = enquiry.message;
      if (enquiry.status) updateData.status = enquiry.status;
      if (enquiry.customFields) updateData.custom_fields = enquiry.customFields;

      await this.makeRequest(`/api/v1/enquiries/${crmId}`, 'PUT', updateData);
      
      return this.createSuccessResult(crmId, 'Enquiry updated in TreadSoft');
    } catch (error: any) {
      return this.createErrorResult(error.message);
    }
  }

  async createBooking(booking: CRMBooking): Promise<CRMSyncResult> {
    try {
      const treadSoftBooking = {
        contact_id: booking.contactCrmId || booking.contactId,
        property_id: booking.propertyCrmId || booking.propertyId,
        check_in_date: booking.checkInDate.toISOString(),
        check_out_date: booking.checkOutDate.toISOString(),
        number_of_guests: booking.numberOfGuests,
        total_price: booking.totalPrice,
        status: booking.status,
        custom_fields: booking.customFields || {},
      };

      const response = await this.makeRequest('/api/v1/bookings', 'POST', treadSoftBooking);
      
      return this.createSuccessResult(
        response.id || response.booking_id,
        'Booking created in TreadSoft'
      );
    } catch (error: any) {
      return this.createErrorResult(error.message);
    }
  }

  async updateBooking(crmId: string, booking: Partial<CRMBooking>): Promise<CRMSyncResult> {
    try {
      const updateData: any = {};
      
      if (booking.checkInDate) updateData.check_in_date = booking.checkInDate.toISOString();
      if (booking.checkOutDate) updateData.check_out_date = booking.checkOutDate.toISOString();
      if (booking.numberOfGuests) updateData.number_of_guests = booking.numberOfGuests;
      if (booking.totalPrice) updateData.total_price = booking.totalPrice;
      if (booking.status) updateData.status = booking.status;
      if (booking.customFields) updateData.custom_fields = booking.customFields;

      await this.makeRequest(`/api/v1/bookings/${crmId}`, 'PUT', updateData);
      
      return this.createSuccessResult(crmId, 'Booking updated in TreadSoft');
    } catch (error: any) {
      return this.createErrorResult(error.message);
    }
  }
}
