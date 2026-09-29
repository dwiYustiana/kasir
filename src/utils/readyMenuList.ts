import { Product } from '../types/pos';
import { CATEGORY_GROUPS, formatShortPrice, formatRupiah } from '../data/masterMenu';
import { RARUMI_WHATSAPP_DISPLAY } from './orderSummaryTemplate';

/**
 * Generates an official WhatsApp-ready string of ALL menu items currently marked READY.
 */
export function generateReadyMenuListText(products: Product[]): string {
  const readyProducts = products.filter(p => p.isAvailable);
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  let text = `🌱 *DAFTAR MENU READY HARI INI* 🌱\n`;
  text += `*Rarumi Healthy Kitchen*\n`;
  text += `_Update: ${dateStr}_\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  for (const group of CATEGORY_GROUPS) {
    const groupItems = readyProducts.filter(p => p.categoryKey === group.key);
    if (groupItems.length === 0) continue;

    text += `*${group.title.toUpperCase()}*\n`;
    groupItems.forEach((item, idx) => {
      const tags = item.dietaryTags.length > 0 ? ` [${item.dietaryTags.join('/')}]` : '';
      const portion = item.portion ? ` (${item.portion})` : '';
      text += `• ${item.name}${portion}${tags}\n  └─ *${formatShortPrice(item.price)}* (Stok: ${item.stockQty})\n`;
    });

    if (group.disclaimer) {
      text += `_Notes: ${group.disclaimer}_\n`;
    }
    text += `\n`;
  }

  text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `*CARA PEMESANAN:*\n`;
  text += `Ketik: *ORDER [Nama Menu] [Jumlah]*\n`;
  text += `Contoh: *ORDER Sourdough 2, Rawon 1*\n\n`;
  text += `📍 Pengiriman: Paxel Cold Chain / Instant\n`;
  text += `💬 WhatsApp Hotline: ${RARUMI_WHATSAPP_DISPLAY}\n`;
  text += `_Jazakumullah Khairan Katsiran_ 🙏✨`;

  return text;
}
