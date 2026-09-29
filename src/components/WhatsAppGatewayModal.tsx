import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  MessageSquare, 
  Bot, 
  Sparkles, 
  ShoppingCart, 
  Check, 
  Radio, 
  RefreshCw, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Play,
  Settings2,
  Plus,
  Trash2,
  Edit2,
  ToggleLeft,
  ToggleRight,
  Sliders,
  Utensils,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { formatRupiah } from '../data/masterMenu';
import { WhatsAppAutoReplyTrigger } from '../types/pos';

interface WhatsAppGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCart?: () => void;
}

export const WhatsAppGatewayModal: React.FC<WhatsAppGatewayModalProps> = ({
  isOpen,
  onClose,
  onOpenCart,
}) => {
  const { 
    waGatewayConnected, 
    waGatewayPhone, 
    waGatewayBotName, 
    waIncomingMessages, 
    waDraftOrders, 
    connectWAGateway, 
    disconnectWAGateway, 
    sendSimulatedWAMessage, 
    acceptDraftOrder, 
    rejectDraftOrder,
    autoReplyTriggers,
    addAutoReplyTrigger,
    updateAutoReplyTrigger,
    deleteAutoReplyTrigger,
    toggleAutoReplyTrigger,
    resetAutoReplyTriggersToDefault
  } = usePOS();

  const [activeTab, setActiveTab] = useState<'simulator' | 'triggers' | 'drafts' | 'connection'>('simulator');
  const [phoneNumberInput, setPhoneNumberInput] = useState<string>(waGatewayPhone || '081298765432');
  const [botNameInput, setBotNameInput] = useState<string>(waGatewayBotName || 'Rarumi Kitchen Order Bot');
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Message Simulator State
  const [testCustomerPhone, setTestCustomerPhone] = useState<string>('081234567890');
  const [testCustomerName, setTestCustomerName] = useState<string>('Ibu Maya (Pondok Indah)');
  const [testMessageText, setTestMessageText] = useState<string>('Halo min, order Sourdough 2 sama Rawon 1');
  const [justSimulated, setJustSimulated] = useState<boolean>(false);

  // Trigger Form State
  const [isAddingTrigger, setIsAddingTrigger] = useState<boolean>(false);
  const [editingTriggerId, setEditingTriggerId] = useState<string | null>(null);
  const [triggerKeyword, setTriggerKeyword] = useState<string>('');
  const [triggerMatchType, setTriggerMatchType] = useState<'contains' | 'exact' | 'startsWith'>('contains');
  const [triggerActionType, setTriggerActionType] = useState<'reply_text' | 'reply_ready_menu' | 'create_order'>('reply_text');
  const [triggerResponseTemplate, setTriggerResponseTemplate] = useState<string>('');
  const [triggerDescription, setTriggerDescription] = useState<string>('');

  if (!isOpen) return null;

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setTimeout(() => {
      connectWAGateway(phoneNumberInput, botNameInput);
      setIsScanning(false);
      setActiveTab('simulator');
    }, 1200);
  };

  const handleSimulateSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testMessageText.trim()) return;

    sendSimulatedWAMessage(testCustomerPhone, testCustomerName, testMessageText);
    setJustSimulated(true);
    setTimeout(() => setJustSimulated(false), 3000);
  };

  const handleSaveTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!triggerKeyword.trim()) return;

    if (editingTriggerId) {
      const existing = autoReplyTriggers.find(t => t.id === editingTriggerId);
      if (existing) {
        updateAutoReplyTrigger({
          ...existing,
          keyword: triggerKeyword.trim().toLowerCase(),
          matchType: triggerMatchType,
          actionType: triggerActionType,
          responseTemplate: triggerResponseTemplate,
          description: triggerDescription.trim() || undefined,
        });
      }
    } else {
      addAutoReplyTrigger({
        keyword: triggerKeyword.trim().toLowerCase(),
        matchType: triggerMatchType,
        actionType: triggerActionType,
        responseTemplate: triggerResponseTemplate,
        description: triggerDescription.trim() || undefined,
        isEnabled: true,
      });
    }

    // Reset form
    setIsAddingTrigger(false);
    setEditingTriggerId(null);
    setTriggerKeyword('');
    setTriggerResponseTemplate('');
    setTriggerDescription('');
  };

  const handleStartEditTrigger = (trigger: WhatsAppAutoReplyTrigger) => {
    setEditingTriggerId(trigger.id);
    setTriggerKeyword(trigger.keyword);
    setTriggerMatchType(trigger.matchType);
    setTriggerActionType(trigger.actionType);
    setTriggerResponseTemplate(trigger.responseTemplate);
    setTriggerDescription(trigger.description || '');
    setIsAddingTrigger(true);
  };

  const handleCancelTriggerForm = () => {
    setIsAddingTrigger(false);
    setEditingTriggerId(null);
    setTriggerKeyword('');
    setTriggerResponseTemplate('');
    setTriggerDescription('');
  };

  const pendingDrafts = waDraftOrders.filter(d => d.status === 'PENDING');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#E8DFD3] overflow-hidden my-4">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-b border-[#E8DFD3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#2D251E]">
                  WhatsApp Gateway & Auto-Responder
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  waGatewayConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${waGatewayConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                  {waGatewayConnected ? 'Aktif Mendengarkan' : 'Terputus'}
                </span>
              </div>
              <p className="text-xs text-[#8C7A6B]">
                Kelola pemicu auto-reply kustom (ORDER, MENU, ONGKIR, dll) dan pemesanan otomatis
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#E0D5C7] flex items-center justify-center text-[#6E5D4F] hover:text-[#2D251E] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex border-b border-[#E8DFD3] bg-[#F4EFEA] px-4 pt-2 gap-1 sm:gap-2 text-xs overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-white text-[#2D251E] border-t border-x border-[#E8DFD3] shadow-xs'
                : 'text-[#6E5D4F] hover:text-[#2D251E]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simulasi & Chat Masuk</span>
            {waIncomingMessages.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('triggers')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'triggers'
                ? 'bg-white text-[#2D251E] border-t border-x border-[#E8DFD3] shadow-xs'
                : 'text-[#6E5D4F] hover:text-[#2D251E]'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Konfigurasi Auto-Reply ({autoReplyTriggers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('drafts')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'drafts'
                ? 'bg-white text-[#2D251E] border-t border-x border-[#E8DFD3] shadow-xs'
                : 'text-[#6E5D4F] hover:text-[#2D251E]'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5 text-sky-600" />
            <span>Order Masuk ({pendingDrafts.length})</span>
            {pendingDrafts.length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                {pendingDrafts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('connection')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'connection'
                ? 'bg-white text-[#2D251E] border-t border-x border-[#E8DFD3] shadow-xs'
                : 'text-[#6E5D4F] hover:text-[#2D251E]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-[#3E6B48]" />
            <span>Login WhatsApp</span>
          </button>
        </div>

        {/* TAB 1: Live Chat & Simulator */}
        {activeTab === 'simulator' && (
          <div className="p-5 sm:p-6 space-y-5 max-h-[520px] overflow-y-auto">
            
            {/* Rule Explainer Banner */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span>Pemicu Auto-Reply Aktif</span>
                </div>
                <button
                  onClick={() => setActiveTab('triggers')}
                  className="text-[11px] font-bold text-emerald-800 underline cursor-pointer"
                >
                  Kelola Trigger ({autoReplyTriggers.filter(t => t.isEnabled).length} Aktif) →
                </button>
              </div>
              <p className="text-emerald-950 leading-relaxed text-[11px]">
                Jika pesan masuk mengandung kata kunci terdaftar, bot akan membalas secara otomatis. Contoh: kata <strong className="bg-white px-1 rounded text-emerald-800 border border-emerald-300 font-mono">ORDER</strong> akan otomatis membuat pesanan kasir, dan <strong className="bg-white px-1 rounded text-emerald-800 border border-emerald-300 font-mono">MENU</strong> akan membalas dengan list menu ready.
              </p>
            </div>

            {/* Live Message Simulator Form */}
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8DFD3] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D251E]">
                  <Play className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                  <span>Uji Kirim Pesan Masuk (Live Tester)</span>
                </div>
                <span className="text-[10px] text-[#8C7A6B]">Simulasi Pelanggan WhatsApp</span>
              </div>

              <form onSubmit={handleSimulateSend} className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-[#6E5D4F] mb-1">Nama Pengirim</label>
                    <input
                      type="text"
                      value={testCustomerName}
                      onChange={(e) => setTestCustomerName(e.target.value)}
                      placeholder="Nama pelanggan"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-[#E0D5C7] rounded-xl outline-none focus:border-[#3E6B48]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#6E5D4F] mb-1">No. WhatsApp Pengirim</label>
                    <input
                      type="tel"
                      value={testCustomerPhone}
                      onChange={(e) => setTestCustomerPhone(e.target.value)}
                      placeholder="0812..."
                      className="w-full px-3 py-1.5 text-xs bg-white border border-[#E0D5C7] rounded-xl outline-none font-mono focus:border-[#3E6B48]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#6E5D4F] mb-1">Isi Pesan WhatsApp</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={testMessageText}
                      onChange={(e) => setTestMessageText(e.target.value)}
                      placeholder="Contoh: Halo min, order Sourdough 2 biji"
                      className="flex-1 px-3 py-2 text-xs bg-white border border-[#E0D5C7] rounded-xl outline-none focus:border-emerald-600 font-medium"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Tes</span>
                    </button>
                  </div>
                </div>

                {/* Preset Fast Testing Chips based on active triggers */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                  <span className="text-[10px] text-[#8C7A6B]">Pilihan Cepat:</span>
                  <button
                    type="button"
                    onClick={() => setTestMessageText('order Sourdough 2 dan Susu Almond 1')}
                    className="px-2 py-0.5 bg-white border border-[#E0D5C7] rounded-lg text-[#6E5D4F] hover:text-[#2D251E] cursor-pointer"
                  >
                    • "order Sourdough 2..."
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestMessageText('menu')}
                    className="px-2 py-0.5 bg-white border border-[#E0D5C7] rounded-lg text-[#6E5D4F] hover:text-[#2D251E] cursor-pointer"
                  >
                    • "menu"
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestMessageText('ongkir')}
                    className="px-2 py-0.5 bg-white border border-[#E0D5C7] rounded-lg text-[#6E5D4F] hover:text-[#2D251E] cursor-pointer"
                  >
                    • "ongkir"
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestMessageText('lokasi')}
                    className="px-2 py-0.5 bg-white border border-[#E0D5C7] rounded-lg text-[#6E5D4F] hover:text-[#2D251E] cursor-pointer"
                  >
                    • "lokasi"
                  </button>
                </div>
              </form>
            </div>

            {/* Incoming Chats & Bot Replies Feed */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#2D251E]">
                <span>Log Pesan Masuk & Jawaban Bot ({waIncomingMessages.length})</span>
                <span className="text-[10px] text-emerald-700 font-normal">Real-time sync</span>
              </div>

              <div className="space-y-3">
                {waIncomingMessages.slice(0, 5).map((msg) => (
                  <div key={msg.id} className="bg-white p-3.5 rounded-2xl border border-[#E8DFD3] space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#2D251E]">{msg.fromName}</span>
                        <span className="text-[11px] text-[#8C7A6B] font-mono">({msg.fromPhone})</span>
                      </div>
                      <span className="text-[10px] text-[#A39281]">{msg.timestamp}</span>
                    </div>

                    <div className="p-2 bg-[#F8F5F0] rounded-xl text-xs text-[#2D251E] font-medium flex items-start gap-2">
                      <span className="text-emerald-700 font-bold shrink-0">Pelanggan:</span>
                      <p className="flex-1">{msg.text}</p>
                    </div>

                    {msg.botReply && (
                      <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-950 space-y-1">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                          <Bot className="w-3 h-3 text-emerald-600" />
                          <span>Balasan Otomatis Bot:</span>
                        </div>
                        <p className="whitespace-pre-line text-[11px] leading-relaxed">{msg.botReply}</p>
                      </div>
                    )}

                    {msg.isOrderKeyword && (
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Kata kunci 'ORDER' terdeteksi! Draf pesanan dibuat</span>
                        </span>
                        <button
                          onClick={() => setActiveTab('drafts')}
                          className="font-bold text-[#3E6B48] hover:underline cursor-pointer"
                        >
                          Lihat Draf Order →
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Custom Auto-Reply Triggers Configuration Screen */}
        {activeTab === 'triggers' && (
          <div className="p-5 sm:p-6 space-y-5 max-h-[520px] overflow-y-auto">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E8DFD3]">
              <div>
                <h4 className="font-bold text-sm text-[#2D251E] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#3E6B48]" />
                  <span>Daftar Pemicu Auto-Reply Kustom</span>
                </h4>
                <p className="text-[11px] text-[#8C7A6B]">
                  Bot akan otomatis membalas pesan masuk yang sesuai dengan kata kunci di bawah ini
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetAutoReplyTriggersToDefault}
                  className="px-3 py-1.5 rounded-xl border border-[#E0D5C7] text-xs font-semibold text-[#6E5D4F] hover:bg-white flex items-center gap-1 cursor-pointer transition-colors"
                  title="Kembalikan ke pemicu bawaan (ORDER, MENU, ONGKIR, dll)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>

                {!isAddingTrigger && (
                  <button
                    onClick={() => {
                      setIsAddingTrigger(true);
                      setEditingTriggerId(null);
                      setTriggerKeyword('');
                      setTriggerMatchType('contains');
                      setTriggerActionType('reply_text');
                      setTriggerResponseTemplate('');
                      setTriggerDescription('');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#3E6B48] hover:bg-[#34593C] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Trigger Baru</span>
                  </button>
                )}
              </div>
            </div>

            {/* Trigger Create/Edit Form */}
            {isAddingTrigger && (
              <form onSubmit={handleSaveTrigger} className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-[#3E6B48] shadow-sm space-y-3.5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-2">
                  <h5 className="font-bold text-xs text-[#2D251E] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{editingTriggerId ? 'Edit Pemicu Auto-Reply' : 'Buat Pemicu Auto-Reply Baru'}</span>
                  </h5>
                  <button
                    type="button"
                    onClick={handleCancelTriggerForm}
                    className="text-[#8C7A6B] hover:text-[#2D251E] text-xs cursor-pointer"
                  >
                    Batal
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#4A3E33] mb-1">
                      Kata Kunci (Keyword) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={triggerKeyword}
                      onChange={(e) => setTriggerKeyword(e.target.value)}
                      placeholder="Contoh: diskon / promo / jadwal"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E0D5C7] outline-none font-mono focus:border-[#3E6B48]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4A3E33] mb-1">
                      Metode Pencocokan (Match Type)
                    </label>
                    <select
                      value={triggerMatchType}
                      onChange={(e) => setTriggerMatchType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E0D5C7] outline-none bg-white focus:border-[#3E6B48]"
                    >
                      <option value="contains">Mengandung Kata (Contains - Direkomendasikan)</option>
                      <option value="exact">Sama Persis (Exact Match)</option>
                      <option value="startsWith">Diawali Kata (Starts With)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#4A3E33] mb-1">
                    Jenis Aksi Bot (Action Type) <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setTriggerActionType('reply_ready_menu')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        triggerActionType === 'reply_ready_menu'
                          ? 'border-[#3E6B48] bg-emerald-50 text-emerald-950 font-bold ring-1 ring-[#3E6B48]'
                          : 'border-[#E0D5C7] hover:bg-[#FAF8F5] text-[#6E5D4F]'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1 mb-0.5">
                        <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Kirim Menu Ready</span>
                      </div>
                      <p className="text-[10px] text-[#8C7A6B] font-normal leading-tight">
                        Otomatis kirim seluruh daftar menu ready saat ini.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTriggerActionType('create_order')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        triggerActionType === 'create_order'
                          ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold ring-1 ring-amber-500'
                          : 'border-[#E0D5C7] hover:bg-[#FAF8F5] text-[#6E5D4F]'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1 mb-0.5">
                        <ShoppingCart className="w-3.5 h-3.5 text-amber-600" />
                        <span>Buat Draf Pesanan</span>
                      </div>
                      <p className="text-[10px] text-[#8C7A6B] font-normal leading-tight">
                        Deteksi pesanan, buat struk draf & hitung total di kasir.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTriggerActionType('reply_text')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        triggerActionType === 'reply_text'
                          ? 'border-sky-500 bg-sky-50 text-sky-950 font-bold ring-1 ring-sky-500'
                          : 'border-[#E0D5C7] hover:bg-[#FAF8F5] text-[#6E5D4F]'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1 mb-0.5">
                        <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                        <span>Balas Teks Kustom</span>
                      </div>
                      <p className="text-[10px] text-[#8C7A6B] font-normal leading-tight">
                        Kirim teks bebas (info alamat, rekening, jadwal, dll).
                      </p>
                    </button>
                  </div>
                </div>

                {triggerActionType !== 'reply_ready_menu' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-[#4A3E33]">
                        Template Balasan Bot
                      </label>
                      <span className="text-[10px] text-[#8C7A6B]">
                        Variabel: <strong className="font-mono">{'{name}'}</strong>, <strong className="font-mono">{'{subtotal}'}</strong>
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      required={triggerActionType !== 'reply_ready_menu'}
                      value={triggerResponseTemplate}
                      onChange={(e) => setTriggerResponseTemplate(e.target.value)}
                      placeholder="Contoh: Halo Kak {name}! Promo hari ini diskon 10% untuk pemesanan cake..."
                      className="w-full p-2.5 text-xs rounded-xl border border-[#E0D5C7] outline-none font-mono focus:border-[#3E6B48]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-[#4A3E33] mb-1">
                    Deskripsi / Catatan Trigger (Opsional)
                  </label>
                  <input
                    type="text"
                    value={triggerDescription}
                    onChange={(e) => setTriggerDescription(e.target.value)}
                    placeholder="Contoh: Untuk menjawab pertanyaan seputar promo gajian"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E0D5C7] outline-none focus:border-[#3E6B48]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCancelTriggerForm}
                    className="px-3.5 py-2 rounded-xl border border-[#E0D5C7] text-xs font-semibold text-[#6E5D4F] hover:bg-[#FAF8F5] cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#3E6B48] hover:bg-[#34593C] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    {editingTriggerId ? 'Simpan Perubahan' : 'Tambahkan Trigger'}
                  </button>
                </div>
              </form>
            )}

            {/* Triggers List */}
            <div className="space-y-2.5">
              {autoReplyTriggers.map((trigger) => (
                <div
                  key={trigger.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                    trigger.isEnabled
                      ? 'bg-white border-[#E8DFD3] hover:border-[#3E6B48]/50 shadow-2xs'
                      : 'bg-[#FAF8F5] border-[#E8DFD3] opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-[#FAF8F5] border border-[#E0D5C7] px-2 py-0.5 rounded-lg text-[#2D251E]">
                        "{trigger.keyword}"
                      </span>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        trigger.actionType === 'create_order' ? 'bg-amber-100 text-amber-900' :
                        trigger.actionType === 'reply_ready_menu' ? 'bg-emerald-100 text-emerald-900' :
                        'bg-sky-100 text-sky-900'
                      }`}>
                        {trigger.actionType === 'create_order' ? '🛒 Buat Pesanan' :
                         trigger.actionType === 'reply_ready_menu' ? '🌱 Kirim Menu Ready' :
                         '💬 Teks Kustom'}
                      </span>

                      <span className="text-[10px] text-[#8C7A6B]">
                        ({trigger.matchType})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Toggle Active Button */}
                      <button
                        type="button"
                        onClick={() => toggleAutoReplyTrigger(trigger.id)}
                        className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                          trigger.isEnabled
                            ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                            : 'text-zinc-500 bg-zinc-100 hover:bg-zinc-200'
                        }`}
                        title={trigger.isEnabled ? 'Nonaktifkan trigger ini' : 'Aktifkan trigger ini'}
                      >
                        {trigger.isEnabled ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Aktif</span>
                          </>
                        ) : (
                          <span>Nonaktif</span>
                        )}
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleStartEditTrigger(trigger)}
                        className="p-1 text-[#8C7A6B] hover:text-[#2D251E] rounded-lg hover:bg-[#F0EAE1] cursor-pointer"
                        title="Edit Trigger"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => deleteAutoReplyTrigger(trigger.id)}
                        className="p-1 text-[#8C7A6B] hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                        title="Hapus Trigger"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {trigger.description && (
                    <p className="text-[11px] text-[#8C7A6B] mb-2">{trigger.description}</p>
                  )}

                  {trigger.actionType === 'reply_ready_menu' ? (
                    <div className="p-2 bg-emerald-50/70 border border-emerald-100 rounded-xl text-[11px] text-emerald-900 flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Mengirimkan seluruh daftar menu ready live dari master stok secara real-time.</span>
                    </div>
                  ) : (
                    <div className="p-2 bg-[#FAF8F5] border border-[#EFE9DF] rounded-xl text-[11px] font-mono text-[#4A3E33] whitespace-pre-line line-clamp-2">
                      {trigger.responseTemplate}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 text-[10px] text-[#A39281]">
                    <span>Coba ketik kata kunci ini di tab 'Simulasi'</span>
                    <button
                      type="button"
                      onClick={() => {
                        setTestMessageText(trigger.keyword);
                        setActiveTab('simulator');
                      }}
                      className="font-bold text-[#3E6B48] hover:underline cursor-pointer"
                    >
                      Uji di Simulator →
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: Draft Orders from WhatsApp */}
        {activeTab === 'drafts' && (
          <div className="p-5 sm:p-6 space-y-4 max-h-[520px] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#2D251E]">Draf Pesanan dari WhatsApp</h4>
                <p className="text-xs text-[#8C7A6B]">Pesanan yang otomatis masuk saat pelanggan mengirim kata 'ORDER'</p>
              </div>
              <span className="text-xs bg-amber-100 text-amber-900 px-2.5 py-1 rounded-xl font-bold">
                {pendingDrafts.length} Menunggu
              </span>
            </div>

            {waDraftOrders.length === 0 ? (
              <div className="p-10 text-center bg-[#FAF8F5] rounded-2xl border border-[#E8DFD3] space-y-2">
                <ShoppingCart className="w-8 h-8 text-[#C4B7A6] mx-auto" />
                <p className="text-xs font-semibold text-[#2D251E]">Belum ada pesanan via WhatsApp</p>
                <p className="text-[11px] text-[#8C7A6B]">Gunakan tab 'Simulasi' untuk mencoba mengirim pesan dengan kata 'ORDER'.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {waDraftOrders.map((draft) => {
                  const isPending = draft.status === 'PENDING';

                  return (
                    <div 
                      key={draft.id} 
                      className={`p-4 rounded-2xl border transition-all ${
                        isPending 
                          ? 'bg-white border-amber-300 ring-1 ring-amber-300 shadow-xs' 
                          : 'bg-[#FAF8F5] border-[#E8DFD3] opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs sm:text-sm text-[#2D251E]">{draft.customerName}</h4>
                            <span className="font-mono text-[11px] text-[#8C7A6B]">{draft.customerPhone}</span>
                          </div>
                          <p className="text-[11px] text-[#6E5D4F] italic mt-0.5">
                            "{draft.originalText}"
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          draft.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                          draft.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          {draft.status === 'ACCEPTED' ? 'DITERIMA' : draft.status === 'REJECTED' ? 'DITOLAK' : 'MENUNGGU KASIR'}
                        </span>
                      </div>

                      <div className="p-2.5 bg-[#FAF8F5] rounded-xl text-xs font-mono space-y-1 my-2 divide-y divide-[#EFE9DF]">
                        {draft.items.map((it, idx) => (
                          <div key={idx} className="pt-1 flex justify-between">
                            <span>{it.quantity}x {it.product.name}</span>
                            <span className="font-bold text-[#3E6B48]">{formatRupiah(it.product.price * it.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="text-xs">
                          <span className="text-[#8C7A6B]">Total: </span>
                          <strong className="text-sm font-mono text-[#2D251E]">{formatRupiah(draft.subtotal)}</strong>
                        </div>

                        {isPending && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => rejectDraftOrder(draft.id)}
                              className="px-2.5 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold cursor-pointer"
                            >
                              Tolak
                            </button>
                            <button
                              onClick={() => {
                                acceptDraftOrder(draft.id);
                                if (onOpenCart) onOpenCart();
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-[#3E6B48] hover:bg-[#34593C] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Terima ke Kasir</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Connection Status & QR Code */}
        {activeTab === 'connection' && (
          <div className="p-5 sm:p-6 space-y-5 max-h-[520px] overflow-y-auto">
            <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-[#FAF8F5] rounded-2xl border border-[#E8DFD3]">
              
              {/* QR Simulator Box */}
              <div className="w-36 h-36 bg-white p-3 rounded-2xl border border-[#E0D5C7] shadow-xs flex flex-col items-center justify-center shrink-0 text-center relative group">
                {isScanning ? (
                  <div className="space-y-2">
                    <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                    <span className="text-[10px] text-emerald-700 font-bold block">Menghubungkan...</span>
                  </div>
                ) : waGatewayConnected ? (
                  <div className="space-y-1.5 text-emerald-700">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <span className="text-[11px] font-bold block">WhatsApp Terhubung</span>
                    <span className="text-[9px] text-[#8C7A6B] block">Session Aktif</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <QrCode className="w-12 h-12 text-[#2D251E] mx-auto opacity-70" />
                    <span className="text-[10px] text-[#6E5D4F] block">Scan via WhatsApp</span>
                  </div>
                )}
              </div>

              {/* Status Details */}
              <div className="flex-1 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-[#2D251E]">Nomor WhatsApp Bot Toko</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    waGatewayConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-700'
                  }`}>
                    {waGatewayConnected ? 'Online (Active)' : 'Offline'}
                  </span>
                </div>

                <div className="space-y-1 text-[#6E5D4F]">
                  <p>Nomor Aktif: <strong className="font-mono text-[#2D251E]">{waGatewayPhone}</strong></p>
                  <p>Nama Gateway: <strong className="text-[#2D251E]">{waGatewayBotName}</strong></p>
                  <p>Fungsi: Mendeteksi pesan masuk dengan kata <strong>ORDER</strong> untuk mencatat pesanan & kata <strong>MENU</strong> untuk mengirim katalog ready.</p>
                </div>

                <div className="pt-2">
                  {waGatewayConnected ? (
                    <button
                      onClick={disconnectWAGateway}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold text-xs cursor-pointer transition-colors"
                    >
                      Putuskan Sambungan WhatsApp
                    </button>
                  ) : (
                    <button
                      onClick={handleConnect}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Sambungkan WhatsApp Toko</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Configuration Form */}
            <form onSubmit={handleConnect} className="space-y-3 bg-white p-4 rounded-2xl border border-[#E8DFD3]">
              <h5 className="font-bold text-xs text-[#2D251E]">Ubah Konfigurasi Nomor WhatsApp Toko</h5>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6E5D4F] mb-1">Nomor WhatsApp Toko</label>
                  <input
                    type="tel"
                    required
                    value={phoneNumberInput}
                    onChange={(e) => setPhoneNumberInput(e.target.value)}
                    placeholder="Contoh: 081298765432"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E0D5C7] outline-none font-mono focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6E5D4F] mb-1">Nama Perangkat / Bot</label>
                  <input
                    type="text"
                    required
                    value={botNameInput}
                    onChange={(e) => setBotNameInput(e.target.value)}
                    placeholder="Contoh: Rarumi Kitchen Bot"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E0D5C7] outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isScanning}
                className="w-full py-2.5 rounded-xl bg-[#2D251E] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                <span>Simpan & Sambungkan Ulang WhatsApp</span>
              </button>
            </form>

          </div>
        )}

        {/* Modal Bottom Footer with Clear Exit Button */}
        <div className="p-3.5 bg-[#FAF8F5] border-t border-[#E8DFD3] flex items-center justify-between text-xs">
          <div className="text-[#8C7A6B] flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pesan WhatsApp dengan kata <strong>ORDER</strong> otomatis membuat pesanan di kasir</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#2D251E] hover:bg-black text-white font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
          >
            <X className="w-4 h-4" />
            <span>Tutup & Keluar</span>
          </button>
        </div>

      </div>
    </div>
  );
};
