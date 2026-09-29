import React, { useState, useMemo, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  DollarSign, 
  Boxes, 
  Save, 
  X,
  FileCheck,
  Tag,
  Users,
  Percent,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { CATEGORY_GROUPS, formatRupiah, formatShortPrice, DietaryTag } from '../data/masterMenu';
import { Product } from '../types/pos';

interface InventoryScreenProps {
  onOpenResellerModal?: () => void;
}

export const InventoryScreen: React.FC<InventoryScreenProps> = ({ onOpenResellerModal }) => {
  const { 
    products, 
    toggleProductStock, 
    updateProduct, 
    addProduct, 
    deleteProduct, 
    resetToDefaultCatalog 
  } = usePOS();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterAvailability, setFilterAvailability] = useState<'all' | 'ready' | 'out'>('all');
  
  // Edit modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newProductData, setNewProductData] = useState<Omit<Product, 'id' | 'sku'>>({
    name: '',
    category: CATEGORY_GROUPS[0].title,
    categoryKey: CATEGORY_GROUPS[0].key,
    price: 35000,
    costPrice: 22000,
    resellerPrice: 28500,
    stockQty: 10,
    minStock: 3,
    isAvailable: true,
    portion: '250gr',
    dietaryTags: ['GF'],
    brand: 'Rarumi',
    notes: '',
  });

  // Handle ESC key to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (editingProduct) setEditingProduct(null);
        if (isAddModalOpen) setIsAddModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingProduct, isAddModalOpen]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'all' && p.categoryKey !== selectedCategory) {
        return false;
      }
      if (filterAvailability === 'ready' && !p.isAvailable) return false;
      if (filterAvailability === 'out' && p.isAvailable) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, selectedCategory, filterAvailability, searchQuery]);

  // Inventory value calculations
  const totalAssetValue = products.reduce((sum, p) => sum + (p.stockQty * p.costPrice), 0);
  const totalPotentialRevenue = products.reduce((sum, p) => sum + (p.stockQty * p.price), 0);
  const readyCount = products.filter(p => p.isAvailable).length;
  const outCount = products.filter(p => !p.isAvailable).length;

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductData.name.trim()) return;
    addProduct(newProductData);
    setIsAddModalOpen(false);
    // Reset form
    setNewProductData({
      name: '',
      category: CATEGORY_GROUPS[0].title,
      categoryKey: CATEGORY_GROUPS[0].key,
      price: 35000,
      costPrice: 22000,
      resellerPrice: 28500,
      stockQty: 10,
      minStock: 3,
      isAvailable: true,
      portion: '',
      dietaryTags: ['GF'],
      brand: 'Rarumi',
      notes: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header and Asset Value Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3E6B48]"></span>
            <h1 className="text-xl font-bold tracking-tight text-[#2D251E] font-serif-display">
              Master Data & Manajemen Stok
            </h1>
          </div>
          <p className="text-xs text-[#8C7A6B] mt-0.5">
            Kelola {products.length} menu master, status ketersediaan (❎), harga jual, harga khusus reseller, dan HPP
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {onOpenResellerModal && (
            <button
              onClick={onOpenResellerModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-xl text-xs font-bold text-amber-900 transition-colors cursor-pointer shadow-xs"
              title="Buka Daftar Mitra Reseller & Aturan Diskon"
            >
              <Users className="w-3.5 h-3.5 text-amber-700" />
              <span>Daftar Mitra Reseller</span>
            </button>
          )}

          <button
            onClick={() => {
              if (window.confirm('Reset seluruh katalog ke data awal broadcast? Semua perubahan harga dan stok custom akan dikembalikan ke default.')) {
                resetToDefaultCatalog();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E0D5C7] rounded-xl text-xs font-semibold text-[#6E5D4F] hover:text-[#2D251E] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            title="Kembalikan ke master data awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Awal</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#3E6B48] hover:bg-[#34593C] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Menu Baru</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E8DFD3] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-[#8C7A6B]">Menu Siap (Ready)</p>
            <p className="text-lg font-bold font-mono text-[#2D251E]">{readyCount} Menu</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8DFD3] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <XCircle className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <p className="text-xs text-[#8C7A6B]">Menu Habis (❎)</p>
            <p className="text-lg font-bold font-mono text-rose-700">{outCount} Menu</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8DFD3] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-[#8C7A6B]">Nilai Modal Stok (HPP)</p>
            <p className="text-lg font-bold font-mono text-[#2D251E]">{formatShortPrice(totalAssetValue)}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8DFD3] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F4EFEA] text-[#3E6B48] flex items-center justify-center font-bold">
            <Boxes className="w-5 h-5 text-[#3E6B48]" />
          </div>
          <div>
            <p className="text-xs text-[#8C7A6B]">Potensi Omzet</p>
            <p className="text-lg font-bold font-mono text-[#3E6B48]">{formatShortPrice(totalPotentialRevenue)}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#E8DFD3] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari SKU, nama menu, kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E0D5C7] outline-none focus:border-[#3E6B48] bg-[#FCFBF9]"
            />
          </div>

          {/* Availability Status Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F4EFEA] rounded-xl text-xs w-full sm:w-auto">
            <button
              onClick={() => setFilterAvailability('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterAvailability === 'all'
                  ? 'bg-white text-[#2D251E] shadow-xs'
                  : 'text-[#6E5D4F] hover:text-[#2D251E]'
              }`}
            >
              Semua ({products.length})
            </button>
            <button
              onClick={() => setFilterAvailability('ready')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                filterAvailability === 'ready'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-[#6E5D4F] hover:text-[#2D251E]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ready ({readyCount})</span>
            </button>
            <button
              onClick={() => setFilterAvailability('out')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                filterAvailability === 'out'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-[#6E5D4F] hover:text-[#2D251E]'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Habis ({outCount})</span>
            </button>
          </div>
        </div>

        {/* Category Horizontal Scroll Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg shrink-0 transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#2D251E] text-white font-medium'
                : 'bg-[#F4EFEA] text-[#6E5D4F] hover:bg-[#EBE2D7]'
            }`}
          >
            Semua Kategori ({products.length})
          </button>
          {CATEGORY_GROUPS.map((c) => {
            const count = products.filter(p => p.categoryKey === c.key).length;
            if (count === 0) return null;
            return (
              <button
                key={c.key}
                onClick={() => setSelectedCategory(c.key)}
                className={`px-3 py-1.5 rounded-lg shrink-0 transition-colors ${
                  selectedCategory === c.key
                    ? 'bg-[#2D251E] text-white font-medium'
                    : 'bg-[#F4EFEA] text-[#6E5D4F] hover:bg-[#EBE2D7]'
                }`}
              >
                {c.title} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Inventory Table */}
      <div className="bg-white rounded-3xl border border-[#E8DFD3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E8DFD3] text-[#8C7A6B] font-semibold">
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Nama Menu</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Harga Jual (Retail)</th>
                <th className="py-3.5 px-4 bg-amber-50/50 text-amber-900">Harga Reseller</th>
                <th className="py-3.5 px-4">HPP (Modal)</th>
                <th className="py-3.5 px-4 text-center">Stok Fisik</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4]">
              {filteredProducts.map((p) => {
                const margin = p.price > 0 ? Math.round(((p.price - p.costPrice) / p.price) * 100) : 0;
                const effectiveResellerPrice = p.resellerPrice || Math.round((p.price * 0.82) / 500) * 500;
                const resellerDiscountPct = p.price > 0 ? Math.round(((p.price - effectiveResellerPrice) / p.price) * 100) : 0;

                return (
                  <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    {/* SKU */}
                    <td className="py-3 px-4 font-mono font-bold text-[#A39281]">
                      {p.sku}
                    </td>

                    {/* Name & Tags */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#2D251E]">{p.name}</p>
                      <div className="flex items-center gap-1 text-[11px] text-[#8C7A6B] mt-0.5">
                        {p.portion && <span>{p.portion}</span>}
                        {p.portion && p.dietaryTags.length > 0 && <span>·</span>}
                        {p.dietaryTags.length > 0 && (
                          <span className="text-[#3E6B48] font-medium">
                            {p.dietaryTags.join(', ')}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-[#6E5D4F]">
                      {p.category}
                    </td>

                    {/* Price Retail */}
                    <td className="py-3 px-4 font-mono font-bold text-[#2D251E]">
                      {formatRupiah(p.price)}
                    </td>

                    {/* Reseller Price */}
                    <td className="py-3 px-4 font-mono font-bold bg-amber-50/40 text-amber-900">
                      <span>{formatRupiah(effectiveResellerPrice)}</span>
                      <span className="text-[10px] text-amber-700 bg-amber-100 font-semibold px-1.5 py-0.5 rounded-full ml-1.5">
                        -{resellerDiscountPct}%
                      </span>
                    </td>

                    {/* Cost / HPP */}
                    <td className="py-3 px-4 font-mono text-[#8C7A6B]">
                      {formatRupiah(p.costPrice)}
                      <span className="text-[10px] text-emerald-700 ml-1.5 font-semibold">
                        ({margin}%)
                      </span>
                    </td>

                    {/* Stock Qty */}
                    <td className="py-3 px-4 text-center font-mono font-bold text-[#2D251E]">
                      {p.stockQty}
                    </td>

                    {/* Status Toggle Switch */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleProductStock(p.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                          p.isAvailable
                            ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                        }`}
                        title="Klik untuk ubah status"
                      >
                        {p.isAvailable ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Ready</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Habis ❎</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="p-1.5 rounded-lg text-[#6E5D4F] hover:text-[#2D251E] hover:bg-[#FAF8F5] transition-colors"
                          title="Edit Menu & Harga Reseller"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus ${p.name} dari master data?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus Menu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal with Exit Button */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg border border-[#E8DFD3] shadow-2xl space-y-4 my-4">
            
            {/* Header with Exit Button */}
            <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-3">
              <div>
                <h3 className="font-bold text-sm text-[#2D251E]">Edit Master Menu ({editingProduct.sku})</h3>
                <p className="text-[11px] text-[#8C7A6B]">Ubah harga jual umum, harga mitra reseller, dan HPP</p>
              </div>
              <button 
                onClick={() => setEditingProduct(null)}
                className="w-8 h-8 rounded-full bg-white border border-[#E0D5C7] flex items-center justify-center text-[#6E5D4F] hover:text-[#2D251E] hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
                title="Tutup / Keluar (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block font-medium text-[#6E5D4F] mb-1">Nama Menu</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl font-semibold outline-none focus:border-[#3E6B48]"
                  required
                />
              </div>

              {/* Pricing Grid (Retail, Reseller, HPP) */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-[#6E5D4F] mb-1">Harga Jual (Rp)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl font-mono font-bold outline-none focus:border-[#3E6B48]"
                    required
                  />
                  <span className="text-[10px] text-[#8C7A6B] mt-0.5 block">Harga Retail</span>
                </div>

                <div className="bg-amber-50/70 p-1.5 rounded-xl border border-amber-200">
                  <label className="block font-bold text-amber-900 mb-1">Harga Reseller (Rp)</label>
                  <input
                    type="number"
                    value={editingProduct.resellerPrice || Math.round((editingProduct.price * 0.82) / 500) * 500}
                    onChange={(e) => setEditingProduct({ ...editingProduct, resellerPrice: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 border border-amber-300 rounded-lg font-mono font-bold bg-white text-amber-900 outline-none focus:ring-1 focus:ring-amber-500"
                    required
                  />
                  <span className="text-[10px] text-amber-700 mt-0.5 block font-medium">Khusus Grosir</span>
                </div>

                <div>
                  <label className="block font-medium text-[#6E5D4F] mb-1">HPP / Modal (Rp)</label>
                  <input
                    type="number"
                    value={editingProduct.costPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, costPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl font-mono outline-none focus:border-[#3E6B48]"
                    required
                  />
                  <span className="text-[10px] text-[#8C7A6B] mt-0.5 block">Modal Dapur</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#6E5D4F] mb-1">Stok Fisik</label>
                  <input
                    type="number"
                    value={editingProduct.stockQty}
                    onChange={(e) => {
                      const qty = Number(e.target.value);
                      setEditingProduct({ 
                        ...editingProduct, 
                        stockQty: qty,
                        isAvailable: qty > 0 
                      });
                    }}
                    className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl font-mono outline-none focus:border-[#3E6B48]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#6E5D4F] mb-1">Kemasan / Porsi</label>
                  <input
                    type="text"
                    value={editingProduct.portion || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, portion: e.target.value })}
                    placeholder="misal: 250gr, 1L, isi 10pcs"
                    className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl outline-none focus:border-[#3E6B48]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#6E5D4F] mb-1">Catatan / Keterangan</label>
                <input
                  type="text"
                  value={editingProduct.notes || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, notes: e.target.value })}
                  placeholder="Keterangan tambahan..."
                  className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl outline-none focus:border-[#3E6B48]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="availCheck"
                  checked={editingProduct.isAvailable}
                  onChange={(e) => setEditingProduct({ ...editingProduct, isAvailable: e.target.checked })}
                  className="rounded text-[#3E6B48] focus:ring-[#3E6B48]"
                />
                <label htmlFor="availCheck" className="font-semibold text-[#2D251E] cursor-pointer">
                  Status Ready Stock (Hilangkan centang jika Habis ❎)
                </label>
              </div>

              {/* Bottom Footer Actions with Exit Button */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8DFD3]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-[#E0D5C7] rounded-xl text-[#6E5D4F] hover:bg-[#FAF8F5] cursor-pointer transition-colors"
                >
                  Batal / Keluar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3E6B48] text-white rounded-xl font-semibold hover:bg-[#34593C] cursor-pointer transition-colors shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Product Modal with Exit Button */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg border border-[#E8DFD3] shadow-2xl space-y-4 my-4">
            
            {/* Header with Exit Button */}
            <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-3">
              <div>
                <h3 className="font-bold text-sm text-[#2D251E]">Tambah Menu Baru ke Master Data</h3>
                <p className="text-[11px] text-[#8C7A6B]">Tambahkan produk dengan harga retail dan harga reseller</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-[#E0D5C7] flex items-center justify-center text-[#6E5D4F] hover:text-[#2D251E] hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
                title="Tutup / Keluar (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNew} className="space-y-3.5 text-xs max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block font-medium text-[#6E5D4F] mb-1">Nama Menu</label>
                <input
                  type="text"
                  placeholder="Misal: GF Brownies Almond"
                  value={newProductData.name}
                  onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl font-semibold outline-none focus:border-[#3E6B48]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#6E5D4F] mb-1">Kategori</label>
                  <select
                    value={newProductData.categoryKey}
                    onChange={(e) => {
                      const cat = CATEGORY_GROUPS.find(c => c.key === e.target.value);
                      setNewProductData({
                        ...newProductData,
                        categoryKey: e.target.value,
                        category: cat ? cat.title : 'Lainnya',
                      });
                    }}
                    className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl outline-none focus:border-[#3E6B48]"
                  >
                    {CATEGORY_GROUPS.map(c => (
                      <option key={c.key} value={c.key}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#6E5D4F] mb-1">Kemasan / Porsi</label>
                  <input
                    type="text"
                    placeholder="Misal: 300ml, 250gr"
                    value={newProductData.portion || ''}
                    onChange={(e) => setNewProductData({ ...newProductData, portion: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl outline-none focus:border-[#3E6B48]"
                  />
                </div>
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-[#6E5D4F] mb-1">Harga Retail (Rp)</label>
                  <input
                    type="number"
                    value={newProductData.price}
                    onChange={(e) => {
                      const p = Number(e.target.value);
                      setNewProductData({ 
                        ...newProductData, 
                        price: p,
                        resellerPrice: Math.round((p * 0.82) / 500) * 500
                      });
                    }}
                    className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl font-mono font-bold outline-none focus:border-[#3E6B48]"
                    required
                  />
                </div>

                <div className="bg-amber-50/70 p-1.5 rounded-xl border border-amber-200">
                  <label className="block font-bold text-amber-900 mb-1">Harga Reseller (Rp)</label>
                  <input
                    type="number"
                    value={newProductData.resellerPrice || Math.round((newProductData.price * 0.82) / 500) * 500}
                    onChange={(e) => setNewProductData({ ...newProductData, resellerPrice: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 border border-amber-300 rounded-lg font-mono font-bold bg-white text-amber-900 outline-none focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#6E5D4F] mb-1">HPP / Modal (Rp)</label>
                  <input
                    type="number"
                    value={newProductData.costPrice}
                    onChange={(e) => setNewProductData({ ...newProductData, costPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl font-mono outline-none focus:border-[#3E6B48]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#6E5D4F] mb-1">Stok Awal</label>
                  <input
                    type="number"
                    value={newProductData.stockQty}
                    onChange={(e) => setNewProductData({ ...newProductData, stockQty: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl font-mono outline-none focus:border-[#3E6B48]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#6E5D4F] mb-1">Min. Stok Peringatan</label>
                  <input
                    type="number"
                    value={newProductData.minStock}
                    onChange={(e) => setNewProductData({ ...newProductData, minStock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl font-mono outline-none focus:border-[#3E6B48]"
                    required
                  />
                </div>
              </div>

              {/* Bottom Footer Actions with Exit Button */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8DFD3]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-[#E0D5C7] rounded-xl text-[#6E5D4F] hover:bg-[#FAF8F5] cursor-pointer transition-colors"
                >
                  Batal / Keluar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3E6B48] text-white rounded-xl font-semibold hover:bg-[#34593C] cursor-pointer transition-colors shadow-xs"
                >
                  Simpan Menu Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
