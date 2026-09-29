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
  Menu,
  PanelLeftClose,
  PanelLeft,
  LayoutDashboard,
  MessageCircle,
  Sparkles,
  Utensils,
  Settings,
  Key
} from 'lucide-react';
import { usePOS } from '../context/POSContext';

export type UserRole = 'user' | 'admin';
export type ActiveTab = 'overview' | 'pos' | 'analytics' | 'inventory' | 'history' | 'broadcast' | 'chat';

interface TopBarProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenMobileCart?: () => void;
  onOpenAddProduct?: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  onOpenWhatsAppLogin?: () => void;
  onOpenChatBotOrder?: () => void;
  onOpenWhatsAppGateway?: () => void;
  onOpenReadyMenuList?: () => void;
  onOpenSettings?: () => void;
  onOpenResellerModal?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  role,
  setRole,
  activeTab, 
  setActiveTab, 
  onOpenMobileCart,
  onOpenAddProduct,
  onToggleSidebar,
  isSidebarOpen = false,
  onOpenWhatsAppLogin,
  onOpenChatBotOrder,
  onOpenWhatsAppGateway,
  onOpenReadyMenuList,
  onOpenSettings,
  onOpenResellerModal
}) => {
  const { cartItemCount, isCloudSynced, customerUser, products, waGatewayConnected, waDraftOrders, resellers } = usePOS();

  const readyCount = products.filter(p => p.isAvailable).length;
  const pendingOrdersCount = waDraftOrders.filter(d => d.status === 'PENDING').length;

  const adminNavItems = [
    { key: 'overview' as ActiveTab, label: 'Overview', icon: LayoutDashboard },
    { key: 'pos' as ActiveTab, label: 'Kasir POS', icon: ShoppingCart },
    { key: 'analytics' as ActiveTab, label: 'Analisa & Laba', icon: BarChart3 },
    { key: 'inventory' as ActiveTab, label: 'Master Stok', icon: Package },
    { key: 'history' as ActiveTab, label: 'Riwayat Struk', icon: Receipt },
    { key: 'broadcast' as ActiveTab, label: 'Broadcast WA', icon: Share2 },
    { key: 'chat' as ActiveTab, label: 'Asisten AI', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8DFD3]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-3">
        
        {/* Zone 1: Interactive Brand Logo Toggle with Sidebar Indicator */}
        <div className="flex items-center gap-2">
          {onToggleSidebar ? (
            <button
              onClick={onToggleSidebar}
              className="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-white transition-all cursor-pointer group text-left focus:outline-none"
              title={isSidebarOpen ? 'Tutup Menu Samping' : 'Buka Menu Samping'}
            >
              <div className="relative w-10 h-10 rounded-2xl bg-[#3E6B48] flex items-center justify-center text-white font-serif-display font-bold text-lg shadow-xs group-hover:scale-105 transition-transform">
                <span>RK</span>
                <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-white ${
                  isSidebarOpen ? 'bg-[#2D251E] text-white' : 'bg-emerald-500 text-white animate-pulse'
                }`}>
                  {isSidebarOpen ? '✕' : '☰'}
                </span>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight text-[#2D251E] group-hover:text-[#3E6B48] transition-colors">
                    Rarumi Kitchen
                  </span>
                  <span className="text-[10px] text-[#8C7A6B] bg-[#F0EAE1] px-1.5 py-0.5 rounded-md font-mono">
                    {isSidebarOpen ? 'Tutup' : 'Menu'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#8C7A6B]">
                  <span className={`w-1.5 h-1.5 rounded-full ${isCloudSynced ? 'bg-emerald-600 animate-pulse' : 'bg-amber-500'}`}></span>
                  <span>{role === 'admin' ? 'Backoffice' : 'Katalog Menu'}</span>
                </div>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#3E6B48] flex items-center justify-center text-white font-serif-display font-bold text-lg shadow-xs">
                RK
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-[#2D251E] block">
                  Rarumi Kitchen
                </span>
                <span className="text-[11px] text-[#8C7A6B] block">
                  {role === 'admin' ? 'Backoffice' : 'Katalog Menu'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        {role === 'admin' ? (
          <nav className="hidden lg:flex items-center gap-1 bg-[#F0EAE1]/70 p-1 rounded-2xl border border-[#E0D5C7]">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-white text-[#2D251E] shadow-xs' 
                      : 'text-[#6E5D4F] hover:text-[#2D251E] hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#3E6B48]' : 'text-[#8C7A6B]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-2 text-xs font-semibold text-[#6E5D4F]">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E0D5C7] text-[#2D251E]">
              <Store className="w-3.5 h-3.5 text-[#3E6B48]" />
              <span>Menu Bebas Alergi & Organik</span>
            </span>

            {onOpenReadyMenuList && (
              <button
                onClick={onOpenReadyMenuList}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E0D5C7] text-[#2D251E] hover:border-[#3E6B48] hover:text-[#3E6B48] transition-colors cursor-pointer"
              >
                <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                <span>List Menu Ready ({readyCount})</span>
              </button>
            )}

            {onOpenChatBotOrder && (
              <button
                onClick={onOpenChatBotOrder}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E0D5C7] text-[#2D251E] hover:border-[#3E6B48] hover:text-[#3E6B48] transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Chatbot Order</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </button>
            )}
          </nav>
        )}

        {/* Zone 3: Role Switcher, WhatsApp Login & Quick Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Quick Access: List Menu Ready Button */}
          {onOpenReadyMenuList && (
            <button
              onClick={onOpenReadyMenuList}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="Buka Daftar Menu Yang Ready Hari Ini"
            >
              <Utensils className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden md:inline">Menu Ready</span>
              <span className="font-mono text-[10px] bg-emerald-200 text-emerald-900 px-1 rounded-full">
                {readyCount}
              </span>
            </button>
          )}

          {/* Quick Access: WhatsApp Gateway & Auto-Order Bot */}
          {onOpenWhatsAppGateway && (
            <button
              onClick={onOpenWhatsAppGateway}
              className="relative flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="WhatsApp Bot Listener & Auto-Order Responder"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Bot WA</span>
              <span className={`w-2 h-2 rounded-full ${waGatewayConnected ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`}></span>
              {pendingOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-mono text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-bounce">
                  {pendingOrdersCount}
                </span>
              )}
            </button>
          )}

          {/* User WhatsApp Login Chip / Button */}
          {onOpenWhatsAppLogin && (
            <button
              onClick={onOpenWhatsAppLogin}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                customerUser
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-50'
              }`}
              title={customerUser ? `Akun: ${customerUser.name} (${customerUser.phone})` : 'Masuk dengan Nomor WhatsApp'}
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden lg:inline">
                {customerUser ? customerUser.name.split(' ')[0] : 'Login WA'}
              </span>
              {customerUser && (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </button>
          )}

          {/* Admin specific: Mitra Reseller Quick Access */}
          {role === 'admin' && onOpenResellerModal && (
            <button
              onClick={onOpenResellerModal}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Kelola Mitra Reseller & Harga Grosir"
            >
              <Users className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden xl:inline">Reseller</span>
              <span className="font-mono text-[10px] bg-amber-200 text-amber-900 px-1 rounded-full">
                {resellers.length}
              </span>
            </button>
          )}

          {/* Settings & API Key Modal */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-white border border-[#E0D5C7] text-[#6E5D4F] hover:text-[#2D251E] hover:border-[#3E6B48] transition-all cursor-pointer shadow-2xs"
              title="Pengaturan Sistem & Input API Key"
            >
              <Settings className="w-4 h-4 text-[#8C7A6B]" />
            </button>
          )}

          {/* Admin specific: Quick + Tambah Data Button */}
          {role === 'admin' && onOpenAddProduct && (
            <button
              onClick={onOpenAddProduct}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3E6B48] hover:bg-[#34593C] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Tambah Data Menu Baru ke Master"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Data</span>
            </button>
          )}

          {/* ROLE SWITCHER TOGGLE BUTTON */}
          <div className="flex items-center p-0.5 bg-[#F0EAE1] rounded-xl border border-[#E0D5C7]">
            <button
              onClick={() => setRole('user')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                role === 'user'
                  ? 'bg-white text-[#2D251E] shadow-2xs'
                  : 'text-[#8C7A6B] hover:text-[#2D251E]'
              }`}
              title="Beralih ke Tampilan Pelanggan (User)"
            >
              <Users className="w-3.5 h-3.5 text-[#3E6B48]" />
              <span className="hidden sm:inline">User</span>
            </button>

            <button
              onClick={() => setRole('admin')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                role === 'admin'
                  ? 'bg-[#2D251E] text-white shadow-2xs'
                  : 'text-[#8C7A6B] hover:text-[#2D251E]'
              }`}
              title="Beralih ke Mode Admin / Kasir POS"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>

          {/* Cart Icon in User Mode on mobile */}
          {role === 'user' && (
            <button
              onClick={onOpenMobileCart}
              className="relative p-2 rounded-xl bg-[#2D251E] text-white shadow-xs cursor-pointer"
              aria-label="Keranjang"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar for Admin */}
      {role === 'admin' && (
        <div className="lg:hidden flex items-center justify-around border-t border-[#E8DFD3] bg-[#FAF8F5] px-2 py-1.5 overflow-x-auto">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors shrink-0 ${
                  isActive ? 'text-[#3E6B48] font-bold' : 'text-[#8C7A6B]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
