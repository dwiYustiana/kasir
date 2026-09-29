import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  User, 
  MapPin, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { CustomerProfile } from '../types/pos';

interface WhatsAppAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppAuthModal: React.FC<WhatsAppAuthModalProps> = ({ isOpen, onClose }) => {
  const { customerUser, loginWithWhatsApp, logoutWhatsApp } = usePOS();

  const [step, setStep] = useState<'input' | 'otp' | 'profile'>('input');
  const [name, setName] = useState<string>(customerUser?.name || '');
  const [phone, setPhone] = useState<string>(customerUser?.phone || '');
  const [address, setAddress] = useState<string>(customerUser?.address || '');
  const [notes, setNotes] = useState<string>(customerUser?.notes || '');
  const [otpCode, setOtpCode] = useState<string>('');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Silakan isi Nama Lengkap Anda.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 9) {
      setErrorMessage('Nomor WhatsApp tidak valid (minimal 9 digit).');
      return;
    }

    setErrorMessage('');
    // Generate a friendly 4-digit OTP for instant verification simulation
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim() !== generatedOtp && otpCode.trim() !== '1234') {
      setErrorMessage(`Kode OTP tidak sesuai. Masukkan kode: ${generatedOtp}`);
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      let formattedPhone = phone.trim();
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '62' + formattedPhone.slice(1);
      }

      const profile: CustomerProfile = {
        name: name.trim(),
        phone: formattedPhone,
        address: address.trim(),
        notes: notes.trim(),
        loggedInAt: new Date().toISOString(),
      };

      loginWithWhatsApp(profile);
      setIsVerifying(false);
      onClose();
    }, 500);
  };

  const handleOpenWhatsAppTest = () => {
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
    const msg = encodeURIComponent(`*Kode Verifikasi Rarumi Kitchen:* ${generatedOtp}\n\nMasukkan kode ini di aplikasi untuk menyelesaikan login.`);
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E8DFD3] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-b border-[#E8DFD3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#2D251E]">
                {customerUser ? 'Profil Akun WhatsApp' : 'Masuk dengan WhatsApp'}
              </h3>
              <p className="text-[11px] text-[#8C7A6B]">
                {customerUser ? 'Terhubung & Tersinkronisasi' : 'Nikmati pemesanan cepat tanpa ribet'}
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

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {customerUser ? (
            /* Logged in state */
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Akun Aktif Terhubung</span>
                </div>
                <div className="text-xs text-emerald-950 space-y-1">
                  <p><strong>Nama:</strong> {customerUser.name}</p>
                  <p><strong>WhatsApp:</strong> {customerUser.phone}</p>
                  {customerUser.address && <p><strong>Alamat:</strong> {customerUser.address}</p>}
                  {customerUser.notes && <p><strong>Preferensi Alergi:</strong> {customerUser.notes}</p>}
                </div>
              </div>

              <div className="text-xs text-[#8C7A6B]">
                Data akun WhatsApp Anda otomatis mengisi nama, telepon, dan alamat saat melakukan checkout atau order lewat asisten AI.
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    logoutWhatsApp();
                    setStep('input');
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs transition-colors cursor-pointer border border-rose-200"
                >
                  Keluar Akun (Logout)
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#2D251E] text-white hover:bg-black font-bold text-xs transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          ) : step === 'input' ? (
            /* Step 1: Input Form */
            <form onSubmit={handleSendOtp} className="space-y-3.5">
              {errorMessage && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#4A3E33] mb-1">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Ibu Ratna / dr. Sarah"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E0D5C7] bg-[#FCFBF9] focus:bg-white focus:border-[#3E6B48] focus:ring-1 focus:ring-[#3E6B48] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3E33] mb-1">
                  Nomor WhatsApp <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E0D5C7] bg-[#FCFBF9] focus:bg-white focus:border-[#3E6B48] focus:ring-1 focus:ring-[#3E6B48] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3E33] mb-1">
                  Alamat Pengiriman (Opsional)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Contoh: Jl. Menteng Raya No. 12, Jakpus"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E0D5C7] bg-[#FCFBF9] focus:bg-white focus:border-[#3E6B48] focus:ring-1 focus:ring-[#3E6B48] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3E33] mb-1">
                  Preferensi Diet / Catatan Alergi (Opsional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Alergi telur (Egg-Free), Celiac (Gluten-Free)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E0D5C7] bg-[#FCFBF9] focus:bg-white focus:border-[#3E6B48] focus:ring-1 focus:ring-[#3E6B48] outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-[#E0D5C7] text-[#6E5D4F] hover:bg-[#FAF8F5] font-semibold text-xs transition-colors cursor-pointer"
                >
                  Batal / Keluar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Kode OTP</span>
                </button>
              </div>
            </form>
          ) : (
            /* Step 2: OTP Verification */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Kode Verifikasi Simulasi</span>
                </div>
                <p className="text-amber-900">
                  Gunakan kode OTP ini: <span className="font-mono font-bold text-base bg-white px-2 py-0.5 rounded border border-amber-300 ml-1 text-emerald-800">{generatedOtp}</span>
                </p>
                <p className="text-[11px] text-amber-700">
                  Dikirimkan untuk nomor: <strong>{phone}</strong>
                </p>
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#4A3E33] mb-1.5">
                  Masukkan 4 Digit Kode OTP
                </label>
                <input
                  type="text"
                  maxLength={4}
                  autoFocus
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Contoh: 1234"
                  className="w-full text-center tracking-widest text-xl font-bold font-mono py-2.5 rounded-xl border border-[#E0D5C7] bg-[#FCFBF9] focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="text-[#8C7A6B] hover:underline cursor-pointer"
                >
                  Ubah Nomor WhatsApp
                </button>
                <button
                  type="button"
                  onClick={handleOpenWhatsAppTest}
                  className="text-emerald-700 font-semibold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Kirim ke WhatsApp</span>
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-[#E0D5C7] text-[#6E5D4F] hover:bg-[#FAF8F5] font-semibold text-xs transition-colors cursor-pointer"
                >
                  Batal / Keluar
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  {isVerifying ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verifikasi</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
