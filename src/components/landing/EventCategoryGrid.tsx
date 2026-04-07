import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { eventCategories } from "@/data/events";

interface EventCategoryGridProps {
  onSelectEvent: (categoryId: string, eventId: string) => void;
}

const EventCategoryGrid = ({ onSelectEvent }: EventCategoryGridProps) => {
  return (
    <section id="events" className="container py-12">
      <div className="mb-8 text-center">
        <h2 className="font-display text-3xl font-bold text-foreground">Our Catering Services</h2>
        <p className="mt-2 text-muted-foreground">Choose your event type and we'll craft the perfect menu</p>
      </div>
      <div className="space-y-10">
        {eventCategories.map(category => (
          <div key={category.id}>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-xl">{category.emoji}</span>
              <h3 className="font-display text-xl font-bold text-foreground">{category.name}</h3>
              <Badge variant="secondary" className="ml-2">{category.events.length} events</Badge>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {category.events.map(event => (
                <Card
                  key={event.id}
                  className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/30"
                  onClick={() => onSelectEvent(category.id, event.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <span className="text-4xl">{event.image}</span>
                      <Badge variant="outline" className="text-xs">
                        {event.minGuests}-{event.maxGuests} guests
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{event.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary">
                        From ₹{Math.min(...event.packages.map(p => p.pricePerPlate))}/plate
                      </span>
                      <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                        View Packages →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EventCategoryGrid;
