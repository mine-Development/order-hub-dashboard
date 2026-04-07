export interface EventCategory {
  id: string;
  name: string;
  color: string;
  emoji: string;
  events: EventType[];
}

export interface EventType {
  id: string;
  name: string;
  description: string;
  image: string;
  minGuests: number;
  maxGuests: number;
  packages: Package[];
}

export interface Package {
  id: string;
  name: string;
  description: string;
  pricePerPlate: number;
  items: string[];
  isPopular?: boolean;
}

export interface Booking {
  id: string;
  eventCategoryId: string;
  eventTypeId: string;
  eventName: string;
  packageId: string;
  packageName: string;
  date: string;
  guestCount: number;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  venue: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'completed' | 'cancelled';
  createdAt: string;
  reviewed: boolean;
  review?: { rating: number; comment: string };
}
