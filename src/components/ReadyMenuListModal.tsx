import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Copy, 
  Check, 
  Send, 
  Printer, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  ShoppingCart, 
  Package, 
  Share2,
  FileText,
  Utensils
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { CATEGORY_GROUPS, formatRupiah, formatShortPrice } from '../data/masterMenu';
import { generateReadyMenuListText } from '../utils/readyMenuList';
import { Product } from '../types/pos';

interface ReadyMenuListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCart?: () => void;
}

export const ReadyMenuListModal: React.FC<ReadyMenuListModalProps> = ({
  isOpen,
  onClose,
  onOpenCart,
}) => {
  const { products, addToCart, cart } = usePOS();

  const [activeTab, setActiveTab] = useState<'catalog' | 'whatsapp_text'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Filter only ready products
  const readyProducts = useMemo(() => {
    return products.filter(p => p.isAvailable);
  }, [products]);

  // Filtered by category and search
  const filteredProducts = useMemo(() => {
    return readyProducts.filter(item => {
      if (selectedCategory !== 'all' && item.categoryKey !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.brand?.toLowerCase().includes(q) ||
          item.dietaryTags.some(t => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [readyProducts, selectedCategory, searchQuery]);

  const readyWhatsAppText = useMemo(() => {
    return generateReadyMenuListText(products);
  }, [products]);

  if (!isOpen) return null;

  const handleCopyText = () => {
    navigator.clipboard.writeText(readyWhatsAppText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsAppShare = () => {
    const encoded = encodeURIComponent(readyWhatsAppText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#E8DFD3] overflow-hidden my-4">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-b border-[#E8DFD3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#3E6B48] text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#2D251E]">
                  Daftar Menu Ready Hari Ini
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {readyProducts.length} Menu Tersedia
                </span>
              </div>
              <p className="text-xs text-[#8C7A6B]">
                Katalog menu aktif siap saji yang siap dikirim via Paxel Sameday / Instant
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#E0D5C7] flex items-center justify-center text-[#6E5D4F] hover:text-[#2D251E] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex border-b border-[#E8DFD3] bg-[#F4EFEA] px-4 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl font-bold transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-white text-[#2D251E] border-t border-x border-[#E8DFD3] shadow-xs'
                : 'text-[#6E5D4F] hover:text-[#2D251E]'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-[#3E6B48]" />
            <span>Katalog Menu Ready ({filteredProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp_text')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl font-bold transition-all cursor-pointer ${
              activeTab === 'whatsapp_text'
                ? 'bg-white text-[#2D251E] border-t border-x border-[#E8DFD3] shadow-xs'
                : 'text-[#6E5D4F] hover:text-[#2D251E]'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Format Teks Siap Kirim WhatsApp</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </button>
        </div>

        {/* TAB 1: Interactive Ready Menu Catalog */}
        {activeTab === 'catalog' && (
          <div className="p-4 sm:p-6 space-y-4 max-h-[520px] overflow-y-auto">
            
            {/* Search & Category Filter Row */}
            <div className="space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari menu ready, sourdough, cake, lauk, atau bumbu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E0D5C7] bg-[#FAF8F5] focus:bg-white focus:border-[#3E6B48] outline-none"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap cursor-pointer transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-[#3E6B48] text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-[#6E5D4F] border border-[#E8DFD3] hover:bg-white'
                  }`}
                >
                  Semua ({readyProducts.length})
                </button>
                {CATEGORY_GROUPS.map((cat) => {
                  const count = readyProducts.filter(p => p.categoryKey === cat.key).length;
                  if (count === 0) return null;

                  return (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap cursor-pointer transition-all ${
                        selectedCategory === cat.key
                          ? 'bg-[#3E6B48] text-white shadow-xs'
                          : 'bg-[#FAF8F5] text-[#6E5D4F] border border-[#E8DFD3] hover:bg-white'
                      }`}
                    >
                      <span>{cat.title}</span>
                      <span className="ml-1 opacity-75 font-mono text-[10px]">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="p-10 text-center bg-[#FAF8F5] rounded-2xl border border-[#E8DFD3] space-y-2">
                <Utensils className="w-8 h-8 text-[#C4B7A6] mx-auto" />
                <p className="text-xs font-semibold text-[#2D251E]">Tidak ada menu ready yang sesuai filter</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-3 py-1 bg-[#2D251E] text-white rounded-lg text-xs font-semibold"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProducts.map((product) => {
                  const inCartItem = cart.find(ci => ci.product.id === product.id);

                  return (
                    <div
                      key={product.id}
                      className="p-3.5 bg-white rounded-2xl border border-[#E8DFD3] hover:border-[#3E6B48]/50 hover:shadow-xs transition-all flex flex-col justify-between space-y-2.5"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-mono text-[#8C7A6B] font-semibold">{product.sku}</span>
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Stok: {product.stockQty}
                          </span>
                        </div>

                        <h4 className="font-bold text-xs sm:text-sm text-[#2D251E] leading-snug">
                          {product.name}
                        </h4>

                        <div className="flex flex-wrap items-center gap-1 text-[11px] text-[#8C7A6B] mt-1">
                          <span>{product.category}</span>
                          {product.portion && <span>· {product.portion}</span>}
                          {product.dietaryTags.length > 0 && (
                            <span className="text-[#3E6B48] font-bold">
                              · {product.dietaryTags.join('/')}
                            </span>
                          )}
                        </div>

                        {product.notes && (
                          <p className="text-[10px] text-[#9A8774] italic mt-1 line-clamp-1">
                            {product.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#F2ECE4]">
                        <div className="font-mono font-bold text-sm text-[#2D251E]">
                          {formatRupiah(product.price)}
                        </div>

                        <button
                          onClick={() => addToCart(product, 1)}
                          className="px-2.5 py-1 rounded-xl bg-[#3E6B48] hover:bg-[#34593C] text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                        >
                          {inCartItem ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-300" />
                              <span>({inCartItem.quantity})</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ Kasir</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WhatsApp Ready List Text Format */}
        {activeTab === 'whatsapp_text' && (
          <div className="p-4 sm:p-6 space-y-4 max-h-[520px] overflow-y-auto">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6E5D4F]">
                Format teks otomatis ter-update mengikuti stok live:
              </span>
              <span className="font-bold text-emerald-700">
                {readyProducts.length} Menu Ready Terangkum
              </span>
            </div>

            <div className="bg-[#ECE5DD] p-4 rounded-2xl border border-[#DFD8D0]">
              <div className="bg-white rounded-xl p-4 text-xs font-mono whitespace-pre-wrap text-[#111B21] leading-relaxed shadow-xs max-h-80 overflow-y-auto">
                {readyWhatsAppText}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={handleCopyText}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-[#E0D5C7] text-xs font-bold text-[#2D251E] hover:bg-[#FAF8F5] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Tersalin ke Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#3E6B48]" />
                    <span>Salin List Menu Ready</span>
                  </>
                )}
              </button>

              <button
                onClick={handleOpenWhatsAppShare}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Bagikan ke WhatsApp</span>
              </button>

              <button
                onClick={handlePrint}
                className="py-2.5 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F0EAE1] text-[#2D251E] border border-[#E0D5C7] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Cetak Daftar Menu Ready"
              >
                <Printer className="w-4 h-4 text-[#3E6B48]" />
                <span className="hidden sm:inline">Cetak</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Bottom Footer */}
        <div className="p-3.5 bg-[#FAF8F5] border-t border-[#E8DFD3] flex items-center justify-between text-xs">
          <div className="text-[#8C7A6B] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Ketik <strong>ORDER [menu]</strong> di WhatsApp untuk langsung memesan</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border border-[#E0D5C7] hover:bg-white text-[#6E5D4F] hover:text-[#2D251E] font-bold transition-colors cursor-pointer"
            >
              Tutup & Keluar
            </button>

            {onOpenCart && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCart();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#2D251E] hover:bg-black text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Buka Keranjang Kasir</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
