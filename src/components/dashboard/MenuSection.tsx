import { useState } from "react";
import { Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { menuItems, categories } from "@/data/menuItems";
import { useOrder } from "@/context/OrderContext";
import { toast } from "sonner";

const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { addToCart } = useOrder();

  const filtered = activeCategory === "All" ? menuItems : menuItems.filter(i => i.category === activeCategory);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Our Menu</h2>
        <p className="text-sm text-muted-foreground">Choose from our delicious selection</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", ...categories].map(cat => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "secondary"}
            size="sm"
            onClick={() => setActiveCategory(cat)}
            className="rounded-full"
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(item => (
          <Card key={item.id} className="group overflow-hidden transition-all hover:shadow-lg">
            <CardContent className="p-4">
              <div className="mb-3 flex items-start justify-between">
                <span className="text-4xl">{item.image}</span>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  {item.rating}
                </Badge>
              </div>
              <h3 className="font-display font-semibold text-foreground">{item.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-primary">${item.price.toFixed(2)}</span>
                <Button
                  size="sm"
                  onClick={() => { addToCart(item); toast.success(`${item.name} added to cart`); }}
                  className="rounded-full"
                >
                  <Plus className="mr-1 h-4 w-4" /> Add
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenuSection;
