import { ChefHat, Heart, Users, Award } from "lucide-react";

const AboutPage = () => {
  return (
    <section className="container py-16 max-w-4xl">
      <h1 className="font-display text-4xl font-bold text-foreground mb-6 text-center">About FoodDash</h1>
      <p className="text-lg text-muted-foreground text-center mb-12">
        Bringing authentic South Indian flavors to your most cherished celebrations since 2010.
      </p>

      <div className="grid sm:grid-cols-2 gap-8 mb-12">
        {[
          { icon: ChefHat, title: "Expert Chefs", desc: "Our team of experienced chefs specializes in traditional South Indian cuisine, ensuring every dish is prepared with authenticity and love." },
          { icon: Heart, title: "Made with Passion", desc: "Every meal is crafted with fresh ingredients sourced locally, following time-honored recipes passed down through generations." },
          { icon: Users, title: "5000+ Events Served", desc: "From intimate family gatherings to grand weddings with 10,000+ guests, we've catered events of every scale with excellence." },
          { icon: Award, title: "Quality Guaranteed", desc: "We maintain the highest standards of hygiene and taste, earning trust from families across Tamil Nadu and beyond." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-xl border border-border bg-card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <h2 className="font-display text-2xl font-bold text-foreground mb-4">Our Mission</h2>
        <p className="text-muted-foreground leading-relaxed">
          At FoodDash, we believe food is the heart of every celebration. Our mission is to make traditional South Indian catering accessible, reliable, and memorable for every occasion — be it a grand Kalyana Virundhu, a sacred Seemantham, or a vibrant Pongal Vizha. We bring the warmth of home-cooked meals to events of any scale.
        </p>
      </div>
    </section>
  );
};

export default AboutPage;
