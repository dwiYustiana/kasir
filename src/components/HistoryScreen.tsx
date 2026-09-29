import React, { useState } from 'react';
import { 
  Receipt, 
  Search, 
  RotateCcw, 
  Printer, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  User, 
  Calendar,
  Wallet
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { Transaction } from '../types/pos';
import { formatRupiah } from '../data/masterMenu';

interface HistoryScreenProps {
  onSelectReceipt: (tx: Transaction) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ onSelectReceipt }) => {
  const { transactions, refundTransaction } = usePOS();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const filteredTransactions = transactions.filter(t => {
    if (methodFilter !== 'all' && t.paymentMethod !== methodFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchInv = t.invoiceNumber.toLowerCase().includes(q);
      const matchCust = t.customerName?.toLowerCase().includes(q);
      const matchItem = t.items.some(it => it.product.name.toLowerCase().includes(q));
      return matchInv || matchCust || matchItem;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3E6B48]"></span>
            <h1 className="text-xl font-bold tracking-tight text-[#2D251E] font-serif-display">
              Riwayat Transaksi & Struk Kasir
            </h1>
          </div>
          <p className="text-xs text-[#8C7A6B] mt-0.5">
            Daftar seluruh penjualan selesai, cetak ulang struk, dan kirim bukti pembayaran via WhatsApp
          </p>
        </div>

        <div className="text-xs text-[#8C7A6B] font-mono">
          Total: <strong className="text-[#2D251E]">{transactions.length}</strong> transaksi tercatat
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8DFD3] shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A6B]" />
          <input
            type="text"
            placeholder="Cari no invoice (INV-...), nama pelanggan, atau nama menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#FAF8F5] border border-[#E0D5C7] rounded-xl focus:ring-2 focus:ring-[#3E6B48] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {['all', 'TUNAI', 'QRIS', 'TRANSFER_BCA', 'TRANSFER_MANDIRI'].map((m) => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-colors ${
                methodFilter === m
                  ? 'bg-[#2D251E] text-white'
                  : 'bg-[#F4EFEA] text-[#6E5D4F] hover:bg-[#EBE2D7]'
              }`}
            >
              {m === 'all' ? 'Semua Metode' : m.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-3xl border border-[#E8DFD3] shadow-xs overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-[#8C7A6B]">
            <Receipt className="w-10 h-10 text-[#C4B7A6] mx-auto mb-2" />
            <p className="font-semibold text-sm text-[#2D251E]">Tidak ada transaksi ditemukan</p>
            <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian transaksi Anda.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F2ECE4]">
            {filteredTransactions.map((tx) => {
              const formattedDate = new Date(tx.createdAt).toLocaleString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const isCompleted = tx.status === 'COMPLETED';

              return (
                <div key={tx.id} className="p-5 hover:bg-[#FAF8F5]/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Invoice & Details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#2D251E] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E8DFD3]">
                        {tx.invoiceNumber}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                        isCompleted ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                      }`}>
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Lunas</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>Dibatalkan / Refund</span>
                          </>
                        )}
                      </span>
                      <span className="text-xs text-[#8C7A6B] flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formattedDate}</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E5D4F]">
                      {tx.customerName && (
                        <span className="flex items-center gap-1 font-semibold text-[#2D251E]">
                          <User className="w-3 h-3 text-[#A39281]" />
                          <span>{tx.customerName}</span>
                        </span>
                      )}
                      <span>·</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Wallet className="w-3 h-3 text-[#A39281]" />
                        <span>{tx.paymentMethod.replace('_', ' ')}</span>
                      </span>
                      <span>·</span>
                      <span>{tx.items.length} jenis item</span>
                    </div>

                    {/* Preview of first 2 items */}
                    <p className="text-xs text-[#8C7A6B] line-clamp-1">
                      {tx.items.map(it => `${it.quantity}x ${it.product.name}`).join(', ')}
                    </p>
                  </div>

                  {/* Right: Total & Action Buttons */}
                  <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#F2ECE4]">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-[#8C7A6B] uppercase font-medium">Total Bayar</span>
                      <p className="text-base font-bold font-mono text-[#3E6B48]">
                        {formatRupiah(tx.total)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectReceipt(tx)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E0D5C7] rounded-xl text-xs font-semibold text-[#2D251E] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                        title="Buka Struk Pembayaran"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#3E6B48]" />
                        <span>Struk</span>
                      </button>

                      {isCompleted && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Batalkan transaksi ${tx.invoiceNumber} dan kembalikan stok barang ke sistem?`)) {
                              refundTransaction(tx.id);
                            }
                          }}
                          className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Batalkan / Refund Transaksi"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
