import { DietaryTag } from '../data/masterMenu';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  categoryKey: string;
  price: number;
  costPrice: number; // HPP (Harga Pokok Penjualan)
  stockQty: number; // Stored units
  minStock: number;
  isAvailable: boolean; // Ready vs Habis (❎)
  portion?: string;
  dietaryTags: DietaryTag[];
  notes?: string;
  brand?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  discount: number; // per item discount in IDR
  notes?: string;
}

export type PaymentMethod = 
  | 'TUNAI' 
  | 'QRIS' 
  | 'TRANSFER_BCA' 
  | 'TRANSFER_MANDIRI' 
  | 'KARTU_DEBIT'
  | 'PIUTANG';

export interface Transaction {
  id: string;
  invoiceNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee?: number;
  total: number;
  paymentMethod: PaymentMethod;
  cashGiven: number;
  changeDue: number;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  deliveryMethod?: string;
  orderNotes?: string;
  cashierName: string;
  status: 'COMPLETED' | 'REFUNDED';
}


export interface SalesAnalytics {
  totalRevenue: number;
  totalProfit: number;
  totalOrders: number;
  averageOrderValue: number;
  outOfStockCount: number;
  inStockCount: number;
  categorySales: { [categoryKey: string]: { name: string; total: number; qty: number } };
  topProducts: { name: string; qty: number; revenue: number }[];
  paymentBreakdown: { [method: string]: number };
}
