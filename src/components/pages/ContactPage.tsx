import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ContactPage = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      message: form.message,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
      return;
    }
    toast({ title: "Message Sent!", description: "We'll get back to you within 24 hours." });
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section className="container py-16 max-w-5xl">
      <h1 className="font-display text-4xl font-bold text-foreground mb-6 text-center">Contact Us</h1>
      <p className="text-lg text-muted-foreground text-center mb-12">
        Have questions? We'd love to hear from you. Reach out to us anytime!
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          {[
            { icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
            { icon: Mail, label: "Email", value: "info@fooddash.in", href: "mailto:info@fooddash.in" },
            { icon: MapPin, label: "Address", value: "123 Anna Salai, Chennai, Tamil Nadu 600002" },
            { icon: Clock, label: "Working Hours", value: "Mon - Sun: 8:00 AM - 10:00 PM" },
          ].map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-4 rounded-xl border border-border bg-card p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{label}</p>
                {href ? (
                  <a href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{value}</a>
                ) : (
                  <p className="text-sm text-muted-foreground">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">Send a Message</h2>
          <Input placeholder="Your Name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input type="email" placeholder="Email Address" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <Input type="tel" placeholder="Phone Number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          <Textarea placeholder="Your Message" required rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ContactPage;
