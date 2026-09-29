import React, { useState } from 'react';
import { POSProvider, usePOS } from './context/POSContext';
import { TopBar, ActiveTab, UserRole } from './components/TopBar';
import { POSScreen } from './components/POSScreen';
import { CustomerScreen } from './components/CustomerScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { InventoryScreen } from './components/InventoryScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { BroadcastScreen } from './components/BroadcastScreen';
import { PaymentModal } from './components/PaymentModal';
import { ReceiptModal } from './components/ReceiptModal';
import { AddProductModal } from './components/AddProductModal';
import { GeminiChatbot } from './components/GeminiChatbot';
import { Transaction } from './types/pos';
import { Bot, Plus } from 'lucide-react';

function MainApp() {
  // Role: 'user' (Pelanggan) or 'admin' (Kasir Pintar Backoffice)
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('rarumi_app_role') as UserRole) || 'user';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('pos');
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [paymentInitialTab, setPaymentInitialTab] = useState<'pay' | 'summary'>('pay');
  const [receiptTx, setReceiptTx] = useState<Transaction | null>(null);
  const [mobileCartOpen, setMobileCartOpen] = useState<boolean>(false);
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState<boolean>(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false);

  const { activeTransaction, setActiveTransaction } = usePOS();

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('rarumi_app_role', newRole);
    if (newRole === 'admin') {
      setActiveTab('pos');
    }
  };

  const handleOpenCheckout = (initialTab: 'pay' | 'summary' = 'pay') => {
    setPaymentInitialTab(initialTab);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (tx: Transaction) => {
    setIsPaymentOpen(false);
    setReceiptTx(tx);
  };

  const handleOpenReceiptFromHistory = (tx: Transaction) => {
    setReceiptTx(tx);
  };

  const handleNewTransaction = () => {
    setReceiptTx(null);
    setActiveTab('pos');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D251E] flex flex-col font-sans pb-16 lg:pb-8">
      {/* 3-Zone Top Bar Contract with Role Switcher & Tambah Data */}
      <TopBar 
        role={role}
        setRole={handleRoleChange}
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onOpenMobileCart={() => setIsPaymentOpen(true)}
        onOpenAddProduct={() => setIsAddProductOpen(true)}
      />

      {/* Main Content View based on active Role */}
      <main className="flex-1">
        {role === 'user' ? (
          /* USER / CUSTOMER STOREFRONT MODE */
          <CustomerScreen onOpenAssistant={() => setIsFloatingChatOpen(true)} />
        ) : (
          /* ADMIN / KASIR POS MODE */
          <>
            {activeTab === 'pos' && (
              <POSScreen 
                onOpenCheckout={handleOpenCheckout}
                mobileCartOpen={mobileCartOpen}
                setMobileCartOpen={setMobileCartOpen}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsScreen />
            )}

            {activeTab === 'inventory' && (
              <InventoryScreen />
            )}

            {activeTab === 'history' && (
              <HistoryScreen onSelectReceipt={handleOpenReceiptFromHistory} />
            )}

            {activeTab === 'broadcast' && (
              <BroadcastScreen />
            )}

            {activeTab === 'chat' && (
              <div className="max-w-4xl mx-auto px-4">
                <GeminiChatbot />
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Assistant Trigger Button */}
      {!(role === 'admin' && activeTab === 'chat') && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-30">
          <button
            onClick={() => setIsFloatingChatOpen(!isFloatingChatOpen)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#3E6B48] text-white hover:bg-[#34593C] shadow-lg transition-all active:scale-95 cursor-pointer font-bold text-xs border border-white/20"
            title="Buka Asisten AI Rarumi"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">Tanya Ahli Gizi AI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
          </button>
        </div>
      )}

      {/* Floating Chatbot Popup Drawer */}
      {isFloatingChatOpen && !(role === 'admin' && activeTab === 'chat') && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-20 sm:right-6 z-40 sm:w-[440px] flex items-end sm:items-auto p-2 sm:p-0">
          <div className="w-full bg-white rounded-3xl shadow-2xl border border-[#E8DFD3] overflow-hidden">
            <GeminiChatbot isFloating={true} onClose={() => setIsFloatingChatOpen(false)} />
          </div>
        </div>
      )}

      {/* Payment Processing Modal (Android Kasir Pintar Style) */}
      <PaymentModal
        isOpen={isPaymentOpen}
        initialTab={paymentInitialTab}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
      />

      {/* Thermal Receipt Preview Modal */}
      <ReceiptModal
        transaction={receiptTx}
        onClose={() => setReceiptTx(null)}
        onNewTransaction={handleNewTransaction}
      />

      {/* Dedicated Tambah Data Menu Modal */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <POSProvider>
      <MainApp />
    </POSProvider>
  );
}
