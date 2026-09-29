import React from 'react';
import { ShoppingCart, Check, X, Bell, MessageSquare, ArrowRight } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { formatRupiah } from '../data/masterMenu';

interface IncomingOrderBannerProps {
  onOpenGatewayModal: () => void;
  onOpenCart?: () => void;
}

export const IncomingOrderBanner: React.FC<IncomingOrderBannerProps> = ({
  onOpenGatewayModal,
  onOpenCart,
}) => {
  const { latestOrderAlert, clearLatestOrderAlert, acceptDraftOrder } = usePOS();

  if (!latestOrderAlert) return null;

  return (
    <div className="fixed top-18 left-4 right-4 sm:left-auto sm:right-6 sm:w-[480px] z-50 animate-bounce-once">
      <div className="bg-[#2D251E] text-white p-4 rounded-3xl shadow-2xl border-2 border-amber-400 flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-500 text-[#2D251E] flex items-center justify-center shrink-0 mt-0.5 shadow-md">
          <Bell className="w-5 h-5 animate-pulse" />
        </div>

        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-full">
              WA Order Masuk!
            </span>
            <button
              onClick={clearLatestOrderAlert}
              className="text-white/60 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="font-bold text-xs sm:text-sm text-white truncate">
            {latestOrderAlert.customerName} ({latestOrderAlert.customerPhone})
          </p>

          <p className="text-[11px] text-amber-200/90 italic line-clamp-1">
            "{latestOrderAlert.originalText}"
          </p>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
            <span className="font-mono font-bold text-amber-300">
              {formatRupiah(latestOrderAlert.subtotal)}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenGatewayModal}
                className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] transition-colors cursor-pointer"
              >
                Detail
              </button>
              <button
                onClick={() => {
                  acceptDraftOrder(latestOrderAlert.id);
                  if (onOpenCart) onOpenCart();
                }}
                className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Terima ke Kasir</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
