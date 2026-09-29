import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  Product, 
  CartItem, 
  Transaction, 
  PaymentMethod, 
  SalesAnalytics, 
  CustomerProfile,
  WhatsAppIncomingMessage,
  WhatsAppDraftOrder,
  WhatsAppAutoReplyTrigger,
  Reseller
} from '../types/pos';
import { INITIAL_MENU_ITEMS, formatRupiah } from '../data/masterMenu';
import { generateReadyMenuListText } from '../utils/readyMenuList';
import { DEFAULT_AUTO_REPLY_TRIGGERS } from '../data/defaultAutoReplyTriggers';
import { INITIAL_RESELLERS } from '../data/resellerData';
import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  writeBatch 
} from 'firebase/firestore';
import { 
  subscribeToProducts, 
  seedProductsIfEmpty, 
  saveProductToFirestore, 
  updateProductStockInFirestore, 
  deleteProductFromFirestore,
  deductProductStocksInFirestore 
} from '../services/productService';

interface POSContextType {
  products: Product[];
  isLoadingProducts: boolean;
  cart: CartItem[];
  transactions: Transaction[];
  activeTransaction: Transaction | null;
  cashierName: string;
  setCashierName: (name: string) => void;
  isCloudSynced: boolean;
  // Customer WhatsApp Profile
  customerUser: CustomerProfile | null;
  loginWithWhatsApp: (profile: CustomerProfile) => void;
  logoutWhatsApp: () => void;
  // WhatsApp Bot Gateway & Listener
  waGatewayConnected: boolean;
  waGatewayPhone: string;
  waGatewayBotName: string;
  waIncomingMessages: WhatsAppIncomingMessage[];
  waDraftOrders: WhatsAppDraftOrder[];
  latestOrderAlert: WhatsAppDraftOrder | null;
  connectWAGateway: (phone: string, botName?: string) => void;
  disconnectWAGateway: () => void;
  sendSimulatedWAMessage: (fromPhone: string, fromName: string, text: string) => WhatsAppIncomingMessage;
  acceptDraftOrder: (draftOrderId: string) => void;
  rejectDraftOrder: (draftOrderId: string) => void;
  clearLatestOrderAlert: () => void;
  // Custom WhatsApp Auto-Reply Triggers Configuration
  autoReplyTriggers: WhatsAppAutoReplyTrigger[];
  addAutoReplyTrigger: (trigger: Omit<WhatsAppAutoReplyTrigger, 'id'>) => void;
  updateAutoReplyTrigger: (updated: WhatsAppAutoReplyTrigger) => void;
  deleteAutoReplyTrigger: (id: string) => void;
  toggleAutoReplyTrigger: (id: string) => void;
  resetAutoReplyTriggersToDefault: () => void;
  // Reseller Management & Pricing
  resellers: Reseller[];
  addReseller: (reseller: Omit<Reseller, 'id' | 'totalOrdersCount' | 'totalSpent' | 'joinedDate'>) => void;
  updateReseller: (updated: Reseller) => void;
  deleteReseller: (id: string) => void;
  selectedResellerForCart: Reseller | null;
  setSelectedResellerForCart: (reseller: Reseller | null) => void;
  isResellerMode: boolean;
  setIsResellerMode: (enabled: boolean) => void;
  // Cart Actions
  addToCart: (product: Product, quantity?: number, forceResellerPrice?: boolean) => void;
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
  PRODUCTS: 'kasir_pintar_products_v2',
  TRANSACTIONS: 'kasir_pintar_transactions_v2',
  CASHIER: 'kasir_pintar_cashier_v2',
};

// Seed initial realistic products from master menu
function seedProducts(): Product[] {
  return INITIAL_MENU_ITEMS.map((item, index) => {
    const sku = `RRM-${String(index + 1).padStart(3, '0')}`;
    const costPrice = Math.round((item.price * 0.62) / 500) * 500;
    const resellerPrice = Math.round((item.price * 0.82) / 500) * 500;
    const stockQty = item.isAvailable ? 12 + ((index * 3) % 15) : 0;

    return {
      id: item.id,
      sku,
      name: item.name,
      category: item.category,
      categoryKey: item.categoryKey,
      price: item.price,
      costPrice,
      resellerPrice,
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

function seedInitialTransactions(products: Product[]): Transaction[] {
  const sampleTx: Transaction[] = [];
  const now = new Date();

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
      changeDue: 0,
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

  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

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

  const [customerUser, setCustomerUser] = useState<CustomerProfile | null>(() => {
    try {
      const saved = localStorage.getItem('rarumi_customer_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const loginWithWhatsApp = (profile: CustomerProfile) => {
    setCustomerUser(profile);
    localStorage.setItem('rarumi_customer_user', JSON.stringify(profile));
    // Also save/update customer in Firestore
    try {
      const cleanPhone = profile.phone.replace(/\D/g, '');
      if (cleanPhone) {
        setDoc(doc(db, 'customers', cleanPhone), profile, { merge: true }).catch(err => {
          console.warn('Customer save to Firestore:', err);
        });
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const logoutWhatsApp = () => {
    setCustomerUser(null);
    localStorage.removeItem('rarumi_customer_user');
  };

  // WhatsApp Gateway Bot State & Auto-Responder
  const [waGatewayConnected, setWaGatewayConnected] = useState<boolean>(() => {
    return localStorage.getItem('rarumi_wa_gateway_connected') === 'true' || true; // Default connected for immediate usability
  });
  const [waGatewayPhone, setWaGatewayPhone] = useState<string>(() => {
    return localStorage.getItem('rarumi_wa_gateway_phone') || '6281298765432';
  });
  const [waGatewayBotName, setWaGatewayBotName] = useState<string>(() => {
    return localStorage.getItem('rarumi_wa_gateway_name') || 'Rarumi Kitchen Order Bot';
  });

  const [waIncomingMessages, setWaIncomingMessages] = useState<WhatsAppIncomingMessage[]>(() => {
    try {
      const saved = localStorage.getItem('rarumi_wa_incoming_msgs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'msg-sample-1',
        fromPhone: '081234567890',
        fromName: 'Ibu Ratna (Menteng)',
        text: 'Halo min, order Sourdough 2 sama Susu Almond 1',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        isOrderKeyword: true,
        isMenuKeyword: false,
        botReply: 'Halo Kak Ibu Ratna! Pesanan kata kunci "ORDER" telah diterima sistem. Total: Rp 230.000. Sedang disiapkan kasir!',
        draftOrderId: 'draft-sample-1',
      }
    ];
  });

  const [waDraftOrders, setWaDraftOrders] = useState<WhatsAppDraftOrder[]>(() => {
    try {
      const saved = localStorage.getItem('rarumi_wa_draft_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [latestOrderAlert, setLatestOrderAlert] = useState<WhatsAppDraftOrder | null>(null);

  // WhatsApp Auto-Reply Triggers State
  const [autoReplyTriggers, setAutoReplyTriggers] = useState<WhatsAppAutoReplyTrigger[]>(() => {
    try {
      const saved = localStorage.getItem('rarumi_wa_triggers');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_AUTO_REPLY_TRIGGERS;
  });

  useEffect(() => {
    localStorage.setItem('rarumi_wa_triggers', JSON.stringify(autoReplyTriggers));
  }, [autoReplyTriggers]);

  const addAutoReplyTrigger = (triggerData: Omit<WhatsAppAutoReplyTrigger, 'id'>) => {
    const newTrigger: WhatsAppAutoReplyTrigger = {
      ...triggerData,
      id: `trigger-${Date.now()}`,
    };
    setAutoReplyTriggers(prev => [...prev, newTrigger]);
  };

  const updateAutoReplyTrigger = (updated: WhatsAppAutoReplyTrigger) => {
    setAutoReplyTriggers(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const deleteAutoReplyTrigger = (id: string) => {
    setAutoReplyTriggers(prev => prev.filter(t => t.id !== id));
  };

  const toggleAutoReplyTrigger = (id: string) => {
    setAutoReplyTriggers(prev => prev.map(t => t.id === id ? { ...t, isEnabled: !t.isEnabled } : t));
  };

  const resetAutoReplyTriggersToDefault = () => {
    setAutoReplyTriggers(DEFAULT_AUTO_REPLY_TRIGGERS);
  };

  // Resellers State
  const [resellers, setResellers] = useState<Reseller[]>(() => {
    try {
      const saved = localStorage.getItem('rarumi_resellers');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_RESELLERS;
  });

  const [selectedResellerForCart, setSelectedResellerForCart] = useState<Reseller | null>(null);
  const [isResellerMode, setIsResellerMode] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('rarumi_resellers', JSON.stringify(resellers));
  }, [resellers]);

  const addReseller = (resellerData: Omit<Reseller, 'id' | 'totalOrdersCount' | 'totalSpent' | 'joinedDate'>) => {
    const newReseller: Reseller = {
      ...resellerData,
      id: `reseller-${Date.now()}`,
      totalOrdersCount: 0,
      totalSpent: 0,
      joinedDate: new Date().toISOString().slice(0, 10),
    };
    setResellers(prev => [newReseller, ...prev]);
  };

  const updateReseller = (updated: Reseller) => {
    setResellers(prev => prev.map(r => r.id === updated.id ? updated : r));
    if (selectedResellerForCart?.id === updated.id) {
      setSelectedResellerForCart(updated);
    }
  };

  const deleteReseller = (id: string) => {
    setResellers(prev => prev.filter(r => r.id !== id));
    if (selectedResellerForCart?.id === id) {
      setSelectedResellerForCart(null);
    }
  };

  useEffect(() => {
    localStorage.setItem('rarumi_wa_incoming_msgs', JSON.stringify(waIncomingMessages));
  }, [waIncomingMessages]);

  useEffect(() => {
    localStorage.setItem('rarumi_wa_draft_orders', JSON.stringify(waDraftOrders));
  }, [waDraftOrders]);

  const connectWAGateway = (phone: string, botName: string = 'Rarumi Kitchen Order Bot') => {
    setWaGatewayConnected(true);
    setWaGatewayPhone(phone);
    setWaGatewayBotName(botName);
    localStorage.setItem('rarumi_wa_gateway_connected', 'true');
    localStorage.setItem('rarumi_wa_gateway_phone', phone);
    localStorage.setItem('rarumi_wa_gateway_name', botName);
  };

  const disconnectWAGateway = () => {
    setWaGatewayConnected(false);
    localStorage.setItem('rarumi_wa_gateway_connected', 'false');
  };

  const clearLatestOrderAlert = () => {
    setLatestOrderAlert(null);
  };

  const sendSimulatedWAMessage = (fromPhone: string, fromName: string, text: string): WhatsAppIncomingMessage => {
    const textLower = text.toLowerCase().trim();
    let botReply = '';
    let draftOrderId: string | undefined = undefined;
    let isOrderKeyword = false;
    let isMenuKeyword = false;

    // Check custom configured auto-reply triggers
    const activeTriggers = autoReplyTriggers.filter(t => t.isEnabled);
    let matchedTrigger: WhatsAppAutoReplyTrigger | undefined = undefined;

    for (const trigger of activeTriggers) {
      const kw = trigger.keyword.toLowerCase().trim();
      let isMatch = false;

      if (trigger.matchType === 'exact') {
        isMatch = textLower === kw;
      } else if (trigger.matchType === 'startsWith') {
        isMatch = textLower.startsWith(kw);
      } else {
        isMatch = textLower.includes(kw);
      }

      if (isMatch) {
        matchedTrigger = trigger;
        break;
      }
    }

    if (matchedTrigger) {
      if (matchedTrigger.actionType === 'create_order') {
        isOrderKeyword = true;
        const orderItems: CartItem[] = [];
        let calculatedSubtotal = 0;

        products.forEach(p => {
          const pLower = p.name.toLowerCase();
          const keywords = pLower.split(' ').filter(w => w.length > 2);
          const matches = keywords.some(k => textLower.includes(k));
          if (matches && p.isAvailable) {
            let qty = 1;
            const matchNum = textLower.match(new RegExp(`(\\d+)\\s*(porsi|buah|box|biji|pcs)?\\s*(?:dari\\s*)?${keywords[0]}`, 'i'));
            if (matchNum && matchNum[1]) {
              qty = parseInt(matchNum[1], 10);
            } else if (textLower.includes(' 2 ') || textLower.includes('dua')) {
              qty = 2;
            } else if (textLower.includes(' 3 ') || textLower.includes('tiga')) {
              qty = 3;
            }
            orderItems.push({
              product: p,
              quantity: qty,
              discount: 0,
            });
            calculatedSubtotal += p.price * qty;
          }
        });

        // Default if item name wasn't explicitly matched
        if (orderItems.length === 0) {
          const defaultProd = products.find(p => p.isAvailable) || products[0];
          if (defaultProd) {
            orderItems.push({
              product: defaultProd,
              quantity: 1,
              discount: 0,
            });
            calculatedSubtotal = defaultProd.price;
          }
        }

        const newDraftId = `draft-${Date.now()}`;
        draftOrderId = newDraftId;

        const newDraft: WhatsAppDraftOrder = {
          id: newDraftId,
          messageId: `msg-${Date.now()}`,
          customerName: fromName || 'Pelanggan WhatsApp',
          customerPhone: fromPhone,
          originalText: text,
          createdAt: new Date().toISOString(),
          items: orderItems,
          subtotal: calculatedSubtotal,
          status: 'PENDING',
        };

        setWaDraftOrders(prev => [newDraft, ...prev]);
        setLatestOrderAlert(newDraft);

        const itemsDesc = orderItems.map(i => `${i.quantity}x ${i.product.name}`).join(', ');
        const tpl = matchedTrigger.responseTemplate || 'Halo Kak {name}! Pesanan Anda [{items}] dengan kata kunci ORDER berhasil dicatat di kasir. Total: {subtotal} 🙏✨';
        botReply = tpl
          .replace(/{name}/g, fromName || 'Kak')
          .replace(/{subtotal}/g, formatRupiah(calculatedSubtotal))
          .replace(/{items}/g, itemsDesc);

      } else if (matchedTrigger.actionType === 'reply_ready_menu') {
        isMenuKeyword = true;
        botReply = generateReadyMenuListText(products);
      } else {
        // reply_text
        botReply = matchedTrigger.responseTemplate.replace(/{name}/g, fromName || 'Kak');
      }
    } else {
      // Fallback if no specific trigger matched
      botReply = `Halo Kak ${fromName || 'Pelanggan'}! Terima kasih telah menghubungi Rarumi Kitchen.\n\n• Kirim *ORDER [nama menu]* untuk memesan.\n• Kirim *MENU* untuk melihat daftar menu ready hari ini.\n• Kirim *ONGKIR* untuk info tarif Paxel Cold Chain.`;
    }

    const newMsg: WhatsAppIncomingMessage = {
      id: `msg-${Date.now()}`,
      fromPhone,
      fromName: fromName || 'Pelanggan',
      text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      isOrderKeyword,
      isMenuKeyword,
      botReply,
      draftOrderId,
    };

    setWaIncomingMessages(prev => [newMsg, ...prev]);
    return newMsg;
  };

  const acceptDraftOrder = (draftOrderId: string) => {
    const draft = waDraftOrders.find(d => d.id === draftOrderId);
    if (!draft) return;

    draft.items.forEach(it => {
      addToCart(it.product, it.quantity);
    });

    setWaDraftOrders(prev => prev.map(d => d.id === draftOrderId ? { ...d, status: 'ACCEPTED' } : d));
    if (latestOrderAlert?.id === draftOrderId) {
      setLatestOrderAlert(null);
    }
  };

  const rejectDraftOrder = (draftOrderId: string) => {
    setWaDraftOrders(prev => prev.map(d => d.id === draftOrderId ? { ...d, status: 'REJECTED' } : d));
    if (latestOrderAlert?.id === draftOrderId) {
      setLatestOrderAlert(null);
    }
  };

  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);
  const isInitialProductLoad = useRef<boolean>(true);
  const isInitialTxLoad = useRef<boolean>(true);

  // Sync to local storage as fallback
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CASHIER, cashierName);
  }, [cashierName]);

  // Real-time Firestore Sync for Products using dedicated productService
  useEffect(() => {
    setIsLoadingProducts(true);

    const unsubscribe = subscribeToProducts(
      async (loadedProducts) => {
        if (loadedProducts.length === 0 && isInitialProductLoad.current) {
          isInitialProductLoad.current = false;
          // Seed to Firestore if collection is empty
          try {
            const seeded = await seedProductsIfEmpty(seedProducts());
            setProducts(seeded);
            setIsCloudSynced(true);
          } catch (seedErr) {
            console.warn('Seeding products error:', seedErr);
          } finally {
            setIsLoadingProducts(false);
          }
        } else {
          isInitialProductLoad.current = false;
          setProducts(loadedProducts);
          setIsCloudSynced(true);
          setIsLoadingProducts(false);
        }
      },
      (err) => {
        console.warn('Firestore products listener error:', err);
        setIsLoadingProducts(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Real-time Firestore Sync for Transactions
  useEffect(() => {
    const txCol = collection(db, 'transactions');
    const unsubscribe = onSnapshot(txCol, async (snapshot) => {
      if (snapshot.empty && isInitialTxLoad.current) {
        isInitialTxLoad.current = false;
        try {
          const initialTx = seedInitialTransactions(products);
          const batch = writeBatch(db);
          initialTx.forEach(tx => {
            const ref = doc(db, 'transactions', tx.id);
            batch.set(ref, tx);
          });
          await batch.commit();
        } catch (err) {
          console.warn('Initial tx batch seeding error:', err);
        }
      } else if (!snapshot.empty) {
        isInitialTxLoad.current = false;
        const loadedTx: Transaction[] = [];
        snapshot.forEach(docSnap => {
          loadedTx.push(docSnap.data() as Transaction);
        });
        loadedTx.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setTransactions(loadedTx);
      }
    }, (err) => {
      console.warn('Firestore transactions listener:', err.message);
    });

    return () => unsubscribe();
  }, []);

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1, forceResellerPrice?: boolean) => {
    const shouldUseReseller = forceResellerPrice !== undefined
      ? forceResellerPrice
      : (isResellerMode || !!selectedResellerForCart);

    const baseResellerPrice = product.resellerPrice || Math.round((product.price * 0.82) / 500) * 500;
    const appliedPrice = shouldUseReseller ? baseResellerPrice : product.price;

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, appliedPrice, isResellerPrice: shouldUseReseller }
            : item
        );
      }
      return [...prev, { product, quantity, discount: 0, appliedPrice, isResellerPrice: shouldUseReseller }];
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
    const unitPrice = item.appliedPrice !== undefined ? item.appliedPrice : item.product.price;
    const itemSubtotal = (unitPrice - item.discount) * item.quantity;
    return sum + itemSubtotal;
  }, 0);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Checkout transaction with Firestore sync & stock deduction
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
    const isResellerTx = isResellerMode || !!selectedResellerForCart;

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
      customerName: customerName || (selectedResellerForCart ? selectedResellerForCart.name : 'Pelanggan Walk-In'),
      customerPhone: customerPhone || (selectedResellerForCart ? selectedResellerForCart.phone : undefined),
      customerAddress,
      deliveryMethod,
      orderNotes,
      cashierName,
      status: 'COMPLETED',
      isResellerOrder: isResellerTx,
      resellerId: selectedResellerForCart?.id,
      resellerName: selectedResellerForCart ? `${selectedResellerForCart.name} (${selectedResellerForCart.storeName || selectedResellerForCart.city})` : undefined,
    };

    // If reseller order, update reseller stats
    if (selectedResellerForCart) {
      setResellers(prev => prev.map(r => {
        if (r.id === selectedResellerForCart.id) {
          return {
            ...r,
            totalOrdersCount: r.totalOrdersCount + 1,
            totalSpent: r.totalSpent + finalTotal,
          };
        }
        return r;
      }));
    }

    // Optimistic local update
    const purchased = cart.map(ci => ({ productId: ci.product.id, quantity: ci.quantity }));
    const updatedProducts = products.map(prod => {
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
    });

    setProducts(updatedProducts);
    setTransactions(prev => [newTx, ...prev]);
    setActiveTransaction(newTx);
    clearCart();

    // Persist transaction to Firestore
    try {
      setDoc(doc(db, 'transactions', newTx.id), newTx).catch(err => {
        console.warn('Error saving transaction to Firestore:', err);
      });

      // Deduct stock in Firestore using productService
      deductProductStocksInFirestore(products, purchased);
    } catch (e) {
      console.warn('Error syncing checkout to Firestore:', e);
    }

    return newTx;
  };

  const refundTransaction = (txId: string) => {
    let refundedTx: Transaction | null = null;
    const nextTxList = transactions.map(tx => {
      if (tx.id === txId && tx.status === 'COMPLETED') {
        refundedTx = { ...tx, status: 'REFUNDED' };
        return refundedTx;
      }
      return tx;
    });

    setTransactions(nextTxList);

    if (refundedTx) {
      setDoc(doc(db, 'transactions', txId), refundedTx).catch(err => console.warn(err));

      // Restore stock
      (refundedTx as Transaction).items.forEach(item => {
        const prod = products.find(p => p.id === item.product.id);
        if (prod) {
          const restored: Product = {
            ...prod,
            stockQty: prod.stockQty + item.quantity,
            isAvailable: true,
          };
          updateProduct(restored);
        }
      });
    }
  };

  // Inventory Management with Firestore Service
  const toggleProductStock = (productId: string) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;

    const nextAvailable = !target.isAvailable;
    const nextQty = nextAvailable ? (target.stockQty > 0 ? target.stockQty : 10) : 0;

    const updated: Product = {
      ...target,
      isAvailable: nextAvailable,
      stockQty: nextQty,
    };

    // Optimistic local update
    setProducts(prev => prev.map(p => (p.id === productId ? updated : p)));
    // Firestore persistence
    updateProductStockInFirestore(productId, nextAvailable, nextQty);
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    saveProductToFirestore(updated);
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
    saveProductToFirestore(fullProd);
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    deleteProductFromFirestore(productId);
  };

  const resetToDefaultCatalog = () => {
    const fresh = seedProducts();
    setProducts(fresh);
    const freshTx = seedInitialTransactions(fresh);
    setTransactions(freshTx);
    clearCart();

    try {
      const batch = writeBatch(db);
      fresh.forEach(p => {
        batch.set(doc(db, 'products', p.id), p);
      });
      freshTx.forEach(tx => {
        batch.set(doc(db, 'transactions', tx.id), tx);
      });
      batch.commit().catch(err => console.warn(err));
    } catch (e) {
      console.warn(e);
    }
  };

  // Analytics Computation
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
      paymentBreakdown[tx.paymentMethod] = (paymentBreakdown[tx.paymentMethod] || 0) + tx.total;

      tx.items.forEach(ci => {
        const itemRevenue = (ci.product.price - ci.discount) * ci.quantity;
        const itemCost = ci.product.costPrice * ci.quantity;
        totalProfit += itemRevenue - itemCost;

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

    const inStockCount = products.filter(p => p.isAvailable).length;
    const outOfStockCount = products.length - inStockCount;

    const topProducts = Object.values(productStats)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 10);

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      totalProfit,
      outOfStockCount,
      inStockCount,
      topProducts,
      categorySales,
      paymentBreakdown,
    };
  };

  const analytics = computeAnalytics();

  return (
    <POSContext.Provider
      value={{
        products,
        isLoadingProducts,
        cart,
        transactions,
        activeTransaction,
        cashierName,
        setCashierName,
        isCloudSynced,
        customerUser,
        loginWithWhatsApp,
        logoutWhatsApp,
        waGatewayConnected,
        waGatewayPhone,
        waGatewayBotName,
        waIncomingMessages,
        waDraftOrders,
        latestOrderAlert,
        connectWAGateway,
        disconnectWAGateway,
        sendSimulatedWAMessage,
        acceptDraftOrder,
        rejectDraftOrder,
        clearLatestOrderAlert,
        autoReplyTriggers,
        addAutoReplyTrigger,
        updateAutoReplyTrigger,
        deleteAutoReplyTrigger,
        toggleAutoReplyTrigger,
        resetAutoReplyTriggersToDefault,
        resellers,
        addReseller,
        updateReseller,
        deleteReseller,
        selectedResellerForCart,
        setSelectedResellerForCart,
        isResellerMode,
        setIsResellerMode,
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
