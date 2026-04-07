import { Package, Clock, CheckCircle2, ChefHat, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/context/OrderContext";

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  pending: { icon: Clock, color: "bg-warning/10 text-warning", label: "Pending" },
  confirmed: { icon: CheckCircle2, color: "bg-primary/10 text-primary", label: "Confirmed" },
  preparing: { icon: ChefHat, color: "bg-primary/10 text-primary", label: "Preparing" },
  ready: { icon: Package, color: "bg-success/10 text-success", label: "Ready" },
  delivered: { icon: Truck, color: "bg-success/10 text-success", label: "Delivered" },
};

const OrdersSection = () => {
  const { orders, setActiveTab } = useOrder();

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl">📦</span>
        <h3 className="mt-4 font-display text-xl font-semibold text-foreground">No orders yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">Place your first order from our menu</p>
        <Button className="mt-4" onClick={() => setActiveTab("menu")}>Browse Menu</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Your Orders</h2>
      <div className="space-y-4">
        {orders.map(order => {
          const sc = statusConfig[order.status];
          const Icon = sc.icon;
          return (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <span className="font-display font-semibold text-foreground">{order.id}</span>
                    <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={sc.color}>
                      <Icon className="mr-1 h-3 w-3" /> {sc.label}
                    </Badge>
                    <span className="font-bold text-foreground">${order.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {order.items.map(item => (
                    <span key={item.id} className="text-sm text-muted-foreground">
                      {item.image} {item.name} × {item.quantity}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Paid via {order.paymentMethod}</p>
                {order.reviewed && order.review && (
                  <div className="mt-2 rounded-md bg-muted p-2 text-sm">
                    <span className="font-medium text-foreground">Your Review:</span>{" "}
                    {"⭐".repeat(order.review.rating)} — {order.review.comment}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersSection;
