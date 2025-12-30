"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, User, Minus, Plus } from "lucide-react";
import { formatDateUKLong } from "@/lib/date-utils";
import { format } from "date-fns";
import { toast } from "sonner";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  propertyTitle: string;
  priceFrom: number;
}

export default function BookingModal({
  open,
  onOpenChange,
  propertyId,
  propertyTitle,
  priceFrom,
}: BookingModalProps) {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBookNow = async () => {
    if (!checkInDate || !checkOutDate) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (guests < 1) {
      toast.error("Please select at least 1 guest");
      return;
    }

    if (!guestName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!guestEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!guestPhone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    setIsProcessing(true);

    try {
      // Create booking directly
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: parseInt(propertyId),
          checkInDate: format(checkInDate, "yyyy-MM-dd"),
          checkOutDate: format(checkOutDate, "yyyy-MM-dd"),
          numberOfGuests: guests,
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim(),
          guestPhone: guestPhone.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      // Show success message
      toast.success("Booking request submitted successfully!");
      
      // Close modal
      onOpenChange(false);
      
      // Redirect to confirmation page
      if (data.booking?.id) {
        setTimeout(() => {
          window.location.href = `/booking/success?id=${data.booking.id}`;
        }, 1000);
      }

    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process booking");
    } finally {
      setIsProcessing(false);
    }
  };

  const dateRangeDisplay =
    checkInDate && checkOutDate
      ? `${formatDateUKLong(checkInDate)} → ${formatDateUKLong(checkOutDate)}`
      : checkInDate
      ? `${formatDateUKLong(checkInDate)} → ?`
      : "Select dates";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl" style={{ fontFamily: "var(--font-display)" }}>
            Book {propertyTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Dates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-in / Check-out
            </label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal h-12"
                >
                  <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                  <span className={checkInDate ? "text-gray-900" : "text-gray-500"}>
                    {dateRangeDisplay}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-4 border-b flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">
                    {!checkInDate && "Select check-in date"}
                    {checkInDate && !checkOutDate && "Select check-out date"}
                    {checkInDate && checkOutDate && "Your dates"}
                  </p>
                  <button
                    onClick={() => {
                      setCheckInDate(undefined);
                      setCheckOutDate(undefined);
                    }}
                    className="text-sm text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors font-medium"
                    type="button"
                  >
                    Clear dates
                  </button>
                </div>
                <CalendarComponent
                  mode="range"
                  selected={
                    checkInDate && checkOutDate
                      ? { from: checkInDate, to: checkOutDate }
                      : checkInDate
                      ? { from: checkInDate, to: undefined }
                      : undefined
                  }
                  onSelect={(range) => {
                    if (!range) return;
                    
                    if ('from' in range && range.from) {
                      setCheckInDate(range.from);
                      
                      if (range.to) {
                        setCheckOutDate(range.to);
                        // Close when both dates selected
                        setTimeout(() => setDatePickerOpen(false), 300);
                      } else {
                        setCheckOutDate(undefined);
                      }
                    }
                  }}
                  numberOfMonths={2}
                  disabled={(date) => {
                    const today = new Date(new Date().setHours(0, 0, 0, 0));
                    return date < today;
                  }}
                  modifiersClassNames={{
                    range_start: "ge-date-start",
                    range_end: "ge-date-end",
                    range_middle: "ge-date-in-range",
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Guests
            </label>
            <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal h-12"
                >
                  <User className="mr-2 h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">
                    {guests} guest{guests !== 1 ? "s" : ""}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-6" align="start">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Guests</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-lg border-2 border-[var(--color-accent-sage)]"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">{guests}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-lg border-2 border-[var(--color-accent-sage)]"
                      onClick={() => setGuests(guests + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Guest Information */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900">Your Information</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <Input
                type="text"
                placeholder="John Smith"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                placeholder="john@example.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <Input
                type="tel"
                placeholder="+44 1234 567890"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Price Summary */}
          <div className="rounded-lg bg-[var(--color-bg-secondary)] p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[var(--color-neutral-dark)]">
                From £{priceFrom} per night
              </span>
            </div>
            {checkInDate && checkOutDate && (
              <div className="text-sm text-[var(--color-neutral-dark)]">
                {Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))}{" "}
                night{Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)) !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleBookNow}
              disabled={isProcessing || !checkInDate || !checkOutDate || !guestName.trim() || !guestEmail.trim() || !guestPhone.trim()}
              style={{
                background: "var(--color-accent-sage)",
                color: "white",
              }}
            >
              {isProcessing ? "Processing..." : "Book Now"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}





