import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  PieChart, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight,
  Calendar,
  Wallet,
  Package,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { formatRupiah, CATEGORY_GROUPS } from '../data/masterMenu';

export const AnalyticsScreen: React.FC = () => {
  const { analytics, transactions, products } = usePOS();
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  const {
    totalRevenue,
    totalProfit,
    totalOrders,
    averageOrderValue,
    outOfStockCount,
    inStockCount,
    topProducts,
    categorySales,
    paymentBreakdown
  } = analytics;

  const profitMargin = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0;
  const stockAvailabilityRate = products.length > 0 
    ? Math.round((inStockCount / products.length) * 100) 
    : 0;

  // Sorted categories by revenue
  const sortedCategories = Object.entries(categorySales)
    .sort(([, a], [, b]) => b.total - a.total);

  const maxCatSales = sortedCategories.length > 0 ? sortedCategories[0][1].total : 1;

  // Export report to CSV
  const handleExportCSV = () => {
    let csv = `Laporan Transaksi Kasir Pintar - Rarumi Kitchen\n`;
    csv += `Tanggal Export: ${new Date().toLocaleDateString('id-ID')}\n\n`;
    csv += `No Invoice,Waktu,Pelanggan,Metode Bayar,Total,Status\n`;

    transactions.forEach(t => {
      csv += `"${t.invoiceNumber}","${t.createdAt}","${t.customerName || '-'}","${t.paymentMethod}",${t.total},"${t.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Kasir_Pintar_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header with Time Period Selector & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3E6B48]"></span>
            <h1 className="text-xl font-bold tracking-tight text-[#2D251E] font-serif-display">
              Analisa Bisnis & Performa Kasir
            </h1>
          </div>
          <p className="text-xs text-[#8C7A6B] mt-0.5">
            Analitik komprehensif omzet, laba kotor (HPP), dan perputaran stok harian
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Time range tabs */}
          <div className="flex items-center gap-1 bg-[#F4EFEA] p-1 rounded-xl text-xs">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                timeRange === 'today'
                  ? 'bg-white text-[#2D251E] shadow-xs font-semibold'
                  : 'text-[#6E5D4F]'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                timeRange === 'week'
                  ? 'bg-white text-[#2D251E] shadow-xs font-semibold'
                  : 'text-[#6E5D4F]'
              }`}
            >
              Minggu Ini
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                timeRange === 'month'
                  ? 'bg-white text-[#2D251E] shadow-xs font-semibold'
                  : 'text-[#6E5D4F]'
              }`}
            >
              Bulan Ini
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E0D5C7] rounded-xl text-xs font-semibold text-[#2D251E] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#3E6B48]" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Omzet */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD3] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-[#8C7A6B] text-xs font-medium mb-1">
            <span>Total Penjualan (Omzet)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#2D251E] tracking-tight">
            {formatRupiah(totalRevenue)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 mt-2 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Dari {totalOrders} transaksi berhasil</span>
          </div>
        </div>

        {/* Card 2: Laba Kotor (Gross Profit) */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD3] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-[#8C7A6B] text-xs font-medium mb-1">
            <span>Estimasi Laba Kotor</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#3E6B48] tracking-tight">
            {formatRupiah(totalProfit)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#6E5D4F] mt-2">
            <span className="font-semibold text-emerald-700">{profitMargin}%</span>
            <span>Margin Keuntungan Bersih</span>
          </div>
        </div>

        {/* Card 3: Rata-rata Nilai Belanja (AOV) */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD3] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-[#8C7A6B] text-xs font-medium mb-1">
            <span>Rata-Rata Belanja (AOV)</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#2D251E] tracking-tight">
            {formatRupiah(averageOrderValue)}
          </div>
          <div className="text-xs text-[#8C7A6B] mt-2">
            Per transaksi pesanan kasir
          </div>
        </div>

        {/* Card 4: Status Ketersediaan Stok */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD3] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-[#8C7A6B] text-xs font-medium mb-1">
            <span>Rasio Stok Tersedia</span>
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#2D251E] tracking-tight">
            {stockAvailabilityRate}%
          </div>
          <div className="flex items-center gap-2 text-xs text-[#8C7A6B] mt-2">
            <span className="text-emerald-700 font-semibold">{inStockCount} Ready</span>
            <span>·</span>
            <span className="text-rose-700 font-semibold">{outOfStockCount} Habis ❎</span>
          </div>
        </div>

      </div>

      {/* Row 2: Top Selling Products & Sales by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top 8 Fast-Moving Products (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#2D251E] flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Produk Terlaris (Fast Moving)</span>
              </h3>
              <p className="text-xs text-[#8C7A6B]">Menu dengan volume penjualan terbanyak</p>
            </div>
            <span className="text-xs font-mono text-[#3E6B48] font-semibold">Top {topProducts.length}</span>
          </div>

          <div className="divide-y divide-[#F2ECE4]">
            {topProducts.length === 0 ? (
              <p className="text-xs text-center py-8 text-[#A39281]">Belum ada data penjualan tercatat.</p>
            ) : (
              topProducts.map((p, idx) => {
                const maxQty = topProducts[0].qty || 1;
                const percentage = Math.round((p.qty / maxQty) * 100);

                return (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 space-y-1.5">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          idx === 0 
                            ? 'bg-amber-100 text-amber-800' 
                            : idx === 1 
                            ? 'bg-slate-200 text-slate-800' 
                            : idx === 2 
                            ? 'bg-amber-50 text-amber-700' 
                            : 'bg-stone-100 text-[#8C7A6B]'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-[#2D251E] truncate">{p.name}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold font-mono text-[#2D251E]">{p.qty} porsi</span>
                        <span className="text-[#8C7A6B] text-[11px] block font-mono">
                          {formatRupiah(p.revenue)}
                        </span>
                      </div>
                    </div>
                    {/* Visual Bar */}
                    <div className="w-full bg-[#F4EFEA] h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#3E6B48] h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Category Contribution (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#2D251E] flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#3E6B48]" />
                <span>Omzet per Kategori</span>
              </h3>
              <p className="text-xs text-[#8C7A6B]">Pangsa penjualan per kelompok menu</p>
            </div>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {sortedCategories.length === 0 ? (
              <p className="text-xs text-center py-8 text-[#A39281]">Belum ada kategori terjual.</p>
            ) : (
              sortedCategories.map(([key, data]) => {
                const pctOfTotal = totalRevenue > 0 ? Math.round((data.total / totalRevenue) * 100) : 0;
                const barWidth = Math.round((data.total / maxCatSales) * 100);

                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#2D251E] truncate max-w-[180px]">
                        {data.name}
                      </span>
                      <div className="text-right font-mono">
                        <span className="font-bold text-[#2D251E]">{formatRupiah(data.total)}</span>
                        <span className="text-[#8C7A6B] text-[11px] ml-1.5">({pctOfTotal}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-[#F4EFEA] h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-700 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${barWidth}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Row 3: Payment Breakdown & Stock Restock Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Payment Methods (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-sm text-[#2D251E] flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-700" />
              <span>Metode Pembayaran</span>
            </h3>
            <p className="text-xs text-[#8C7A6B]">Kanal penerimaan uang kasir</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(paymentBreakdown).map(([method, amount]) => {
              const pct = totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0;
              return (
                <div key={method} className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E8DFD3]">
                  <p className="text-[11px] text-[#8C7A6B] font-medium uppercase tracking-wider">
                    {method.replace('_', ' ')}
                  </p>
                  <p className="text-base font-bold font-mono text-[#2D251E] mt-1">
                    {formatRupiah(amount)}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                    {pct}% dari total transaksi
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stock Inventory Alert / Restock Recommendations (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-sm text-[#2D251E] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Analisa Kebutuhan Restock</span>
            </h3>
            <p className="text-xs text-[#8C7A6B]">
              {outOfStockCount} menu saat ini berstatus habis (❎) di master data
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#3E6B48] mt-0.5 shrink-0" />
              <div className="text-xs text-[#2D251E] space-y-1">
                <p className="font-semibold">Saran Tindakan Kasir & Dapur:</p>
                <ul className="list-disc pl-4 space-y-1 text-[#6E5D4F]">
                  <li>
                    Menu <strong>Dessert Jar 300ml</strong> & <strong>PETITE Jar</strong> semuanya berstatus habis (❎️). Siapkan batch baking sore untuk memenuhi pesanan malam.
                  </li>
                  <li>
                    Bahan segar <strong>Ayam & Daging Organik</strong> grassfed banyak yang habis. Hubungi supplier Berkah Chicken untuk pengiriman subuh.
                  </li>
                  <li>
                    Menu <strong>LAUK Siap Saji</strong> dan <strong>Frozen Food Bebas Telur</strong> memiliki permintaan stabil dan stok mencukupi.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
