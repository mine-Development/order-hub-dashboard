import React, { createContext, useContext, useState, useCallback } from "react";
import { CartItem, MenuItem, Order } from "@/types/food";

interface OrderContextType {
  cart: CartItem[];
  orders: Order[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  placeOrder: (paymentMethod: string) => void;
  reviewOrder: (orderId: string, rating: number, comment: string) => void;
}

const OrderContext = createContext<OrderContextType | null>(null);

export const useOrder = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("menu");

  const addToCart = useCallback((item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) { setCart(prev => prev.filter(i => i.id !== id)); return; }
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const placeOrder = useCallback((paymentMethod: string) => {
    const order: Order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      items: [...cart],
      total: cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
      status: "confirmed",
      date: new Date().toISOString(),
      paymentMethod,
      reviewed: false,
    };
    setOrders(prev => [order, ...prev]);
    setCart([]);
    setActiveTab("orders");
  }, [cart]);

  const reviewOrder = useCallback((orderId: string, rating: number, comment: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, reviewed: true, review: { rating, comment } } : o));
  }, []);

  return (
    <OrderContext.Provider value={{ cart, orders, activeTab, setActiveTab, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, placeOrder, reviewOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
