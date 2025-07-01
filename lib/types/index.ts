export interface MenuItem {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  basePrice: number;
  image: string;
  inStock: boolean;
  rating: number;
  preparationTime: number;
  category?: {
    id: string;
    name: string;
    icon: string;
  };
  variants: MenuVariant[];
  customizations: MenuCustomization[];
}

export interface MenuVariant {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  isDefault: boolean;
}

export interface MenuCustomization {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  isFree: boolean;
  category: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  icon: string;
  displayOrder: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  variant: MenuVariant;
  customizations: MenuCustomization[];
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';
  deliveryMode: 'delivery' | 'pickup' | 'taftaf';
  paymentMethod: 'orange_money' | 'wave' | 'card' | 'cash';
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress?: string;
  customerNotes?: string;
  //estimatedDeliveryTime?: Date;
  items: OrderItem[];
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItem: MenuItem;
  variant: MenuVariant;
  customizations: MenuCustomization[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'food' | 'discount' | 'delivery' | 'other';
  icon: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}