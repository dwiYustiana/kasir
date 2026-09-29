import React, { useState } from 'react';
import { POSProvider, usePOS } from './context/POSContext';
import { TopBar, ActiveTab, UserRole } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { OverviewScreen } from './components/OverviewScreen';
import { POSScreen } from './components/POSScreen';
import { CustomerScreen } from './components/CustomerScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { InventoryScreen } from './components/InventoryScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { BroadcastScreen } from './components/BroadcastScreen';
import { PaymentModal } from './components/PaymentModal';
import { ReceiptModal } from './components/ReceiptModal';
import { AddProductModal } from './components/AddProductModal';
import { WhatsAppAuthModal } from './components/WhatsAppAuthModal';
import { ChatBotOrderModal } from './components/ChatBotOrderModal';
import { WhatsAppGatewayModal } from './components/WhatsAppGatewayModal';
import { ReadyMenuListModal } from './components/ReadyMenuListModal';
import { IncomingOrderBanner } from './components/IncomingOrderBanner';
import { GeminiChatbot } from './components/GeminiChatbot';
import { SettingsModal } from './components/SettingsModal';
import { ResellerManagementModal } from './components/ResellerManagementModal';
import { Transaction, Reseller } from './types/pos';
import { Bot, Plus, Sparkles, MessageCircle, Utensils, Settings, Users } from 'lucide-react';

function MainApp() {
  // Role: 'user' (Pelanggan) or 'admin' (Kasir Pintar Backoffice)
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('rarumi_app_role') as UserRole) || 'user';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [paymentInitialTab, setPaymentInitialTab] = useState<'pay' | 'summary'>('pay');
  const [receiptTx, setReceiptTx] = useState<Transaction | null>(null);
  const [mobileCartOpen, setMobileCartOpen] = useState<boolean>(false);
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState<boolean>(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false);
  const [isWhatsAppAuthOpen, setIsWhatsAppAuthOpen] = useState<boolean>(false);
  const [isChatBotOrderOpen, setIsChatBotOrderOpen] = useState<boolean>(false);
  const [isWAGatewayOpen, setIsWAGatewayOpen] = useState<boolean>(false);
  const [isReadyMenuOpen, setIsReadyMenuOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isResellerModalOpen, setIsResellerModalOpen] = useState<boolean>(false);

  const { activeTransaction, setActiveTransaction } = usePOS();

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('rarumi_app_role', newRole);
    if (newRole === 'admin') {
      setActiveTab('overview');
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

  const handleOpenPOSWithReseller = (reseller: Reseller) => {
    setActiveTab('pos');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D251E] flex flex-col font-sans pb-16 lg:pb-8">
      
      {/* Real-time Incoming WhatsApp Order Notification Alert */}
      <IncomingOrderBanner 
        onOpenGatewayModal={() => setIsWAGatewayOpen(true)}
        onOpenCart={() => setIsPaymentOpen(true)}
      />

      {/* Dynamic Collapsible Sidebar on the Left */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onToggle={() => setIsSidebarOpen(prev => !prev)}
        role={role}
        setRole={handleRoleChange}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddProduct={() => setIsAddProductOpen(true)}
        onOpenCart={() => setIsPaymentOpen(true)}
        onOpenAssistant={() => setIsFloatingChatOpen(true)}
        onOpenWhatsAppLogin={() => setIsWhatsAppAuthOpen(true)}
        onOpenChatBotOrder={() => setIsChatBotOrderOpen(true)}
        onOpenWhatsAppGateway={() => setIsWAGatewayOpen(true)}
        onOpenReadyMenuList={() => setIsReadyMenuOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenResellerModal={() => setIsResellerModalOpen(true)}
      />

      {/* 3-Zone Top Bar Contract with Interactive Logo to Toggle Sidebar */}
      <TopBar 
        role={role}
        setRole={handleRoleChange}
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onOpenMobileCart={() => setIsPaymentOpen(true)}
        onOpenAddProduct={() => setIsAddProductOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        isSidebarOpen={isSidebarOpen}
        onOpenWhatsAppLogin={() => setIsWhatsAppAuthOpen(true)}
        onOpenChatBotOrder={() => setIsChatBotOrderOpen(true)}
        onOpenWhatsAppGateway={() => setIsWAGatewayOpen(true)}
        onOpenReadyMenuList={() => setIsReadyMenuOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenResellerModal={() => setIsResellerModalOpen(true)}
      />

      {/* Main Content View with smooth margin transition if sidebar is open on large screens */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'xl:ml-72' : 'ml-0'}`}>
        {role === 'user' ? (
          /* USER / CUSTOMER STOREFRONT MODE */
          <CustomerScreen 
            onOpenAssistant={() => setIsFloatingChatOpen(true)}
            onOpenWhatsAppLogin={() => setIsWhatsAppAuthOpen(true)}
            onOpenChatBotOrder={() => setIsChatBotOrderOpen(true)}
          />
        ) : (
          /* ADMIN / KASIR POS MODE */
          <>
            {activeTab === 'overview' && (
              <OverviewScreen 
                onNavigateToPOS={() => setActiveTab('pos')}
                onNavigateToInventory={() => setActiveTab('inventory')}
                onNavigateToHistory={() => setActiveTab('history')}
                onOpenResellerModal={() => setIsResellerModalOpen(true)}
              />
            )}

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
              <InventoryScreen 
                onOpenResellerModal={() => setIsResellerModalOpen(true)}
              />
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

      {/* Floating Action Buttons */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-30 flex flex-col items-end gap-2.5">
        {/* Quick Menu Ready Button */}
        <button
          onClick={() => setIsReadyMenuOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-emerald-700 text-white hover:bg-emerald-800 shadow-xl transition-all active:scale-95 cursor-pointer font-bold text-xs border border-white/20"
          title="Lihat Daftar Menu Ready Hari Ini"
        >
          <Utensils className="w-4 h-4 text-emerald-200" />
          <span className="hidden sm:inline">Menu Ready</span>
        </button>

        {/* Chatbot Order Quick Button */}
        <button
          onClick={() => setIsChatBotOrderOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-xl transition-all active:scale-95 cursor-pointer font-bold text-xs border border-white/20"
          title="Buka Chatbot Pemesanan Cerdas"
        >
          <Sparkles className="w-4 h-4 text-amber-100 animate-spin" />
          <span>Chatbot Order Cerdas</span>
        </button>

        {/* Floating AI Nutrition Assistant button (if closed) */}
        {!isFloatingChatOpen && (
          <button
            onClick={() => setIsFloatingChatOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#2D251E] text-white hover:bg-black shadow-xl transition-all active:scale-95 cursor-pointer font-bold text-xs border border-[#4A3E33]"
            title="Tanya Ahli Gizi AI Rarumi Kitchen"
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>Asisten AI Nutrisi</span>
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
          </button>
        )}
      </div>

      {/* Floating Chatbot Popup Drawer */}
      {isFloatingChatOpen && !(role === 'admin' && activeTab === 'chat') && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-20 sm:right-6 z-40 sm:w-[440px] flex items-end sm:items-auto p-2 sm:p-0">
          <div className="w-full bg-white rounded-3xl shadow-2xl border border-[#E8DFD3] overflow-hidden">
            <GeminiChatbot isFloating={true} onClose={() => setIsFloatingChatOpen(false)} />
          </div>
        </div>
      )}

      {/* WhatsApp Gateway & Bot Auto-Responder Modal */}
      <WhatsAppGatewayModal
        isOpen={isWAGatewayOpen}
        onClose={() => setIsWAGatewayOpen(false)}
        onOpenCart={() => setIsPaymentOpen(true)}
      />

      {/* Ready Menu List Modal */}
      <ReadyMenuListModal
        isOpen={isReadyMenuOpen}
        onClose={() => setIsReadyMenuOpen(false)}
        onOpenCart={() => setIsPaymentOpen(true)}
      />

      {/* Chatbot Order Modal */}
      <ChatBotOrderModal
        isOpen={isChatBotOrderOpen}
        onClose={() => setIsChatBotOrderOpen(false)}
        onOpenCart={() => setIsPaymentOpen(true)}
        onOpenWhatsAppLogin={() => setIsWhatsAppAuthOpen(true)}
      />

      {/* WhatsApp Authentication Modal */}
      <WhatsAppAuthModal
        isOpen={isWhatsAppAuthOpen}
        onClose={() => setIsWhatsAppAuthOpen(false)}
      />

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

      {/* Settings & API Key Input Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Reseller Management & Wholesaler Partner Modal */}
      <ResellerManagementModal
        isOpen={isResellerModalOpen}
        onClose={() => setIsResellerModalOpen(false)}
        onOpenPOSWithReseller={handleOpenPOSWithReseller}
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
