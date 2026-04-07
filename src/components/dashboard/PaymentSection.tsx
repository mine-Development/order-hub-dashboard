import { useState } from "react";
import { CreditCard, Wallet, Banknote, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useOrder } from "@/context/OrderContext";
import { toast } from "sonner";

const paymentMethods = [
  { id: "card", label: "Credit Card", icon: CreditCard },
  { id: "wallet", label: "Digital Wallet", icon: Wallet },
  { id: "cash", label: "Cash on Delivery", icon: Banknote },
];

const PaymentSection = () => {
  const { cart, cartTotal, placeOrder, setActiveTab } = useOrder();
  const [method, setMethod] = useState("card");
  const [processing, setProcessing] = useState(false);

  const total = cartTotal + 2.99 + cartTotal * 0.08;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl">💳</span>
        <h3 className="mt-4 font-display text-xl font-semibold text-foreground">Nothing to pay for</h3>
        <p className="mt-1 text-sm text-muted-foreground">Add items to your cart first</p>
        <Button className="mt-4" onClick={() => setActiveTab("menu")}>Browse Menu</Button>
      </div>
    );
  }

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      placeOrder(paymentMethods.find(m => m.id === method)?.label || method);
      toast.success("Order placed successfully! 🎉");
      setProcessing(false);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Payment</h2>

      <Card>
        <CardHeader><CardTitle className="text-base">Select Payment Method</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          {paymentMethods.map(pm => (
            <button
              key={pm.id}
              onClick={() => setMethod(pm.id)}
              className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${method === pm.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
            >
              <pm.icon className={`h-5 w-5 ${method === pm.id ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`font-medium ${method === pm.id ? "text-foreground" : "text-muted-foreground"}`}>{pm.label}</span>
              {method === pm.id && <CheckCircle2 className="ml-auto h-5 w-5 text-primary" />}
            </button>
          ))}
        </CardContent>
      </Card>

      {method === "card" && (
        <Card>
          <CardHeader><CardTitle className="text-base">Card Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input id="cardName" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="4242 4242 4242 4242" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Items ({cart.reduce((s, i) => s + i.quantity, 0)})</span><span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Delivery + Tax</span><span>${(2.99 + cartTotal * 0.08).toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold text-foreground">
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full" size="lg" onClick={handlePay} disabled={processing}>
        {processing ? "Processing..." : `Pay $${total.toFixed(2)}`}
      </Button>
    </div>
  );
};

export default PaymentSection;
