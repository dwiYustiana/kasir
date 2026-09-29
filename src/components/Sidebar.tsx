import React from 'react';
import { 
  ShoppingCart, 
  BarChart3, 
  Package, 
  Receipt, 
  Share2, 
  Bot, 
  Plus, 
  ShieldAlert, 
  Store, 
  Users, 
  Database,
  X,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  Info,
  LayoutDashboard,
  MessageCircle,
  Utensils,
  Radio,
  Settings,
  Key
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { ActiveTab, UserRole } from './TopBar';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddProduct?: () => void;
  onOpenCart?: () => void;
  onOpenAssistant?: () => void;
  onOpenWhatsAppLogin?: () => void;
  onOpenChatBotOrder?: () => void;
  onOpenWhatsAppGateway?: () => void;
  onOpenReadyMenuList?: () => void;
  onOpenSettings?: () => void;
  onOpenResellerModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onToggle,
  role,
  setRole,
  activeTab,
  setActiveTab,
  onOpenAddProduct,
  onOpenCart,
  onOpenAssistant,
  onOpenWhatsAppLogin,
  onOpenChatBotOrder,
  onOpenWhatsAppGateway,
  onOpenReadyMenuList,
  onOpenSettings,
  onOpenResellerModal,
}) => {
  const { products, cartItemCount, cashierName, isCloudSynced, customerUser, waGatewayConnected, waDraftOrders, resellers } = usePOS();

  const readyCount = products.filter(p => p.isAvailable).length;
  const pendingOrdersCount = waDraftOrders.filter(d => d.status === 'PENDING').length;

  const adminNavItems = [
    { key: 'overview' as ActiveTab, label: 'Overview Dashboard', icon: LayoutDashboard },
    { key: 'pos' as ActiveTab, label: 'Kasir POS', icon: ShoppingCart, badge: cartItemCount > 0 ? `${cartItemCount}` : undefined },
    { key: 'analytics' as ActiveTab, label: 'Analisa & Laba', icon: BarChart3 },
    { key: 'inventory' as ActiveTab, label: 'Master Stok', icon: Package, badge: `${products.length}` },
    { key: 'history' as ActiveTab, label: 'Riwayat Struk', icon: Receipt },
    { key: 'broadcast' as ActiveTab, label: 'Broadcast WhatsApp', icon: Share2 },
    { key: 'chat' as ActiveTab, label: 'Asisten AI Nutrisi', icon: Bot },
  ];

  return (
    <>
      {/* Backdrop for mobile & tablet */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Main Drawer / Sidebar on the LEFT */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#FAF8F5] border-r border-[#E8DFD3] shadow-2xl md:shadow-lg flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto">
          {/* Header Branding with Interactive Logo & Close Button */}
          <div className="p-4 border-b border-[#E8DFD3] flex items-center justify-between bg-white">
            <button
              onClick={onToggle}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
              title="Klik logo untuk tutup menu samping"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#3E6B48] flex items-center justify-center text-white font-serif-display font-bold text-lg shadow-xs group-hover:scale-105 transition-transform">
                RK
              </div>
              <div>
                <h2 className="font-bold text-sm tracking-tight text-[#2D251E] group-hover:text-[#3E6B48] transition-colors">
                  Rarumi Kitchen
                </h2>
                <p className="text-[10px] text-[#8C7A6B]">
                  POS Kasir & Menu Alergi
                </p>
              </div>
            </button>

            {/* Close Button with Exit Icon */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E0D5C7] flex items-center justify-center text-[#6E5D4F] hover:text-[#2D251E] hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
              title="Tutup Menu Samping (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Account / WhatsApp Login Status Card */}
          <div className="p-3 bg-[#F4EFEA] border-b border-[#E8DFD3]">
            {customerUser ? (
              <div className="bg-white p-3 rounded-2xl border border-emerald-200 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Akun WA Terhubung
                  </span>
                  {onOpenWhatsAppLogin && (
                    <button
                      onClick={onOpenWhatsAppLogin}
                      className="text-[10px] text-emerald-700 hover:underline font-semibold cursor-pointer"
                    >
                      Detail
                    </button>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#2D251E] line-clamp-1">{customerUser.name}</h4>
                  <p className="text-[11px] font-mono text-[#8C7A6B]">{customerUser.phone}</p>
                </div>
              </div>
            ) : (
              onOpenWhatsAppLogin && (
                <button
                  onClick={() => {
                    onOpenWhatsAppLogin();
                    onClose();
                  }}
                  className="w-full bg-white p-3 rounded-2xl border border-[#E0D5C7] hover:border-emerald-500 flex items-center justify-between text-left transition-all group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#2D251E]">Masuk WhatsApp</h4>
                      <p className="text-[10px] text-[#8C7A6B]">Pesan & sync otomatis</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8C7A6B] group-hover:text-emerald-600 transition-colors" />
                </button>
              )
            )}
          </div>

          {/* Quick Access: Chatbot Order & Ready Menu */}
          <div className="p-3 border-b border-[#E8DFD3] space-y-2">
            {onOpenChatBotOrder && (
              <button
                onClick={() => {
                  onOpenChatBotOrder();
                  onClose();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center justify-between shadow-xs transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Chatbot Order Cerdas</span>
                </div>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">
                  Ketik Bebas
                </span>
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              {onOpenReadyMenuList && (
                <button
                  onClick={() => {
                    onOpenReadyMenuList();
                    onClose();
                  }}
                  className="py-2 px-2.5 rounded-xl bg-white border border-[#E0D5C7] hover:bg-emerald-50 text-[#2D251E] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Utensils className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Menu Ready</span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1 rounded-full ml-auto">
                    {readyCount}
                  </span>
                </button>
              )}

              {onOpenWhatsAppGateway && (
                <button
                  onClick={() => {
                    onOpenWhatsAppGateway();
                    onClose();
                  }}
                  className="py-2 px-2.5 rounded-xl bg-white border border-[#E0D5C7] hover:bg-emerald-50 text-[#2D251E] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer relative"
                >
                  <Bot className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Bot WA</span>
                  <span className={`w-2 h-2 rounded-full ml-auto ${waGatewayConnected ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`}></span>
                  {pendingOrdersCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {pendingOrdersCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Quick Add Product Button (Admin Mode) */}
          {role === 'admin' && onOpenAddProduct && (
            <div className="px-3 pt-3">
              <button
                onClick={() => {
                  onOpenAddProduct();
                  onClose();
                }}
                className="w-full py-2 px-3 rounded-xl bg-[#3E6B48] hover:bg-[#34593C] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Menu Baru</span>
              </button>
            </div>
          )}

          {/* Dynamic Navigation Menu Items */}
          <div className="p-3 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A6B] mb-2 px-2">
              {role === 'admin' ? 'Menu Navigasi Backoffice' : 'Layanan Pelanggan'}
            </div>

            {role === 'admin' ? (
              <>
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        setActiveTab(item.key);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white text-[#2D251E] shadow-xs font-bold border border-[#E0D5C7]'
                          : 'text-[#6E5D4F] hover:bg-white/60 hover:text-[#2D251E]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#3E6B48]' : 'text-[#8C7A6B]'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-[#3E6B48] text-white' : 'bg-[#E8DFD3] text-[#6E5D4F]'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                {/* Dedicated Reseller Mitra Management in Navigation */}
                {onOpenResellerModal && (
                  <button
                    onClick={() => {
                      onOpenResellerModal();
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-amber-700" />
                      <span>Daftar Mitra Reseller</span>
                    </div>
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-mono">
                      {resellers.length} Mitra
                    </span>
                  </button>
                )}

                {/* Settings & API Key Input Modal */}
                {onOpenSettings && (
                  <button
                    onClick={() => {
                      onOpenSettings();
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-[#6E5D4F] hover:bg-white/60 hover:text-[#2D251E] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Settings className="w-4 h-4 text-[#8C7A6B]" />
                      <span>Pengaturan & Input API Key</span>
                    </div>
                    <Key className="w-3.5 h-3.5 text-amber-600" />
                  </button>
                )}
              </>
            ) : (
              <div className="space-y-1">
                <button
                  onClick={onClose}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold bg-white text-[#2D251E] shadow-xs border border-[#E0D5C7] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Store className="w-4 h-4 text-[#3E6B48]" />
                    <span>Katalog Menu Sehat</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    {products.length} Menu
                  </span>
                </button>

                {onOpenChatBotOrder && (
                  <button
                    onClick={() => {
                      onOpenChatBotOrder();
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Chatbot Order Cerdas</span>
                    </div>
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full font-bold">
                      Baru ✨
                    </span>
                  </button>
                )}

                {onOpenCart && (
                  <button
                    onClick={() => {
                      onOpenCart();
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-[#6E5D4F] hover:bg-white/60 hover:text-[#2D251E] cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShoppingCart className="w-4 h-4 text-[#8C7A6B]" />
                      <span>Keranjang Belanja</span>
                    </div>
                    {cartItemCount > 0 && (
                      <span className="text-[10px] bg-[#3E6B48] text-white px-2 py-0.5 rounded-full font-bold">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                )}

                {onOpenAssistant && (
                  <button
                    onClick={() => {
                      onOpenAssistant();
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-[#6E5D4F] hover:bg-white/60 hover:text-[#2D251E] cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bot className="w-4 h-4 text-[#3E6B48]" />
                      <span>Tanya Ahli Gizi AI</span>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                      Online
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Database and System Info */}
        <div className="p-3 border-t border-[#E8DFD3] bg-white space-y-2">
          {/* Cloud Database Status */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF8F5] border border-[#E8DFD3] text-[11px]">
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#3E6B48]" />
              <span className="text-[#6E5D4F]">Firestore Cloud</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${isCloudSynced ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
              <span className="font-semibold text-[#2D251E]">{isCloudSynced ? 'Live Sync' : 'Menghubungkan'}</span>
            </div>
          </div>

          {/* Cashier / Operator */}
          <div className="text-[10px] text-[#8C7A6B] flex items-center justify-between px-1">
            <span>Operator: <strong className="text-[#2D251E]">{cashierName}</strong></span>
            <span>v2.7 Pro</span>
          </div>
        </div>
      </aside>
    </>
  );
};
