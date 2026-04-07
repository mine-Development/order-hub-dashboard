import { Minus, Plus, Trash2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useOrder } from "@/context/OrderContext";

const CartSection = () => {
  const { cart, cartTotal, updateQuantity, removeFromCart, setActiveTab } = useOrder();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl">🛒</span>
        <h3 className="mt-4 font-display text-xl font-semibold text-foreground">Your cart is empty</h3>
        <p className="mt-1 text-sm text-muted-foreground">Add some delicious items from our menu</p>
        <Button className="mt-4" onClick={() => setActiveTab("menu")}>Browse Menu</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Your Cart</h2>
      <Card>
        <CardContent className="divide-y divide-border p-0">
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-4">
              <span className="text-3xl">{item.image}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{item.name}</p>
                <p className="text-sm text-primary font-medium">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center font-medium text-foreground">{item.quantity}</span>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <span className="w-16 text-right font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeFromCart(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span><span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Delivery Fee</span><span>$2.99</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Tax</span><span>${(cartTotal * 0.08).toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold text-foreground">
            <span>Total</span><span>${(cartTotal + 2.99 + cartTotal * 0.08).toFixed(2)}</span>
          </div>
          <Button className="w-full mt-2" size="lg" onClick={() => setActiveTab("payment")}>
            <CreditCard className="mr-2 h-4 w-4" /> Proceed to Payment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CartSection;
