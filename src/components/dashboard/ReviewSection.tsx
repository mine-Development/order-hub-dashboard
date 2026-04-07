import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useOrder } from "@/context/OrderContext";
import { toast } from "sonner";

const ReviewSection = () => {
  const { orders, reviewOrder, setActiveTab } = useOrder();
  const unreviewed = orders.filter(o => !o.reviewed);
  const reviewed = orders.filter(o => o.reviewed);
  const [activeReview, setActiveReview] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (orderId: string) => {
    reviewOrder(orderId, rating, comment);
    toast.success("Review submitted! Thank you 🙏");
    setActiveReview(null);
    setRating(5);
    setComment("");
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl">⭐</span>
        <h3 className="mt-4 font-display text-xl font-semibold text-foreground">No orders to review</h3>
        <p className="mt-1 text-sm text-muted-foreground">Place an order first, then come back to review</p>
        <Button className="mt-4" onClick={() => setActiveTab("menu")}>Browse Menu</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Reviews</h2>

      {unreviewed.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" /> Pending Reviews ({unreviewed.length})
          </h3>
          {unreviewed.map(order => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-semibold text-foreground">{order.id}</span>
                    <p className="text-xs text-muted-foreground">{order.items.map(i => `${i.image} ${i.name}`).join(", ")}</p>
                  </div>
                  <span className="font-bold text-primary">${order.total.toFixed(2)}</span>
                </div>

                {activeReview === order.id ? (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <button key={s} onClick={() => setRating(s)} className="transition-transform hover:scale-110">
                          <Star className={`h-6 w-6 ${s <= rating ? "fill-warning text-warning" : "text-border"}`} />
                        </button>
                      ))}
                    </div>
                    <Textarea placeholder="Share your experience..." value={comment} onChange={e => setComment(e.target.value)} rows={3} />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSubmit(order.id)}>Submit Review</Button>
                      <Button size="sm" variant="outline" onClick={() => setActiveReview(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" className="mt-2" onClick={() => setActiveReview(order.id)}>
                    Write Review
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {reviewed.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Completed Reviews ({reviewed.length})</h3>
          {reviewed.map(order => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{order.id}</span>
                  <span className="text-sm text-muted-foreground">{"⭐".repeat(order.review!.rating)}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{order.review!.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
