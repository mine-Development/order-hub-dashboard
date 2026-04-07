import { UtensilsCrossed, CreditCard, Package, Star } from "lucide-react";
import { OrderProvider, useOrder } from "@/context/OrderContext";
import Header from "@/components/dashboard/Header";
import MenuSection from "@/components/dashboard/MenuSection";
import PaymentSection from "@/components/dashboard/PaymentSection";
import OrdersSection from "@/components/dashboard/OrdersSection";
import ReviewSection from "@/components/dashboard/ReviewSection";

const tabs = [
  { id: "menu", label: "Menu", icon: UtensilsCrossed },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "orders", label: "Orders", icon: Package },
  { id: "reviews", label: "Reviews", icon: Star },
];

const DashboardContent = () => {
  const { activeTab, setActiveTab } = useOrder();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-6">
        <nav className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-card p-1 shadow-sm border border-border">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {activeTab === "menu" && <MenuSection />}
        {activeTab === "payment" && <PaymentSection />}
        {activeTab === "orders" && <OrdersSection />}
        {activeTab === "reviews" && <ReviewSection />}
      </div>
    </div>
  );
};

const Index = () => (
  <OrderProvider>
    <DashboardContent />
  </OrderProvider>
);

export default Index;
