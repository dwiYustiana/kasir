import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Sparkles, 
  Check, 
  Package, 
  DollarSign, 
  Tag, 
  Layers,
  ChefHat
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { CATEGORY_GROUPS, DietaryTag, formatRupiah } from '../data/masterMenu';
import { Product } from '../types/pos';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { addProduct, products } = usePOS();

  const [name, setName] = useState<string>('');
  const [categoryKey, setCategoryKey] = useState<string>(CATEGORY_GROUPS[0].key);
  const [priceStr, setPriceStr] = useState<string>('35000');
  const [costPriceStr, setCostPriceStr] = useState<string>('22000');
  const [stockQtyStr, setStockQtyStr] = useState<string>('15');
  const [minStockStr, setMinStockStr] = useState<string>('3');
  const [portion, setPortion] = useState<string>('250gr');
  const [brand, setBrand] = useState<string>('Rarumi');
  const [notes, setNotes] = useState<string>('');
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [selectedTags, setSelectedTags] = useState<DietaryTag[]>(['GF']);

  if (!isOpen) return null;

  const price = parseInt(priceStr.replace(/\D/g, ''), 10) || 0;
  const costPrice = parseInt(costPriceStr.replace(/\D/g, ''), 10) || 0;
  const stockQty = parseInt(stockQtyStr.replace(/\D/g, ''), 10) || 0;
  const minStock = parseInt(minStockStr.replace(/\D/g, ''), 10) || 0;

  const profit = Math.max(0, price - costPrice);
  const margin = price > 0 ? Math.round((profit / price) * 100) : 0;
  const estimatedSku = `RRM-${String(products.length + 1).padStart(3, '0')}`;

  const availableDietTags: DietaryTag[] = [
    'GF',
    'EF',
    'DF',
    'Vegan',
    'Grassfed',
    'Tanpa Tepung',
    'Organik',
    'Halal',
  ];

  const toggleDietTag = (tag: DietaryTag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const selectedCategoryGroup = CATEGORY_GROUPS.find(g => g.key === categoryKey) || CATEGORY_GROUPS[0];

    addProduct({
      name: name.trim(),
      category: selectedCategoryGroup.title,
      categoryKey: selectedCategoryGroup.key,
      price,
      costPrice,
      stockQty,
      minStock,
      isAvailable,
      portion: portion.trim() || undefined,
      brand: brand.trim() || undefined,
      notes: notes.trim() || undefined,
      dietaryTags: selectedTags,
    });

    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#E8DFD3] overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-b border-[#E8DFD3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#3E6B48] text-white flex items-center justify-center font-bold text-xs">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2D251E] flex items-center gap-2">
                <span>Tambah Data Menu Baru</span>
                <span className="text-xs font-mono font-semibold text-[#8C7A6B]">({estimatedSku})</span>
              </h3>
              <p className="text-xs text-[#8C7A6B]">Daftarkan menu baru ke master stok & katalog kasir</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#E0D5C7] flex items-center justify-center text-[#6E5D4F] hover:text-[#2D251E] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          
          {/* Menu Name */}
          <div>
            <label className="block font-bold text-[#2D251E] mb-1">
              Nama Menu / Produk *
            </label>
            <input
              type="text"
              placeholder="Misal: GF Avocado Fudge Brownie, Dimsum Ayam Seaweed..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E0D5C7] rounded-xl focus:ring-2 focus:ring-[#3E6B48] focus:outline-none font-semibold text-sm"
              required
            />
          </div>

          {/* Category & Portion */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#6E5D4F] mb-1">
                Kategori Menu *
              </label>
              <select
                value={categoryKey}
                onChange={(e) => setCategoryKey(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E0D5C7] rounded-xl focus:ring-2 focus:ring-[#3E6B48] focus:outline-none cursor-pointer"
              >
                {CATEGORY_GROUPS.map((cg) => (
                  <option key={cg.key} value={cg.key}>
                    {cg.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#6E5D4F] mb-1">
                Kemasan / Porsi
              </label>
              <input
                type="text"
                placeholder="Misal: 250gr, 300ml, isi 10pcs, 1/2 ekor"
                value={portion}
                onChange={(e) => setPortion(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E0D5C7] rounded-xl focus:ring-2 focus:ring-[#3E6B48] focus:outline-none"
              />
            </div>
          </div>

          {/* Price, HPP and Profit preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E8DFD3]">
            <div>
              <label className="block font-semibold text-[#2D251E] mb-1">
                Harga Jual Kasir (Rp) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8C7A6B]">
                  Rp
                </span>
                <input
                  type="text"
                  value={priceStr}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '');
                    setPriceStr(clean ? Number(clean).toLocaleString('id-ID') : '');
                  }}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#E0D5C7] rounded-xl font-mono font-bold text-sm focus:ring-2 focus:ring-[#3E6B48] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#6E5D4F] mb-1">
                Harga Modal / HPP (Rp) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8C7A6B]">
                  Rp
                </span>
                <input
                  type="text"
                  value={costPriceStr}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '');
                    setCostPriceStr(clean ? Number(clean).toLocaleString('id-ID') : '');
                  }}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#E0D5C7] rounded-xl font-mono text-sm focus:ring-2 focus:ring-[#3E6B48] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-2 pt-1 border-t border-[#E8DFD3] flex items-center justify-between text-[11px] text-[#6E5D4F]">
              <span>Estimasi Margin Keuntungan:</span>
              <span className="font-bold text-emerald-700 font-mono">
                {formatRupiah(profit)} ({margin}%)
              </span>
            </div>
          </div>

          {/* Stock & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#6E5D4F] mb-1">
                Jumlah Stok Fisik Awal
              </label>
              <input
                type="number"
                min="0"
                value={stockQtyStr}
                onChange={(e) => setStockQtyStr(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E0D5C7] rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#6E5D4F] mb-1">
                Brand / Produsen (Opsional)
              </label>
              <input
                type="text"
                placeholder="Rarumi, Berkah Chicken, dll"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E0D5C7] rounded-xl"
              />
            </div>
          </div>

          {/* Dietary Tag Badges Multi-select */}
          <div>
            <label className="block font-semibold text-[#2D251E] mb-1.5">
              Label Diet & Kriteria Sehat
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableDietTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleDietTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#3E6B48] text-white shadow-2xs'
                        : 'bg-[#F4EFEA] text-[#6E5D4F] hover:bg-[#EBE2D7]'
                    }`}
                  >
                    {tag} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-[#6E5D4F] mb-1">
              Catatan Menu / Keterangan Penyimpanan
            </label>
            <input
              type="text"
              placeholder="Misal: Simpan beku di freezer, reheat kukus 5 menit..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E0D5C7] rounded-xl"
            />
          </div>

          {/* Availability Switch */}
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8DFD3] flex items-center justify-between">
            <div>
              <p className="font-bold text-[#2D251E]">Status Ketersediaan</p>
              <p className="text-[11px] text-[#8C7A6B]">
                {isAvailable ? 'Siap dijual (Ready Stock)' : 'Habis hari ini (❎)'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAvailable(!isAvailable)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                isAvailable 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {isAvailable ? 'Ready' : 'Habis ❎'}
            </button>
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-[#E8DFD3] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E0D5C7] text-xs font-semibold text-[#6E5D4F] hover:bg-[#FAF8F5] cursor-pointer"
            >
              Batal
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#3E6B48] hover:bg-[#34593C] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan ke Master Menu</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
