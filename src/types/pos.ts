import { DietaryTag } from '../data/masterMenu';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  categoryKey: string;
  price: number;
  costPrice: number; // HPP (Harga Pokok Penjualan)
  resellerPrice?: number; // Harga Khusus Reseller
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
  isResellerPrice?: boolean;
  appliedPrice?: number;
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
  isResellerOrder?: boolean;
  resellerId?: string;
  resellerName?: string;
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

export interface CustomerProfile {
  name: string;
  phone: string;
  address?: string;
  notes?: string;
  loggedInAt: string;
}

export interface WhatsAppIncomingMessage {
  id: string;
  fromPhone: string;
  fromName: string;
  text: string;
  timestamp: string;
  isOrderKeyword: boolean;
  isMenuKeyword: boolean;
  botReply?: string;
  draftOrderId?: string;
}

export interface WhatsAppDraftOrder {
  id: string;
  messageId: string;
  customerName: string;
  customerPhone: string;
  originalText: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface WhatsAppAutoReplyTrigger {
  id: string;
  keyword: string;
  matchType: 'contains' | 'exact' | 'startsWith';
  actionType: 'reply_text' | 'reply_ready_menu' | 'create_order';
  responseTemplate: string;
  isEnabled: boolean;
  description?: string;
}

export interface Reseller {
  id: string;
  name: string;
  storeName?: string;
  phone: string;
  city: string;
  tier: 'SILVER' | 'GOLD' | 'PLATINUM';
  discountPercent?: number;
  totalOrdersCount: number;
  totalSpent: number;
  joinedDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  notes?: string;
}


