import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Booking } from "@/types/booking";

interface BookingContextType {
  bookings: Booking[];
  loading: boolean;
  addBooking: (booking: Omit<Booking, "id" | "status" | "createdAt" | "reviewed">) => Promise<Booking>;
  cancelBooking: (id: string) => Promise<void>;
  reviewBooking: (id: string, rating: number, comment: string) => Promise<void>;
  refreshBookings: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | null>(null);

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const mapRow = (row: any): Booking => ({
    id: row.id,
    eventCategoryId: row.event_category_id,
    eventTypeId: row.event_type_id,
    eventName: row.event_name,
    packageId: row.package_id,
    packageName: row.package_name,
    date: row.date,
    guestCount: row.guest_count,
    totalAmount: row.total_amount,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email || "",
    venue: row.venue,
    notes: row.notes || "",
    status: row.status,
    createdAt: row.created_at,
    reviewed: row.reviewed,
    review: row.review_rating ? { rating: row.review_rating, comment: row.review_comment || "" } : undefined,
  });

  const refreshBookings = useCallback(async () => {
    const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    if (data) setBookings(data.map(mapRow));
    setLoading(false);
  }, []);

  useEffect(() => { refreshBookings(); }, [refreshBookings]);

  const addBooking = useCallback(async (data: Omit<Booking, "id" | "status" | "createdAt" | "reviewed">) => {
    const { data: rows, error } = await supabase.from("bookings").insert({
      event_category_id: data.eventCategoryId,
      event_type_id: data.eventTypeId,
      event_name: data.eventName,
      package_id: data.packageId,
      package_name: data.packageName,
      date: data.date,
      guest_count: data.guestCount,
      total_amount: data.totalAmount,
      customer_name: data.customerName,
      customer_phone: data.customerPhone,
      customer_email: data.customerEmail || null,
      venue: data.venue,
      notes: data.notes || null,
    }).select().single();
    if (error) throw error;
    const booking = mapRow(rows);
    setBookings(prev => [booking, ...prev]);
    return booking;
  }, []);

  const cancelBooking = useCallback(async (id: string) => {
    await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" as const } : b));
  }, []);

  const reviewBooking = useCallback(async (id: string, rating: number, comment: string) => {
    await supabase.from("bookings").update({ reviewed: true, review_rating: rating, review_comment: comment }).eq("id", id);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, reviewed: true, review: { rating, comment } } : b));
  }, []);

  return (
    <BookingContext.Provider value={{ bookings, loading, addBooking, cancelBooking, reviewBooking, refreshBookings }}>
      {children}
    </BookingContext.Provider>
  );
};
