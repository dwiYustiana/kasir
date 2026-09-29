import React from 'react';
import { 
  ShoppingCart, 
  BarChart3, 
  Package, 
  Receipt, 
  Share2, 
  UserCheck,
  Bot,
  Plus,
  ShieldAlert,
  Store,
  Users
} from 'lucide-react';
import { usePOS } from '../context/POSContext';

export type ActiveTab = 'pos' | 'analytics' | 'inventory' | 'history' | 'broadcast' | 'chat';
export type UserRole = 'user' | 'admin';

interface TopBarProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenMobileCart?: () => void;
  onOpenAddProduct?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  role,
  setRole,
  activeTab, 
  setActiveTab, 
  onOpenMobileCart,
  onOpenAddProduct 
}) => {
  const { cartItemCount, cartTotal, cashierName } = usePOS();

  const adminNavItems = [
    { key: 'pos' as ActiveTab, label: 'Kasir POS', icon: ShoppingCart },
    { key: 'analytics' as ActiveTab, label: 'Analisa & Laba', icon: BarChart3 },
    { key: 'inventory' as ActiveTab, label: 'Master Stok', icon: Package },
    { key: 'history' as ActiveTab, label: 'Riwayat Struk', icon: Receipt },
    { key: 'broadcast' as ActiveTab, label: 'Broadcast WA', icon: Share2 },
    { key: 'chat' as ActiveTab, label: 'Asisten AI', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8DFD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Zone 1: Brand title & Role Indicator */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#2D251E] text-[#FAF8F5] flex items-center justify-center font-bold text-sm shadow-sm">
            {role === 'admin' ? 'KP' : 'RK'}
          </div>
          <div>
            <a 
              href="#home" 
              onClick={(e) => { 
                e.preventDefault(); 
                if (role === 'admin') setActiveTab('pos'); 
              }}
              className="text-base sm:text-lg font-bold tracking-tight text-[#2D251E] flex items-center gap-1.5"
            >
              <span>{role === 'admin' ? 'Kasir Pintar' : 'Rarumi Kitchen'}</span>
              <span className="hidden sm:inline font-normal text-xs text-[#8C7A6B]">
                {role === 'admin' ? '· Backoffice & POS' : '· Menu Sehat Organik'}
              </span>
            </a>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Different for User vs Admin) */}
        {role === 'admin' ? (
          <nav className="hidden md:flex items-center gap-1 bg-[#F0EAE1] p-1 rounded-xl">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#2D251E] shadow-xs font-semibold'
                      : 'text-[#6E5D4F] hover:text-[#2D251E] hover:bg-white/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#3E6B48]' : 'text-[#8C7A6B]'}`} />
                  <span>{item.label}</span>
                  {item.key === 'pos' && cartItemCount > 0 && (
                    <span className="bg-[#3E6B48] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-3 text-xs font-semibold text-[#6E5D4F]">
            <span className="text-[#3E6B48] flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <Store className="w-3.5 h-3.5 text-[#3E6B48]" />
              <span>Katalog Belanja Pelanggan</span>
            </span>
          </nav>
        )}

        {/* Zone 3: Role Switcher & Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Admin specific: Quick + Tambah Data Button */}
          {role === 'admin' && onOpenAddProduct && (
            <button
              onClick={onOpenAddProduct}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3E6B48] hover:bg-[#34593C] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Tambah Data Menu Baru ke Master"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tambah Data</span>
            </button>
          )}

          {/* ROLE SWITCHER TOGGLE BUTTON */}
          <div className="flex items-center p-0.5 bg-[#F0EAE1] rounded-xl border border-[#E0D5C7]">
            <button
              onClick={() => setRole('user')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                role === 'admin'
                  ? 'bg-[#2D251E] text-white shadow-2xs'
                  : 'text-[#8C7A6B] hover:text-[#2D251E]'
              }`}
              title="Beralih ke Mode Admin / Kasir POS"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Admin POS</span>
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
        <div className="md:hidden flex items-center justify-around border-t border-[#E8DFD3] bg-[#FAF8F5] px-2 py-1.5 overflow-x-auto">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
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
