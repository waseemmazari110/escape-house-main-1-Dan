# Milestone 11 — Quick Reference Guide

**Frontend Integration Essentials**  
**Date Format**: DD/MM/YYYY (UK Standard)  
**Last Updated**: 12/12/2025

---

## 🚀 Quick Start Snippets

### Date Formatting (UK)

```typescript
// Basic date format: 15/12/2025
const formatDateUK = (date: Date | string) => {
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

// With time: 15/12/2025 14:30
const formatDateTimeUK = (date: Date | string) => {
  const d = new Date(date);
  const dateStr = formatDateUK(d);
  return `${dateStr} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

// Long format: 15 December 2025
const formatDateLongUK = (date: Date | string) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};
```

---

## 🔐 Authentication Quick Copy

### Login API Call

```typescript
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};
```

### Register API Call

```typescript
const register = async (data: {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: 'owner' | 'guest';
}) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};
```

### Check Session

```typescript
const getSession = async () => {
  const response = await fetch('/api/auth/session', {
    credentials: 'include',
  });
  return response.json();
};
```

### Logout

```typescript
const logout = async () => {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
};
```

---

## 🏠 Property Management Quick Copy

### Fetch Properties

```typescript
const getProperties = async (filters?: {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
}) => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });
  }
  
  const response = await fetch(`/api/properties?${params}`, {
    credentials: 'include',
  });
  return response.json();
};
```

### Get Single Property

```typescript
const getProperty = async (id: string) => {
  const response = await fetch(`/api/properties/${id}`, {
    credentials: 'include',
  });
  return response.json();
};
```

### Create Property

```typescript
const createProperty = async (data: {
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
}) => {
  const response = await fetch('/api/properties', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return response.json();
};
```

### Update Property

```typescript
const updateProperty = async (id: string, data: Partial<Property>) => {
  const response = await fetch(`/api/properties/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return response.json();
};
```

---

## 📅 Booking Quick Copy

### Create Booking

```typescript
const createBooking = async (data: {
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
  contactPhone: string;
  emergencyContact: string;
  totalPrice: number;
}) => {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return response.json();
};
```

### Get User Bookings

```typescript
const getUserBookings = async () => {
  const response = await fetch('/api/bookings/user', {
    credentials: 'include',
  });
  return response.json();
};
```

### Check Availability

```typescript
const checkAvailability = async (propertyId: string, startDate: string, endDate: string) => {
  const response = await fetch(
    `/api/properties/${propertyId}/availability?start=${startDate}&end=${endDate}`,
    { credentials: 'include' }
  );
  return response.json();
};
```

### Cancel Booking

```typescript
const cancelBooking = async (bookingId: string) => {
  const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
    method: 'POST',
    credentials: 'include',
  });
  return response.json();
};
```

---

## 💳 Payment Quick Copy

### Create Payment Intent

```typescript
const createPaymentIntent = async (bookingId: string, amount: number) => {
  const response = await fetch('/api/payments/create-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      bookingId,
      amount: Math.round(amount * 100), // Convert to pence
    }),
  });
  return response.json();
};
```

### Confirm Payment

```typescript
const confirmPayment = async (bookingId: string, paymentIntentId: string) => {
  const response = await fetch(`/api/bookings/${bookingId}/payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ paymentIntentId }),
  });
  return response.json();
};
```

---

## 📊 Dashboard Quick Copy

### Owner Stats

```typescript
const getOwnerStats = async () => {
  const response = await fetch('/api/owner/dashboard/stats', {
    credentials: 'include',
  });
  return response.json();
};
```

### Guest Stats

```typescript
const getGuestStats = async () => {
  const response = await fetch('/api/guest/dashboard/stats', {
    credentials: 'include',
  });
  return response.json();
};
```

---

## 📧 Email & Notifications Quick Copy

### Send Verification Email

```typescript
const resendVerification = async (email: string) => {
  const response = await fetch('/api/auth/resend-verification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return response.json();
};
```

### Verify Email Token

```typescript
const verifyEmail = async (token: string) => {
  const response = await fetch('/api/auth/verify-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  return response.json();
};
```

---

## 🎨 Common UI Patterns

### Loading Spinner

```typescript
{loading && (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
)}
```

### Error Alert

```typescript
{error && (
  <Alert variant="destructive">
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}
```

### Success Message

```typescript
{success && (
  <Alert>
    <CheckCircle className="h-4 w-4" />
    <AlertDescription>{success}</AlertDescription>
  </Alert>
)}
```

### Empty State

```typescript
{items.length === 0 && (
  <div className="text-center p-8 text-muted-foreground">
    <p>No items found</p>
  </div>
)}
```

---

## 🔧 Useful Hooks

### useAuth Hook

```typescript
import { useAuth } from '@/hooks/use-auth';

function MyComponent() {
  const { user, loading, logout } = useAuth(['owner']); // Optional role check
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;
  
  return <div>Welcome {user.fullName}</div>;
}
```

### useToast Hook

```typescript
import { useToast } from '@/hooks/use-toast';

function MyComponent() {
  const { toast } = useToast();
  
  const handleSuccess = () => {
    toast({
      title: 'Success!',
      description: 'Operation completed',
      variant: 'success',
    });
  };
}
```

### useDebounce Hook

```typescript
import { useDebounce } from '@/hooks/use-debounce';

function SearchComponent() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  
  useEffect(() => {
    // API call with debouncedSearch
  }, [debouncedSearch]);
}
```

---

## 📱 Responsive Utilities

### Media Query Hook

```typescript
import { useMediaQuery } from '@/lib/responsive';

function MyComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  
  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </div>
  );
}
```

---

## 🎯 Form Validation Patterns

### Email Validation

```typescript
const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
```

### Password Validation

```typescript
const isValidPassword = (password: string) => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
};
```

### Phone Validation (UK)

```typescript
const isValidUKPhone = (phone: string) => {
  return /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/.test(phone);
};
```

---

## 💡 Common Calculations

### Calculate Nights

```typescript
const calculateNights = (checkIn: Date, checkOut: Date) => {
  const diff = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
```

### Calculate Total Price

```typescript
const calculateTotal = (pricePerNight: number, nights: number, serviceFee: number = 0.1) => {
  const subtotal = pricePerNight * nights;
  const fee = subtotal * serviceFee;
  return subtotal + fee;
};
```

### Format Currency (UK)

```typescript
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
};
```

---

## 🔒 Security Patterns

### Protected Page Component

```typescript
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const { user, loading } = useAuth(['owner', 'admin']);
  const router = useRouter();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    router.push('/auth/login');
    return null;
  }
  
  return <div>Protected content</div>;
}
```

### CSRF Token Pattern

```typescript
const getCsrfToken = async () => {
  const response = await fetch('/api/csrf-token');
  const data = await response.json();
  return data.token;
};

const makeSecureRequest = async (endpoint: string, data: any) => {
  const csrfToken = await getCsrfToken();
  
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
};
```

---

## 🧪 Testing Snippets

### Mock API Call

```typescript
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'test' }),
  })
) as jest.Mock;
```

### Render with Router

```typescript
import { render } from '@testing-library/react';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockRouter = {
  push: jest.fn(),
  refresh: jest.fn(),
};

(useRouter as jest.Mock).mockReturnValue(mockRouter);
```

---

## 📦 Essential Imports

### Common Component Imports

```typescript
// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

// Next.js
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// React
import { useState, useEffect } from 'react';

// Icons
import { CheckCircle, AlertCircle, Home, User } from 'lucide-react';
```

---

## ⚡ Performance Tips

### Image Optimization

```typescript
<Image
  src={imageUrl}
  alt="Property"
  width={800}
  height={600}
  priority={isAboveFold}
  placeholder="blur"
  blurDataURL="/placeholder.jpg"
/>
```

### Lazy Loading Component

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/heavy'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});
```

### Memoization

```typescript
import { useMemo } from 'react';

const expensiveValue = useMemo(() => {
  return computeExpensiveValue(input);
}, [input]);
```

---

## 🎨 Tailwind Common Classes

```css
/* Layout */
.container: max-w-7xl mx-auto px-4
.grid-cols-responsive: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

/* Spacing */
.space-y-4: vertical spacing between children
.gap-4: gap between grid/flex items

/* Typography */
.text-sm: 0.875rem
.text-base: 1rem
.text-lg: 1.125rem
.text-xl: 1.25rem
.text-2xl: 1.5rem

/* Colors */
.text-primary: brand primary color
.text-muted-foreground: subtle text
.bg-card: card background
.border: default border

/* Interactive */
.hover:shadow-lg: hover shadow effect
.transition-all: smooth transitions
.cursor-pointer: pointer cursor
```

---

## 📋 Quick Checklist

**Before Deployment:**
- [ ] All dates use UK format (DD/MM/YYYY)
- [ ] API calls include `credentials: 'include'`
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Mobile responsive tested
- [ ] TypeScript types defined
- [ ] Images optimized
- [ ] Environment variables set
- [ ] HTTPS enabled
- [ ] Authentication tested

---

## 🔗 Quick Links

- Full Documentation: `MILESTONE_11_COMPLETE.md`
- API Routes: `/api/*`
- Component Library: Shadcn/ui
- Date Format: UK (DD/MM/YYYY)

---

**Quick Reference Version**: 1.0.0  
**Last Updated**: 12/12/2025
