export enum KaratType {
  K24 = '24',
  K22 = '22',
  K21 = '21',
  K18 = '18',
  K14 = '14',
}

export interface GoldPrice {
  karat: KaratType;
  price: number; // Price per gram
  lastUpdated: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  karat: KaratType;
  weight: number; // in grams
  quantity: number;
  makingChargePerGram: number; // Masna'iya
  costPricePerGram?: number;
  description?: string;
  imageUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  totalPurchases: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  itemsSupplied: number;
}

export interface SupplyTransaction {
  id: string;
  supplierId: string;
  supplierName: string;
  productId: string;
  productName: string;
  quantity: number;
  totalCost: number;
  date: string;
}

export interface CartItem extends Product {
  salesPricePerGram: number; // Snapshot of price at time of sale
  totalPrice: number;
}

export interface Sale {
  id: string;
  customerId: string | null;
  customerName: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  date: string;
  paymentMethod: 'cash' | 'card' | 'transfer';
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'staff';
  name: string;
}

export interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalItems: number;
  lowStockCount: number;
}