import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Send, 
  Copy, 
  Truck, 
  MapPin, 
  User, 
  Phone, 
  Sparkles, 
  Flame, 
  Leaf, 
  Info,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { CATEGORY_GROUPS, formatRupiah, formatShortPrice, DietaryTag } from '../data/masterMenu';
import { Product } from '../types/pos';
import { 
  generateOrderTextWithRarumiWhatsAppLink, 
  RARUMI_WHATSAPP_DISPLAY, 
  RARUMI_WHATSAPP_NUMBER 
} from '../utils/orderSummaryTemplate';

interface CustomerScreenProps {
  onOpenAssistant?: () => void;
}

export const CustomerScreen: React.FC<CustomerScreenProps> = ({ onOpenAssistant }) => {
  const { products, cart, addToCart, updateCartQty, removeFromCart, clearCart, cartTotal, cartItemCount } = usePOS();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDiet, setSelectedDiet] = useState<string>('all');
  const [readyOnly, setReadyOnly] = useState<boolean>(false);

  // Customer Checkout Drawer State
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [deliveryMethod, setDeliveryMethod] = useState<string>('Paxel Sameday (Cold / Frozen Chain)');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [orderSubmitted, setOrderSubmitted] = useState<boolean>(false);

  // Filtered Products for Customer Storefront
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      if (readyOnly && !item.isAvailable) return false;
      if (selectedCategory !== 'all' && item.categoryKey !== selectedCategory) return false;
      if (selectedDiet !== 'all' && !item.dietaryTags.includes(selectedDiet as any)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.brand?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, selectedCategory, selectedDiet, readyOnly, searchQuery]);

  // Order summary with Rarumi WhatsApp Link
  const orderData = generateOrderTextWithRarumiWhatsAppLink({
    customerName: customerName || 'Pelanggan',
    items: cart,
    subtotal: cartTotal,
    orderNotes,
  });

  const handleSendOrderWhatsApp = () => {
    window.open(orderData.oneTapShareUrl, '_blank');
    setOrderSubmitted(true);
  };

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(orderData.formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const readyCount = products.filter(p => p.isAvailable).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      
      {/* Hero Banner (Customer Facing) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#2D251E] via-[#382F27] to-[#1F1914] text-[#FAF8F5] p-6 sm:p-10 shadow-lg border border-[#4A3E33]">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Bismillahirrahmannirrahim · Ready Today</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight font-serif-display leading-tight">
            Makanan Sehat Artisanal, Bebas Gluten & Halal Thayyib
          </h1>

          <p className="text-xs sm:text-sm text-[#D9CEBF] leading-relaxed">
            Katalog resmi menu segar hari ini: Dessert jar, cake vegan & gluten-free, sourdough fermentasi alami, frozen food bebas telur, lauk sehat tanpa MSG, dan daging sapi grassfed pilihan.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#FAF8F5]/80">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Halal & Alami</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-300" />
              <span>Kirim Sameday (Paxel Cold Chain)</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-300" />
              <span>Ready Stock ({readyCount} Menu)</span>
            </div>
          </div>
        </div>

        {/* Floating WhatsApp Hotline Badge */}
        <div className="hidden sm:block absolute top-8 right-8 bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl text-right">
          <span className="text-[11px] text-white/70 block">WhatsApp Pemesanan:</span>
          <a 
            href={`https://wa.me/${RARUMI_WHATSAPP_NUMBER}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-emerald-300 font-mono font-bold text-sm hover:underline"
          >
            {RARUMI_WHATSAPP_DISPLAY}
          </a>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8DFD3] shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A6B]" />
            <input
              type="text"
              placeholder="Cari menu sehat, gluten-free, bakso, kue, atau bumbu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAF8F5] border border-[#E0D5C7] rounded-xl focus:ring-2 focus:ring-[#3E6B48] focus:outline-none"
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

          {/* Quick Ready Only Toggle */}
          <button
            onClick={() => setReadyOnly(!readyOnly)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              readyOnly 
                ? 'bg-emerald-700 text-white shadow-xs' 
                : 'bg-[#F4EFEA] text-[#6E5D4F] hover:bg-[#EBE2D7]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Hanya Yang Ready Stock</span>
          </button>
        </div>

        {/* Dietary Filter Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[#8C7A6B] shrink-0 font-medium mr-1">Kategori Diet:</span>
          {[
            { label: 'Semua Menu', val: 'all' },
            { label: 'Gluten-Free (GF)', val: 'GF' },
            { label: 'Bebas Telur (EF)', val: 'EF' },
            { label: 'Dairy-Free (DF)', val: 'DF' },
            { label: 'Vegan Plant-Based', val: 'Vegan' },
            { label: 'Grassfed', val: 'Grassfed' },
            { label: 'Tanpa Tepung', val: 'Tanpa Tepung' },
          ].map((d) => (
            <button
              key={d.val}
              onClick={() => setSelectedDiet(d.val)}
              className={`px-3 py-1.5 rounded-lg shrink-0 transition-colors cursor-pointer ${
                selectedDiet === d.val
                  ? 'bg-[#2D251E] text-white font-semibold'
                  : 'bg-[#F4EFEA] text-[#6E5D4F] hover:bg-[#EBE2D7]'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Category Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar pt-1 border-t border-[#F2ECE4]">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl font-medium shrink-0 transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#3E6B48] text-white font-bold shadow-2xs'
                : 'bg-white text-[#6E5D4F] border border-[#E8DFD3] hover:bg-[#FAF8F5]'
            }`}
          >
            Semua ({products.length})
          </button>
          {CATEGORY_GROUPS.map((cat) => {
            const count = products.filter(p => p.categoryKey === cat.key).length;
            const isSel = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-xl font-medium shrink-0 transition-all cursor-pointer ${
                  isSel
                    ? 'bg-[#3E6B48] text-white font-bold shadow-2xs'
                    : 'bg-white text-[#6E5D4F] border border-[#E8DFD3] hover:bg-[#FAF8F5]'
                }`}
              >
                <span>{cat.title}</span>
                <span className="ml-1 opacity-70 font-mono text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sourdough & Food Care Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-xs text-[#6E5D4F]">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong>Catatan Penyimpanan:</strong> Roti sourdough dan frozen food homemade dapat disimpan di freezer dalam wadah tertutup. Reheat kukus -+ 5 menit sebelum dinikmati agar lembut dan fluffy kembali.
        </p>
      </div>

      {/* Product Catalog Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[#8C7A6B]">
          <span>Menampilkan <strong>{filteredProducts.length}</strong> menu</span>
          <span>Pilih menu untuk menambahkan ke keranjang belanja WhatsApp</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E8DFD3]">
            <p className="text-base font-semibold text-[#2D251E]">Menu tidak ditemukan</p>
            <p className="text-xs text-[#8C7A6B] mt-1">Coba sesuaikan pencarian atau matikan filter stok.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDiet('all');
                setReadyOnly(false);
              }}
              className="mt-4 px-4 py-2 bg-[#2D251E] text-white text-xs rounded-xl font-medium"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const inCart = cart.find(ci => ci.product.id === product.id);
              const inCartQty = inCart?.quantity || 0;

              return (
                <div
                  key={product.id}
                  className={`bg-white rounded-2xl p-4 border transition-all duration-150 flex flex-col justify-between ${
                    !product.isAvailable
                      ? 'border-dashed border-[#DFD3C3] bg-[#FCFBF9] opacity-75'
                      : inCartQty > 0
                      ? 'border-[#3E6B48] ring-1 ring-[#3E6B48] shadow-xs'
                      : 'border-[#E8DFD3] hover:border-[#C4B7A6] hover:shadow-xs'
                  }`}
                >
                  <div>
                    {/* Top: Availability & Portion */}
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="text-[#8C7A6B] font-medium truncate max-w-[150px]">
                        {product.category}
                      </span>
                      {product.isAvailable ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Ready
                        </span>
                      ) : (
                        <span className="text-rose-700 font-semibold flex items-center gap-1">
                          <XCircle className="w-3 h-3 text-rose-500" />
                          Habis ❎
                        </span>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="font-bold text-sm text-[#2D251E] leading-snug">
                      {product.name}
                    </h3>

                    {/* Clean unboxed metadata */}
                    <div className="flex flex-wrap items-center gap-1 text-[11px] text-[#8C7A6B] mt-1.5">
                      {product.portion && <span>{product.portion}</span>}
                      {product.portion && product.brand && <span>·</span>}
                      {product.brand && <span className="font-semibold text-[#6E5D4F]">{product.brand}</span>}
                      {product.dietaryTags.length > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-[#3E6B48] font-semibold">
                            {product.dietaryTags.join(' · ')}
                          </span>
                        </>
                      )}
                    </div>

                    {product.notes && (
                      <p className="text-[11px] text-[#9A8774] italic mt-1 line-clamp-2">
                        {product.notes}
                      </p>
                    )}
                  </div>

                  {/* Bottom: Price & Add to Cart button */}
                  <div className="pt-3 mt-3 border-t border-[#F2ECE4] flex items-center justify-between gap-2">
                    <span className="text-base font-bold font-mono text-[#2D251E]">
                      {formatRupiah(product.price)}
                    </span>

                    {product.isAvailable ? (
                      inCartQty > 0 ? (
                        <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#E0D5C7] rounded-xl p-0.5">
                          <button
                            onClick={() => updateCartQty(product.id, inCartQty - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#2D251E] hover:bg-[#EBE2D7] active:scale-95"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-5 text-center font-bold text-xs font-mono text-[#2D251E]">
                            {inCartQty}
                          </span>
                          <button
                            onClick={() => addToCart(product, 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#3E6B48] text-white hover:bg-[#34593C] active:scale-95 shadow-2xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2D251E] text-white text-xs font-semibold hover:bg-[#3E6B48] active:scale-95 transition-all shadow-2xs cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Pesan</span>
                        </button>
                      )
                    ) : (
                      <span className="text-[11px] text-[#A39281] font-medium py-1 px-2 bg-[#F4EFEA] rounded-lg">
                        Habis Hari Ini
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Bottom Bar for Customer Cart */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-40 bg-[#2D251E] text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 border border-white/15 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#3E6B48] flex items-center justify-center font-bold text-xs">
              {cartItemCount}
            </div>
            <div>
              <p className="text-[10px] text-white/70">Total Pesanan ({cart.length} menu)</p>
              <p className="text-base font-bold font-mono text-emerald-300">
                {formatRupiah(cartTotal)}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Kirim Pesanan WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Customer Cart / Checkout Modal Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#E8DFD3] overflow-hidden my-4">
            
            {/* Header */}
            <div className="p-4 bg-[#FAF8F5] border-b border-[#E8DFD3] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  WA
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2D251E]">Konfirmasi Pesanan WhatsApp</h3>
                  <p className="text-[11px] text-[#8C7A6B]">Kirim langsung ke WhatsApp resmi Rarumi Kitchen</p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-7 h-7 rounded-full bg-white border border-[#E0D5C7] flex items-center justify-center text-[#6E5D4F]"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              
              {/* Itemized Cart List */}
              <div className="space-y-2 pb-3 border-b border-[#F2ECE4]">
                <div className="flex justify-between items-center font-semibold text-[#2D251E]">
                  <span>Item Yang Dipesan ({cartItemCount} pcs)</span>
                  <button onClick={clearCart} className="text-rose-600 text-[11px] hover:underline">
                    Kosongkan
                  </button>
                </div>

                <div className="divide-y divide-[#F2ECE4] max-h-40 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-2 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#2D251E] truncate">{item.product.name}</p>
                        <p className="text-[10px] text-[#8C7A6B] font-mono">
                          {formatRupiah(item.product.price)} × {item.quantity}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-[#FAF8F5] border border-[#E0D5C7] flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-bold font-mono">{item.quantity}</span>
                        <button
                          onClick={() => addToCart(item.product, 1)}
                          className="w-6 h-6 rounded bg-[#3E6B48] text-white flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="w-6 h-6 text-rose-500 hover:text-rose-700 ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-between font-bold text-sm text-[#2D251E]">
                  <span>Subtotal Belanja</span>
                  <span className="font-mono text-[#3E6B48]">{formatRupiah(cartTotal)}</span>
                </div>
              </div>

              {/* Customer Details Form */}
              <div className="space-y-3 bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E8DFD3]">
                <h4 className="font-bold text-[#2D251E] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#3E6B48]" />
                  <span>Informasi Pemesan & Pengiriman</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E5D4F] mb-1">
                      Nama Anda *
                    </label>
                    <input
                      type="text"
                      placeholder="Misal: Bu Ratna"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#E0D5C7] rounded-xl focus:ring-2 focus:ring-[#3E6B48]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E5D4F] mb-1">
                      Nomor WhatsApp Anda
                    </label>
                    <input
                      type="tel"
                      placeholder="0812xxxxxxx"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#E0D5C7] rounded-xl focus:ring-2 focus:ring-[#3E6B48]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#6E5D4F] mb-1">
                    Alamat Pengiriman (Khusus Dikirim)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kota..."
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#E0D5C7] rounded-xl focus:ring-2 focus:ring-[#3E6B48] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E5D4F] mb-1">
                      Pilihan Pengiriman
                    </label>
                    <select
                      value={deliveryMethod}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#E0D5C7] rounded-xl"
                    >
                      <option value="Paxel Sameday (Cold / Frozen Chain)">Paxel Sameday (Cold Chain)</option>
                      <option value="Instant (Gojek / Grab)">Instant (Gojek / Grab)</option>
                      <option value="Sameday (Gojek / Grab)">Sameday (Gojek / Grab)</option>
                      <option value="Ambil Sendiri di Dapur (Pickup)">Ambil Sendiri di Dapur (Pickup)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E5D4F] mb-1">
                      Catatan Tambahan
                    </label>
                    <input
                      type="text"
                      placeholder="Misal: sambal dipisah..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#E0D5C7] rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Formatted Text Preview */}
              <div className="bg-[#ECE5DD] p-3 rounded-2xl border border-[#DFD8D0]">
                <div className="text-[10px] text-zinc-500 text-center mb-1 font-mono">
                  Pratinjau Pesan yang Akan Dikirim ke WhatsApp Rarumi
                </div>
                <div className="bg-white rounded-xl p-3 text-[11px] font-mono whitespace-pre-wrap text-[#111B21] max-h-40 overflow-y-auto leading-relaxed border border-[#DFD8D0]">
                  {orderData.formattedText}
                </div>
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-[#FAF8F5] border-t border-[#E8DFD3] flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleCopyOrder}
                className="py-2.5 px-4 rounded-xl border border-[#E0D5C7] bg-white text-[#6E5D4F] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#FAF8F5]"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Tersalin!' : 'Salin Pesanan'}</span>
              </button>

              <button
                disabled={cart.length === 0}
                onClick={handleSendOrderWhatsApp}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Langsung ke WhatsApp Rarumi (1-Tap)</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
