import React, { useState, useMemo } from 'react';
import { 
  X, 
  Banknote, 
  QrCode, 
  CreditCard, 
  Building2, 
  Check, 
  User, 
  Phone, 
  MapPin, 
  Truck, 
  Copy, 
  Send, 
  FileText, 
  MessageSquare,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { PaymentMethod, Transaction } from '../types/pos';
import { formatRupiah } from '../data/masterMenu';
import { 
  generateWhatsAppOrderSummary, 
  getWhatsAppApiUrl,
  generateOrderTextWithRarumiWhatsAppLink,
  RARUMI_WHATSAPP_DISPLAY,
  RARUMI_WHATSAPP_NUMBER
} from '../utils/orderSummaryTemplate';


interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (tx: Transaction) => void;
  initialTab?: 'pay' | 'summary';
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  initialTab = 'pay'
}) => {
  const { cart, cartTotal, checkout } = usePOS();

  // Active view tab inside checkout: 'pay' (Kasir) or 'summary' (Ringkasan WA)
  const [activeCheckoutTab, setActiveCheckoutTab] = useState<'pay' | 'summary'>(initialTab);

  // Sync active tab whenever modal opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveCheckoutTab(initialTab);
    }
  }, [isOpen, initialTab]);


  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TRANSFER_BCA');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [deliveryMethod, setDeliveryMethod] = useState<string>('Paxel Sameday (Cold / Frozen)');
  const [shippingFeeStr, setShippingFeeStr] = useState<string>('0');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [cashGivenStr, setCashGivenStr] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [copiedTemplate, setCopiedTemplate] = useState<boolean>(false);
  const [templateFormat, setTemplateFormat] = useState<'standard' | 'with-link'>('with-link');

  if (!isOpen) return null;

  const shippingFee = parseInt(shippingFeeStr.replace(/\D/g, ''), 10) || 0;
  const finalTotal = Math.max(0, cartTotal - discountAmount + shippingFee);

  const cashGiven = paymentMethod === 'TUNAI' 
    ? (cashGivenStr ? parseInt(cashGivenStr.replace(/\D/g, ''), 10) || 0 : 0)
    : finalTotal;

  const changeDue = Math.max(0, cashGiven - finalTotal);
  const isUnderpaid = paymentMethod === 'TUNAI' && cashGiven < finalTotal;

  // 1. Standard Order Summary
  const orderSummaryText = generateWhatsAppOrderSummary({
    customerName,
    customerPhone,
    customerAddress,
    deliveryMethod,
    paymentMethod,
    items: cart,
    subtotal: cartTotal,
    discount: discountAmount,
    shippingFee,
    orderNotes,
  });

  // 2. Specific Formatted text containing customer name, items with prices, subtotal, and link to Rarumi WhatsApp
  const rarumiLinkData = generateOrderTextWithRarumiWhatsAppLink({
    customerName,
    items: cart,
    subtotal: cartTotal,
    discount: discountAmount,
    shippingFee,
    orderNotes,
  });

  // Active text to copy / send depending on selected format
  const activeText = templateFormat === 'with-link' 
    ? rarumiLinkData.formattedText 
    : orderSummaryText;

  const handleCopySummary = () => {
    navigator.clipboard.writeText(activeText);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  const handleSendWhatsAppOneTap = () => {
    if (templateFormat === 'with-link') {
      window.open(rarumiLinkData.oneTapShareUrl, '_blank');
    } else {
      const url = getWhatsAppApiUrl(customerPhone, orderSummaryText);
      window.open(url, '_blank');
    }
  };


  const handleCompleteTransaction = (andSendWhatsApp: boolean = false) => {
    if (isUnderpaid) return;

    if (andSendWhatsApp) {
      handleSendWhatsAppOneTap();
    }

    const tx = checkout(
      paymentMethod,
      cashGiven,
      customerName.trim() || undefined,
      customerPhone.trim() || undefined,
      discountAmount,
      customerAddress.trim() || undefined,
      deliveryMethod,
      shippingFee,
      orderNotes.trim() || undefined
    );

    onSuccess(tx);
  };

  // Preset cash buttons
  const cashPresets = [
    { label: 'Uang Pas', value: finalTotal },
    { label: '50.000', value: 50000 },
    { label: '100.000', value: 100000 },
    { label: '200.000', value: 200000 },
    { label: '500.000', value: 500000 },
  ];

  const handleKeypadPress = (val: string) => {
    if (val === 'C') {
      setCashGivenStr('');
    } else if (val === 'BACK') {
      setCashGivenStr(prev => prev.slice(0, -1));
    } else if (val === '000') {
      setCashGivenStr(prev => (prev ? prev + '000' : ''));
    } else {
      setCashGivenStr(prev => prev + val);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E8DFD3] overflow-hidden my-4">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-b border-[#E8DFD3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#3E6B48] text-white flex items-center justify-center font-bold text-xs">
              WA
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#2D251E] flex items-center gap-2">
                <span>Kasir & Ringkasan Pesanan</span>
                <span className="hidden sm:inline text-xs font-normal text-[#8C7A6B]">· WhatsApp Integrated</span>
              </h3>
              <p className="text-[11px] text-[#8C7A6B]">Proses pembayaran & kirim ringkasan pesanan 1-tap ke WhatsApp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#E0D5C7] flex items-center justify-center text-[#6E5D4F] hover:text-[#2D251E] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Switcher Tabs (Kasir vs WhatsApp Summary) */}
        <div className="flex border-b border-[#E8DFD3] bg-[#F4EFEA] px-4 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveCheckoutTab('pay')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl font-semibold transition-all cursor-pointer ${
              activeCheckoutTab === 'pay'
                ? 'bg-white text-[#2D251E] border-t border-x border-[#E8DFD3] shadow-xs'
                : 'text-[#6E5D4F] hover:text-[#2D251E]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-[#3E6B48]" />
            <span>1. Pembayaran & Pengiriman</span>
          </button>

          <button
            onClick={() => setActiveCheckoutTab('summary')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl font-semibold transition-all cursor-pointer ${
              activeCheckoutTab === 'summary'
                ? 'bg-white text-[#2D251E] border-t border-x border-[#E8DFD3] shadow-xs'
                : 'text-[#6E5D4F] hover:text-[#2D251E]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>2. Ringkasan Pesanan WhatsApp (One-Tap)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[calc(85vh-160px)] overflow-y-auto space-y-4">
          
          {/* TAB 1: Payment & Delivery Details */}
          {activeCheckoutTab === 'pay' ? (
            <div className="space-y-4">
              
              {/* Total Tagihan Summary Card */}
              <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#E8DFD3] flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] font-medium text-[#8C7A6B]">Total Yang Harus Dibayar</p>
                  <p className="text-2xl font-bold font-mono text-[#3E6B48]">
                    {formatRupiah(finalTotal)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[#6E5D4F]">
                    Subtotal: <strong className="font-mono">{formatRupiah(cartTotal)}</strong>
                  </span>
                  {shippingFee > 0 && (
                    <span className="text-[#6E5D4F]">
                      · Ongkir: <strong className="font-mono text-emerald-700">+{formatRupiah(shippingFee)}</strong>
                    </span>
                  )}
                  {discountAmount > 0 && (
                    <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-medium">
                      Diskon: -{formatRupiah(discountAmount)}
                    </span>
                  )}
                </div>
              </div>

              {/* Customer Details Form */}
              <div className="space-y-3 p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8DFD3]">
                <h4 className="text-xs font-bold text-[#2D251E] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#3E6B48]" />
                  <span>Data Pelanggan & Pengiriman</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E5D4F] mb-1">
                      Nama Pelanggan
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A39281]" />
                      <input
                        type="text"
                        placeholder="Misal: Bu Ratna"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E0D5C7] rounded-xl focus:ring-2 focus:ring-[#3E6B48] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E5D4F] mb-1">
                      Nomor WhatsApp Pelanggan (Untuk Kirim One-Tap)
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A39281]" />
                      <input
                        type="tel"
                        placeholder="081234567890"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E0D5C7] rounded-xl focus:ring-2 focus:ring-[#3E6B48] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#6E5D4F] mb-1">
                    Alamat Pengiriman (Opsional / Kurir)
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#A39281]" />
                    <textarea
                      rows={2}
                      placeholder="Alamat lengkap, nama jalan, no rumah, patokan..."
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#E0D5C7] rounded-xl focus:ring-2 focus:ring-[#3E6B48] focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Shipping Method & Ongkir */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E5D4F] mb-1">
                      Metode Pengiriman
                    </label>
                    <div className="relative">
                      <Truck className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A39281]" />
                      <select
                        value={deliveryMethod}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E0D5C7] rounded-xl focus:ring-2 focus:ring-[#3E6B48] focus:outline-none"
                      >
                        <option value="Paxel Sameday (Cold / Frozen)">Paxel Sameday (Cold / Frozen Chain)</option>
                        <option value="Instant (Gojek / Grab)">Instant (Gojek / Grab)</option>
                        <option value="Sameday (Gojek / Grab)">Sameday (Gojek / Grab)</option>
                        <option value="Ambil Sendiri di Dapur (Pickup)">Ambil Sendiri di Dapur (Pickup)</option>
                        <option value="Ekspedisi Reguler (Khusus Produk Kering)">Ekspedisi Reguler</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E5D4F] mb-1">
                      Biaya Ongkir (Rp)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8C7A6B]">
                        Rp
                      </span>
                      <input
                        type="text"
                        placeholder="0"
                        value={shippingFeeStr}
                        onChange={(e) => {
                          const clean = e.target.value.replace(/\D/g, '');
                          setShippingFeeStr(clean ? Number(clean).toLocaleString('id-ID') : '');
                        }}
                        className="w-full pl-9 pr-3 py-2 text-xs font-mono font-bold bg-white border border-[#E0D5C7] rounded-xl focus:ring-2 focus:ring-[#3E6B48] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Order Notes */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#6E5D4F] mb-1">
                    Catatan Khusus Pesanan
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Mohon dikirim sebelum jam 3 sore, sambal dipisah..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#E0D5C7] rounded-xl focus:ring-2 focus:ring-[#3E6B48] focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-[#2D251E] mb-2">
                  Pilih Metode Pembayaran
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'TRANSFER_BCA' as PaymentMethod, label: 'Transfer BCA', icon: Building2 },
                    { id: 'TRANSFER_MANDIRI' as PaymentMethod, label: 'Transfer Mandiri', icon: Building2 },
                    { id: 'QRIS' as PaymentMethod, label: 'QRIS All Payment', icon: QrCode },
                    { id: 'TUNAI' as PaymentMethod, label: 'Tunai (Cash)', icon: Banknote },
                    { id: 'KARTU_DEBIT' as PaymentMethod, label: 'Kartu Debit', icon: CreditCard },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setPaymentMethod(m.id);
                          if (m.id !== 'TUNAI') setCashGivenStr('');
                        }}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#3E6B48] bg-emerald-50/70 text-[#3E6B48] font-bold shadow-2xs'
                            : 'border-[#E8DFD3] bg-white text-[#6E5D4F] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-[#3E6B48]' : 'text-[#8C7A6B]'}`} />
                        <span className="truncate">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cash Keypad (When TUNAI selected) */}
              {paymentMethod === 'TUNAI' && (
                <div className="space-y-3 pt-2 border-t border-[#F2ECE4]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#2D251E]">
                      Uang Tunai Diterima
                    </label>
                    <span className="text-xs font-mono text-[#8C7A6B]">
                      Kurang: {isUnderpaid ? formatRupiah(finalTotal - cashGiven) : 'Rp 0'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#8C7A6B]">
                        Rp
                      </span>
                      <input
                        type="text"
                        placeholder="0"
                        value={cashGivenStr ? Number(cashGivenStr).toLocaleString('id-ID') : ''}
                        onChange={(e) => {
                          const clean = e.target.value.replace(/\D/g, '');
                          setCashGivenStr(clean);
                        }}
                        className="w-full pl-11 pr-3 py-2.5 text-base font-bold font-mono bg-[#FAF8F5] border border-[#E0D5C7] rounded-xl focus:ring-2 focus:ring-[#3E6B48] focus:outline-none"
                      />
                    </div>

                    <div className={`p-2.5 rounded-xl border flex flex-col justify-center ${
                      isUnderpaid 
                        ? 'bg-rose-50 border-rose-200 text-rose-800' 
                        : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}>
                      <span className="text-[10px] font-medium uppercase tracking-wide">
                        {isUnderpaid ? 'Uang Kurang' : 'Kembalian'}
                      </span>
                      <span className="text-base font-bold font-mono">
                        {isUnderpaid 
                          ? `- ${formatRupiah(finalTotal - cashGiven)}` 
                          : formatRupiah(changeDue)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {cashPresets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setCashGivenStr(String(preset.value))}
                        className="px-2.5 py-1.5 bg-[#F4EFEA] hover:bg-[#EBE2D7] text-xs font-semibold text-[#2D251E] rounded-lg transition-colors cursor-pointer"
                      >
                        {preset.label === 'Uang Pas' ? 'Uang Pas' : `Rp ${preset.label}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* TAB 2: WhatsApp Order Summary Template View */
            <div className="space-y-4">
              
              {/* Template Style Selector */}
              <div className="flex items-center gap-1.5 p-1 bg-[#F4EFEA] rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setTemplateFormat('with-link')}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-semibold transition-all cursor-pointer ${
                    templateFormat === 'with-link'
                      ? 'bg-white text-[#2D251E] shadow-xs'
                      : 'text-[#6E5D4F] hover:text-[#2D251E]'
                  }`}
                >
                  🔗 Format + Link WhatsApp Rarumi ({RARUMI_WHATSAPP_DISPLAY})
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateFormat('standard')}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-semibold transition-all cursor-pointer ${
                    templateFormat === 'standard'
                      ? 'bg-white text-[#2D251E] shadow-xs'
                      : 'text-[#6E5D4F] hover:text-[#2D251E]'
                  }`}
                >
                  📋 Format Lengkap Invoice & Alamat
                </button>
              </div>

              {/* Direct Rarumi Link Banner */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-emerald-900 block">Link WhatsApp Resmi Rarumi Kitchen:</span>
                  <a 
                    href={rarumiLinkData.rarumiWhatsAppUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-700 underline font-mono text-[11px] break-all hover:text-emerald-900"
                  >
                    https://wa.me/{RARUMI_WHATSAPP_NUMBER} (0812-9876-5432)
                  </a>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs cursor-pointer"
                  >
                    {copiedTemplate ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Salin Teks</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleSendWhatsAppOneTap}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Buka WA (1-Tap)</span>
                  </button>
                </div>
              </div>

              {/* Formatted Text Preview in WhatsApp Bubble Style */}
              <div className="bg-[#ECE5DD] p-3 sm:p-5 rounded-2xl border border-[#DFD8D0] shadow-inner">
                <div className="text-[10px] text-zinc-500 text-center mb-2 font-mono">
                  Pratinjau Format Teks Siap Kirim (Nama Pelanggan, Menu & Harga, Subtotal, Link WA)
                </div>
                <div className="bg-white rounded-2xl p-4 sm:p-5 text-xs font-mono whitespace-pre-wrap text-[#111B21] leading-relaxed shadow-sm border border-[#DFD8D0] max-h-[380px] overflow-y-auto">
                  {activeText}
                </div>
              </div>
            </div>

          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-t border-[#E8DFD3] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-[#E0D5C7] text-xs font-semibold text-[#6E5D4F] hover:bg-white transition-colors cursor-pointer"
            >
              Batal
            </button>

            {/* Quick One-Tap WhatsApp Button in footer */}
            <button
              type="button"
              onClick={handleSendWhatsAppOneTap}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Kirim template ringkasan pesanan ke WhatsApp sekarang"
            >
              <Send className="w-3.5 h-3.5 text-emerald-700" />
              <span>Kirim Ringkasan WA</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Complete & Send WA option */}
            <button
              type="button"
              disabled={isUnderpaid}
              onClick={() => handleCompleteTransaction(true)}
              className={`flex-1 sm:flex-none py-2.5 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isUnderpaid
                  ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
              }`}
              title="Simpan transaksi kasir & buka WhatsApp dengan ringkasan pesanan terisi"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Bayar & Kirim WA (1-Tap)</span>
            </button>

            {/* Standard Complete Transaction */}
            <button
              type="button"
              disabled={isUnderpaid}
              onClick={() => handleCompleteTransaction(false)}
              className={`flex-1 sm:flex-none py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isUnderpaid
                  ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                  : 'bg-[#2D251E] text-white hover:bg-black shadow-xs'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Selesaikan Kasir</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
