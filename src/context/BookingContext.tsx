import React, { createContext, useContext, useState, useCallback } from "react";
import type { Booking } from "@/types/booking";

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, "id" | "status" | "createdAt" | "reviewed">) => Booking;
  cancelBooking: (id: string) => void;
  reviewBooking: (id: string, rating: number, comment: string) => void;
}

const BookingContext = createContext<BookingContextType | null>(null);

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const addBooking = useCallback((data: Omit<Booking, "id" | "status" | "createdAt" | "reviewed">) => {
    const booking: Booking = {
      ...data,
      id: `BK-${Date.now().toString(36).toUpperCase()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
      reviewed: false,
    };
    setBookings(prev => [booking, ...prev]);
    return booking;
  }, []);

  const cancelBooking = useCallback((id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" as const } : b));
  }, []);

  const reviewBooking = useCallback((id: string, rating: number, comment: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, reviewed: true, review: { rating, comment } } : b));
  }, []);

  return (
    <BookingContext.Provider value={{ bookings, addBooking, cancelBooking, reviewBooking }}>
      {children}
    </BookingContext.Provider>
  );
};
