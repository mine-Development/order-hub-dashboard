import { useState } from "react";
import { format } from "date-fns";
import { ArrowLeft, CalendarIcon, Users, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { EventType, Package } from "@/types/booking";
import { useBooking } from "@/context/BookingContext";
import { toast } from "sonner";

interface EventBookingProps {
  event: EventType;
  categoryId: string;
  onBack: () => void;
  onBooked: () => void;
}

const EventBooking = ({ event, categoryId, onBack, onBooked }: EventBookingProps) => {
  const { addBooking } = useBooking();
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [date, setDate] = useState<Date>();
  const [guestCount, setGuestCount] = useState(event.minGuests);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [venue, setVenue] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<"package" | "details">("package");

  const total = selectedPkg ? selectedPkg.pricePerPlate * guestCount : 0;

  const handleSubmit = () => {
    if (!selectedPkg || !date || !name || !phone || !venue) {
      toast.error("Please fill all required fields");
      return;
    }
    addBooking({
      eventCategoryId: categoryId,
      eventTypeId: event.id,
      eventName: event.name,
      packageId: selectedPkg.id,
      packageName: selectedPkg.name,
      date: date.toISOString(),
      guestCount,
      totalAmount: total,
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      venue,
      notes,
    });
    toast.success("Booking request submitted successfully!");
    onBooked();
  };

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
      </Button>

      <div className="mb-6">
        <div className="flex items-center gap-3">
          <span className="text-5xl">{event.image}</span>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">{event.name}</h2>
            <p className="text-sm text-muted-foreground">{event.description}</p>
          </div>
        </div>
      </div>

      {step === "package" && (
        <div className="space-y-6">
          <h3 className="font-display text-lg font-semibold">Choose a Package</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {event.packages.map(pkg => (
              <Card
                key={pkg.id}
                className={cn(
                  "cursor-pointer transition-all",
                  selectedPkg?.id === pkg.id
                    ? "border-primary ring-2 ring-primary/20 shadow-lg"
                    : "hover:shadow-md hover:border-primary/20"
                )}
                onClick={() => setSelectedPkg(pkg)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {pkg.isPopular && <Badge className="bg-secondary text-secondary-foreground">Popular</Badge>}
                      {selectedPkg?.id === pkg.id && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-3 text-2xl font-bold text-primary">₹{pkg.pricePerPlate}<span className="text-sm font-normal text-muted-foreground">/plate</span></div>
                  <div className="space-y-1">
                    {pkg.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="h-1 w-1 rounded-full bg-primary/60" />
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {selectedPkg && (
            <Button onClick={() => setStep("details")} className="rounded-full px-8">
              Continue to Details
            </Button>
          )}
        </div>
      )}

      {step === "details" && selectedPkg && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Event Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(d) => d < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Guests *</Label>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={guestCount}
                        onChange={e => setGuestCount(Math.max(event.minGuests, Math.min(event.maxGuests, Number(e.target.value))))}
                        min={event.minGuests}
                        max={event.maxGuests}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{event.minGuests} - {event.maxGuests} guests</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Venue / Location *</Label>
                  <Input value={venue} onChange={e => setVenue(e.target.value)} placeholder="Event venue address" />
                </div>
                <div className="space-y-2">
                  <Label>Special Instructions</Label>
                  <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any dietary requirements, preferences, etc." />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number *</Label>
                    <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email (Optional)</Label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-20 border-primary/20">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Event</span><span className="font-medium">{event.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Package</span><span className="font-medium">{selectedPkg.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Price/Plate</span><span>₹{selectedPkg.pricePerPlate}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Guests</span><span>{guestCount}</span></div>
                  {date && <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{format(date, "PP")}</span></div>}
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Estimated Total</span>
                    <span className="text-primary">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Final price may vary based on customizations</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep("package")} className="rounded-full">
                    Change Package
                  </Button>
                  <Button onClick={handleSubmit} className="flex-1 rounded-full">
                    Submit Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventBooking;
