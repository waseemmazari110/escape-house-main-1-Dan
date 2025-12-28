# Milestone 11 — React Component Examples

**Complete React Component Library**  
**All Dates in UK Format (DD/MM/YYYY)**  
**Last Updated**: 12/12/2025

---

## 📦 Table of Contents

1. [Layout Components](#layout-components)
2. [Form Components](#form-components)
3. [Display Components](#display-components)
4. [Interactive Components](#interactive-components)
5. [Data Components](#data-components)
6. [Modal Components](#modal-components)
7. [Navigation Components](#navigation-components)
8. [Utility Components](#utility-components)

---

## 🎨 Layout Components

### Responsive Container

```typescript
// components/layout/container.tsx
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-screen-2xl',
  full: 'max-w-full',
};

export function Container({ children, className, size = 'lg' }: ContainerProps) {
  return (
    <div className={cn('mx-auto px-4 sm:px-6 lg:px-8', sizeClasses[size], className)}>
      {children}
    </div>
  );
}
```

### Header Component

```typescript
// components/layout/header.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Home, User, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Escape Houses</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/properties" className="hover:text-primary transition">
              Properties
            </Link>
            {user?.role === 'owner' && (
              <Link href="/owner/dashboard" className="hover:text-primary transition">
                Dashboard
              </Link>
            )}
            {user?.role === 'guest' && (
              <Link href="/dashboard" className="hover:text-primary transition">
                My Bookings
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {user.fullName}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t">
            <Link
              href="/properties"
              className="block px-4 py-2 hover:bg-muted rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Properties
            </Link>
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-muted rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-muted rounded"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block px-4 py-2 hover:bg-muted rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block px-4 py-2 hover:bg-muted rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
```

### Footer Component

```typescript
// components/layout/footer.tsx
import Link from 'next/link';
import { Home, Mail, Phone, Facebook, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Home className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Escape Houses</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Find your perfect escape. Book unique properties across the UK.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties" className="text-muted-foreground hover:text-primary">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h3 className="font-semibold mb-4">For Property Owners</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/list-property" className="text-muted-foreground hover:text-primary">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link href="/owner/guide" className="text-muted-foreground hover:text-primary">
                  Owner's Guide
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-primary">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@escapehouses.co.uk</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+44 20 1234 5678</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Escape Houses. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-primary">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

---

## 📝 Form Components

### Multi-Step Form

```typescript
// components/forms/multi-step-form.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

interface MultiStepFormProps {
  steps: Step[];
  onComplete: (data: any) => void;
}

export function MultiStepForm({ steps, onComplete }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = (stepData: any) => {
    const newData = { ...formData, ...stepData };
    setFormData(newData);

    if (currentStep === steps.length - 1) {
      onComplete(newData);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Step {currentStep + 1} of {steps.length}</span>
          <span className="text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Step Header */}
      <div>
        <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
        <p className="text-muted-foreground">{steps[currentStep].description}</p>
      </div>

      {/* Step Content */}
      <CurrentStepComponent
        data={formData}
        onNext={handleNext}
        onBack={handleBack}
      />

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="flex gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentStep
                  ? 'bg-primary'
                  : index < currentStep
                  ? 'bg-primary/50'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Date Range Picker

```typescript
// components/forms/date-range-picker.tsx
'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { formatDateUK } from '@/lib/utils/date-formatter';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onDateChange: (start: Date | undefined, end: Date | undefined) => void;
  disabledDates?: Date[];
  minDate?: Date;
}

export function DateRangePicker({
  startDate,
  endDate,
  onDateChange,
  disabledDates = [],
  minDate = new Date(),
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isDateDisabled = (date: Date) => {
    if (date < minDate) return true;
    return disabledDates.some(
      disabledDate =>
        date.toDateString() === disabledDate.toDateString()
    );
  };

  return (
    <div className="grid gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !startDate && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate && endDate ? (
              <>
                {formatDateUK(startDate)} - {formatDateUK(endDate)}
              </>
            ) : (
              <span>Pick dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => {
                onDateChange(date, endDate);
                if (date && endDate && date > endDate) {
                  onDateChange(date, undefined);
                }
              }}
              disabled={isDateDisabled}
              initialFocus
            />
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => {
                if (startDate && date && date > startDate) {
                  onDateChange(startDate, date);
                  setIsOpen(false);
                }
              }}
              disabled={(date) => {
                if (!startDate) return true;
                return date <= startDate || isDateDisabled(date);
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
```

### Image Upload Component

```typescript
// components/forms/image-upload.tsx
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X, Upload, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
}

export function ImageUpload({
  value = [],
  onChange,
  maxFiles = 10,
  maxSize = 5,
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file size
    const validFiles = files.filter(file => {
      const sizeMB = file.size / 1024 / 1024;
      return sizeMB <= maxSize;
    });

    // Limit number of files
    const remainingSlots = maxFiles - value.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    // Create previews
    const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
    
    setPreviews([...previews, ...newPreviews]);
    onChange([...value, ...filesToAdd]);
  };

  const handleRemove = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    URL.revokeObjectURL(previews[index]);
    
    setPreviews(newPreviews);
    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
            <Image
              src={preview}
              alt={`Upload ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {value.length < maxFiles && (
          <button
            onClick={() => inputRef.current?.click()}
            className={cn(
              'aspect-square rounded-lg border-2 border-dashed',
              'flex flex-col items-center justify-center',
              'hover:border-primary hover:bg-primary/5 transition',
              'cursor-pointer'
            )}
          >
            <ImagePlus className="h-8 w-8 mb-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Add Image</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="text-xs text-muted-foreground">
        <p>Upload up to {maxFiles} images. Max {maxSize}MB per image.</p>
        <p>{value.length} of {maxFiles} images uploaded</p>
      </div>
    </div>
  );
}
```

---

## 🎯 Display Components

### Statistics Card

```typescript
// components/display/stats-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  trend = 'neutral',
  description,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <p className={cn(
            'text-xs mt-1',
            trend === 'up' && 'text-green-600',
            trend === 'down' && 'text-red-600',
            trend === 'neutral' && 'text-muted-foreground'
          )}>
            {change > 0 ? '+' : ''}{change}% from last month
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
```

### Timeline Component

```typescript
// components/display/timeline.tsx
import { formatDateTimeUK } from '@/lib/utils/date-formatter';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  const getIcon = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-4">
          {/* Icon Column */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 bg-background">
              {getIcon(event.status)}
            </div>
            {index < events.length - 1 && (
              <div className="w-0.5 h-full bg-border mt-2" />
            )}
          </div>

          {/* Content Column */}
          <div className="flex-1 pb-8">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">{event.title}</h4>
                {event.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {event.description}
                  </p>
                )}
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                {formatDateTimeUK(event.timestamp)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Rating Display

```typescript
// components/display/rating.tsx
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  max?: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  onChange?: (value: number) => void;
}

export function Rating({
  value,
  max = 5,
  showValue = true,
  size = 'md',
  readonly = true,
  onChange,
}: RatingProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: max }).map((_, index) => {
          const rating = index + 1;
          const isFilled = rating <= Math.round(value);
          const isPartial = rating > value && rating <= value + 0.5;

          return (
            <button
              key={index}
              onClick={() => handleClick(rating)}
              disabled={readonly}
              className={cn(
                'transition-colors',
                !readonly && 'cursor-pointer hover:scale-110'
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  isFilled && 'fill-yellow-400 text-yellow-400',
                  isPartial && 'fill-yellow-400/50 text-yellow-400',
                  !isFilled && !isPartial && 'text-muted-foreground'
                )}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
```

---

## 🔄 Interactive Components

### Confirmation Dialog

```typescript
// components/interactive/confirmation-dialog.tsx
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = 'Continue',
  cancelText = 'Cancel',
  variant = 'default',
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={variant === 'destructive' ? 'bg-destructive hover:bg-destructive/90' : ''}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

### Infinite Scroll List

```typescript
// components/interactive/infinite-scroll-list.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  loading: boolean;
}

export function InfiniteScrollList<T>({
  items,
  renderItem,
  loadMore,
  hasMore,
  loading,
}: InfiniteScrollListProps<T>) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, loadMore]);

  return (
    <div className="space-y-4">
      {items.map((item, index) => renderItem(item, index))}
      
      {hasMore && (
        <div ref={observerTarget} className="flex justify-center py-8">
          {loading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
        </div>
      )}
      
      {!hasMore && items.length > 0 && (
        <p className="text-center text-muted-foreground py-8">
          No more items to load
        </p>
      )}
    </div>
  );
}
```

### Tabs with Persistence

```typescript
// components/interactive/persistent-tabs.tsx
'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Tab {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface PersistentTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  storageKey?: string;
}

export function PersistentTabs({
  tabs,
  defaultTab,
  storageKey = 'active-tab',
}: PersistentTabsProps) {
  const [activeTab, setActiveTab] = useState(
    defaultTab || tabs[0]?.value || ''
  );

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem(storageKey);
    if (saved && tabs.some(tab => tab.value === saved)) {
      setActiveTab(saved);
    }
  }, [storageKey, tabs]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem(storageKey, value);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
```

---

## 📊 Data Components

### Data Table with Sorting

```typescript
// components/data/sortable-table.tsx
'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface SortableTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

type SortDirection = 'asc' | 'desc' | null;

export function SortableTable<T extends Record<string, any>>({
  data,
  columns,
}: SortableTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortKey(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey || !sortDirection) return 0;

    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getSortIcon = (key: keyof T) => {
    if (sortKey !== key) return <ArrowUpDown className="h-4 w-4" />;
    if (sortDirection === 'asc') return <ArrowUp className="h-4 w-4" />;
    return <ArrowDown className="h-4 w-4" />;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)}>
                {column.sortable ? (
                  <Button
                    variant="ghost"
                    onClick={() => handleSort(column.key)}
                    className="h-8 px-2"
                  >
                    {column.label}
                    {getSortIcon(column.key)}
                  </Button>
                ) : (
                  column.label
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={String(column.key)}>
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### Pagination Component

```typescript
// components/data/pagination.tsx
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      {showFirstLast && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          First
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getPageNumbers().map((page, index) =>
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2">
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(page as number)}
            className={cn(currentPage === page && 'pointer-events-none')}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {showFirstLast && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </Button>
      )}
    </div>
  );
}
```

---

## 🎯 Navigation Components

### Breadcrumb Navigation

```typescript
// components/navigation/breadcrumb.tsx
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

export function Breadcrumb({ items, showHome = true }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      {showHome && (
        <>
          <Link
            href="/"
            className="hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
        </>
      )}
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center space-x-2">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-foreground font-medium' : ''}>
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className="h-4 w-4" />}
          </div>
        );
      })}
    </nav>
  );
}
```

---

## 🛠️ Utility Components

### Copy to Clipboard Button

```typescript
// components/utility/copy-button.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function CopyButton({ text, variant = 'ghost', size = 'sm' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className="transition-all"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </>
      )}
    </Button>
  );
}
```

### Loading Skeleton

```typescript
// components/utility/skeleton-loader.tsx
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
    />
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}
```

---

**React Examples Version**: 1.0.0  
**Last Updated**: 12/12/2025  
**All dates formatted**: DD/MM/YYYY (UK Standard)
