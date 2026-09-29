import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Transaction, PaymentMethod, SalesAnalytics } from '../types/pos';
import { INITIAL_MENU_ITEMS, CATEGORY_GROUPS, formatRupiah } from '../data/masterMenu';

interface POSContextType {
  products: Product[];
  cart: CartItem[];
  transactions: Transaction[];
  activeTransaction: Transaction | null;
  cashierName: string;
  setCashierName: (name: string) => void;
  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  updateCartItemNotes: (productId: string, notes: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  // Transaction
  checkout: (
    paymentMethod: PaymentMethod,
    cashGiven: number,
    customerName?: string,
    customerPhone?: string,
    discountAmount?: number,
    customerAddress?: string,
    deliveryMethod?: string,
    shippingFee?: number,
    orderNotes?: string
  ) => Transaction;

  setActiveTransaction: (tx: Transaction | null) => void;
  refundTransaction: (txId: string) => void;
  // Inventory Actions
  toggleProductStock: (productId: string) => void;
  updateProduct: (updated: Product) => void;
  addProduct: (product: Omit<Product, 'id' | 'sku'>) => void;
  deleteProduct: (productId: string) => void;
  resetToDefaultCatalog: () => void;
  // Analytics
  analytics: SalesAnalytics;
}

const STORAGE_KEYS = {
  PRODUCTS: 'kasir_pintar_products_v1',
  TRANSACTIONS: 'kasir_pintar_transactions_v1',
  CASHIER: 'kasir_pintar_cashier_v1',
};

// Seed initial realistic products from master menu
function seedProducts(): Product[] {
  return INITIAL_MENU_ITEMS.map((item, index) => {
    const sku = `RRM-${String(index + 1).padStart(3, '0')}`;
    // Estimate standard HPP (Cost of Goods Sold) ~62% for food & bakery
    const costPrice = Math.round((item.price * 0.62) / 500) * 500;
    // If not available (marked with ❎ in broadcast), stock is 0. Else realistic kitchen batch quantity.
    const stockQty = item.isAvailable ? 12 + ((index * 3) % 15) : 0;

    return {
      id: item.id,
      sku,
      name: item.name,
      category: item.category,
      categoryKey: item.categoryKey,
      price: item.price,
      costPrice,
      stockQty,
      minStock: 3,
      isAvailable: item.isAvailable,
      portion: item.portion,
      dietaryTags: item.dietaryTags,
      notes: item.notes,
      brand: item.brand,
    };
  });
}

// Seed realistic initial transactions for analytics
function seedInitialTransactions(products: Product[]): Transaction[] {
  const sampleTx: Transaction[] = [];
  const now = new Date();

  // Create 6 realistic recent transactions today
  const sampleOrders = [
    {
      items: [
        { prodId: 'st-1', qty: 2 },
        { prodId: 'mie-1', qty: 1 },
        { prodId: 'bv-1', qty: 2 },
      ],
      method: 'QRIS' as PaymentMethod,
      customer: 'Ibu Ratna (Menteng)',
      phone: '081234567890',
      hoursAgo: 5,
    },
    {
      items: [
        { prodId: 'ff-ef-1', qty: 2 },
        { prodId: 'ff-3', qty: 1 },
        { prodId: 'lk-5', qty: 1 },
      ],
      method: 'TRANSFER_BCA' as PaymentMethod,
      customer: 'Pak Hendra (Pondok Indah)',
      phone: '081987654321',
      hoursAgo: 4,
    },
    {
      items: [
        { prodId: 'bl-1', qty: 1 },
        { prodId: 'sc-5', qty: 1 },
        { prodId: 'bv-7', qty: 1 },
      ],
      method: 'TUNAI' as PaymentMethod,
      customer: 'dr. Sarah Sp.A',
      phone: '081399887766',
      hoursAgo: 3,
    },
    {
      items: [
        { prodId: 'ff-ef-3', qty: 1 },
        { prodId: 'ff-ef-7', qty: 2 },
        { prodId: 'sm-2', qty: 1 },
      ],
      method: 'QRIS' as PaymentMethod,
      customer: 'Mba Cindy (Kuningan)',
      phone: '085611223344',
      hoursAgo: 2,
    },
    {
      items: [
        { prodId: 'sp-sup-2', qty: 1 },
        { prodId: 'sp-sup-6', qty: 1 },
        { prodId: 'bv-2', qty: 1 },
      ],
      method: 'TRANSFER_MANDIRI' as PaymentMethod,
      customer: 'Pak Budi Hartono',
      phone: '081122334455',
      hoursAgo: 1,
    },
    {
      items: [
        { prodId: 'mie-2', qty: 1 },
        { prodId: 'sn-1', qty: 2 },
      ],
      method: 'TUNAI' as PaymentMethod,
      customer: 'Ibu Maya',
      phone: '08177665544',
      hoursAgo: 0.5,
    },
  ];

  sampleOrders.forEach((so, idx) => {
    const txItems: CartItem[] = [];
    let subtotal = 0;

    so.items.forEach(it => {
      const prod = products.find(p => p.id === it.prodId);
      if (prod) {
        txItems.push({
          product: prod,
          quantity: it.qty,
          discount: 0,
        });
        subtotal += prod.price * it.qty;
      }
    });

    const txTime = new Date(now.getTime() - so.hoursAgo * 60 * 60 * 1000);
    const dateStr = txTime.toISOString().slice(0, 10).replace(/-/g, '');
    const invoiceNumber = `INV-${dateStr}-${String(idx + 1).padStart(4, '0')}`;

    sampleTx.push({
      id: `tx-${idx + 1}`,
      invoiceNumber,
      createdAt: txTime.toISOString(),
      items: txItems,
      subtotal,
      discount: 0,
      total: subtotal,
      paymentMethod: so.method,
      cashGiven: so.method === 'TUNAI' ? Math.ceil(subtotal / 50000) * 50000 : subtotal,
      changeDue: so.method === 'TUNAI' ? Math.max(0, Math.ceil(subtotal / 50000) * 50000 - subtotal) : 0,
      customerName: so.customer,
      customerPhone: so.phone,
      cashierName: 'Kasir Utama',
      status: 'COMPLETED',
    });
  });

  return sampleTx;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return seedProducts();
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return seedInitialTransactions(seedProducts());
  });

  const [cashierName, setCashierName] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.CASHIER) || 'Kasir Utama';
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);

  // Sync products to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  // Sync transactions to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  // Sync cashier name
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CASHIER, cashierName);
  }, [cashierName]);

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, discount: 0 }];
    });
  };

  const updateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const updateCartItemNotes = (productId: string, notes: string) => {
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, notes } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => {
    const itemSubtotal = (item.product.price - item.discount) * item.quantity;
    return sum + itemSubtotal;
  }, 0);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Checkout transaction
  const checkout = (
    paymentMethod: PaymentMethod,
    cashGiven: number,
    customerName?: string,
    customerPhone?: string,
    discountAmount: number = 0,
    customerAddress?: string,
    deliveryMethod?: string,
    shippingFee: number = 0,
    orderNotes?: string
  ): Transaction => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const txCount = transactions.length + 1;
    const invoiceNumber = `INV-${dateStr}-${String(txCount).padStart(4, '0')}`;
    const finalTotal = Math.max(0, cartTotal - discountAmount + shippingFee);
    const changeDue = paymentMethod === 'TUNAI' ? Math.max(0, cashGiven - finalTotal) : 0;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      invoiceNumber,
      createdAt: now.toISOString(),
      items: [...cart],
      subtotal: cartTotal,
      discount: discountAmount,
      shippingFee,
      total: finalTotal,
      paymentMethod,
      cashGiven: paymentMethod === 'TUNAI' ? cashGiven : finalTotal,
      changeDue,
      customerName: customerName || 'Pelanggan Walk-In',
      customerPhone,
      customerAddress,
      deliveryMethod,
      orderNotes,
      cashierName,
      status: 'COMPLETED',
    };


    // Deduct stock
    setProducts(prev =>
      prev.map(prod => {
        const cartItem = cart.find(ci => ci.product.id === prod.id);
        if (cartItem) {
          const newQty = Math.max(0, prod.stockQty - cartItem.quantity);
          return {
            ...prod,
            stockQty: newQty,
            isAvailable: newQty > 0,
          };
        }
        return prod;
      })
    );

    setTransactions(prev => [newTx, ...prev]);
    setActiveTransaction(newTx);
    clearCart();
    return newTx;
  };

  const refundTransaction = (txId: string) => {
    setTransactions(prev =>
      prev.map(tx => {
        if (tx.id === txId && tx.status === 'COMPLETED') {
          // Restore stock
          tx.items.forEach(item => {
            setProducts(pList =>
              pList.map(p =>
                p.id === item.product.id
                  ? { ...p, stockQty: p.stockQty + item.quantity, isAvailable: true }
                  : p
              )
            );
          });
          return { ...tx, status: 'REFUNDED' };
        }
        return tx;
      })
    );
  };

  // Inventory Management
  const toggleProductStock = (productId: string) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const nextAvailable = !p.isAvailable;
          return {
            ...p,
            isAvailable: nextAvailable,
            stockQty: nextAvailable ? (p.stockQty > 0 ? p.stockQty : 10) : 0,
          };
        }
        return p;
      })
    );
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  };

  const addProduct = (newProd: Omit<Product, 'id' | 'sku'>) => {
    const id = `custom-${Date.now()}`;
    const sku = `RRM-${String(products.length + 1).padStart(3, '0')}`;
    const fullProd: Product = {
      ...newProd,
      id,
      sku,
    };
    setProducts(prev => [fullProd, ...prev]);
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const resetToDefaultCatalog = () => {
    const fresh = seedProducts();
    setProducts(fresh);
    setTransactions(seedInitialTransactions(fresh));
    clearCart();
  };

  // Analytics Computation (Kasir Pintar Android Analisa)
  const computeAnalytics = (): SalesAnalytics => {
    const completedTx = transactions.filter(t => t.status === 'COMPLETED');
    const totalRevenue = completedTx.reduce((sum, t) => sum + t.total, 0);
    const totalOrders = completedTx.length;
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    let totalProfit = 0;
    const categorySales: { [categoryKey: string]: { name: string; total: number; qty: number } } = {};
    const productStats: { [prodId: string]: { name: string; qty: number; revenue: number } } = {};
    const paymentBreakdown: { [method: string]: number } = {};

    completedTx.forEach(tx => {
      // Payment method
      paymentBreakdown[tx.paymentMethod] = (paymentBreakdown[tx.paymentMethod] || 0) + tx.total;

      tx.items.forEach(ci => {
        const itemRevenue = (ci.product.price - ci.discount) * ci.quantity;
        const itemCost = ci.product.costPrice * ci.quantity;
        totalProfit += itemRevenue - itemCost;

        // Category
        const cKey = ci.product.categoryKey || 'lainnya';
        if (!categorySales[cKey]) {
          categorySales[cKey] = {
            name: ci.product.category,
            total: 0,
            qty: 0,
          };
        }
        categorySales[cKey].total += itemRevenue;
        categorySales[cKey].qty += ci.quantity;

        // Product
        if (!productStats[ci.product.id]) {
          productStats[ci.product.id] = {
            name: ci.product.name,
            qty: 0,
            revenue: 0,
          };
        }
        productStats[ci.product.id].qty += ci.quantity;
        productStats[ci.product.id].revenue += itemRevenue;
      });
    });

    const topProducts = Object.values(productStats)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 8);

    const outOfStockCount = products.filter(p => !p.isAvailable).length;
    const inStockCount = products.filter(p => p.isAvailable).length;

    return {
      totalRevenue,
      totalProfit,
      totalOrders,
      averageOrderValue,
      outOfStockCount,
      inStockCount,
      categorySales,
      topProducts,
      paymentBreakdown,
    };
  };

  const analytics = computeAnalytics();

  return (
    <POSContext.Provider
      value={{
        products,
        cart,
        transactions,
        activeTransaction,
        cashierName,
        setCashierName,
        addToCart,
        updateCartQty,
        updateCartItemNotes,
        removeFromCart,
        clearCart,
        cartTotal,
        cartItemCount,
        checkout,
        setActiveTransaction,
        refundTransaction,
        toggleProductStock,
        updateProduct,
        addProduct,
        deleteProduct,
        resetToDefaultCatalog,
        analytics,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
