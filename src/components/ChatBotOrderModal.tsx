import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  ShoppingCart, 
  Check, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  Minus, 
  CheckCircle2, 
  HelpCircle,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { Product } from '../types/pos';
import { formatRupiah } from '../data/masterMenu';
import { RARUMI_WHATSAPP_NUMBER } from '../utils/orderSummaryTemplate';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  matchedProducts?: { product: Product; quantity: number }[];
  isOrderSummary?: boolean;
  timestamp: string;
}

interface ChatBotOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCart?: () => void;
  onOpenWhatsAppLogin?: () => void;
}

export const ChatBotOrderModal: React.FC<ChatBotOrderModalProps> = ({
  isOpen,
  onClose,
  onOpenCart,
  onOpenWhatsAppLogin,
}) => {
  const { products, addToCart, cart, cartTotal, customerUser } = usePOS();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome: ChatMessage = {
        id: 'msg-welcome',
        sender: 'bot',
        text: `Halo ${customerUser ? customerUser.name : 'Sahabat Sehat'}! 👋 Selamat datang di Asisten Pemesanan Cerdas Rarumi Kitchen.\n\nKetik menu yang ingin dipesan secara bebas, contoh:\n• "Pesan 2 Sourdough Whole Wheat dan 1 Susu Almond"\n• "Rekomendasi sarapan gluten-free dan egg-free"\n• "Mau pesan snack manis sehat yang ready"`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([welcome]);
    }
  }, [isOpen, customerUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  // Natural Language Menu Item Parser
  const parseOrderIntent = (input: string): { matched: { product: Product; quantity: number }[]; queryDesc: string } => {
    const textLower = input.toLowerCase();
    const matched: { product: Product; quantity: number }[] = [];

    products.forEach(p => {
      const pNameLower = p.name.toLowerCase();
      // Split words for fuzzy matching
      const keywords = pNameLower.split(' ').filter(w => w.length > 2);
      
      let isMatch = false;
      if (textLower.includes(pNameLower)) {
        isMatch = true;
      } else {
        // Match if significant part matches (e.g., 'sourdough whole wheat', 'almond milk', 'rawon')
        const matchedKeywords = keywords.filter(k => textLower.includes(k));
        if (matchedKeywords.length >= Math.min(2, keywords.length)) {
          isMatch = true;
        }
      }

      if (isMatch) {
        // Try to detect quantity around the product keyword
        let qty = 1;
        const regexNumber = new RegExp(`(\\d+)\\s*(porsi|buah|box|biji|pcs|botol)?\\s*(?:dari\\s*)?${keywords[0]}`, 'i');
        const regexNumberAfter = new RegExp(`${keywords[0]}[^\\d]*?(\\d+)`, 'i');
        
        const matchBefore = textLower.match(regexNumber);
        const matchAfter = textLower.match(regexNumberAfter);

        if (matchBefore && matchBefore[1]) {
          qty = parseInt(matchBefore[1], 10);
        } else if (matchAfter && matchAfter[1]) {
          qty = parseInt(matchAfter[1], 10);
        } else if (textLower.includes('dua') || textLower.includes(' 2 ')) {
          qty = 2;
        } else if (textLower.includes('tiga') || textLower.includes(' 3 ')) {
          qty = 3;
        }

        matched.push({ product: p, quantity: Math.min(qty, 20) });
      }
    });

    return { matched, queryDesc: input };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsProcessing(true);

    setTimeout(() => {
      const lower = text.toLowerCase();

      // Check if user asks for checkout / order summary
      if (lower.includes('checkout') || lower.includes('hitung total') || lower.includes('bayar') || lower.includes('selesai')) {
        if (cart.length === 0) {
          setMessages(prev => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: 'bot',
              text: 'Keranjang belanja Anda saat ini masih kosong. Silakan pilih atau sebutkan menu yang ingin dipesan terlebih dahulu ya!',
              timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        } else {
          setMessages(prev => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: 'bot',
              text: `Berikut adalah ringkasan pesanan aktif Anda (${cart.length} item). Total: ${formatRupiah(cartTotal)}`,
              isOrderSummary: true,
              timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }
        setIsProcessing(false);
        return;
      }

      // Dietary recommendations
      if (lower.includes('egg-free') || lower.includes('tanpa telur')) {
        const efProducts = products.filter(p => p.isAvailable && p.dietaryTags.includes('EF')).slice(0, 4);
        setMessages(prev => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `Berikut rekomendasi menu *Egg-Free (Bebas Telur)* yang siap dipesan hari ini:`,
            matchedProducts: efProducts.map(p => ({ product: p, quantity: 1 })),
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setIsProcessing(false);
        return;
      }

      if (lower.includes('gluten-free') || lower.includes('bebas gluten')) {
        const gfProducts = products.filter(p => p.isAvailable && p.dietaryTags.includes('GF')).slice(0, 4);
        setMessages(prev => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `Berikut rekomendasi menu *Gluten-Free (Bebas Gluten)* terfavorit:`,
            matchedProducts: gfProducts.map(p => ({ product: p, quantity: 1 })),
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setIsProcessing(false);
        return;
      }

      // General order parsing
      const { matched } = parseOrderIntent(text);

      if (matched.length > 0) {
        setMessages(prev => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `Saya menemukan ${matched.length} menu yang sesuai dengan pesanan Anda. Anda bisa langsung klik tombol *Tambah ke Keranjang* atau *Order WhatsApp*:`,
            matchedProducts: matched,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        // Fallback friendly guidance with popular options
        const popular = products.filter(p => p.isAvailable).slice(0, 3);
        setMessages(prev => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `Saya belum menemukan menu spesifik dengan kata kunci tersebut. Apakah Anda berminat dengan menu terpopuler kami berikut ini?`,
            matchedProducts: popular.map(p => ({ product: p, quantity: 1 })),
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }

      setIsProcessing(false);
    }, 450);
  };

  const handleAddFromBot = (product: Product, quantity: number) => {
    addToCart(product, quantity);
  };

  const handleDirectWhatsAppOrder = (product: Product, quantity: number) => {
    const custName = customerUser ? customerUser.name : 'Pelanggan';
    const subtotal = product.price * quantity;
    const msg = encodeURIComponent(
      `*Halo Rarumi Kitchen*, saya ingin pesan langsung via WhatsApp:\n\n` +
      `• *${product.name}* (${quantity}x) = ${formatRupiah(subtotal)}\n` +
      `Nama Pemesan: ${custName}\n` +
      (customerUser?.phone ? `No. WA: ${customerUser.phone}\n` : '') +
      (customerUser?.address ? `Alamat: ${customerUser.address}\n` : '') +
      `Mohon infokan total ongkir dan metode pembayarannya. Terima kasih! 🌱`
    );
    window.open(`https://api.whatsapp.com/send?phone=${RARUMI_WHATSAPP_NUMBER}&text=${msg}`, '_blank');
  };

  const handleCheckoutViaWhatsApp = () => {
    if (cart.length === 0) return;
    const custName = customerUser ? customerUser.name : 'Pelanggan';
    const lines = cart.map((ci, i) => `${i + 1}. *${ci.product.name}* (${ci.quantity}x) = ${formatRupiah(ci.product.price * ci.quantity)}`).join('\n');
    const msg = encodeURIComponent(
      `*PESANAN VIA CHATBOT RARUMI KITCHEN*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Nama: *${custName}*\n` +
      (customerUser?.phone ? `No. WA: ${customerUser.phone}\n` : '') +
      (customerUser?.address ? `Alamat: ${customerUser.address}\n` : '') +
      `\n*Daftar Menu:*\n${lines}\n\n` +
      `*Subtotal:* ${formatRupiah(cartTotal)}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Mohon konfirmasi ketersediaan dan detail pengirimannya 🙏`
    );
    window.open(`https://api.whatsapp.com/send?phone=${RARUMI_WHATSAPP_NUMBER}&text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg h-[620px] bg-white rounded-3xl shadow-2xl border border-[#E8DFD3] flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 bg-[#FAF8F5] border-b border-[#E8DFD3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-2xl bg-[#3E6B48] text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#2D251E]">Chatbot Pemesanan Cerdas</h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-[#8C7A6B]">
                {customerUser ? `Halo, ${customerUser.name}` : 'Pesan menu sehat via chat interaktif'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!customerUser && onOpenWhatsAppLogin && (
              <button
                onClick={onOpenWhatsAppLogin}
                className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Login WA</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-[#E0D5C7] flex items-center justify-center text-[#6E5D4F] hover:text-[#2D251E] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-[#F8F5F0] px-4 py-2 border-b border-[#E8DFD3] flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
          <button
            onClick={() => handleSendMessage('Pesan 2 Sourdough Whole Wheat')}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#E0D5C7] text-[#6E5D4F] hover:text-[#2D251E] whitespace-nowrap cursor-pointer text-[11px] font-medium"
          >
            🥖 2 Sourdough Whole Wheat
          </button>
          <button
            onClick={() => handleSendMessage('Menu sarapan gluten-free ready?')}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#E0D5C7] text-[#6E5D4F] hover:text-[#2D251E] whitespace-nowrap cursor-pointer text-[11px] font-medium"
          >
            🌱 Sarapan Gluten-Free
          </button>
          <button
            onClick={() => handleSendMessage('Rekomendasi egg-free tanpa telur')}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#E0D5C7] text-[#6E5D4F] hover:text-[#2D251E] whitespace-nowrap cursor-pointer text-[11px] font-medium"
          >
            🥚 Menu Egg-Free
          </button>
          <button
            onClick={() => handleSendMessage('Checkout dan hitung total')}
            className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 whitespace-nowrap cursor-pointer text-[11px] font-bold"
          >
            🛒 Cek Keranjang
          </button>
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAF8F5]">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-end justify-end'}`}
              >
                {isBot && (
                  <div className="w-7 h-7 rounded-xl bg-[#3E6B48] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 text-xs shadow-2xs space-y-2.5 ${
                    isBot
                      ? 'bg-white text-[#2D251E] border border-[#E8DFD3]'
                      : 'bg-[#2D251E] text-white rounded-br-xs'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  {/* Render Matched Product Cards */}
                  {msg.matchedProducts && msg.matchedProducts.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {msg.matchedProducts.map(({ product, quantity }) => {
                        const inCart = cart.find(c => c.product.id === product.id);

                        return (
                          <div
                            key={product.id}
                            className="bg-[#FCFBF9] p-2.5 rounded-xl border border-[#E8DFD3] space-y-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-bold text-[#2D251E] text-xs">
                                  {product.name}
                                </h4>
                                <div className="text-[10px] text-[#8C7A6B] flex items-center gap-1 mt-0.5">
                                  <span>{product.category}</span>
                                  {product.portion && <span>· {product.portion}</span>}
                                  {product.dietaryTags.length > 0 && (
                                    <span className="text-[#3E6B48] font-semibold">
                                      · {product.dietaryTags.join('/')}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className="font-mono font-bold text-[#3E6B48] text-xs shrink-0">
                                {formatRupiah(product.price)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#F0EAE1]">
                              <span className="text-[10px] text-[#8C7A6B]">
                                Status: {product.isAvailable ? <strong className="text-emerald-700">Ready</strong> : <strong className="text-rose-600">Habis ❎</strong>}
                              </span>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  disabled={!product.isAvailable}
                                  onClick={() => handleAddFromBot(product, quantity)}
                                  className="px-2 py-1 rounded-lg bg-[#3E6B48] hover:bg-[#34593C] disabled:opacity-50 text-white font-bold text-[10px] flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                                >
                                  {inCart ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-300" />
                                      <span>Di Keranjang ({inCart.quantity})</span>
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-3 h-3" />
                                      <span>+ Keranjang ({quantity}x)</span>
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDirectWhatsAppOrder(product, quantity)}
                                  className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Order langsung lewat pesan WhatsApp"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                  <span>Order WA</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Render Order Summary Bubble */}
                  {msg.isOrderSummary && cart.length > 0 && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2 mt-2">
                      <div className="font-bold text-emerald-900 text-xs">
                        Rincian Pesanan ({cart.length} menu):
                      </div>
                      <div className="space-y-1 text-[11px] text-emerald-950 font-mono divide-y divide-emerald-100">
                        {cart.map(c => (
                          <div key={c.product.id} className="pt-1 flex justify-between">
                            <span>{c.quantity}x {c.product.name}</span>
                            <span>{formatRupiah(c.product.price * c.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold pt-1.5 border-t border-emerald-200 text-emerald-900 font-mono">
                        <span>Total:</span>
                        <span>{formatRupiah(cartTotal)}</span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        {onOpenCart && (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenCart();
                            }}
                            className="flex-1 py-1.5 px-2 bg-[#2D251E] text-white rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Buka Kasir</span>
                          </button>
                        )}
                        <button
                          onClick={handleCheckoutViaWhatsApp}
                          className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Pesan via WA</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <span className="text-[9px] text-[#A39281] block text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex items-center gap-2 text-xs text-[#8C7A6B]">
              <div className="w-7 h-7 rounded-xl bg-[#3E6B48] text-white flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white px-3 py-2 rounded-2xl border border-[#E8DFD3] text-[#6E5D4F]">
                Menganalisa menu dan menghitung stok...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Field */}
        <div className="p-3 bg-white border-t border-[#E8DFD3]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Contoh: Pesan 2 Sourdough dan 1 Susu Almond..."
              className="flex-1 px-3.5 py-2.5 text-xs rounded-2xl border border-[#E0D5C7] bg-[#FCFBF9] focus:bg-white focus:border-[#3E6B48] focus:ring-1 focus:ring-[#3E6B48] outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-9 h-9 rounded-2xl bg-[#3E6B48] hover:bg-[#34593C] disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-colors shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
