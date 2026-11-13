import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Apartment, SiteSettings } from '../types';
import {
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { generateWhatsAppLink, getApartmentWhatsAppText } from '../services/api';

interface ApartmentModalProps {
  apartment: Apartment | null;
  settings: SiteSettings;
  onClose: () => void;
  onOpenBooking: (apartment: Apartment) => void;
}

export const ApartmentModal: React.FC<ApartmentModalProps> = ({
  apartment,
  settings,
  onClose,
  onOpenBooking,
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    setActiveImageIdx(0);
  }, [apartment?.id]);

  useEffect(() => {
    if (!apartment) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [apartment, onClose]);

  const images = apartment
    ? (apartment.gallery && apartment.gallery.length > 0 ? apartment.gallery : [apartment.coverImage])
    : [];

  const handlePrevImage = () => {
    setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const whatsappUrl = apartment
    ? generateWhatsAppLink(
        settings.whatsappNumber,
        getApartmentWhatsAppText(settings.brandName, apartment.title, apartment.code)
      )
    : '#';

  return (
    <AnimatePresence>
      {apartment && (
        <motion.div
          key="apartment-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={apartment.title}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
        >
          <motion.div
            key={apartment.id}
            initial={{ opacity: 0, scale: 0.92, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 14 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[84vh] bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#DCCDB9]/80 flex flex-col"
          >
            {/* Prominent Fixed Top-Right Close (X) Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white text-[#18222F] hover:bg-[#63B9C5] hover:text-white border border-[#DCCDB9] shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out cursor-pointer"
              aria-label="Kapat"
              title="Kapat"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Gallery Section (Compact Height) */}
            <div className="relative h-48 sm:h-60 bg-[#18222F] overflow-hidden select-none shrink-0">
              <img
                src={images[activeImageIdx]}
                alt={`${apartment.title} - Fotoğraf ${activeImageIdx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-opacity duration-300"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/85 hover:bg-white text-[#18222F] backdrop-blur-md hover:scale-105 transition-all duration-300 ease-in-out shadow-md"
                    aria-label="Önceki Fotoğraf"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/85 hover:bg-white text-[#18222F] backdrop-blur-md hover:scale-105 transition-all duration-300 ease-in-out shadow-md"
                    aria-label="Sonraki Fotoğraf"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Image index counter */}
              <div className="absolute bottom-3 left-3 px-2.5 py-1 text-[11px] font-semibold rounded-md bg-black/65 backdrop-blur-md text-white">
                {activeImageIdx + 1} / {images.length} Fotoğraf
              </div>

              {/* Apartment Code & Type */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-[#18222F]/85 backdrop-blur-md text-white">
                  {apartment.code}
                </span>
                <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#63B9C5]/95 backdrop-blur-md text-white">
                  {apartment.type}
                </span>
              </div>
            </div>

            {/* Thumbnail Selector */}
            {images.length > 1 && (
              <div className="flex gap-2 px-4 py-2.5 bg-[#F7F5F0] border-b border-[#DCCDB9]/50 overflow-x-auto shrink-0">
                {images.map((img, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-14 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all duration-300 ease-in-out ${
                      activeImageIdx === idx ? 'border-[#63B9C5] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="küçük görsel" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Scrollable Body Content */}
            <div className="p-5 sm:p-6 flex-1 overflow-y-auto">
              
              {/* Header & Specs */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#DCCDB9]/50">
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-[#18222F]/70 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#63B9C5]" />
                    <span>{apartment.location}</span>
                    {apartment.floor && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{apartment.floor}</span>
                      </>
                    )}
                  </div>
                  <h2 className="font-serif-luxury text-xl sm:text-2xl text-[#18222F] font-bold leading-tight">
                    {apartment.title}
                  </h2>
                </div>

                {/* Price Box */}
                {(() => {
                  const displayPrice = settings.hideExactPrices !== false
                    ? (settings.startingPriceAmount || 1500)
                    : apartment.pricePerNight;

                  return displayPrice ? (
                    <div className="bg-[#F7F5F0] px-4 py-3 rounded-2xl border border-[#DCCDB9]/60 sm:text-right shrink-0">
                      <div className="text-[11px] text-[#18222F]/65">Konaklama Ücreti</div>
                      <div className="text-base sm:text-lg font-bold font-serif-luxury text-[#18222F] tabular-nums">
                        {displayPrice.toLocaleString('tr-TR')} TL'den başlayan fiyatlar
                      </div>
                      <div className="text-[11px] text-[#18222F]/60 mt-0.5">
                        Net fiyat tarihe göre WhatsApp'tan belirlenir
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Quick Specifications Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-4 border-b border-[#DCCDB9]/50 text-center">
                <div className="p-2.5 rounded-xl bg-[#F7F5F0]">
                  <span className="text-[11px] text-[#18222F]/60 block mb-0.5">Kapasite</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#18222F]">Maks. {apartment.capacity} Kişi</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F7F5F0]">
                  <span className="text-[11px] text-[#18222F]/60 block mb-0.5">Daire Alanı</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#18222F]">{apartment.areaM2} m²</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F7F5F0]">
                  <span className="text-[11px] text-[#18222F]/60 block mb-0.5">Yatak Düzeni</span>
                  <span className="text-xs font-semibold text-[#18222F] line-clamp-1">{apartment.beds}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F7F5F0]">
                  <span className="text-[11px] text-[#18222F]/60 block mb-0.5">Daire Tipi</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#63B9C5]">{apartment.type}</span>
                </div>
              </div>

              {/* Descriptions */}
              <div className="py-4 border-b border-[#DCCDB9]/50">
                <h4 className="text-xs font-semibold text-[#18222F] uppercase tracking-wider mb-2">
                  Daire Hakkında
                </h4>
                <p className="text-xs sm:text-sm text-[#18222F]/80 leading-relaxed whitespace-pre-line">
                  {apartment.fullDescription || apartment.shortDescription}
                </p>
              </div>

              {/* Amenities Grid */}
              <div className="py-4 border-b border-[#DCCDB9]/50">
                <h4 className="text-xs font-semibold text-[#18222F] uppercase tracking-wider mb-3">
                  Sunulan Olanaklar & Konfor Standartları
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {apartment.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-[#18222F]/85">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#63B9C5] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rules and Check-in info */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#F7F5F0] border border-[#DCCDB9]/50">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#18222F] mb-1">
                    <Clock className="w-3.5 h-3.5 text-[#63B9C5]" />
                    <span>Giriş & Çıkış Saatleri</span>
                  </div>
                  <p className="text-xs text-[#18222F]/75">
                    Giriş: <strong>{apartment.rules?.checkIn || settings.checkInHour}</strong> · Çıkış: <strong>{apartment.rules?.checkOut || settings.checkOutHour}</strong>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F7F5F0] border border-[#DCCDB9]/50">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#18222F] mb-1">
                    <AlertCircle className="w-3.5 h-3.5 text-[#63B9C5]" />
                    <span>Konaklama Kuralları</span>
                  </div>
                  <p className="text-xs text-[#18222F]/75">
                    İç mekanda sigara içilmez. Evcil hayvan kabul edilmemektedir.
                  </p>
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="p-4 sm:p-5 bg-[#F7F5F0] border-t border-[#DCCDB9]/60 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="text-[11px] text-[#18222F]/70 text-center sm:text-left">
                Müsaitlik ve kesin fiyat için WhatsApp üzerinden hemen ulaşın.
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenBooking(apartment);
                  }}
                  className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold text-[#18222F] bg-white hover:bg-[#DCCDB9]/30 border border-[#DCCDB9] rounded-xl hover:scale-105 hover:shadow-md active:scale-95 transition-all duration-300 ease-in-out whitespace-nowrap"
                >
                  Ön Talep Formu
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  WhatsApp ile Rezervasyon
                </a>
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
