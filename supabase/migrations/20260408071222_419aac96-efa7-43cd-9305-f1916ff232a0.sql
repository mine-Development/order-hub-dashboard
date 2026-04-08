
-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_category_id TEXT NOT NULL,
  event_type_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  package_id TEXT NOT NULL,
  package_name TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  guest_count INTEGER NOT NULL,
  total_amount NUMERIC NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  venue TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed BOOLEAN NOT NULL DEFAULT false,
  review_rating INTEGER,
  review_comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert bookings (public booking form)
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);

-- Allow anyone to read all bookings (for admin page, no auth for now)
CREATE POLICY "Anyone can view bookings" ON public.bookings FOR SELECT USING (true);

-- Allow anyone to update bookings (for status changes, reviews)
CREATE POLICY "Anyone can update bookings" ON public.bookings FOR UPDATE USING (true);

-- Allow anyone to insert contact messages
CREATE POLICY "Anyone can create contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Allow anyone to read contact messages (admin page)
CREATE POLICY "Anyone can view contact messages" ON public.contact_messages FOR SELECT USING (true);

-- Allow anyone to update contact messages (mark as read)
CREATE POLICY "Anyone can update contact messages" ON public.contact_messages FOR UPDATE USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
