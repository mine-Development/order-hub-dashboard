import { ChefHat, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBooking } from "@/context/BookingContext";

interface HeaderProps {
  onViewBookings: () => void;
  onHome: () => void;
}

const Header = ({ onViewBookings, onHome }: HeaderProps) => {
  const { bookings } = useBooking();
  const pendingCount = bookings.filter(b => b.status === "pending" || b.status === "confirmed").length;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <button onClick={onHome} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <ChefHat className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">FoodDash</span>
          <span className="hidden sm:inline text-xs text-muted-foreground">South Indian Catering</span>
        </button>
        <Button variant="outline" size="sm" onClick={onViewBookings} className="rounded-full">
          <CalendarDays className="mr-2 h-4 w-4" />
          My Bookings
          {pendingCount > 0 && (
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">{pendingCount}</Badge>
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
