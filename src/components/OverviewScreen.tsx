import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  Calendar, 
  Layers, 
  Database,
  ArrowRight,
  Package,
  Receipt,
  Users,
  Percent,
  RefreshCw,
  Phone,
  MessageCircle,
  ExternalLink,
  Store,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts';
import { usePOS } from '../context/POSContext';
import { formatRupiah, formatShortPrice } from '../data/masterMenu';
import { Reseller } from '../types/pos';

interface OverviewScreenProps {
  onNavigateToPOS?: () => void;
  onNavigateToInventory?: () => void;
  onNavigateToHistory?: () => void;
  onOpenResellerModal?: () => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  onNavigateToPOS,
  onNavigateToInventory,
  onNavigateToHistory,
  onOpenResellerModal,
}) => {
  const { 
    analytics, 
    transactions, 
    products, 
    resellers, 
    setSelectedResellerForCart, 
    setIsResellerMode, 
    isCloudSynced 
  } = usePOS();
  
  const [timeFilter, setTimeFilter] = useState<'7days' | '14days' | '30days' | 'all'>('7days');

  const {
    totalRevenue,
    totalProfit,
    totalOrders,
    averageOrderValue,
    inStockCount,
    outOfStockCount,
    categorySales,
  } = analytics;

  const profitMarginPercent = totalRevenue > 0 
    ? Math.round((totalProfit / totalRevenue) * 100) 
    : 0;

  // Filter transactions based on selected date range
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const days = timeFilter === '7days' ? 7 : timeFilter === '14days' ? 14 : timeFilter === '30days' ? 30 : 365;
    const cutoffTime = now.getTime() - days * 24 * 60 * 60 * 1000;

    return transactions.filter(t => {
      if (timeFilter === 'all') return true;
      return new Date(t.createdAt).getTime() >= cutoffTime;
    });
  }, [transactions, timeFilter]);

  // Daily Revenue Data prepared for Recharts AreaChart
  const dailyRevenueData = useMemo(() => {
    const dayMap: { [key: string]: { dateStr: string; label: string; revenue: number; orders: number; timestamp: number } } = {};
    const now = new Date();
    const numDays = timeFilter === '7days' ? 7 : timeFilter === '14days' ? 14 : timeFilter === '30days' ? 30 : 10;

    // Initialize all days in range so chart is continuous
    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
      dayMap[key] = {
        dateStr: key,
        label,
        revenue: 0,
        orders: 0,
        timestamp: d.getTime(),
      };
    }

    // Populate actual transaction revenues
    filteredTransactions.forEach(t => {
      if (t.status === 'COMPLETED') {
        const key = t.createdAt.slice(0, 10);
        if (dayMap[key]) {
          dayMap[key].revenue += t.total;
          dayMap[key].orders += 1;
        } else {
          const d = new Date(t.createdAt);
          dayMap[key] = {
            dateStr: key,
            label: d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
            revenue: t.total,
            orders: 1,
            timestamp: d.getTime(),
          };
        }
      }
    });

    return Object.values(dayMap).sort((a, b) => a.timestamp - b.timestamp);
  }, [filteredTransactions, timeFilter]);

  // Top Selling Categories Data prepared for Recharts BarChart
  const topCategoriesData = useMemo(() => {
    const arr = Object.values(categorySales);
    return arr
      .sort((a, b) => b.total - a.total)
      .slice(0, 6)
      .map(item => ({
        name: item.name.length > 18 ? item.name.substring(0, 16) + '...' : item.name,
        fullName: item.name,
        revenue: item.total,
        units: item.units,
      }));
  }, [categorySales]);

  // Palette colors for category bars
  const BAR_COLORS = ['#3E6B48', '#5B8C67', '#85AA8E', '#B38B59', '#D4A373', '#9D8189'];

  // Reseller Analytics calculations
  const totalResellerSpent = useMemo(() => {
    return resellers.reduce((sum, r) => sum + r.totalSpent, 0);
  }, [resellers]);

  const totalResellerOrders = useMemo(() => {
    return resellers.reduce((sum, r) => sum + r.totalOrdersCount, 0);
  }, [resellers]);

  const resellerTierBreakdown = useMemo(() => {
    const tiers = {
      PLATINUM: { count: 0, spent: 0, discount: '15%' },
      GOLD: { count: 0, spent: 0, discount: '10%' },
      SILVER: { count: 0, spent: 0, discount: '5%' },
    };
    resellers.forEach(r => {
      if (tiers[r.tier]) {
        tiers[r.tier].count += 1;
        tiers[r.tier].spent += r.totalSpent;
      }
    });
    return tiers;
  }, [resellers]);

  // Top Reseller Leaderboard sorted by totalSpent
  const sortedResellers = useMemo(() => {
    return [...resellers].sort((a, b) => b.totalSpent - a.totalSpent);
  }, [resellers]);

  // Reseller vs Retail percentage estimation
  const retailRevenue = Math.max(0, totalRevenue - totalResellerSpent);
  const totalCombinedOmzet = totalRevenue + totalResellerSpent;
  const resellerSharePercent = totalCombinedOmzet > 0 
    ? Math.round((totalResellerSpent / totalCombinedOmzet) * 100) 
    : 35;
  const retailSharePercent = 100 - resellerSharePercent;

  const handleStartOrderForReseller = (reseller: Reseller) => {
    setSelectedResellerForCart(reseller);
    setIsResellerMode(true);
    if (onNavigateToPOS) {
      onNavigateToPOS();
    }
  };

  const handleOpenWhatsAppChat = (phone: string, name: string) => {
    const clean = phone.replace(/\D/g, '');
    const msg = encodeURIComponent(`Halo ${name}, kami dari tim admin Rarumi Healthy Kitchen. Ada yang bisa kami bantu untuk pemesanan grosir reseller Anda hari ini? 🌱`);
    window.open(`https://api.whatsapp.com/send?phone=${clean}&text=${msg}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Welcome & KPI Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3E6B48]"></span>
            <h1 className="text-xl font-bold tracking-tight text-[#2D251E] font-serif-display">
              Ringkasan Kinerja & Overview Bisnis
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Live Real-Time
            </span>
          </div>
          <p className="text-xs text-[#8C7A6B] mt-0.5">
            Analisis pendapatan harian, kategori terlaris, performa kemitraan reseller, dan perputaran stok
          </p>
        </div>

        {/* Date Filter & Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 bg-[#F4EFEA] rounded-xl text-xs">
            <button
              onClick={() => setTimeFilter('7days')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                timeFilter === '7days' ? 'bg-white text-[#2D251E] shadow-xs' : 'text-[#6E5D4F] hover:text-[#2D251E]'
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setTimeFilter('14days')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                timeFilter === '14days' ? 'bg-white text-[#2D251E] shadow-xs' : 'text-[#6E5D4F] hover:text-[#2D251E]'
              }`}
            >
              14 Hari
            </button>
            <button
              onClick={() => setTimeFilter('30days')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                timeFilter === '30days' ? 'bg-white text-[#2D251E] shadow-xs' : 'text-[#6E5D4F] hover:text-[#2D251E]'
              }`}
            >
              30 Hari
            </button>
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                timeFilter === 'all' ? 'bg-white text-[#2D251E] shadow-xs' : 'text-[#6E5D4F] hover:text-[#2D251E]'
              }`}
            >
              Semua
            </button>
          </div>

          {onNavigateToPOS && (
            <button
              onClick={onNavigateToPOS}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#3E6B48] hover:bg-[#34593C] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Buka Kasir</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E8DFD3] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8C7A6B]">
            <span className="text-xs font-medium">Total Omzet Penjualan</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-[#2D251E] tracking-tight">
              {formatRupiah(totalRevenue)}
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{profitMarginPercent}% Margin Laba Bersih</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E8DFD3] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8C7A6B]">
            <span className="text-xs font-medium">Transaksi Sukses</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-[#2D251E] tracking-tight">
              {totalOrders} Order
            </h3>
            <p className="text-[11px] text-[#8C7A6B] mt-1">
              Rata-rata: <strong>{formatRupiah(averageOrderValue)}</strong>/order
            </p>
          </div>
        </div>

        {/* Reseller Revenue */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E8DFD3] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8C7A6B]">
            <span className="text-xs font-medium">Omzet Mitra Reseller</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-blue-900 tracking-tight">
              {formatRupiah(totalResellerSpent)}
            </h3>
            <p className="text-[11px] text-blue-700 font-semibold mt-1">
              {resellers.length} Mitra Reseller Terdaftar
            </p>
          </div>
        </div>

        {/* Ready Stock vs Out */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E8DFD3] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8C7A6B]">
            <span className="text-xs font-medium">Status Stok Menu</span>
            <div className="w-8 h-8 rounded-xl bg-[#F4EFEA] text-[#3E6B48] flex items-center justify-center font-bold">
              <Package className="w-4 h-4 text-[#3E6B48]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold font-mono text-[#3E6B48]">{inStockCount}</span>
              <span className="text-xs text-[#8C7A6B]">Ready</span>
              <span className="text-zinc-300">/</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-rose-600">{outOfStockCount}</span>
              <span className="text-xs text-[#8C7A6B]">Habis</span>
            </div>
            <p className="text-[11px] text-[#8C7A6B] mt-1">
              Total {products.length} menu di master data
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts Grid (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: Daily Revenue Trend (Recharts AreaChart) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8DFD3] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#3E6B48]" />
                <h3 className="font-bold text-base text-[#2D251E]">
                  Tren Pendapatan Harian
                </h3>
              </div>
              <p className="text-xs text-[#8C7A6B] mt-0.5">
                Fluktuasi omzet harian berdasarkan transaksi kasir
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#3E6B48] bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
              Total: {formatShortPrice(totalRevenue)}
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3E6B48" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3E6B48" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EAE1" />
                <XAxis 
                  dataKey="label" 
                  stroke="#8C7A6B" 
                  fontSize={11} 
                  tickLine={false}
                  axisLine={{ stroke: '#E8DFD3' }}
                />
                <YAxis 
                  stroke="#8C7A6B" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={{ stroke: '#E8DFD3' }}
                  tickFormatter={(val) => formatShortPrice(val)}
                  width={55}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#2D251E] text-white p-3 rounded-2xl shadow-xl text-xs font-mono border border-white/10">
                          <p className="text-zinc-400 mb-1">{data.dateStr}</p>
                          <p className="font-bold text-base text-emerald-400">{formatRupiah(data.revenue)}</p>
                          <p className="text-zinc-300 text-[11px] mt-1">{data.orders} transaksi selesai</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3E6B48" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#revenueGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Top-Selling Product Categories (Recharts BarChart) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8DFD3] shadow-xs space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-base text-[#2D251E]">
                Kategori Produk Terlaris
              </h3>
            </div>
            <p className="text-xs text-[#8C7A6B] mt-0.5">
              Distribusi kontribusi omzet per kategori menu
            </p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topCategoriesData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F0EAE1" />
                <XAxis 
                  type="number" 
                  stroke="#8C7A6B" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={{ stroke: '#E8DFD3' }}
                  tickFormatter={(val) => formatShortPrice(val)}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#4A3E33" 
                  fontSize={11} 
                  tickLine={false}
                  axisLine={{ stroke: '#E8DFD3' }}
                  width={90}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#2D251E] text-white p-2.5 rounded-xl shadow-lg text-xs font-mono">
                          <p className="font-bold text-amber-300">{data.name}</p>
                          <p className="text-emerald-400 font-bold">{formatRupiah(data.revenue)}</p>
                          <p className="text-zinc-300 text-[10px]">{data.units} porsi terjual</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="revenue" radius={[0, 8, 8, 0]}>
                  {topCategoriesData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* SPECIAL SECTION: DETAIL KINERJA RESELLER DI DASHBOARD */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8DFD3] shadow-xs space-y-5">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DFD3] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#2D251E]">
                  Detail Kinerja Mitra Reseller & Penjualan Grosir
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono">
                  {resellers.length} Mitra Aktif
                </span>
              </div>
              <p className="text-xs text-[#8C7A6B]">
                Analisis kontribusi omzet reseller, perbandingan dengan penjualan retail, dan leaderboard mitra
              </p>
            </div>
          </div>

          {onOpenResellerModal && (
            <button
              onClick={onOpenResellerModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-amber-700" />
              <span>Kelola Mitra Reseller (+ Tambah Baru)</span>
            </button>
          )}
        </div>

        {/* Reseller KPI Snapshot & Comparison Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Box 1: Retail vs Reseller Share */}
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8DFD3] space-y-3">
            <span className="text-xs font-bold text-[#2D251E] block">
              Porsi Omzet: Retail Langsung vs Reseller
            </span>
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-zinc-200 rounded-full overflow-hidden flex">
                <div 
                  className="bg-[#3E6B48] h-full transition-all" 
                  style={{ width: `${retailSharePercent}%` }}
                  title={`Retail: ${retailSharePercent}%`}
                />
                <div 
                  className="bg-amber-500 h-full transition-all" 
                  style={{ width: `${resellerSharePercent}%` }}
                  title={`Reseller: ${resellerSharePercent}%`}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#3E6B48] font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#3E6B48]"></span>
                  Retail: {retailSharePercent}% ({formatShortPrice(retailRevenue)})
                </span>
                <span className="text-amber-800 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Reseller: {resellerSharePercent}% ({formatShortPrice(totalResellerSpent)})
                </span>
              </div>
            </div>
            <p className="text-[11px] text-[#8C7A6B]">
              Reseller memberikan kepastian volume pesanan partai besar tanpa biaya akuisisi harian.
            </p>
          </div>

          {/* Box 2: Reseller Tier Performance */}
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8DFD3] space-y-2">
            <span className="text-xs font-bold text-[#2D251E] block">
              Distribusi Tier Kemitraan Reseller
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-white rounded-xl border border-amber-200 shadow-2xs">
                <span className="text-[10px] text-amber-700 font-bold block">PLATINUM</span>
                <span className="text-sm font-bold text-[#2D251E]">{resellerTierBreakdown.PLATINUM.count} Mitra</span>
                <span className="text-[10px] text-[#8C7A6B] block">Diskon 15%</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-amber-200 shadow-2xs">
                <span className="text-[10px] text-amber-600 font-bold block">GOLD</span>
                <span className="text-sm font-bold text-[#2D251E]">{resellerTierBreakdown.GOLD.count} Mitra</span>
                <span className="text-[10px] text-[#8C7A6B] block">Diskon 10%</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-zinc-200 shadow-2xs">
                <span className="text-[10px] text-zinc-600 font-bold block">SILVER</span>
                <span className="text-sm font-bold text-[#2D251E]">{resellerTierBreakdown.SILVER.count} Mitra</span>
                <span className="text-[10px] text-[#8C7A6B] block">Diskon 5%</span>
              </div>
            </div>
            <p className="text-[11px] text-[#8C7A6B]">
              Tier dihitung otomatis berdasarkan total frekuensi order dan akumulasi nilai belanja.
            </p>
          </div>

          {/* Box 3: Reseller Key Numbers */}
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8DFD3] space-y-2">
            <span className="text-xs font-bold text-[#2D251E] block">
              Statistik Grosir Reseller
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#8C7A6B]">Total Order Grosir:</span>
                <span className="font-bold font-mono text-[#2D251E]">{totalResellerOrders} Transaksi</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8C7A6B]">Rata-rata Order (AOV):</span>
                <span className="font-bold font-mono text-[#3E6B48]">
                  {formatRupiah(totalResellerOrders > 0 ? Math.round(totalResellerSpent / totalResellerOrders) : 485000)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8C7A6B]">Estimasi Margin Bersih:</span>
                <span className="font-bold text-emerald-700">~22% - 28%</span>
              </div>
            </div>
            <p className="text-[11px] text-[#8C7A6B]">
              Harga grosir diatur di master menu dan otomatis teraplikasi di keranjang kasir.
            </p>
          </div>

        </div>

        {/* Reseller Leaderboard Table */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-[#2D251E] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Leaderboard Mitra Reseller (Omzet Terbanyak)</span>
            </h4>
            <span className="text-[11px] text-[#8C7A6B]">
              Diurutkan berdasarkan akumulasi belanja
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#E8DFD3]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8DFD3] text-[#8C7A6B] font-semibold">
                  <th className="py-2.5 px-3 text-center">Rank</th>
                  <th className="py-2.5 px-3">Nama Mitra & Toko</th>
                  <th className="py-2.5 px-3">Wilayah / Kota</th>
                  <th className="py-2.5 px-3 text-center">Tier</th>
                  <th className="py-2.5 px-3 text-right">Total Belanja</th>
                  <th className="py-2.5 px-3 text-center">Total Order</th>
                  <th className="py-2.5 px-3 text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE4] bg-white">
                {sortedResellers.slice(0, 5).map((reseller, idx) => (
                  <tr key={reseller.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-2.5 px-3 text-center font-bold font-mono">
                      <span className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] ${
                        idx === 0 ? 'bg-amber-100 text-amber-900 font-bold' :
                        idx === 1 ? 'bg-zinc-200 text-zinc-800' :
                        idx === 2 ? 'bg-amber-50 text-amber-800' : 'text-[#8C7A6B]'
                      }`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <p className="font-bold text-[#2D251E]">{reseller.name}</p>
                      {reseller.storeName && (
                        <p className="text-[10px] text-[#8C7A6B]">{reseller.storeName}</p>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-[#6E5D4F]">
                      {reseller.city}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        reseller.tier === 'PLATINUM' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        reseller.tier === 'GOLD' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                        'bg-zinc-100 text-zinc-800'
                      }`}>
                        {reseller.tier} ({reseller.discountPercent || 10}%)
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#3E6B48]">
                      {formatRupiah(reseller.totalSpent)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono">
                      {reseller.totalOrdersCount}x
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenWhatsAppChat(reseller.phone, reseller.name)}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                          title="Chat WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleStartOrderForReseller(reseller)}
                          className="px-2 py-1 rounded-lg bg-[#2D251E] hover:bg-black text-white text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Buka Kasir dengan Reseller Ini"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Order POS</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Snapshot Tables & Quick Insight Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top 5 Best Selling Items Snapshot */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8DFD3] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#2D251E] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#3E6B48]" />
              <span>Top 5 Menu Paling Laris</span>
            </h3>
            {onNavigateToInventory && (
              <button
                onClick={onNavigateToInventory}
                className="text-xs text-[#3E6B48] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Kelola Stok</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="divide-y divide-[#F2ECE4]">
            {analytics.topProducts.slice(0, 5).map((prod, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    idx === 0 ? 'bg-amber-100 text-amber-800' : 'bg-[#F4EFEA] text-[#6E5D4F]'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-semibold text-[#2D251E] line-clamp-1">{prod.name}</h4>
                    <span className="text-[11px] text-[#8C7A6B]">{prod.qty} porsi terjual</span>
                  </div>
                </div>
                <div className="font-bold font-mono text-[#3E6B48]">
                  {formatRupiah(prod.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods & Recent Transactions Snapshot */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8DFD3] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#2D251E] flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-700" />
              <span>Transaksi Terakhir</span>
            </h3>
            {onNavigateToHistory && (
              <button
                onClick={onNavigateToHistory}
                className="text-xs text-[#3E6B48] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Semua Struk</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="divide-y divide-[#F2ECE4]">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#2D251E]">{tx.invoiceNumber}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#F4EFEA] text-[#6E5D4F]">
                      {tx.paymentMethod}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8C7A6B]">
                    {tx.customerName || 'Pelanggan Walk-In'} · {new Date(tx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="font-mono font-bold text-[#2D251E]">
                  {formatRupiah(tx.total)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
