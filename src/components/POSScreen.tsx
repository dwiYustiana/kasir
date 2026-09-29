import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Tag, 
  Utensils, 
  CreditCard,
  Percent,
  FileText,
  MessageSquare,
  Send
} from 'lucide-react';

import { usePOS } from '../context/POSContext';
import { CATEGORY_GROUPS, formatRupiah, formatShortPrice } from '../data/masterMenu';
import { Product } from '../types/pos';

interface POSScreenProps {
  onOpenCheckout: (initialTab?: 'pay' | 'summary') => void;
  mobileCartOpen: boolean;
  setMobileCartOpen: (open: boolean) => void;
}

export const POSScreen: React.FC<POSScreenProps> = ({ 
  onOpenCheckout,
  mobileCartOpen,
  setMobileCartOpen
}) => {

  const { 
    products, 
    cart, 
    addToCart, 
    updateCartQty, 
    updateCartItemNotes,
    removeFromCart, 
    clearCart,
    cartTotal, 
    cartItemCount,
    toggleProductStock
  } = usePOS();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<'all' | 'ready' | 'out'>('all');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState<string>('');

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category match
      if (selectedCategory !== 'all' && item.categoryKey !== selectedCategory) {
        return false;
      }
      // Stock status match
      if (stockFilter === 'ready' && !item.isAvailable) return false;
      if (stockFilter === 'out' && item.isAvailable) return false;

      // Dietary match
      if (dietaryFilter !== 'all' && !item.dietaryTags.includes(dietaryFilter as any)) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesSku = item.sku.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesBrand = item.brand?.toLowerCase().includes(query);
        return matchesName || matchesSku || matchesCategory || matchesBrand;
      }

      return true;
    });
  }, [products, selectedCategory, stockFilter, dietaryFilter, searchQuery]);

  // Count available vs out of stock
  const readyCount = products.filter(p => p.isAvailable).length;
  const outCount = products.filter(p => !p.isAvailable).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Catalog & Controls (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Search & Quick Filters Bar */}
          <div className="bg-white rounded-2xl p-4 border border-[#E8DFD3] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A6B]" />
                <input
                  type="text"
                  placeholder="Cari menu, SKU (RRM-001), atau kategori..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-[#FAF8F5] border border-[#E0D5C7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3E6B48] focus:border-transparent text-[#2D251E] placeholder:text-[#A39281]"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C7A6B] hover:text-[#2D251E]"
                  >
                    Hapus
                  </button>
                )}
              </div>

              {/* Stock Filter (Interactive Segmented Control) */}
              <div className="flex items-center gap-1 bg-[#F4EFEA] p-1 rounded-xl shrink-0 self-start sm:self-auto text-xs">
                <button
                  onClick={() => setStockFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    stockFilter === 'all'
                      ? 'bg-white text-[#2D251E] shadow-xs font-semibold'
                      : 'text-[#6E5D4F] hover:text-[#2D251E]'
                  }`}
                >
                  Semua ({products.length})
                </button>
                <button
                  onClick={() => setStockFilter('ready')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    stockFilter === 'ready'
                      ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                      : 'text-[#6E5D4F] hover:text-[#2D251E]'
                  }`}
                >
                  Ready ({readyCount})
                </button>
                <button
                  onClick={() => setStockFilter('out')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    stockFilter === 'out'
                      ? 'bg-white text-rose-800 shadow-xs font-semibold'
                      : 'text-[#6E5D4F] hover:text-[#2D251E]'
                  }`}
                >
                  Habis ❎ ({outCount})
                </button>
              </div>
            </div>

            {/* Dietary Tags Quick Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-[#8C7A6B] shrink-0 font-medium">Filter Diet:</span>
              {[
                { label: 'Semua Diet', value: 'all' },
                { label: 'Gluten Free (GF)', value: 'GF' },
                { label: 'Bebas Telur (EF)', value: 'EF' },
                { label: 'Dairy Free (DF)', value: 'DF' },
                { label: 'Vegan Plant-Based', value: 'Vegan' },
                { label: 'Grassfed', value: 'Grassfed' },
                { label: 'Tanpa Tepung', value: 'Tanpa Tepung' },
              ].map((df) => (
                <button
                  key={df.value}
                  onClick={() => setDietaryFilter(df.value)}
                  className={`px-2.5 py-1 rounded-md shrink-0 transition-colors ${
                    dietaryFilter === df.value
                      ? 'bg-[#2D251E] text-white font-medium'
                      : 'bg-[#F4EFEA] text-[#6E5D4F] hover:bg-[#EBE2D7]'
                  }`}
                >
                  {df.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Carousel / Horizontal Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#3E6B48] text-white shadow-xs font-semibold'
                  : 'bg-white text-[#6E5D4F] border border-[#E8DFD3] hover:bg-[#FAF8F5]'
              }`}
            >
              Semua Kategori ({products.length})
            </button>
            {CATEGORY_GROUPS.map((cat) => {
              const catCount = products.filter(p => p.categoryKey === cat.key).length;
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#3E6B48] text-white shadow-xs font-semibold'
                      : 'bg-white text-[#6E5D4F] border border-[#E8DFD3] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span>{cat.title}</span>
                  <span className="ml-1.5 opacity-75 font-mono text-[11px]">({catCount})</span>
                </button>
              );
            })}
          </div>

          {/* Product Grid Header */}
          <div className="flex items-center justify-between text-xs text-[#8C7A6B] px-1">
            <span>Menampilkan {filteredProducts.length} produk dari master data</span>
            <span className="hidden sm:inline">Klik kartu untuk menambah ke kasir</span>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#E8DFD3]">
              <Utensils className="w-10 h-10 text-[#C4B7A6] mx-auto mb-3" />
              <p className="text-base font-semibold text-[#2D251E]">Tidak ada menu yang sesuai</p>
              <p className="text-xs text-[#8C7A6B] mt-1">Coba sesuaikan kata kunci pencarian atau filter ketersediaan.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setStockFilter('all');
                  setDietaryFilter('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 text-xs font-medium bg-[#2D251E] text-white rounded-lg hover:bg-black transition-colors"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
              {filteredProducts.map((product) => {
                const inCartItem = cart.find(ci => ci.product.id === product.id);
                const inCartQty = inCartItem?.quantity || 0;

                return (
                  <div
                    key={product.id}
                    className={`group relative bg-white rounded-2xl p-4 border transition-all duration-150 flex flex-col justify-between ${
                      !product.isAvailable
                        ? 'border-dashed border-[#DFD3C3] bg-[#FCFBF9] opacity-80'
                        : inCartQty > 0
                        ? 'border-[#3E6B48] ring-1 ring-[#3E6B48] shadow-xs'
                        : 'border-[#E8DFD3] hover:border-[#C4B7A6] hover:shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Top Row: SKU, Category & Quick Stock Toggle */}
                      <div className="flex items-center justify-between gap-2 text-[11px] mb-2">
                        <span className="font-mono text-[#A39281] font-semibold">{product.sku}</span>
                        <div className="flex items-center gap-1.5">
                          {/* Stock status indicator with 1-click toggle */}
                          <button
                            title="Klik untuk ubah stok (Ready / Habis)"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleProductStock(product.id);
                            }}
                            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-colors ${
                              product.isAvailable
                                ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                                : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
                            }`}
                          >
                            {product.isAvailable ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Ready ({product.stockQty})</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 text-rose-600" />
                                <span>Habis ❎</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Product Name */}
                      <h4 className="text-sm font-semibold text-[#2D251E] group-hover:text-[#3E6B48] transition-colors leading-snug">
                        {product.name}
                      </h4>

                      {/* Metadata: Portion, Brand, Notes (Clean unboxed text) */}
                      <div className="flex flex-wrap items-center gap-1 text-[11px] text-[#8C7A6B] mt-1.5">
                        {product.portion && <span>{product.portion}</span>}
                        {product.portion && product.brand && <span>·</span>}
                        {product.brand && <span className="font-medium text-[#6E5D4F]">{product.brand}</span>}
                        {product.dietaryTags.length > 0 && (
                          <>
                            <span>·</span>
                            <span className="text-[#3E6B48] font-medium">
                              {product.dietaryTags.join(' · ')}
                            </span>
                          </>
                        )}
                      </div>

                      {product.notes && (
                        <p className="text-[11px] text-[#9A8774] italic mt-1 line-clamp-1">
                          {product.notes}
                        </p>
                      )}
                    </div>

                    {/* Bottom Row: Price & Add to Cart button */}
                    <div className="pt-3 mt-3 border-t border-[#F2ECE4] flex items-center justify-between gap-2">
                      <div>
                        <div className="text-base font-bold font-mono text-[#2D251E]">
                          {formatRupiah(product.price)}
                        </div>
                        <div className="text-[10px] text-[#A39281] font-mono">
                          HPP: {formatRupiah(product.costPrice)}
                        </div>
                      </div>

                      {/* Action buttons */}
                      {product.isAvailable ? (
                        inCartQty > 0 ? (
                          <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#E0D5C7] rounded-xl p-0.5">
                            <button
                              onClick={() => updateCartQty(product.id, inCartQty - 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#2D251E] hover:bg-[#EBE2D7] active:scale-95 transition-all"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-5 text-center font-bold text-xs text-[#2D251E] font-mono">
                              {inCartQty}
                            </span>
                            <button
                              onClick={() => addToCart(product, 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#3E6B48] text-white hover:bg-[#34593C] active:scale-95 transition-all shadow-2xs"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(product, 1)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2D251E] text-white text-xs font-semibold hover:bg-[#3E6B48] active:scale-95 transition-all cursor-pointer shadow-2xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Tambah</span>
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => toggleProductStock(product.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-[#F0EAE1] text-[#8C7A6B] text-[11px] font-medium hover:text-[#2D251E] transition-colors"
                        >
                          Tandai Ready
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Desktop Kasir Bill Panel (4 cols) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-20">
          <div className="bg-white rounded-2xl border border-[#E8DFD3] shadow-xs overflow-hidden flex flex-col h-[calc(100vh-6rem)]">
            
            {/* Bill Header */}
            <div className="p-4 border-b border-[#E8DFD3] bg-[#FAF8F5] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#2D251E]">Tagihan Kasir</h3>
                <p className="text-xs text-[#8C7A6B]">Pesanan Aktif ({cartItemCount} item)</p>
              </div>
              {cart.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenCheckout('summary')}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                    title="Buka Template Ringkasan WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Format WA</span>
                  </button>

                  <button
                    onClick={clearCart}
                    className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Batal</span>
                  </button>
                </div>
              )}
            </div>


            {/* Bill Item List */}
            <div className="flex-1 overflow-y-auto p-4 divide-y divide-[#F2ECE4] space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 text-[#A39281]">
                  <CreditCard className="w-10 h-10 mb-2 stroke-1" />
                  <p className="text-sm font-medium text-[#6E5D4F]">Keranjang Kasir Kosong</p>
                  <p className="text-xs text-[#A39281] mt-1 max-w-[200px]">
                    Pilih menu di sebelah kiri untuk menambahkan ke struk pesanan.
                  </p>
                </div>
              ) : (
                cart.map((item) => {
                  const itemSubtotal = (item.product.price - item.discount) * item.quantity;
                  const isEditingNote = editingNoteId === item.product.id;

                  return (
                    <div key={item.product.id} className="pt-3 first:pt-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-[#2D251E] leading-snug">
                            {item.product.name}
                          </p>
                          <p className="text-[11px] text-[#8C7A6B] font-mono mt-0.5">
                            {formatRupiah(item.product.price)} × {item.quantity}
                          </p>
                          {item.notes && (
                            <p className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                              Catatan: {item.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold font-mono text-[#2D251E]">
                            {formatRupiah(itemSubtotal)}
                          </p>
                        </div>
                      </div>

                      {/* Note editor form */}
                      {isEditingNote && (
                        <div className="mt-2 flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Tulis catatan (misal: pisah kuah)..."
                            value={tempNote}
                            onChange={(e) => setTempNote(e.target.value)}
                            className="flex-1 text-xs px-2 py-1 border border-[#D9CEBF] rounded-lg"
                          />
                          <button
                            onClick={() => {
                              updateCartItemNotes(item.product.id, tempNote);
                              setEditingNoteId(null);
                            }}
                            className="px-2 py-1 bg-[#3E6B48] text-white text-xs rounded-lg font-medium"
                          >
                            Simpan
                          </button>
                        </div>
                      )}

                      {/* Stepper & Remove */}
                      <div className="flex items-center justify-between mt-2 pt-1">
                        <button
                          onClick={() => {
                            setEditingNoteId(isEditingNote ? null : item.product.id);
                            setTempNote(item.notes || '');
                          }}
                          className="text-[11px] text-[#6E5D4F] hover:text-[#2D251E] flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3 text-[#A39281]" />
                          <span>{item.notes ? 'Ubah Catatan' : '+ Catatan'}</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-md bg-[#FAF8F5] border border-[#E0D5C7] flex items-center justify-center text-[#2D251E] hover:bg-[#EBE2D7]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold font-mono text-[#2D251E]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => addToCart(item.product, 1)}
                            className="w-6 h-6 rounded-md bg-[#3E6B48] text-white flex items-center justify-center hover:bg-[#34593C]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="w-6 h-6 ml-1 flex items-center justify-center text-rose-500 hover:text-rose-700"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bill Footer & Checkout Button */}
            <div className="p-4 border-t border-[#E8DFD3] bg-[#FAF8F5] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#6E5D4F]">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium">{formatRupiah(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-[#6E5D4F]">
                  <span>Pajak (PB1 0% Bebas UMKM)</span>
                  <span className="font-mono">Rp 0</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#2D251E] pt-2 border-t border-[#E8DFD3]">
                  <span>Total Tagihan</span>
                  <span className="font-mono text-lg text-[#3E6B48]">{formatRupiah(cartTotal)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  disabled={cart.length === 0}
                  onClick={() => onOpenCheckout('pay')}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    cart.length > 0
                      ? 'bg-[#3E6B48] text-white hover:bg-[#34593C] active:scale-[0.99] shadow-sm'
                      : 'bg-[#E5DDCF] text-[#A39281] cursor-not-allowed'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Bayar Sekarang · {formatRupiah(cartTotal)}</span>
                </button>

                <button
                  disabled={cart.length === 0}
                  onClick={() => onOpenCheckout('summary')}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    cart.length > 0
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                      : 'bg-[#F4EFEA] text-[#A39281] border border-transparent cursor-not-allowed'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Template Ringkasan WA (1-Tap)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Drawer / Bottom Bar for Cart */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t border-[#E8DFD3] shadow-lg">
          <div className="max-w-md mx-auto flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] text-[#8C7A6B]">
                Total ({cartItemCount} item)
              </p>
              <p className="text-base font-bold font-mono text-[#3E6B48]">
                {formatRupiah(cartTotal)}
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-1 justify-end">
              <button
                onClick={() => onOpenCheckout('summary')}
                className="py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                title="Format WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Format WA</span>
              </button>

              <button
                onClick={() => onOpenCheckout('pay')}
                className="py-2.5 px-4 rounded-xl bg-[#3E6B48] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Bayar</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
