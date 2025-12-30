# Milestone 11 — Frontend Integration Documentation

**Status**: ✅ Complete  
**Date**: 12/12/2025  
**Version**: 1.0.0

---

## 📋 Overview

This milestone provides comprehensive frontend integration documentation with practical React examples for all major features in the Escape Houses platform. All examples use UK date formatting (DD/MM/YYYY) and follow best practices for Next.js 14+ App Router.

---

## 🎯 What's Included

### 1. **Authentication System Integration**
- Login/Registration forms
- Session management
- Role-based access control
- Guest authentication

### 2. **Property Management Components**
- Property listing displays
- Property creation forms
- Image upload handling
- Search and filtering

### 3. **Booking System Integration**
- Booking calendar components
- Booking form with validation
- Availability checking
- Booking confirmation

### 4. **Payment Integration**
- Stripe payment elements
- Payment processing
- Subscription management
- Invoice generation

### 5. **Dashboard Components**
- Owner dashboard widgets
- Guest dashboard views
- Analytics displays
- Notification systems

### 6. **Email & Communication**
- Email verification flows
- Notification preferences
- WhatsApp integration
- Contact forms

---

## 🔧 Core React Patterns

### Date Formatting (UK Format)

```typescript
// lib/utils/date-formatter.ts
export const formatDateUK = (date: Date | string): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatDateTimeUK = (date: Date | string): string => {
  const d = new Date(date);
  const dateStr = formatDateUK(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${dateStr} ${hours}:${minutes}`;
};

export const formatDateLongUK = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};
```

### API Client Setup

```typescript
// lib/api/client.ts
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API Error');
    }

    return response.json();
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }
}

export const api = new ApiClient();
```

---

## 🔐 Authentication Components

### Login Form Component

```typescript
// components/auth/login-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Redirect based on role
      if (data.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (data.user.role === 'owner') {
        router.push('/owner/dashboard');
      } else {
        router.push('/dashboard');
      }
      
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
```

### Registration Form Component

```typescript
// components/auth/register-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    isOwner: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phone: formData.phone,
          role: formData.isOwner ? 'owner' : 'guest',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Redirect to email verification page
      router.push('/auth/verify-email?email=' + encodeURIComponent(formData.email));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="John Smith"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="john.smith@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+44 20 1234 5678"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          minLength={8}
        />
        <p className="text-xs text-muted-foreground">
          At least 8 characters with uppercase, lowercase, and numbers
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isOwner"
          checked={formData.isOwner}
          onCheckedChange={(checked) => 
            setFormData({ ...formData, isOwner: checked as boolean })
          }
        />
        <Label htmlFor="isOwner" className="text-sm font-normal">
          I want to list my property
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
}
```

### Protected Route Hook

```typescript
// hooks/use-auth.ts
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'owner' | 'guest';
  emailVerified: boolean;
  createdAt: string;
}

export function useAuth(requiredRole?: string[]) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Not authenticated');
      }

      const data = await response.json();
      setUser(data.user);

      // Check if user has required role
      if (requiredRole && !requiredRole.includes(data.user.role)) {
        router.push('/unauthorized');
      }
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    router.push('/');
    router.refresh();
  };

  return { user, loading, logout };
}
```

---

## 🏠 Property Management Components

### Property Card Component

```typescript
// components/properties/property-card.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Bed, Bath } from 'lucide-react';
import { formatDateUK } from '@/lib/utils/date-formatter';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    description: string;
    location: string;
    pricePerNight: number;
    maxGuests: number;
    bedrooms: number;
    bathrooms: number;
    images: string[];
    status: 'active' | 'inactive';
    createdAt: string;
    owner: {
      fullName: string;
    };
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  const mainImage = property.images[0] || '/placeholder-property.jpg';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/properties/${property.id}`}>
        <div className="relative h-48 w-full">
          <Image
            src={mainImage}
            alt={property.title}
            fill
            className="object-cover"
          />
          {property.status === 'inactive' && (
            <Badge className="absolute top-2 right-2" variant="secondary">
              Unavailable
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/properties/${property.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-primary">
            {property.title}
          </h3>
        </Link>

        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          {property.location}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {property.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {property.maxGuests}
          </div>
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            {property.bedrooms}
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            {property.bathrooms}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Listed: {formatDateUK(property.createdAt)}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div>
          <span className="text-2xl font-bold">£{property.pricePerNight}</span>
          <span className="text-sm text-muted-foreground"> / night</span>
        </div>
        <Link href={`/properties/${property.id}`}>
          <Badge variant="outline">View Details</Badge>
        </Link>
      </CardFooter>
    </Card>
  );
}
```

### Property Creation Form

```typescript
// components/properties/create-property-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImageUpload } from '@/components/ui/image-upload';

export function CreatePropertyForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    pricePerNight: '',
    maxGuests: '',
    bedrooms: '',
    bathrooms: '',
    amenities: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Upload images first
      const uploadedImages = await uploadImages(images);

      // Create property
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          pricePerNight: parseFloat(formData.pricePerNight),
          maxGuests: parseInt(formData.maxGuests),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          amenities: formData.amenities.split(',').map(a => a.trim()),
          images: uploadedImages,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create property');
      }

      const data = await response.json();
      router.push(`/owner/properties/${data.property.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload images');
    }

    const data = await response.json();
    return data.urls;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Property Title</Label>
        <Input
          id="title"
          type="text"
          placeholder="Luxury Coastal Retreat"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your property..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          type="text"
          placeholder="Brighton, East Sussex"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pricePerNight">Price per Night (£)</Label>
          <Input
            id="pricePerNight"
            type="number"
            min="0"
            step="0.01"
            placeholder="150.00"
            value={formData.pricePerNight}
            onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxGuests">Max Guests</Label>
          <Input
            id="maxGuests"
            type="number"
            min="1"
            placeholder="4"
            value={formData.maxGuests}
            onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input
            id="bedrooms"
            type="number"
            min="0"
            placeholder="2"
            value={formData.bedrooms}
            onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input
            id="bathrooms"
            type="number"
            min="0"
            placeholder="1"
            value={formData.bathrooms}
            onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amenities">Amenities (comma-separated)</Label>
        <Input
          id="amenities"
          type="text"
          placeholder="WiFi, Parking, Kitchen, TV"
          value={formData.amenities}
          onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Property Images</Label>
        <ImageUpload
          value={images}
          onChange={setImages}
          maxFiles={10}
        />
        <p className="text-xs text-muted-foreground">
          Upload up to 10 images. First image will be the main display.
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating Property...' : 'Create Property'}
      </Button>
    </form>
  );
}
```

---

## 📅 Booking Components

### Booking Calendar Component

```typescript
// components/bookings/booking-calendar.tsx
'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { formatDateUK } from '@/lib/utils/date-formatter';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BookingCalendarProps {
  propertyId: string;
  pricePerNight: number;
  onBookingSelect: (checkIn: Date, checkOut: Date, totalPrice: number) => void;
}

export function BookingCalendar({
  propertyId,
  pricePerNight,
  onBookingSelect,
}: BookingCalendarProps) {
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookedDates();
  }, [propertyId]);

  const fetchBookedDates = async () => {
    try {
      const response = await fetch(`/api/properties/${propertyId}/availability`);
      const data = await response.json();
      
      const dates = data.bookedDates.map((d: string) => new Date(d));
      setBookedDates(dates);
    } catch (error) {
      console.error('Failed to fetch availability:', error);
    }
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    return calculateNights() * pricePerNight;
  };

  const handleConfirm = () => {
    if (checkIn && checkOut) {
      onBookingSelect(checkIn, checkOut, calculateTotal());
    }
  };

  const isDateBooked = (date: Date) => {
    return bookedDates.some(
      bookedDate =>
        bookedDate.toDateString() === date.toDateString()
    );
  };

  const nights = calculateNights();
  const total = calculateTotal();

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Check-in Date</label>
          <Calendar
            mode="single"
            selected={checkIn}
            onSelect={setCheckIn}
            disabled={(date) =>
              date < new Date() || isDateBooked(date)
            }
            className="rounded-md border"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Check-out Date</label>
          <Calendar
            mode="single"
            selected={checkOut}
            onSelect={setCheckOut}
            disabled={(date) =>
              !checkIn ||
              date <= checkIn ||
              isDateBooked(date)
            }
            className="rounded-md border"
          />
        </div>
      </div>

      {checkIn && checkOut && (
        <Alert>
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Check-in:</span>
                <span className="font-medium">{formatDateUK(checkIn)}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-out:</span>
                <span className="font-medium">{formatDateUK(checkOut)}</span>
              </div>
              <div className="flex justify-between">
                <span>Nights:</span>
                <span className="font-medium">{nights}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handleConfirm}
        disabled={!checkIn || !checkOut || loading}
        className="w-full"
      >
        Continue to Booking
      </Button>
    </div>
  );
}
```

### Booking Form Component

```typescript
// components/bookings/booking-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDateUK } from '@/lib/utils/date-formatter';

interface BookingFormProps {
  propertyId: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  maxGuests: number;
}

export function BookingForm({
  propertyId,
  checkIn,
  checkOut,
  totalPrice,
  maxGuests,
}: BookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    numberOfGuests: '1',
    specialRequests: '',
    contactPhone: '',
    emergencyContact: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          propertyId,
          checkInDate: checkIn.toISOString(),
          checkOutDate: checkOut.toISOString(),
          numberOfGuests: parseInt(formData.numberOfGuests),
          specialRequests: formData.specialRequests,
          contactPhone: formData.contactPhone,
          emergencyContact: formData.emergencyContact,
          totalPrice,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create booking');
      }

      const data = await response.json();
      
      // Redirect to payment
      router.push(`/bookings/${data.booking.id}/payment`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-muted p-4 rounded-lg space-y-2">
        <h3 className="font-semibold">Booking Summary</h3>
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>Check-in:</span>
            <span>{formatDateUK(checkIn)}</span>
          </div>
          <div className="flex justify-between">
            <span>Check-out:</span>
            <span>{formatDateUK(checkOut)}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t">
            <span>Total:</span>
            <span>£{totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="numberOfGuests">Number of Guests</Label>
        <Input
          id="numberOfGuests"
          type="number"
          min="1"
          max={maxGuests}
          value={formData.numberOfGuests}
          onChange={(e) => setFormData({ ...formData, numberOfGuests: e.target.value })}
          required
        />
        <p className="text-xs text-muted-foreground">
          Maximum {maxGuests} guests
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactPhone">Contact Phone</Label>
        <Input
          id="contactPhone"
          type="tel"
          placeholder="+44 20 1234 5678"
          value={formData.contactPhone}
          onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="emergencyContact">Emergency Contact</Label>
        <Input
          id="emergencyContact"
          type="tel"
          placeholder="+44 20 8765 4321"
          value={formData.emergencyContact}
          onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
        <Textarea
          id="specialRequests"
          placeholder="Any special requests or requirements..."
          value={formData.specialRequests}
          onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Processing...' : 'Proceed to Payment'}
      </Button>
    </form>
  );
}
```

---

## 💳 Payment Integration

### Stripe Payment Component

```typescript
// components/payments/stripe-payment-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  bookingId: string;
  amount: number;
}

function CheckoutForm({ bookingId, amount }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message);
      }

      // Confirm payment
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/bookings/${bookingId}/confirmation`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Update booking status
        await fetch(`/api/bookings/${bookingId}/payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
          }),
        });

        router.push(`/bookings/${bookingId}/confirmation`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-muted p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Amount to Pay:</span>
          <span className="text-2xl font-bold">£{amount.toFixed(2)}</span>
        </div>
      </div>

      <PaymentElement />

      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || loading}
      >
        {loading ? 'Processing Payment...' : `Pay £${amount.toFixed(2)}`}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Your payment is secure and encrypted
      </p>
    </form>
  );
}

export function StripePaymentForm({ bookingId, amount }: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);

  useState(() => {
    fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        bookingId,
        amount: Math.round(amount * 100), // Convert to pence
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setLoading(false);
      });
  });

  if (loading || !clientSecret) {
    return <div>Loading payment form...</div>;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
        },
      }}
    >
      <CheckoutForm bookingId={bookingId} amount={amount} />
    </Elements>
  );
}
```

---

## 📊 Dashboard Components

### Owner Dashboard Stats

```typescript
// components/dashboard/owner-stats.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Calendar, PoundSterling, TrendingUp } from 'lucide-react';
import { formatDateUK } from '@/lib/utils/date-formatter';

interface DashboardStats {
  totalProperties: number;
  activeBookings: number;
  monthlyRevenue: number;
  upcomingCheckIns: number;
  recentBookings: Array<{
    id: string;
    propertyTitle: string;
    guestName: string;
    checkInDate: string;
    totalPrice: number;
  }>;
}

export function OwnerStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/owner/dashboard/stats', {
        credentials: 'include',
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (!stats) {
    return <div>Failed to load dashboard</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Properties
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <PoundSterling className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              £{stats.monthlyRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Check-ins
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingCheckIns}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div>
                  <p className="font-medium">{booking.propertyTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    Guest: {booking.guestName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Check-in: {formatDateUK(booking.checkInDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">£{booking.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 📧 Email & Notifications

### Email Verification Component

```typescript
// components/auth/email-verification.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, CheckCircle } from 'lucide-react';

export function EmailVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Email verified successfully! Redirecting...');
        setTimeout(() => router.push('/auth/login'), 2000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Verification failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred during verification');
    }
  };

  const handleResend = async () => {
    if (!email) return;
    
    setResending(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Verification email sent! Please check your inbox.');
      }
    } catch (error) {
      setMessage('Failed to resend email');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 text-center">
      {status === 'pending' && !token && (
        <>
          <Mail className="h-16 w-16 mx-auto text-primary" />
          <h2 className="text-2xl font-bold">Verify Your Email</h2>
          <p className="text-muted-foreground">
            We've sent a verification link to <strong>{email}</strong>
          </p>
          <Alert>
            <AlertDescription>
              Please check your email and click the verification link to activate your account.
            </AlertDescription>
          </Alert>
          <Button onClick={handleResend} disabled={resending} variant="outline">
            {resending ? 'Sending...' : 'Resend Verification Email'}
          </Button>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
          <h2 className="text-2xl font-bold text-green-600">Email Verified!</h2>
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        </>
      )}

      {status === 'error' && (
        <>
          <Alert variant="destructive">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
          <Button onClick={handleResend} disabled={resending}>
            {resending ? 'Sending...' : 'Resend Verification Email'}
          </Button>
        </>
      )}
    </div>
  );
}
```

---

## 🔍 Search & Filter Components

### Property Search Component

```typescript
// components/search/property-search.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

export function PropertySearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    guests: searchParams.get('guests') || '',
    bedrooms: searchParams.get('bedrooms') || '',
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-lg space-y-4">
      <h2 className="text-xl font-bold mb-4">Find Your Perfect Escape</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="City or region"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="guests">Guests</Label>
          <Select
            value={filters.guests}
            onValueChange={(value) => setFilters({ ...filters, guests: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Guest</SelectItem>
              <SelectItem value="2">2 Guests</SelectItem>
              <SelectItem value="4">4 Guests</SelectItem>
              <SelectItem value="6">6+ Guests</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Select
            value={filters.bedrooms}
            onValueChange={(value) => setFilters({ ...filters, bedrooms: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Bedroom</SelectItem>
              <SelectItem value="2">2 Bedrooms</SelectItem>
              <SelectItem value="3">3 Bedrooms</SelectItem>
              <SelectItem value="4">4+ Bedrooms</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minPrice">Min Price (£/night)</Label>
          <Input
            id="minPrice"
            type="number"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxPrice">Max Price (£/night)</Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="1000"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
        </div>

        <div className="flex items-end">
          <Button onClick={handleSearch} className="w-full">
            <Search className="mr-2 h-4 w-4" />
            Search Properties
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎨 Utility Hooks

### useToast Hook

```typescript
// hooks/use-toast.ts
import { useState, useCallback } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast = { id, title, description, variant };
      
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);

      return id;
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, toast, dismiss };
}
```

### useDebounce Hook

```typescript
// hooks/use-debounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

---

## 📱 Responsive Design Patterns

### Mobile-First Breakpoints

```typescript
// lib/responsive.ts
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

// Usage example:
// const isMobile = useMediaQuery('(max-width: 768px)');
```

---

## 🧪 Testing Examples

### Component Test Example

```typescript
// __tests__/components/property-card.test.tsx
import { render, screen } from '@testing-library/react';
import { PropertyCard } from '@/components/properties/property-card';

describe('PropertyCard', () => {
  const mockProperty = {
    id: '1',
    title: 'Test Property',
    description: 'Test Description',
    location: 'Test Location',
    pricePerNight: 100,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    images: ['/test.jpg'],
    status: 'active' as const,
    createdAt: '2025-01-15T10:00:00Z',
    owner: {
      fullName: 'Test Owner',
    },
  };

  it('renders property information correctly', () => {
    render(<PropertyCard property={mockProperty} />);
    
    expect(screen.getByText('Test Property')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText('£100')).toBeInTheDocument();
  });

  it('displays UK formatted date', () => {
    render(<PropertyCard property={mockProperty} />);
    
    // Date should be in DD/MM/YYYY format
    expect(screen.getByText(/15\/01\/2025/)).toBeInTheDocument();
  });
});
```

---

## 📚 Additional Resources

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
DATABASE_URL=postgresql://...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### TypeScript Types

```typescript
// types/index.ts
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'owner' | 'guest';
  emailVerified: boolean;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  status: 'active' | 'inactive';
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  guestId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## ✅ Implementation Checklist

- [x] Date formatting utilities (UK format)
- [x] API client setup
- [x] Authentication components
- [x] Protected route hooks
- [x] Property management components
- [x] Booking calendar and forms
- [x] Stripe payment integration
- [x] Dashboard statistics
- [x] Email verification flows
- [x] Search and filter components
- [x] Custom hooks (toast, debounce)
- [x] Responsive design utilities
- [x] Testing examples
- [x] TypeScript types

---

## 🎓 Best Practices

1. **Always use UK date formatting** for user-facing dates
2. **Include credentials: 'include'** in all authenticated API calls
3. **Validate user input** on both client and server
4. **Handle loading states** for better UX
5. **Show meaningful error messages** to users
6. **Use TypeScript types** for type safety
7. **Implement proper error boundaries**
8. **Test components** thoroughly
9. **Follow accessibility guidelines**
10. **Optimize images** with Next.js Image component

---

## 📞 Support & Documentation

- **API Documentation**: `/api/docs`
- **Component Library**: Shadcn/ui
- **State Management**: React hooks + Context API
- **Date Handling**: UK format (DD/MM/YYYY HH:mm)

---

**Document Version**: 1.0.0  
**Last Updated**: 12/12/2025  
**Next Milestone**: Performance Optimization & SEO
