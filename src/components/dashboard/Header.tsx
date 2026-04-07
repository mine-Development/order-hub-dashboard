import { ShoppingCart, UtensilsCrossed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/context/OrderContext";

const Header = () => {
  const { cart, setActiveTab } = useOrder();
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">FoodDash</span>
        </div>
        <Button variant="outline" size="sm" className="relative" onClick={() => setActiveTab("cart")}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Cart
          {itemCount > 0 && (
            <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-xs text-primary-foreground">
              {itemCount}
            </Badge>
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
