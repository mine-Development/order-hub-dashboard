import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChefHat, CalendarDays, Users, Mail, Phone, MapPin, MessageSquare, RefreshCw, Eye } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import AdminLogin from "@/components/admin/AdminLogin";

interface BookingRow {
  id: string;
  event_name: string;
  package_name: string;
  date: string;
  guest_count: number;
  total_amount: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  venue: string;
  notes: string | null;
  status: string;
  created_at: string;
  reviewed: boolean;
  review_rating: number | null;
  review_comment: string | null;
}

interface ContactRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  preparing: "bg-orange-100 text-orange-800 border-orange-300",
  completed: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem("fooddash_admin") === "true");
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [bRes, cRes] = await Promise.all([
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
    ]);
    if (bRes.data) setBookings(bRes.data);
    if (cRes.data) setContacts(cRes.data);
    setLoading(false);
  };

  useEffect(() => { if (authenticated) fetchData(); }, [authenticated]);

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) { toast.error("Failed to update status"); return; }
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    toast.success(`Status updated to ${status}`);
  };

  const markAsRead = async (id: string) => {
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    setContacts(prev => prev.map(c => c.id === id ? { ...c, is_read: true } : c));
  };

  const pendingCount = bookings.filter(b => b.status === "pending").length;
  const unreadCount = contacts.filter(c => !c.is_read).length;
  const totalRevenue = bookings.filter(b => b.status !== "cancelled").reduce((s, b) => s + Number(b.total_amount), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <ChefHat className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">FoodDash Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`mr-1 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Link to="/">
              <Button variant="outline" size="sm">View Site</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Bookings</p>
              <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-2xl font-bold text-primary">₹{totalRevenue.toLocaleString("en-IN")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Unread Messages</p>
              <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings">
          <TabsList className="mb-4">
            <TabsTrigger value="bookings">
              <CalendarDays className="mr-1 h-4 w-4" /> Bookings {pendingCount > 0 && <Badge className="ml-1 h-5 px-1.5 text-xs">{pendingCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="contacts">
              <MessageSquare className="mr-1 h-4 w-4" /> Contacts {unreadCount > 0 && <Badge className="ml-1 h-5 px-1.5 text-xs">{unreadCount}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            {bookings.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-muted-foreground">No bookings yet</CardContent></Card>
            ) : (
              <Card>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Guests</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Venue</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map(b => (
                        <TableRow key={b.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{b.event_name}</p>
                              <p className="text-xs text-muted-foreground">{b.package_name}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{b.customer_name}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{b.customer_phone}</p>
                              {b.customer_email && <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{b.customer_email}</p>}
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {new Date(b.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1"><Users className="h-3 w-3" />{b.guest_count}</div>
                          </TableCell>
                          <TableCell className="font-semibold text-primary whitespace-nowrap">₹{Number(b.total_amount).toLocaleString("en-IN")}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-xs"><MapPin className="h-3 w-3" />{b.venue}</div>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColors[b.status] || ""}>{b.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Select value={b.status} onValueChange={(v) => updateStatus(b.id, v)}>
                              <SelectTrigger className="h-8 w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="preparing">Preparing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="contacts">
            {contacts.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-muted-foreground">No contact messages yet</CardContent></Card>
            ) : (
              <div className="space-y-3">
                {contacts.map(c => (
                  <Card key={c.id} className={c.is_read ? "opacity-70" : "border-primary/30"}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">{c.name}</p>
                            {!c.is_read && <Badge className="bg-primary text-primary-foreground text-xs">New</Badge>}
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{c.email}</span>
                            {c.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{c.phone}</span>}
                            <span>{new Date(c.created_at).toLocaleString("en-IN")}</span>
                          </div>
                          <p className="mt-2 text-sm text-foreground">{c.message}</p>
                        </div>
                        {!c.is_read && (
                          <Button variant="ghost" size="sm" onClick={() => markAsRead(c.id)}>
                            <Eye className="mr-1 h-4 w-4" /> Mark Read
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
