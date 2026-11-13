import React, { useState } from 'react';
import { SiteSettings } from '../types';
import { MessageCircle, X } from 'lucide-react';
import { generateWhatsAppLink, getGeneralWhatsAppText } from '../services/api';

interface WhatsAppFloatingButtonProps {
  settings: SiteSettings;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({ settings }) => {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = generateWhatsAppLink(
    settings.whatsappNumber,
    getGeneralWhatsAppText(settings.brandName)
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3 pointer-events-none">
      
      {/* Subtle Tooltip Balloon */}
      {showTooltip && (
        <div className="relative pointer-events-auto hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-[#18222F] border border-[#DCCDB9] shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
          <span className="text-xs font-semibold">
            Müsaitlik sorusu için WhatsApp'tan yazın!
          </span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-[#18222F]/40 hover:text-[#18222F] p-0.5 rounded-sm"
            aria-label="Kapat"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
        title="WhatsApp ile İletişime Geçin"
        aria-label="WhatsApp İletişim Butonu"
      >
        <MessageCircle className="w-7 h-7 fill-white" />
        
        {/* Subtle Online Badge */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
      </a>

    </div>
  );
};
