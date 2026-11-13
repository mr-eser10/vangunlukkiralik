import React, { useState } from 'react';
import { SiteSettings } from '../types';
import { Menu, X, MessageCircle } from 'lucide-react';
import { generateWhatsAppLink, getGeneralWhatsAppText } from '../services/api';

interface HeaderProps {
  settings: SiteSettings;
  onOpenAdmin?: () => void;
  onOpenBooking: () => void;
}

export const Header: React.FC<HeaderProps> = ({ settings, onOpenAdmin, onOpenBooking }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoTapCount, setLogoTapCount] = useState(0);

  const handleLogoClick = () => {
    if (!onOpenAdmin) return;
    const next = logoTapCount + 1;
    setLogoTapCount(next);
    if (next >= 5) {
      setLogoTapCount(0);
      onOpenAdmin();
    } else {
      setTimeout(() => setLogoTapCount(0), 1800);
    }
  };

  const whatsappUrl = generateWhatsAppLink(
    settings.whatsappNumber,
    getGeneralWhatsAppText(settings.brandName)
  );

  return (
    <header className="sticky top-0 z-40 bg-[#F7F5F0]/95 backdrop-blur-md border-b border-[#DCCDB9]/60 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand Wordmark / 3D Logo */}
          <a
            href="#"
            onClick={handleLogoClick}
            className="flex items-center group shrink-0 py-1"
            aria-label="Van Günlük Kiralık Daire Ana Sayfa"
          >
            <img
              src="/assets/aistudio/Van_G_nl_k_Kiral_k_Daire_3D_Logosu_f1b36505.png"
              alt="Van Günlük Kiralık Daire Logosu"
              className="h-12 sm:h-14 w-auto object-contain mix-blend-multiply group-hover:scale-[1.02] transition-transform duration-200"
            />
          </a>

          {/* Zone 2: Navigation Links (single-line, concise) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#18222F]/80">
            <a href="#daireler" className="hover:text-[#63B9C5] transition-colors whitespace-nowrap shrink-0">
              Dairelerimiz
            </a>
            <a href="#neden-biz" className="hover:text-[#63B9C5] transition-colors whitespace-nowrap shrink-0">
              Neden Biz?
            </a>
            <a href="#hakkimizda" className="hover:text-[#63B9C5] transition-colors whitespace-nowrap shrink-0">
              Hakkımızda
            </a>
            <a href="#sss" className="hover:text-[#63B9C5] transition-colors whitespace-nowrap shrink-0">
              Sıkça Sorulanlar
            </a>
            <a href="#iletisim" className="hover:text-[#63B9C5] transition-colors whitespace-nowrap shrink-0">
              İletişim
            </a>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#18222F] bg-white border border-[#DCCDB9] rounded-lg hover:border-[#63B9C5] hover:text-[#63B9C5] hover:scale-105 hover:shadow-md active:scale-95 transition-all duration-300 ease-in-out whitespace-nowrap"
              title="WhatsApp İle Hızlı İletişim"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#63B9C5]" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={onOpenBooking}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#18222F] hover:bg-[#63B9C5] hover:scale-105 hover:shadow-md active:scale-95 rounded-lg transition-all duration-300 ease-in-out whitespace-nowrap shadow-sm"
            >
              Rezervasyon Talebi
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#18222F] rounded-lg hover:bg-[#DCCDB9]/20"
              aria-label="Menüyü Aç/Kapat"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#F7F5F0] border-b border-[#DCCDB9] px-5 py-4 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-[#18222F]">
            <a
              href="#daireler"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-white"
            >
              Dairelerimiz
            </a>
            <a
              href="#neden-biz"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-white"
            >
              Neden Biz?
            </a>
            <a
              href="#hakkimizda"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-white"
            >
              Hakkımızda
            </a>
            <a
              href="#sss"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-white"
            >
              Sıkça Sorulanlar
            </a>
            <a
              href="#iletisim"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-white"
            >
              İletişim
            </a>
          </nav>
          <div className="pt-2 border-t border-[#DCCDB9]/40 flex flex-col gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-[#18222F] bg-white border border-[#DCCDB9] rounded-lg"
            >
              <MessageCircle className="w-4 h-4 text-[#63B9C5]" />
              WhatsApp ile Bilgi Al
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 text-xs font-semibold text-white bg-[#18222F] rounded-lg"
            >
              Rezervasyon Talebi Oluştur
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
