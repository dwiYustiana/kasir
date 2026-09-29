import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  Copy, 
  ArrowRight,
  MessageSquare,
  FileText,
  Send,
  Check
} from 'lucide-react';
import { Transaction } from '../types/pos';
import { formatRupiah } from '../data/masterMenu';
import { 
  generateWhatsAppOrderSummary, 
  getWhatsAppApiUrl,
  generateOrderTextWithRarumiWhatsAppLink,
  RARUMI_WHATSAPP_DISPLAY,
  RARUMI_WHATSAPP_NUMBER
} from '../utils/orderSummaryTemplate';

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onNewTransaction: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ 
  transaction, 
  onClose, 
  onNewTransaction 
}) => {
  const [activeTab, setActiveTab] = useState<'receipt' | 'wa_summary'>('receipt');
  const [formatType, setFormatType] = useState<'with-link' | 'standard'>('with-link');
  const [copied, setCopied] = useState<boolean>(false);

  if (!transaction) return null;

  const formattedDate = new Date(transaction.createdAt).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  // 1. Standard Order Summary
  const orderSummaryText = generateWhatsAppOrderSummary({
    customerName: transaction.customerName,
    customerPhone: transaction.customerPhone,
    customerAddress: transaction.customerAddress,
    deliveryMethod: transaction.deliveryMethod,
    paymentMethod: transaction.paymentMethod,
    items: transaction.items,
    subtotal: transaction.subtotal,
    discount: transaction.discount,
    shippingFee: transaction.shippingFee,
    invoiceNumber: transaction.invoiceNumber,
    orderNotes: transaction.orderNotes,
  });

  // 2. Link WhatsApp Rarumi text
  const rarumiLinkData = generateOrderTextWithRarumiWhatsAppLink({
    customerName: transaction.customerName || 'Pelanggan',
    items: transaction.items,
    subtotal: transaction.subtotal,
    discount: transaction.discount,
    shippingFee: transaction.shippingFee,
    invoiceNumber: transaction.invoiceNumber,
    orderNotes: transaction.orderNotes,
  });

  const activeDisplayText = formatType === 'with-link' 
    ? rarumiLinkData.formattedText 
    : orderSummaryText;

  const handleSendWhatsAppOneTap = () => {
    if (formatType === 'with-link') {
      window.open(rarumiLinkData.oneTapShareUrl, '_blank');
    } else {
      const url = getWhatsAppApiUrl(transaction.customerPhone, orderSummaryText);
      window.open(url, '_blank');
    }
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(activeDisplayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E8DFD3] overflow-hidden my-4 print:shadow-none print:border-none print:max-w-full">
        
        {/* Modal Top Actions */}
        <div className="p-4 bg-[#FAF8F5] border-b border-[#E8DFD3] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <span className="font-bold text-xs uppercase tracking-wider block">Transaksi Berhasil</span>
              <span className="text-[11px] text-[#8C7A6B] font-mono">{transaction.invoiceNumber}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white border border-[#E0D5C7] flex items-center justify-center text-[#6E5D4F] hover:text-[#2D251E] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Switcher Tabs (Printable Thermal vs WhatsApp Order Summary) */}
        <div className="flex border-b border-[#E8DFD3] bg-[#F4EFEA] px-4 pt-2 gap-2 text-xs print:hidden">
          <button
            onClick={() => setActiveTab('receipt')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'receipt'
                ? 'bg-white text-[#2D251E] border-t border-x border-[#E8DFD3] shadow-xs'
                : 'text-[#6E5D4F] hover:text-[#2D251E]'
            }`}
          >
            <Printer className="w-3.5 h-3.5 text-[#3E6B48]" />
            <span>Struk Termal (58mm)</span>
          </button>

          <button
            onClick={() => setActiveTab('wa_summary')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'wa_summary'
                ? 'bg-white text-[#2D251E] border-t border-x border-[#E8DFD3] shadow-xs'
                : 'text-[#6E5D4F] hover:text-[#2D251E]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>Template Ringkasan WhatsApp</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </button>
        </div>

        {/* TAB 1: Thermal Receipt Paper View (58mm style) */}
        {activeTab === 'receipt' ? (
          <div className="p-6 bg-[#FCFBF9] font-mono text-xs text-[#2D251E] space-y-4 max-h-[500px] overflow-y-auto print:max-h-none print:p-2" id="printable-receipt">
            {/* Receipt Header */}
            <div className="text-center space-y-1 pb-3 border-b border-dashed border-[#C4B7A6]">
              <h2 className="text-sm font-bold tracking-tight uppercase">
                Rarumi Healthy Kitchen
              </h2>
              <p className="text-[11px] text-[#6E5D4F]">
                Gluten-Free, Egg-Free & Organic
              </p>
              <p className="text-[10px] text-[#8C7A6B]">
                WhatsApp: 0812-xxxx-xxxx · Halal & Thayyib
              </p>
            </div>

            {/* Meta Info */}
            <div className="text-[11px] space-y-1 pb-3 border-b border-dashed border-[#C4B7A6] text-[#4A3E33]">
              <div className="flex justify-between">
                <span>No. Invoice:</span>
                <span className="font-bold">{transaction.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Waktu:</span>
                <span>{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir:</span>
                <span>{transaction.cashierName}</span>
              </div>
              {transaction.customerName && (
                <div className="flex justify-between">
                  <span>Pelanggan:</span>
                  <span className="font-semibold">{transaction.customerName}</span>
                </div>
              )}
              {transaction.deliveryMethod && (
                <div className="flex justify-between">
                  <span>Kurir / Kirim:</span>
                  <span>{transaction.deliveryMethod}</span>
                </div>
              )}
            </div>

            {/* Itemized Table */}
            <div className="space-y-2 pb-3 border-b border-dashed border-[#C4B7A6]">
              {transaction.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-semibold">
                    <span className="line-clamp-1">{item.product.name}</span>
                    <span className="shrink-0 ml-2">
                      {formatRupiah(item.product.price * item.quantity)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-[#8C7A6B]">
                    <span>
                      {item.quantity} × {formatRupiah(item.product.price)}
                      {item.product.portion ? ` (${item.product.portion})` : ''}
                    </span>
                  </div>
                  {item.notes && (
                    <p className="text-[10px] text-amber-700 italic">
                      Catatan: {item.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Total & Payment Details */}
            <div className="space-y-1.5 pb-3 border-b border-dashed border-[#C4B7A6] text-[11px]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatRupiah(transaction.subtotal)}</span>
              </div>
              {transaction.shippingFee && transaction.shippingFee > 0 ? (
                <div className="flex justify-between text-emerald-800">
                  <span>Ongkir:</span>
                  <span>+{formatRupiah(transaction.shippingFee)}</span>
                </div>
              ) : null}
              {transaction.discount > 0 && (
                <div className="flex justify-between text-rose-700">
                  <span>Diskon:</span>
                  <span>-{formatRupiah(transaction.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold pt-1 text-[#2D251E]">
                <span>TOTAL BAYAR:</span>
                <span>{formatRupiah(transaction.total)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-[#6E5D4F]">
                <span>Metode:</span>
                <span className="font-semibold">{transaction.paymentMethod}</span>
              </div>
              {transaction.paymentMethod === 'TUNAI' && (
                <>
                  <div className="flex justify-between text-[11px]">
                    <span>Tunai Diterima:</span>
                    <span>{formatRupiah(transaction.cashGiven)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-emerald-800">
                    <span>Kembalian:</span>
                    <span>{formatRupiah(transaction.changeDue)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Footer Note & Care Tip */}
            <div className="text-center text-[10px] text-[#8C7A6B] space-y-1 pt-1">
              <p className="italic">
                *Tips: Roti sourdough simpan di freezer & kukus -+5 menit sebelum dinikmati.
              </p>
              <p className="font-semibold text-[#4A3E33]">
                Jazakumullah Khairan Katsiran 🙏
              </p>
            </div>
          </div>
        ) : (
          /* TAB 2: WhatsApp Order Summary View */
          <div className="p-4 sm:p-5 bg-[#ECE5DD] max-h-[500px] overflow-y-auto space-y-3">
            <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setFormatType('with-link')}
                className={`flex-1 py-1.5 px-2.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  formatType === 'with-link' ? 'bg-[#3E6B48] text-white shadow-xs' : 'text-[#6E5D4F]'
                }`}
              >
                🔗 Format + Link WA Rarumi ({RARUMI_WHATSAPP_DISPLAY})
              </button>
              <button
                type="button"
                onClick={() => setFormatType('standard')}
                className={`flex-1 py-1.5 px-2.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  formatType === 'standard' ? 'bg-[#3E6B48] text-white shadow-xs' : 'text-[#6E5D4F]'
                }`}
              >
                📋 Format Lengkap
              </button>
            </div>

            <div className="text-[10px] text-zinc-600 text-center font-mono">
              Template Ringkasan Siap Dikirim ke WhatsApp Pelanggan
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-5 text-xs font-mono whitespace-pre-wrap text-[#111B21] leading-relaxed shadow-sm border border-[#DFD8D0]">
              {activeDisplayText}
            </div>
          </div>
        )}


        {/* Modal Action Buttons (Hidden when printing) */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#E8DFD3] space-y-2 print:hidden">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl bg-white border border-[#E0D5C7] text-xs font-semibold text-[#2D251E] hover:bg-[#FAF8F5] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#3E6B48]" />
              <span>Cetak Struk Fisik</span>
            </button>

            {/* Prominent One-Tap WhatsApp Button */}
            <button
              onClick={handleSendWhatsAppOneTap}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="Kirim ringkasan pesanan langsung via WhatsApp API"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Ringkasan WA (1-Tap)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="flex-1 py-2 px-3 rounded-xl bg-white border border-[#E0D5C7] text-xs font-medium text-[#6E5D4F] hover:text-[#2D251E] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#3E6B48]" />
                  <span>Salin Template WA</span>
                </>
              )}
            </button>

            <button
              onClick={onNewTransaction}
              className="flex-1 py-2 px-3 rounded-xl bg-[#2D251E] hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Transaksi Baru</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
