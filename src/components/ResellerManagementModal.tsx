import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Plus, 
  Search, 
  Phone, 
  MapPin, 
  Store, 
  Award, 
  Trash2, 
  Edit2, 
  Send, 
  ShoppingCart, 
  Check, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Percent,
  LogOut
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { formatRupiah } from '../data/masterMenu';
import { Reseller } from '../types/pos';

interface ResellerManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPOSWithReseller?: (reseller: Reseller) => void;
}

export const ResellerManagementModal: React.FC<ResellerManagementModalProps> = ({
  isOpen,
  onClose,
  onOpenPOSWithReseller,
}) => {
  const { 
    resellers, 
    addReseller, 
    updateReseller, 
    deleteReseller, 
    selectedResellerForCart, 
    setSelectedResellerForCart,
    setIsResellerMode
  } = usePOS();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tierFilter, setTierFilter] = useState<'all' | 'SILVER' | 'GOLD' | 'PLATINUM'>('all');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState<string>('');
  const [storeName, setStoreName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [tier, setTier] = useState<'SILVER' | 'GOLD' | 'PLATINUM'>('GOLD');
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const filteredResellers = resellers.filter(r => {
    if (tierFilter !== 'all' && r.tier !== tierFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.storeName?.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStartAdd = () => {
    setEditingId(null);
    setName('');
    setStoreName('');
    setPhone('');
    setCity('');
    setTier('GOLD');
    setDiscountPercent(10);
    setNotes('');
    setIsFormOpen(true);
  };

  const handleStartEdit = (reseller: Reseller) => {
    setEditingId(reseller.id);
    setName(reseller.name);
    setStoreName(reseller.storeName || '');
    setPhone(reseller.phone);
    setCity(reseller.city);
    setTier(reseller.tier);
    setDiscountPercent(reseller.discountPercent || 10);
    setNotes(reseller.notes || '');
    setIsFormOpen(true);
  };

  const handleSaveReseller = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    let cleanPhone = phone.trim();
    if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);

    if (editingId) {
      const existing = resellers.find(r => r.id === editingId);
      if (existing) {
        updateReseller({
          ...existing,
          name: name.trim(),
          storeName: storeName.trim() || undefined,
          phone: cleanPhone,
          city: city.trim() || 'Jakarta',
          tier,
          discountPercent,
          notes: notes.trim() || undefined,
        });
      }
    } else {
      addReseller({
        name: name.trim(),
        storeName: storeName.trim() || undefined,
        phone: cleanPhone,
        city: city.trim() || 'Jakarta',
        tier,
        discountPercent,
        status: 'ACTIVE',
        notes: notes.trim() || undefined,
      });
    }

    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleOpenWhatsAppChat = (phoneNum: string, resellerName: string) => {
    const clean = phoneNum.replace(/\D/g, '');
    const msg = encodeURIComponent(`Halo ${resellerName}, admin Rarumi Kitchen di sini. Ada yang bisa kami bantu untuk pesanan reseller hari ini? 🌱`);
    window.open(`https://api.whatsapp.com/send?phone=${clean}&text=${msg}`, '_blank');
  };

  const handleSelectForKasir = (reseller: Reseller) => {
    setSelectedResellerForCart(reseller);
    setIsResellerMode(true);
    onClose();
    if (onOpenPOSWithReseller) {
      onOpenPOSWithReseller(reseller);
    }
  };

  const totalResellerRevenue = resellers.reduce((sum, r) => sum + r.totalSpent, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#E8DFD3] overflow-hidden my-4">
        
        {/* Header with Exit Button */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-b border-[#E8DFD3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#2D251E]">
                  Master Data & Kemitraan Reseller
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono">
                  {resellers.length} Mitra Terdaftar
                </span>
              </div>
              <p className="text-xs text-[#8C7A6B]">
                Kelola daftar mitra reseller resmi, harga grosir, level tier, dan riwayat pesanan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-[#E0D5C7] flex items-center justify-center text-[#6E5D4F] hover:text-[#2D251E] hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
            title="Tutup / Keluar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#F8F5F0] border-b border-[#E8DFD3] text-xs">
          <div className="bg-white p-3 rounded-xl border border-[#E0D5C7]">
            <span className="text-[10px] text-[#8C7A6B] block">Total Mitra Reseller</span>
            <span className="text-base font-bold font-mono text-[#2D251E]">{resellers.length} Toko</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#E0D5C7]">
            <span className="text-[10px] text-[#8C7A6B] block">Omzet Akumulasi Reseller</span>
            <span className="text-base font-bold font-mono text-[#3E6B48]">{formatRupiah(totalResellerRevenue)}</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#E0D5C7]">
            <span className="text-[10px] text-[#8C7A6B] block">Tier Tertinggi</span>
            <span className="text-base font-bold text-amber-700">Platinum (15%)</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#E0D5C7]">
            <span className="text-[10px] text-[#8C7A6B] block">Mode Reseller di Kasir</span>
            <span className={`text-xs font-bold ${selectedResellerForCart ? 'text-emerald-700' : 'text-[#8C7A6B]'}`}>
              {selectedResellerForCart ? selectedResellerForCart.name.split(' ')[0] : 'Nonaktif'}
            </span>
          </div>
        </div>

        {/* Form Modal or Inline */}
        {isFormOpen && (
          <form onSubmit={handleSaveReseller} className="p-5 bg-white border-b-2 border-amber-400 space-y-3.5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-2">
              <h4 className="font-bold text-xs text-[#2D251E] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{editingId ? 'Edit Data Mitra Reseller' : 'Daftarkan Mitra Reseller Baru'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-xs text-[#8C7A6B] hover:text-[#2D251E] cursor-pointer"
              >
                Batal
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-[#4A3E33] mb-1">Nama Pemilik / Mitra *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Misal: Ibu Ratna Paramitha"
                  className="w-full px-3 py-2 rounded-xl border border-[#E0D5C7] outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A3E33] mb-1">Nama Toko / Klinik (Opsional)</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Misal: Ratna Healthy Mart"
                  className="w-full px-3 py-2 rounded-xl border border-[#E0D5C7] outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A3E33] mb-1">Nomor WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full px-3 py-2 rounded-xl border border-[#E0D5C7] outline-none font-mono focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A3E33] mb-1">Kota / Domisili *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Misal: Jakarta Selatan (Pondok Indah)"
                  className="w-full px-3 py-2 rounded-xl border border-[#E0D5C7] outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A3E33] mb-1">Level Tier Reseller</label>
                <select
                  value={tier}
                  onChange={(e) => {
                    const newTier = e.target.value as any;
                    setTier(newTier);
                    setDiscountPercent(newTier === 'PLATINUM' ? 15 : newTier === 'GOLD' ? 10 : 7);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#E0D5C7] outline-none bg-white focus:border-amber-500"
                >
                  <option value="SILVER">Silver (Diskon 7%)</option>
                  <option value="GOLD">Gold (Diskon 10%)</option>
                  <option value="PLATINUM">Platinum (Diskon 15%)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#4A3E33] mb-1">Tambahan Diskon Reseller (%)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E0D5C7] outline-none font-mono focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-bold text-[#4A3E33] mb-1">Catatan Khusus Kemitraan (Opsional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Pengiriman rutin setiap hari Selasa via Paxel Sameday"
                  className="w-full px-3 py-2 rounded-xl border border-[#E0D5C7] outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#E0D5C7] text-xs font-semibold text-[#6E5D4F] hover:bg-[#FAF8F5] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                {editingId ? 'Simpan Perubahan' : 'Daftarkan Mitra'}
              </button>
            </div>
          </form>
        )}

        {/* Toolbar & Filters */}
        <div className="p-4 border-b border-[#E8DFD3] flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, toko, kota, nomor WA..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E0D5C7] outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value as any)}
              className="px-3 py-2 text-xs rounded-xl border border-[#E0D5C7] bg-white outline-none cursor-pointer"
            >
              <option value="all">Semua Tier</option>
              <option value="PLATINUM">Platinum</option>
              <option value="GOLD">Gold</option>
              <option value="SILVER">Silver</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {!isFormOpen && (
              <button
                onClick={handleStartAdd}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Daftarkan Reseller Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* Resellers Table / Card List */}
        <div className="p-4 max-h-[460px] overflow-y-auto space-y-3">
          {filteredResellers.length === 0 ? (
            <div className="p-10 text-center bg-[#FAF8F5] rounded-2xl border border-[#E8DFD3] space-y-2">
              <Users className="w-8 h-8 text-[#C4B7A6] mx-auto" />
              <p className="text-xs font-semibold text-[#2D251E]">Tidak ada mitra reseller ditemukan</p>
              <button
                onClick={handleStartAdd}
                className="px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-xl"
              >
                Daftarkan Reseller Pertama
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredResellers.map((reseller) => {
                const isCurrentActiveInPOS = selectedResellerForCart?.id === reseller.id;

                return (
                  <div
                    key={reseller.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCurrentActiveInPOS
                        ? 'bg-amber-50/60 border-amber-400 ring-1 ring-amber-400 shadow-xs'
                        : 'bg-white border-[#E8DFD3] hover:border-amber-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#2D251E]">{reseller.name}</h4>
                        
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          reseller.tier === 'PLATINUM' ? 'bg-purple-100 text-purple-900 border border-purple-200' :
                          reseller.tier === 'GOLD' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                          'bg-zinc-100 text-zinc-800 border border-zinc-200'
                        }`}>
                          {reseller.tier} ({reseller.discountPercent || 10}%)
                        </span>

                        {isCurrentActiveInPOS && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Aktif di Kasir
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#6E5D4F]">
                        {reseller.storeName && (
                          <span className="flex items-center gap-1 font-semibold text-[#2D251E]">
                            <Store className="w-3.5 h-3.5 text-amber-600" />
                            {reseller.storeName}
                          </span>
                        )}
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3.5 h-3.5 text-[#8C7A6B]" />
                          {reseller.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#8C7A6B]" />
                          {reseller.city}
                        </span>
                      </div>

                      {reseller.notes && (
                        <p className="text-[11px] text-[#8C7A6B] italic pt-0.5">{reseller.notes}</p>
                      )}
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center gap-3 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[#F0EAE1]">
                      <div className="text-right">
                        <span className="text-[10px] text-[#8C7A6B] block">{reseller.totalOrdersCount} Transaksi</span>
                        <span className="font-mono font-bold text-xs text-[#3E6B48]">
                          {formatRupiah(reseller.totalSpent)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenWhatsAppChat(reseller.phone, reseller.name)}
                          className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-pointer"
                          title="Chat WhatsApp Mitra"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSelectForKasir(reseller)}
                          className="px-2.5 py-1.5 rounded-xl bg-[#2D251E] hover:bg-black text-white text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                          title="Buka Kasir POS dengan harga khusus reseller ini"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Pilih Kasir</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStartEdit(reseller)}
                          className="p-2 rounded-xl text-[#8C7A6B] hover:text-[#2D251E] hover:bg-[#F4EFEA] cursor-pointer"
                          title="Edit Reseller"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteReseller(reseller.id)}
                          className="p-2 rounded-xl text-[#8C7A6B] hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Hapus Reseller"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer with Clear Exit Button */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#E8DFD3] flex items-center justify-between text-xs">
          <div className="text-[#8C7A6B] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Harga reseller otomatis diterapkan di keranjang POS saat mitra dipilih.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#2D251E] hover:bg-black text-white font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Tutup & Keluar</span>
          </button>
        </div>

      </div>
    </div>
  );
};
