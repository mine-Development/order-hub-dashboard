import { ChefHat, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onExplore: () => void;
}

const HeroSection = ({ onExplore }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-16 md:py-24">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-8xl">🪔</div>
        <div className="absolute top-20 right-20 text-7xl">🌺</div>
        <div className="absolute bottom-10 left-1/3 text-6xl">🍃</div>
        <div className="absolute bottom-20 right-10 text-8xl">🪷</div>
      </div>
      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <ChefHat className="h-4 w-4" />
            Authentic South Indian Catering
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Grand Feasts for Every{" "}
            <span className="text-primary">Occasion</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            From traditional Kalyana Virundhu to corporate events — we bring authentic 
            South Indian flavors to your celebrations with love and tradition.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" onClick={onExplore} className="rounded-full px-8 text-base">
              Explore Events
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 text-base">
              <Phone className="mr-2 h-4 w-4" /> Call Us
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Tamil Nadu & Beyond</span>
            <span>🍽️ 500+ Events Served</span>
            <span>⭐ 4.9 Rating</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
