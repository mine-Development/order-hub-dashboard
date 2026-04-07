import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useBooking } from "@/context/BookingContext";
import { Star, CalendarDays, Users, MapPin, Package } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  preparing: "bg-accent/10 text-accent border-accent/20",
  completed: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const MyBookings = () => {
  const { bookings, cancelBooking, reviewBooking } = useBooking();
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleReview = (id: string) => {
    reviewBooking(id, rating, comment);
    setReviewingId(null);
    setComment("");
    setRating(5);
    toast.success("Thank you for your review!");
  };

  if (bookings.length === 0) {
    return (
      <div className="container py-12 text-center">
        <Package className="mx-auto h-16 w-16 text-muted-foreground/30" />
        <h3 className="mt-4 font-display text-xl font-semibold text-foreground">No bookings yet</h3>
        <p className="mt-2 text-muted-foreground">Your booking requests will appear here</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h2 className="mb-6 font-display text-2xl font-bold text-foreground">My Bookings</h2>
      <div className="space-y-4">
        {bookings.map(booking => (
          <Card key={booking.id}>
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{booking.eventName}</CardTitle>
                  <Badge className={statusColors[booking.status]}>{booking.status}</Badge>
                </div>
                <span className="text-sm text-muted-foreground">#{booking.id}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(booking.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {booking.guestCount} guests
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {booking.venue}
                </div>
                <div className="text-right font-bold text-primary">
                  ₹{booking.totalAmount.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Package: {booking.packageName} • Contact: {booking.customerName} ({booking.customerPhone})
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {booking.status === "pending" && (
                  <Button variant="destructive" size="sm" onClick={() => { cancelBooking(booking.id); toast.info("Booking cancelled"); }}>
                    Cancel Booking
                  </Button>
                )}
                {booking.status === "completed" && !booking.reviewed && (
                  <Button variant="outline" size="sm" onClick={() => setReviewingId(booking.id)}>
                    <Star className="mr-1 h-4 w-4" /> Write Review
                  </Button>
                )}
                {booking.reviewed && booking.review && (
                  <div className="flex items-center gap-1 text-sm">
                    {Array.from({ length: booking.review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                    <span className="ml-2 text-muted-foreground">{booking.review.comment}</span>
                  </div>
                )}
              </div>

              {reviewingId === booking.id && (
                <div className="mt-4 space-y-3 rounded-lg border p-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} onClick={() => setRating(s)}>
                        <Star className={`h-6 w-6 ${s <= rating ? "fill-warning text-warning" : "text-muted"}`} />
                      </button>
                    ))}
                  </div>
                  <Textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience..." />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleReview(booking.id)}>Submit Review</Button>
                    <Button size="sm" variant="ghost" onClick={() => setReviewingId(null)}>Cancel</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
