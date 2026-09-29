import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  RotateCcw, 
  X, 
  Minimize2, 
  Maximize2, 
  Copy, 
  Check,
  Zap,
  Cpu,
  Brain,
  MessageSquare
} from 'lucide-react';
import { usePOS } from '../context/POSContext';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  modelUsed?: string;
}

interface GeminiChatbotProps {
  isOpen?: boolean;
  onClose?: () => void;
  isFloating?: boolean;
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({ 
  isOpen = true, 
  onClose,
  isFloating = false 
}) => {
  const { products } = usePOS();

  // Model selection per instructions:
  // - gemini-3.5-flash for general tasks
  // - gemini-3.1-flash-lite for tasks that should happen fast
  // - gemini-3.1-pro-preview for particularly complex tasks
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.5-flash');
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Bismillahirrahmannirrahim! Halo, saya **Asisten Cerdas & Konsultan Gizi Rarumi Kitchen** 🌿\n\nSaya siap membantu Anda:\n• Merekomendasikan menu aman alergi (Gluten-Free, Bebas Telur, Dairy-Free, Vegan, Grassfed)\n• Tips penyimpanan & reheat sourdough kukus 5 menit agar fluffy kembali\n• Merangkum kebutuhan gizi dan format pesanan untuk WhatsApp resmi Rarumi Kitchen.\n\nAda yang bisa saya bantu untuk menu hari ini?`,
      timestamp: new Date(),
      modelUsed: 'gemini-3.5-flash',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const threadEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of thread
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickStarters = [
    'Menu apa yang aman untuk anak alergi telur & gluten?',
    'Bagaimana cara reheat roti sourdough dari freezer agar fluffy?',
    'Rekomendasikan menu makan siang tinggi protein & tanpa tepung',
    'Apa keunggulan susu mentah (raw milk) grassfed & kombucha?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      // Build conversation history for multi-turn chat
      const historyPayload = [...messages, userMessage].map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content,
      }));

      // Include live master inventory summary into system instruction
      const readyMenuNames = products.filter(p => p.isAvailable).slice(0, 30).map(p => p.name).join(', ');
      const systemInstruction = `Anda adalah Asisten Cerdas & Konsultan Gizi Resmi untuk "Rarumi Healthy & Organic Kitchen".
Toko ini berfokus pada makanan sehat artisanal, Gluten-Free (GF), Egg-Free (EF), Dairy-Free (DF), Vegan, Grassfed, dan bahan dapur organik alami tanpa MSG dan tanpa pengawet.

Informasi penting:
- Nomor WhatsApp Resmi Pemesanan: 0812-9876-5432 (Rarumi Kitchen)
- Disclaimer Roti Sourdough: Roti sourdough bisa disimpan di freezer dan direheat kembali (kukus) sebelum dimakan -+ 5 menit agar fluffy kembali.
- Sebagian menu ready saat ini: ${readyMenuNames}

Tugas Anda:
1. Berikan rekomendasi ramah, ilmiah, dan praktis sesuai kebutuhan pantangan/alergi makanan.
2. Jaga riwayat percakapan secara konsisten.
3. Selalu bersikap sopan, ramah, dan bernuansa islami halal-thayyib.`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: historyPayload,
          model: selectedModel,
          systemInstruction,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error (${response.status})`);
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
        modelUsed: data.modelUsed || selectedModel,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Mohon maaf, terjadi kendala saat menghubungi asisten AI (${err.message || 'Koneksi gagal'}). Pastikan konfigurasi GEMINI_API_KEY aktif atau coba lagi sebentar lagi.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Percakapan telah direset. Silakan tanyakan rekomendasi menu atau konsultasi gizi sehat Rarumi Kitchen!`,
        timestamp: new Date(),
        modelUsed: selectedModel,
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className={`flex flex-col bg-white rounded-3xl border border-[#E8DFD3] shadow-xl overflow-hidden ${
      isFloating 
        ? 'w-full max-w-lg h-[600px] max-h-[85vh]' 
        : 'max-w-4xl mx-auto h-[calc(100vh-10rem)] min-h-[500px] my-6'
    }`}>
      
      {/* Chat Header */}
      <div className="p-4 bg-[#FAF8F5] border-b border-[#E8DFD3] flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#3E6B48] text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#2D251E] flex items-center gap-1.5">
              <span>Asisten Pintar Rarumi AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h3>
            <p className="text-[11px] text-[#8C7A6B]">Konsultan Menu Sehat & Gizi Alergi</p>
          </div>
        </div>

        {/* Model Selector & Actions */}
        <div className="flex items-center gap-2">
          {/* Model Selection Dropdown */}
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="text-[11px] font-semibold bg-white border border-[#E0D5C7] rounded-xl px-2.5 py-1.5 text-[#2D251E] focus:outline-none focus:ring-1 focus:ring-[#3E6B48] cursor-pointer"
              title="Pilih Model Gemini"
            >
              <option value="gemini-3.5-flash">⚡ gemini-3.5-flash (Umum & Seimbang)</option>
              <option value="gemini-3.1-flash-lite">🚀 gemini-3.1-flash-lite (Super Cepat)</option>
              <option value="gemini-3.1-pro-preview">🧠 gemini-3.1-pro-preview (Analisis Kompleks)</option>
            </select>
          </div>

          <button
            onClick={handleResetChat}
            className="p-1.5 rounded-lg text-[#8C7A6B] hover:text-[#2D251E] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            title="Mulai Percakapan Baru"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8C7A6B] hover:text-[#2D251E] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Conversation Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FAF8F5]/40">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          const isCopied = copiedId === m.id;

          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                isUser 
                  ? 'bg-[#2D251E] text-white' 
                  : 'bg-[#3E6B48] text-white shadow-2xs'
              }`}>
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                isUser
                  ? 'bg-[#2D251E] text-white rounded-tr-none'
                  : 'bg-white text-[#2D251E] border border-[#E8DFD3] shadow-xs rounded-tl-none'
              }`}>
                <div className="whitespace-pre-wrap font-sans">
                  {m.content}
                </div>

                {/* Footer of Bubble */}
                <div className={`flex items-center justify-between gap-3 mt-2 pt-1 border-t text-[10px] ${
                  isUser ? 'border-white/10 text-white/60' : 'border-[#F2ECE4] text-[#A39281]'
                }`}>
                  <span>
                    {m.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    {m.modelUsed && !isUser && (
                      <span className="ml-1.5 opacity-75 font-mono">· {m.modelUsed}</span>
                    )}
                  </span>

                  <button
                    onClick={() => handleCopyMessage(m.id, m.content)}
                    className="hover:opacity-100 opacity-60 flex items-center gap-1 transition-opacity cursor-pointer"
                    title="Salin Pesan"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-500">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#3E6B48] text-white flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white border border-[#E8DFD3] rounded-2xl rounded-tl-none p-3.5 shadow-xs text-xs text-[#6E5D4F] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3E6B48] animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-[#3E6B48] animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-[#3E6B48] animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px] text-[#8C7A6B] ml-1">Asisten sedang menganalisis menu & nutrisi...</span>
            </div>
          </div>
        )}

        <div ref={threadEndRef} />
      </div>

      {/* Quick Starter Chips */}
      {messages.length <= 2 && (
        <div className="p-3 bg-[#FAF8F5] border-t border-[#E8DFD3] flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar shrink-0">
          <span className="text-[#8C7A6B] shrink-0 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Tanya:
          </span>
          {quickStarters.map((qs, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qs)}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#E0D5C7] text-[#6E5D4F] hover:text-[#2D251E] hover:border-[#3E6B48] shrink-0 transition-all cursor-pointer whitespace-nowrap"
            >
              {qs}
            </button>
          ))}
        </div>
      )}

      {/* Input Composer */}
      <div className="p-3 sm:p-4 bg-white border-t border-[#E8DFD3] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Tanyakan rekomendasi menu, alergi, cara simpan, atau pesan WA..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-xs bg-[#FAF8F5] border border-[#E0D5C7] rounded-xl focus:ring-2 focus:ring-[#3E6B48] focus:outline-none text-[#2D251E] placeholder:text-[#A39281] disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className={`p-2.5 rounded-xl font-bold transition-all flex items-center justify-center cursor-pointer ${
              inputPrompt.trim() && !isLoading
                ? 'bg-[#3E6B48] text-white hover:bg-[#34593C] shadow-xs'
                : 'bg-[#F4EFEA] text-[#A39281] cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
