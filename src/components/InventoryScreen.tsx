import React, { useState, useMemo } from 'react';
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
  Tag
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { CATEGORY_GROUPS, formatRupiah, formatShortPrice, DietaryTag } from '../data/masterMenu';
import { Product } from '../types/pos';

export const InventoryScreen: React.FC = () => {
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
    stockQty: 10,
    minStock: 3,
    isAvailable: true,
    portion: '250gr',
    dietaryTags: ['GF'],
    brand: 'Rarumi',
    notes: '',
  });

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
            Kelola {products.length} menu master, status ketersediaan (❎), harga jual, dan HPP
          </p>
        </div>

        <div className="flex items-center gap-2">
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
            <span>Tambah Menu</span>
          </button>
        </div>
      </div>

      {/* Inventory Mini Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-[#E8DFD3]">
          <span className="text-[11px] font-medium text-[#8C7A6B]">Total Master Menu</span>
          <p className="text-xl font-bold font-mono text-[#2D251E] mt-1">{products.length} Item</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#E8DFD3]">
          <span className="text-[11px] font-medium text-emerald-700">Ready Stock</span>
          <p className="text-xl font-bold font-mono text-emerald-800 mt-1">{readyCount} Item</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#E8DFD3]">
          <span className="text-[11px] font-medium text-rose-700">Habis (❎)</span>
          <p className="text-xl font-bold font-mono text-rose-800 mt-1">{outCount} Item</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#E8DFD3]">
          <span className="text-[11px] font-medium text-[#8C7A6B]">Total Nilai HPP Aset</span>
          <p className="text-xl font-bold font-mono text-[#3E6B48] mt-1">{formatRupiah(totalAssetValue)}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8DFD3] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A6B]" />
            <input
              type="text"
              placeholder="Cari nama menu, SKU, atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#FAF8F5] border border-[#E0D5C7] rounded-xl focus:ring-2 focus:ring-[#3E6B48] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#F4EFEA] p-1 rounded-xl text-xs shrink-0">
            <button
              onClick={() => setFilterAvailability('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterAvailability === 'all' ? 'bg-white text-[#2D251E] shadow-xs font-semibold' : 'text-[#6E5D4F]'
              }`}
            >
              Semua ({products.length})
            </button>
            <button
              onClick={() => setFilterAvailability('ready')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterAvailability === 'ready' ? 'bg-white text-emerald-800 shadow-xs font-semibold' : 'text-[#6E5D4F]'
              }`}
            >
              Tersedia ({readyCount})
            </button>
            <button
              onClick={() => setFilterAvailability('out')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterAvailability === 'out' ? 'bg-white text-rose-800 shadow-xs font-semibold' : 'text-[#6E5D4F]'
              }`}
            >
              Habis ❎ ({outCount})
            </button>
          </div>
        </div>

        {/* Category Horizontal Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg shrink-0 transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#2D251E] text-white font-medium'
                : 'bg-[#F4EFEA] text-[#6E5D4F] hover:bg-[#EBE2D7]'
            }`}
          >
            Semua ({products.length})
          </button>
          {CATEGORY_GROUPS.map((c) => {
            const count = products.filter(p => p.categoryKey === c.key).length;
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
                <th className="py-3.5 px-4">Harga Jual</th>
                <th className="py-3.5 px-4">HPP (Modal)</th>
                <th className="py-3.5 px-4 text-center">Stok Fisik</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4]">
              {filteredProducts.map((p) => {
                const margin = p.price > 0 ? Math.round(((p.price - p.costPrice) / p.price) * 100) : 0;

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

                    {/* Price */}
                    <td className="py-3 px-4 font-mono font-bold text-[#2D251E]">
                      {formatRupiah(p.price)}
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
                          title="Edit Menu"
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

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg border border-[#E8DFD3] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-3">
              <h3 className="font-bold text-sm text-[#2D251E]">Edit Master Menu ({editingProduct.sku})</h3>
              <button 
                onClick={() => setEditingProduct(null)}
                className="text-[#8C7A6B] hover:text-[#2D251E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-[#6E5D4F] mb-1">Nama Menu</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#6E5D4F] mb-1">Harga Jual (Rp)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#6E5D4F] mb-1">HPP / Modal (Rp)</label>
                  <input
                    type="number"
                    value={editingProduct.costPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, costPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl font-mono"
                    required
                  />
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
                    className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl font-mono"
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
                    className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl"
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
                  className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="availCheck"
                  checked={editingProduct.isAvailable}
                  onChange={(e) => setEditingProduct({ ...editingProduct, isAvailable: e.target.checked })}
                  className="rounded text-[#3E6B48]"
                />
                <label htmlFor="availCheck" className="font-semibold text-[#2D251E]">
                  Status Ready Stock (Hilangkan centang jika Habis ❎)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8DFD3]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-[#E0D5C7] rounded-xl text-[#6E5D4F] hover:bg-[#FAF8F5]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3E6B48] text-white rounded-xl font-semibold hover:bg-[#34593C]"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg border border-[#E8DFD3] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-3">
              <h3 className="font-bold text-sm text-[#2D251E]">Tambah Menu Baru ke Master Data</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#8C7A6B] hover:text-[#2D251E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNew} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-[#6E5D4F] mb-1">Nama Menu</label>
                <input
                  type="text"
                  placeholder="Misal: GF Brownies Almond"
                  value={newProductData.name}
                  onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#6E5D4F] mb-1">Kategori</label>
                  <select
                    value={newProductData.categoryKey}
                    onChange={(e) => {
                      const selectedGroup = CATEGORY_GROUPS.find(g => g.key === e.target.value);
                      if (selectedGroup) {
                        setNewProductData({
                          ...newProductData,
                          categoryKey: selectedGroup.key,
                          category: selectedGroup.title
                        });
                      }
                    }}
                    className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl bg-white"
                  >
                    {CATEGORY_GROUPS.map((g) => (
                      <option key={g.key} value={g.key}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#6E5D4F] mb-1">Kemasan / Porsi</label>
                  <input
                    type="text"
                    placeholder="misal: 250gr, isi 10pcs"
                    value={newProductData.portion || ''}
                    onChange={(e) => setNewProductData({ ...newProductData, portion: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#6E5D4F] mb-1">Harga Jual (Rp)</label>
                  <input
                    type="number"
                    value={newProductData.price}
                    onChange={(e) => setNewProductData({ ...newProductData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#6E5D4F] mb-1">HPP / Biaya Modal (Rp)</label>
                  <input
                    type="number"
                    value={newProductData.costPrice}
                    onChange={(e) => setNewProductData({ ...newProductData, costPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl font-mono"
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
                    className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#6E5D4F] mb-1">Brand (Opsional)</label>
                  <input
                    type="text"
                    value={newProductData.brand || ''}
                    onChange={(e) => setNewProductData({ ...newProductData, brand: e.target.value })}
                    placeholder="Rarumi, Lingkar Organik, dll"
                    className="w-full px-3 py-2 border border-[#E0D5C7] rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8DFD3]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-[#E0D5C7] rounded-xl text-[#6E5D4F] hover:bg-[#FAF8F5]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3E6B48] text-white rounded-xl font-semibold hover:bg-[#34593C]"
                >
                  Tambahkan ke Master
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
