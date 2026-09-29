import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  Key, 
  ShieldCheck, 
  Server, 
  Save, 
  Check, 
  Bot, 
  MessageSquare, 
  Store, 
  Info, 
  CheckCircle2, 
  ExternalLink,
  Lock,
  LogOut,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { RARUMI_WHATSAPP_NUMBER, RARUMI_WHATSAPP_DISPLAY } from '../data/masterMenu';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { cashierName, setCashierName, isCloudSynced } = usePOS();

  const [activeTab, setActiveTab] = useState<'api_integrations' | 'store_profile' | 'wa_gateway'>('api_integrations');

  // Custom Gemini AI API Key
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return localStorage.getItem('rarumi_custom_gemini_api_key') || '';
  });
  const [showGeminiKey, setShowGeminiKey] = useState<boolean>(false);

  // WhatsApp Gateway API Token / Webhook settings
  const [waToken, setWaToken] = useState<string>(() => {
    return localStorage.getItem('rarumi_wa_api_token') || 'rk_live_wa_sec_99824';
  });
  const [showWaToken, setShowWaToken] = useState<boolean>(false);
  const [waWebhookUrl, setWaWebhookUrl] = useState<string>(() => {
    return localStorage.getItem('rarumi_wa_webhook_url') || 'https://api.rarumikitchen.com/webhook/wa';
  });

  // Database / Cloud Secret Key
  const [dbSecretKey, setDbSecretKey] = useState<string>(() => {
    return localStorage.getItem('rarumi_db_secret_key') || '';
  });
  const [showDbSecretKey, setShowDbSecretKey] = useState<boolean>(false);

  // Store Profile settings
  const [storeTitle, setStoreTitle] = useState<string>(() => {
    return localStorage.getItem('rarumi_store_title') || 'Rarumi Healthy Kitchen';
  });
  const [storeAddress, setStoreAddress] = useState<string>(() => {
    return localStorage.getItem('rarumi_store_address') || 'Jl. Kesehatan Raya No. 45, Jakarta Selatan';
  });
  const [storePhone, setStorePhone] = useState<string>(() => {
    return localStorage.getItem('rarumi_store_phone') || RARUMI_WHATSAPP_DISPLAY;
  });

  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (geminiApiKey.trim()) {
      localStorage.setItem('rarumi_custom_gemini_api_key', geminiApiKey.trim());
    } else {
      localStorage.removeItem('rarumi_custom_gemini_api_key');
    }
    localStorage.setItem('rarumi_wa_api_token', waToken.trim());
    localStorage.setItem('rarumi_wa_webhook_url', waWebhookUrl.trim());
    if (dbSecretKey.trim()) {
      localStorage.setItem('rarumi_db_secret_key', dbSecretKey.trim());
    } else {
      localStorage.removeItem('rarumi_db_secret_key');
    }
    localStorage.setItem('rarumi_store_title', storeTitle.trim());
    localStorage.setItem('rarumi_store_address', storeAddress.trim());
    localStorage.setItem('rarumi_store_phone', storePhone.trim());
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E8DFD3] overflow-hidden my-4">
        
        {/* Header with Exit Button */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-b border-[#E8DFD3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#2D251E] text-white flex items-center justify-center shadow-xs">
              <Settings className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2D251E]">
                Pengaturan Sistem & Input API Key
              </h3>
              <p className="text-xs text-[#8C7A6B]">
                Tempat menyimpan API Key AI Gemini, WhatsApp Gateway Token, dan Profil Toko
              </p>
            </div>
          </div>

          {/* EXIT BUTTON */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-[#E0D5C7] flex items-center justify-center text-[#6E5D4F] hover:text-[#2D251E] hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
            title="Tutup / Keluar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex border-b border-[#E8DFD3] bg-[#F4EFEA] px-4 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('api_integrations')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl font-bold transition-all cursor-pointer ${
              activeTab === 'api_integrations'
                ? 'bg-white text-[#2D251E] border-t border-x border-[#E8DFD3] shadow-xs'
                : 'text-[#6E5D4F] hover:text-[#2D251E]'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-600" />
            <span>Kunci API & Keamanan Server</span>
          </button>

          <button
            onClick={() => setActiveTab('wa_gateway')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl font-bold transition-all cursor-pointer ${
              activeTab === 'wa_gateway'
                ? 'bg-white text-[#2D251E] border-t border-x border-[#E8DFD3] shadow-xs'
                : 'text-[#6E5D4F] hover:text-[#2D251E]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>Gateway WhatsApp Token</span>
          </button>

          <button
            onClick={() => setActiveTab('store_profile')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl font-bold transition-all cursor-pointer ${
              activeTab === 'store_profile'
                ? 'bg-white text-[#2D251E] border-t border-x border-[#E8DFD3] shadow-xs'
                : 'text-[#6E5D4F] hover:text-[#2D251E]'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-[#3E6B48]" />
            <span>Profil Toko & Kasir</span>
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSaveSettings} className="p-5 sm:p-6 space-y-4 max-h-[500px] overflow-y-auto">
          
          {/* TAB 1: API Keys & Server Security */}
          {activeTab === 'api_integrations' && (
            <div className="space-y-4">
              
              {/* Form Input for Gemini API Key */}
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8DFD3] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs text-[#2D251E] flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-amber-600" />
                    <span>Google Gemini AI API Key (Custom Key)</span>
                  </label>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    geminiApiKey.trim() ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {geminiApiKey.trim() ? '✓ Kunci Kustom Tersedia' : 'Menggunakan Server Key'}
                  </span>
                </div>

                <div className="relative">
                  <input
                    type={showGeminiKey ? 'text' : 'password'}
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="AIzaSy... (Masukkan Google Gemini API Key Anda)"
                    className="w-full pl-3 pr-10 py-2.5 text-xs rounded-xl border border-[#E0D5C7] font-mono outline-none focus:border-[#3E6B48] bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGeminiKey(!showGeminiKey)}
                    className="absolute right-3 top-2.5 text-[#8C7A6B] hover:text-[#2D251E] cursor-pointer"
                    title={showGeminiKey ? 'Sembunyikan' : 'Tampilkan'}
                  >
                    {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-[11px] text-[#6E5D4F] leading-relaxed">
                  Masukkan API Key dari <strong>Google AI Studio</strong> jika ingin menggunakan kuota API sendiri untuk asisten AI nutrisi, chatbot pesanan, dan konsultasi gizi alergi. Jika dikosongkan, sistem secara otomatis menggunakan proxy server bawaan.
                </p>
              </div>

              {/* Form Input for Cloud / Webhook Secret Key */}
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8DFD3] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs text-[#2D251E] flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-[#3E6B48]" />
                    <span>Database & Webhook Secret Token</span>
                  </label>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {isCloudSynced ? 'Cloud Firestore Terhubung' : 'Lokal Aktif'}
                  </span>
                </div>

                <div className="relative">
                  <input
                    type={showDbSecretKey ? 'text' : 'password'}
                    value={dbSecretKey}
                    onChange={(e) => setDbSecretKey(e.target.value)}
                    placeholder="sec_rarumi_live_token_xxxx"
                    className="w-full pl-3 pr-10 py-2.5 text-xs rounded-xl border border-[#E0D5C7] font-mono outline-none focus:border-[#3E6B48] bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDbSecretKey(!showDbSecretKey)}
                    className="absolute right-3 top-2.5 text-[#8C7A6B] hover:text-[#2D251E] cursor-pointer"
                    title={showDbSecretKey ? 'Sembunyikan' : 'Tampilkan'}
                  >
                    {showDbSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-[11px] text-[#6E5D4F] leading-relaxed">
                  Token rahasia enkripsi sinkronisasi data master produk, transaksi POS, dan database cloud.
                </p>
              </div>

              {/* Status Server Info */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1.5 text-emerald-950">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Proteksi Keamanan Kunci</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Kunci API Anda disimpan secara terenkripsi di penyimpanan lokal browser kasir dan diteruskan melalui header server yang aman.
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: WhatsApp Gateway Token */}
          {activeTab === 'wa_gateway' && (
            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-950">
                <p className="font-bold text-amber-900 mb-0.5">Kredensial Gateway WhatsApp</p>
                Gunakan token ini untuk menghubungkan bot WhatsApp pihak ketiga (Fonnte / Wablas / WATI / Baileys) ke sistem Kasir Pintar Rarumi Kitchen.
              </div>

              <div>
                <label className="block font-bold text-[#4A3E33] mb-1">
                  API Token / Secret Key WhatsApp Gateway
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-2.5" />
                  <input
                    type={showWaToken ? 'text' : 'password'}
                    value={waToken}
                    onChange={(e) => setWaToken(e.target.value)}
                    placeholder="Masukkan API Token WhatsApp..."
                    className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-[#E0D5C7] font-mono outline-none focus:border-[#3E6B48] bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowWaToken(!showWaToken)}
                    className="absolute right-3 top-2.5 text-[#8C7A6B] hover:text-[#2D251E] cursor-pointer"
                    title={showWaToken ? 'Sembunyikan' : 'Tampilkan'}
                  >
                    {showWaToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-[#8C7A6B] mt-1">
                  Token rahasia untuk autentikasi pengiriman pesan otomatis dan broadcast.
                </p>
              </div>

              <div>
                <label className="block font-bold text-[#4A3E33] mb-1">
                  Webhook URL Penerima Pesan Masuk
                </label>
                <input
                  type="url"
                  value={waWebhookUrl}
                  onChange={(e) => setWaWebhookUrl(e.target.value)}
                  placeholder="https://api.domain.com/webhook/wa"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E0D5C7] font-mono outline-none focus:border-[#3E6B48]"
                />
                <p className="text-[10px] text-[#8C7A6B] mt-1">
                  Alamat callback server untuk menangkap pesan masuk yang mengandung kata "ORDER" atau "MENU".
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Store & Cashier Profile */}
          {activeTab === 'store_profile' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#4A3E33] mb-1">
                  Nama Toko / Usaha
                </label>
                <input
                  type="text"
                  value={storeTitle}
                  onChange={(e) => setStoreTitle(e.target.value)}
                  placeholder="Rarumi Healthy Kitchen"
                  className="w-full px-3 py-2 rounded-xl border border-[#E0D5C7] outline-none focus:border-[#3E6B48]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A3E33] mb-1">
                  Nama Kasir Aktif
                </label>
                <input
                  type="text"
                  value={cashierName}
                  onChange={(e) => setCashierName(e.target.value)}
                  placeholder="Nama Kasir"
                  className="w-full px-3 py-2 rounded-xl border border-[#E0D5C7] outline-none focus:border-[#3E6B48]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A3E33] mb-1">
                  Nomor WhatsApp Hotline Toko
                </label>
                <input
                  type="text"
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full px-3 py-2 rounded-xl border border-[#E0D5C7] font-mono outline-none focus:border-[#3E6B48]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A3E33] mb-1">
                  Alamat Lengkap Toko
                </label>
                <input
                  type="text"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  placeholder="Jl. Kesehatan Raya No. 45, Jakarta Selatan"
                  className="w-full px-3 py-2 rounded-xl border border-[#E0D5C7] outline-none focus:border-[#3E6B48]"
                />
              </div>
            </div>
          )}

          {/* Form Action Row with Exit Button */}
          <div className="pt-3 border-t border-[#E8DFD3] flex items-center justify-between">
            <div className="text-xs">
              {isSaved && (
                <span className="text-emerald-700 font-bold flex items-center gap-1 animate-pulse">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Pengaturan & Kunci API berhasil disimpan!</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Explicit Exit / Cancel button */}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#E0D5C7] text-xs font-semibold text-[#6E5D4F] hover:bg-[#FAF8F5] hover:text-[#2D251E] cursor-pointer transition-colors"
              >
                Tutup & Keluar
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#3E6B48] hover:bg-[#34593C] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
