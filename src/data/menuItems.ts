import { MenuItem } from "@/types/food";

export const menuItems: MenuItem[] = [
  { id: "1", name: "Classic Cheeseburger", description: "Juicy beef patty with cheddar, lettuce, tomato & secret sauce", price: 12.99, category: "Burgers", image: "🍔", rating: 4.8 },
  { id: "2", name: "Margherita Pizza", description: "Fresh mozzarella, basil & tomato sauce on thin crust", price: 14.99, category: "Pizza", image: "🍕", rating: 4.9 },
  { id: "3", name: "Salmon Sushi Roll", description: "Premium salmon with avocado, cucumber & spicy mayo", price: 16.99, category: "Sushi", image: "🍣", rating: 4.7 },
  { id: "4", name: "Caesar Salad", description: "Romaine, parmesan, croutons & house-made dressing", price: 9.99, category: "Salads", image: "🥗", rating: 4.5 },
  { id: "5", name: "Chicken Tacos", description: "Grilled chicken with fresh salsa, guac & lime crema", price: 11.99, category: "Mexican", image: "🌮", rating: 4.6 },
  { id: "6", name: "Pad Thai", description: "Rice noodles with shrimp, peanuts & tamarind sauce", price: 13.99, category: "Asian", image: "🍜", rating: 4.8 },
  { id: "7", name: "BBQ Ribs", description: "Slow-cooked pork ribs with smoky BBQ glaze & coleslaw", price: 19.99, category: "BBQ", image: "🍖", rating: 4.9 },
  { id: "8", name: "Pasta Carbonara", description: "Spaghetti with pancetta, egg, parmesan & black pepper", price: 13.49, category: "Pasta", image: "🍝", rating: 4.7 },
  { id: "9", name: "Veggie Wrap", description: "Grilled vegetables, hummus & feta in a spinach wrap", price: 10.49, category: "Healthy", image: "🌯", rating: 4.4 },
  { id: "10", name: "Chocolate Lava Cake", description: "Warm dark chocolate cake with molten center & ice cream", price: 8.99, category: "Desserts", image: "🍫", rating: 4.9 },
  { id: "11", name: "Iced Matcha Latte", description: "Premium matcha with oat milk over ice", price: 5.99, category: "Drinks", image: "🍵", rating: 4.6 },
  { id: "12", name: "Fish & Chips", description: "Beer-battered cod with crispy fries & tartar sauce", price: 14.49, category: "Seafood", image: "🐟", rating: 4.5 },
];

export const categories = [...new Set(menuItems.map(i => i.category))];
