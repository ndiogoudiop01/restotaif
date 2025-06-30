export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  image: string;
  inStock: boolean;
  rating: number;
  preparationTime: number; // en minutes
  createdAt: Date;
  updatedAt: Date;
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
  category: 'sauce' | 'extra' | 'side';
}

export interface MenuCategory {
  id: string;
  name: string;
  icon: string;
  displayOrder: number;
}

export interface MenuSearchFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
}