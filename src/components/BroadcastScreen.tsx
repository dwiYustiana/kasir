import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  Filter, 
  RotateCcw,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { CATEGORY_GROUPS, formatShortPrice } from '../data/masterMenu';
import { Product } from '../types/pos';

export const BroadcastScreen: React.FC = () => {
  const { products, toggleProductStock } = usePOS();
  const [copied, setCopied] = useState<boolean>(false);
  const [mode, setMode] = useState<'all' | 'ready-only'>('all');

  // Compute live broadcast text
  const generateBroadcastText = (): string => {
    let text = `Bismillahirrahmannirrahim Ready today\n\n`;

    for (const group of CATEGORY_GROUPS) {
      let groupProducts = products.filter(p => p.categoryKey === group.key);
      
      if (mode === 'ready-only') {
        groupProducts = groupProducts.filter(p => p.isAvailable);
      }

      if (groupProducts.length === 0) continue;

      text += `*${group.title}*\n`;
      for (const p of groupProducts) {
        const priceStr = formatShortPrice(p.price);
        const soldOutMarker = p.isAvailable ? '' : ' ❎️';
        text += `- ${p.name} ${priceStr}${soldOutMarker}\n`;
      }

      if (group.disclaimer) {
        text += `\nDisclaimer:\n${group.disclaimer}\n`;
      }
      text += `\n`;
    }

    return text.trim();
  };

  const broadcastContent = generateBroadcastText();

  const handleCopy = () => {
    navigator.clipboard.writeText(broadcastContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(broadcastContent);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const readyCount = products.filter(p => p.isAvailable).length;
  const outCount = products.filter(p => !p.isAvailable).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3E6B48]"></span>
            <h1 className="text-xl font-bold tracking-tight text-[#2D251E] font-serif-display">
              Sinkronisasi Broadcast Menu WhatsApp
            </h1>
          </div>
          <p className="text-xs text-[#8C7A6B] mt-0.5">
            Otomatis terhubung dengan status master stok. Item bertanda ❎️ otomatis diperbarui saat kasir/admin mengubah stok.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#E0D5C7] rounded-xl text-xs font-bold text-[#2D251E] hover:bg-[#FAF8F5] transition-all shadow-2xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#3E6B48]" />
                <span>Salin Teks Broadcast</span>
              </>
            )}
          </button>

          <button
            onClick={handleOpenWhatsApp}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim ke WhatsApp</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: WhatsApp Live Preview (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8DFD3] shadow-xs overflow-hidden">
          
          {/* WhatsApp Chat Simulation Header */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#25D366] text-[#075E54] flex items-center justify-center font-bold text-xs">
                RK
              </div>
              <div>
                <h3 className="text-xs font-bold">Rarumi Kitchen Broadcast Group</h3>
                <p className="text-[10px] text-white/80">Menu Harian & Stok Terupdate</p>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center gap-1 bg-black/20 p-0.5 rounded-lg text-[11px]">
              <button
                onClick={() => setMode('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  mode === 'all' ? 'bg-white text-[#075E54] font-bold shadow-2xs' : 'text-white/80 hover:text-white'
                }`}
              >
                Format Lengkap ({products.length})
              </button>
              <button
                onClick={() => setMode('ready-only')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  mode === 'ready-only' ? 'bg-white text-[#075E54] font-bold shadow-2xs' : 'text-white/80 hover:text-white'
                }`}
              >
                Hanya Ready ({readyCount})
              </button>
            </div>
          </div>

          {/* WhatsApp Message Bubble Body */}
          <div className="p-4 sm:p-6 bg-[#ECE5DD] min-h-[500px] max-h-[650px] overflow-y-auto">
            <div className="max-w-xl mx-auto bg-white rounded-2xl p-4 sm:p-5 shadow-xs text-xs font-mono whitespace-pre-wrap text-[#111B21] leading-relaxed border border-[#DFD8D0]">
              {broadcastContent}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="p-3 bg-[#F0F2F5] border-t border-[#DFD8D0] flex items-center justify-between text-xs text-[#54656F]">
            <span>{broadcastContent.length} karakter</span>
            <button
              onClick={handleCopy}
              className="text-[#075E54] font-bold hover:underline flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin Sekarang</span>
            </button>
          </div>
        </div>

        {/* Right Column: Quick Stock Toggle Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-sm text-[#2D251E] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#3E6B48]" />
              <span>Kontrol Cepat Ketersediaan Menu</span>
            </h3>
            <p className="text-xs text-[#8C7A6B]">
              Klik tombol pada menu di bawah ini untuk mengubah tanda ❎️ secara instan sebelum broadcast disebarkan.
            </p>
          </div>

          {/* Mini Status Breakdown */}
          <div className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-2xl border border-[#E8DFD3] text-xs">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span><strong>{readyCount}</strong> Ready</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span><strong>{outCount}</strong> Habis (❎️)</span>
            </div>
          </div>

          {/* Scrollable list of items for quick toggling */}
          <div className="max-h-[460px] overflow-y-auto divide-y divide-[#F2ECE4] pr-1">
            {products.map((p) => (
              <div key={p.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#2D251E] truncate">{p.name}</p>
                  <p className="text-[11px] text-[#8C7A6B] font-mono">
                    {p.category} · {formatShortPrice(p.price)}
                  </p>
                </div>

                <button
                  onClick={() => toggleProductStock(p.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                    p.isAvailable
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                  }`}
                >
                  {p.isAvailable ? 'Ready' : 'Habis ❎'}
                </button>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
