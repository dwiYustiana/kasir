import { CartItem, PaymentMethod } from '../types/pos';
import { formatRupiah } from '../data/masterMenu';

export const RARUMI_WHATSAPP_NUMBER = '6281298765432';
export const RARUMI_WHATSAPP_DISPLAY = '0812-9876-5432';

export interface OrderTextWithWhatsAppLinkParams {
  customerName: string;
  items: CartItem[];
  subtotal: number;
  discount?: number;
  shippingFee?: number;
  invoiceNumber?: string;
  orderNotes?: string;
  whatsappNumber?: string;
}

/**
 * Generates a formatted text string containing:
 * - Customer's name
 * - Order items with prices
 * - Subtotal & Total
 * - A link to the Rarumi WhatsApp number for one-tap sharing
 */
export function generateOrderTextWithRarumiWhatsAppLink(params: OrderTextWithWhatsAppLinkParams): {
  formattedText: string;
  rarumiWhatsAppUrl: string;
  oneTapShareUrl: string;
} {
  const {
    customerName,
    items,
    subtotal,
    discount = 0,
    shippingFee = 0,
    invoiceNumber,
    orderNotes,
    whatsappNumber = RARUMI_WHATSAPP_NUMBER,
  } = params;

  const total = Math.max(0, subtotal - discount + shippingFee);
  
  // Format items with price
  const itemsText = items.map((it, idx) => {
    const itemTotal = (it.product.price - it.discount) * it.quantity;
    const notesStr = it.notes ? ` (${it.notes})` : '';
    return `${idx + 1}. ${it.product.name} - ${it.quantity}x @ ${formatRupiah(it.product.price)} = ${formatRupiah(itemTotal)}${notesStr}`;
  }).join('\n');

  // WhatsApp message for customer to send to Rarumi
  const confirmationMsg = `Halo Rarumi Kitchen, saya ${customerName || 'Pelanggan'}${invoiceNumber ? ` (${invoiceNumber})` : ''} ingin konfirmasi pesanan senilai ${formatRupiah(total)}. Mohon proses ya!`;
  const rarumiWhatsAppUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(confirmationMsg)}`;

  let formattedText = `📋 *RINGKASAN PESANAN - RARUMI HEALTHY KITCHEN*\n\n`;
  formattedText += `👤 Nama Pelanggan: ${customerName?.trim() || 'Pelanggan Walk-In'}\n`;
  if (invoiceNumber) {
    formattedText += `🔖 No. Pesanan: ${invoiceNumber}\n`;
  }
  formattedText += `\n📦 *Daftar Pesanan*:\n${itemsText}\n\n`;
  formattedText += `----------------------------------------\n`;
  formattedText += `Subtotal: ${formatRupiah(subtotal)}\n`;
  if (discount > 0) {
    formattedText += `Diskon: -${formatRupiah(discount)}\n`;
  }
  if (shippingFee > 0) {
    formattedText += `Ongkir: +${formatRupiah(shippingFee)}\n`;
  }
  formattedText += `*TOTAL TAGIHAN: ${formatRupiah(total)}*\n`;
  formattedText += `----------------------------------------\n\n`;
  if (orderNotes?.trim()) {
    formattedText += `📝 Catatan: ${orderNotes.trim()}\n\n`;
  }
  formattedText += `📲 *Link WhatsApp Resmi Rarumi (One-Tap)*:\n${rarumiWhatsAppUrl}\n\n`;
  formattedText += `Jazakumullah Khairan Katsiran 🙏`;

  const oneTapShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(formattedText)}`;

  return {
    formattedText,
    rarumiWhatsAppUrl,
    oneTapShareUrl,
  };
}

export interface OrderSummaryDetails {

  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  deliveryMethod?: string;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  discount?: number;
  shippingFee?: number;
  invoiceNumber?: string;
  orderNotes?: string;
}

/**
 * Generates an elegant, structured WhatsApp Order Summary text template
 * Ready for one-tap sending via WhatsApp API / URL Scheme.
 */
export function generateWhatsAppOrderSummary(details: OrderSummaryDetails): string {
  const {
    customerName,
    customerPhone,
    customerAddress,
    deliveryMethod = 'Ambil Sendiri (Pickup)',
    paymentMethod,
    items,
    subtotal,
    discount = 0,
    shippingFee = 0,
    invoiceNumber,
    orderNotes,
  } = details;

  const total = Math.max(0, subtotal - discount + shippingFee);
  const totalItemCount = items.reduce((sum, it) => sum + it.quantity, 0);

  let message = `📋 *RINGKASAN PESANAN (ORDER SUMMARY)*\n`;
  message += `*RARUMI HEALTHY & ORGANIC KITCHEN*\n`;
  message += `----------------------------------------\n`;
  message += `_Bismillahirrahmannirrahim_\n\n`;

  if (invoiceNumber) {
    message += `🔖 *No. Pesanan*: ${invoiceNumber}\n`;
  }

  // Customer & Delivery Info
  message += `👤 *Data Pemesan & Pengiriman*:\n`;
  message += `• Nama: ${customerName?.trim() || 'Pelanggan Walk-In'}\n`;
  if (customerPhone?.trim()) {
    message += `• WhatsApp: ${customerPhone.trim()}\n`;
  }
  if (customerAddress?.trim()) {
    message += `• Alamat Kirim: ${customerAddress.trim()}\n`;
  }
  message += `• Kurir / Pengiriman: ${deliveryMethod}\n`;
  message += `• Metode Pembayaran: ${formatPaymentName(paymentMethod)}\n\n`;

  // Itemized Order List
  message += `📦 *Daftar Pesanan (${totalItemCount} item)*:\n`;
  items.forEach((item, index) => {
    const itemSubtotal = (item.product.price - item.discount) * item.quantity;
    const portionStr = item.product.portion ? ` (${item.product.portion})` : '';
    const dietStr = item.product.dietaryTags.length > 0 ? ` [${item.product.dietaryTags.join('/')}]` : '';

    message += `${index + 1}. *${item.product.name}*${portionStr}${dietStr}\n`;
    message += `   ${item.quantity} × ${formatRupiah(item.product.price)} = ${formatRupiah(itemSubtotal)}\n`;
    if (item.notes?.trim()) {
      message += `   _(Catatan: ${item.notes.trim()})_\n`;
    }
  });

  if (orderNotes?.trim()) {
    message += `\n📝 *Catatan Khusus*: ${orderNotes.trim()}\n`;
  }

  // Total Breakdown
  message += `\n----------------------------------------\n`;
  message += `Subtotal: ${formatRupiah(subtotal)}\n`;
  if (discount > 0) {
    message += `Potongan Diskon: -${formatRupiah(discount)}\n`;
  }
  if (shippingFee > 0) {
    message += `Ongkos Kirim: ${formatRupiah(shippingFee)}\n`;
  }
  message += `*TOTAL TAGIHAN: ${formatRupiah(total)}*\n`;
  message += `----------------------------------------\n\n`;

  // Bank Account & Payment Instruction
  message += `💳 *Instruksi & Rekening Pembayaran*:\n`;
  if (paymentMethod === 'TRANSFER_BCA') {
    message += `• Bank BCA: *1234-5678-90*\n  a.n *Rarumi Kitchen*\n`;
  } else if (paymentMethod === 'TRANSFER_MANDIRI') {
    message += `• Bank Mandiri: *9876-5432-10*\n  a.n *Rarumi Kitchen*\n`;
  } else if (paymentMethod === 'QRIS') {
    message += `• QRIS: Scan kode QRIS kasir (Gopay / OVO / BCA / ShopeePay)\n`;
  } else if (paymentMethod === 'TUNAI') {
    message += `• Tunai / Cash saat pengambilan atau kurir COD\n`;
  } else {
    message += `• Bank BCA: *1234-5678-90* a.n Rarumi Kitchen\n`;
    message += `• Bank Mandiri: *9876-5432-10* a.n Rarumi Kitchen\n`;
  }
  message += `_(Mohon kirimkan bukti transfer ke nomor ini setelah melakukan pembayaran)_\n\n`;

  // Dietary & Reheat Disclaimer
  message += `📌 *Catatan Penyimpanan & Reheat*:\n`;
  message += `Roti sourdough & frozen food dapat disimpan di freezer. Reheat kukus -+ 5 menit sebelum dinikmati agar tetap lembut dan fluffy.\n\n`;
  message += `Jazakumullah Khairan Katsiran telah mempercayakan makanan sehat & halal pada kami! 🙏✨`;

  return message;
}

/**
 * Creates a one-tap WhatsApp API URL
 */
export function getWhatsAppApiUrl(phone: string | undefined, message: string): string {
  const encodedText = encodeURIComponent(message);
  let cleanPhone = (phone || '').replace(/\D/g, '');

  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  }

  if (cleanPhone) {
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
  }
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}

function formatPaymentName(method: PaymentMethod): string {
  switch (method) {
    case 'TUNAI':
      return 'Tunai (Cash)';
    case 'QRIS':
      return 'QRIS (Gopay/OVO/ShopeePay/BCA)';
    case 'TRANSFER_BCA':
      return 'Transfer Bank BCA';
    case 'TRANSFER_MANDIRI':
      return 'Transfer Bank Mandiri';
    case 'KARTU_DEBIT':
      return 'Kartu Debit';
    case 'PIUTANG':
      return 'Piutang / Tempo';
    default:
      return method;
  }
}
