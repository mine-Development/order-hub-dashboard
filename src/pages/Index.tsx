import { useState, useRef } from "react";
import { BookingProvider } from "@/context/BookingContext";
import Header from "@/components/dashboard/Header";
import HeroSection from "@/components/landing/HeroSection";
import EventCategoryGrid from "@/components/landing/EventCategoryGrid";
import EventBooking from "@/components/booking/EventBooking";
import MyBookings from "@/components/booking/MyBookings";
import AboutPage from "@/components/pages/AboutPage";
import ContactPage from "@/components/pages/ContactPage";
import { eventCategories } from "@/data/events";

type View = "home" | "booking" | "my-bookings" | "about" | "contact";

const DashboardContent = () => {
  const [view, setView] = useState<View>("home");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const eventsRef = useRef<HTMLDivElement>(null);

  const handleSelectEvent = (categoryId: string, eventId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedEventId(eventId);
    setView("booking");
    window.scrollTo(0, 0);
  };

  const handleExplore = () => {
    eventsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const selectedCategory = eventCategories.find(c => c.id === selectedCategoryId);
  const selectedEvent = selectedCategory?.events.find(e => e.id === selectedEventId);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onViewBookings={() => setView("my-bookings")}
        onHome={() => setView("home")}
        onAbout={() => { setView("about"); window.scrollTo(0, 0); }}
        onContact={() => { setView("contact"); window.scrollTo(0, 0); }}
      />

      {view === "home" && (
        <>
          <HeroSection onExplore={handleExplore} />
          <div ref={eventsRef}>
            <EventCategoryGrid onSelectEvent={handleSelectEvent} />
          </div>
        </>
      )}

      {view === "booking" && selectedEvent && (
        <EventBooking
          event={selectedEvent}
          categoryId={selectedCategoryId}
          onBack={() => setView("home")}
          onBooked={() => setView("my-bookings")}
        />
      )}

      {view === "my-bookings" && <MyBookings />}

      {view === "about" && <AboutPage />}

      {view === "contact" && <ContactPage />}

      <footer className="border-t border-border bg-card py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 FoodDash South Indian Catering. All rights reserved.</p>
          <p className="mt-1">📞 +91 98765 43210 | 📧 info@fooddash.in</p>
        </div>
      </footer>
    </div>
  );
};

const Index = () => (
  <BookingProvider>
    <DashboardContent />
  </BookingProvider>
);

export default Index;
