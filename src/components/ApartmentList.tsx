import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Apartment, RoomType, SiteSettings } from '../types';
import { MessageCircle, Users, Maximize, Eye, MapPin } from 'lucide-react';
import { generateWhatsAppLink, getApartmentWhatsAppText } from '../services/api';

interface ApartmentListProps {
  apartments: Apartment[];
  settings: SiteSettings;
  onSelectApartment: (apt: Apartment) => void;
  onRequestBooking: (apt: Apartment) => void;
}

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const ApartmentList: React.FC<ApartmentListProps> = ({
  apartments,
  settings,
  onSelectApartment,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | RoomType>('All');

  const filterTabs: Array<{ id: 'All' | RoomType; label: string }> = [
    { id: 'All', label: 'Tüm Daireler' },
    { id: '1+0', label: '1+0 Daireler' },
    { id: '2+1', label: '2+1 Daireler' },
    { id: '3+1', label: '3+1 Daireler' },
  ];

  const filteredApartments = selectedFilter === 'All'
    ? apartments
    : apartments.filter((apt) => apt.type === selectedFilter);

  return (
    <section id="daireler" className="py-12 lg:py-20 bg-[#F7F5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header with on-scroll reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55, ease: easeCurve }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6"
        >
          <div className="max-w-xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#63B9C5] mb-2">
              Van İpekyolu Apart & Daireler
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#18222F] font-bold tracking-tight leading-tight">
              Dairelerimiz ve Konaklama Seçenekleri
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#18222F]/70 leading-relaxed">
              Van İpekyolu mevkiindeki tesisimizde yer alan 1+0, 2+1 ve 3+1 seçeneklerinden oluşan toplam 6 adet temiz ve bağımsız dairemizi inceleyin.
            </p>
          </div>

          {/* Interactive Filter Controls */}
          <div className="flex items-center gap-1.5 p-1.5 bg-[#EAE5DC] rounded-xl self-start md:self-auto overflow-x-auto max-w-full">
            {filterTabs.map((tab) => {
              const isActive = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ease-in-out whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-[#18222F] shadow-sm scale-[1.02]'
                      : 'text-[#18222F]/70 hover:text-[#18222F] hover:scale-105'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Apartments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredApartments.map((apt, idx) => {
            const whatsappText = getApartmentWhatsAppText(
              settings.brandName,
              apt.title,
              apt.code
            );
            const whatsappUrl = generateWhatsAppLink(settings.whatsappNumber, whatsappText);

            return (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{ duration: 0.5, delay: (idx % 2) * 0.08, ease: easeCurve }}
                className="group bg-white rounded-3xl overflow-hidden border border-[#DCCDB9]/70 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col"
              >
                {/* Image Showcase Container */}
                <div className="relative aspect-16/10 overflow-hidden bg-[#EAE5DC]">
                  <img
                    src={apt.coverImage}
                    alt={apt.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 text-xs font-semibold rounded-md bg-[#18222F]/80 backdrop-blur-md text-white shadow-xs">
                      {apt.code}
                    </span>
                    {apt.isAvailable ? (
                      <span className="px-3 py-1 text-xs font-medium rounded-md bg-[#63B9C5]/90 backdrop-blur-md text-white shadow-xs">
                        Müsait
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-medium rounded-md bg-rose-600/90 backdrop-blur-md text-white shadow-xs">
                        Tarih Sorunuz
                      </span>
                    )}
                  </div>

                  {/* Thumbnail gallery preview indicator */}
                  {apt.gallery && apt.gallery.length > 1 && (
                    <div className="absolute bottom-4 right-4 px-2.5 py-1 text-[11px] font-medium rounded-md bg-black/60 backdrop-blur-md text-white">
                      +{apt.gallery.length} Fotoğraf
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Location & Capacity Row */}
                    <div className="flex items-center gap-2 text-xs font-medium text-[#18222F]/60 mb-2.5">
                      <span className="flex items-center gap-1 text-[#63B9C5]">
                        <MapPin className="w-3.5 h-3.5" />
                        {apt.location}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        Maks. {apt.capacity} Kişi
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Maximize className="w-3.5 h-3.5" />
                        {apt.areaM2} m²
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#18222F] font-semibold mb-2.5 group-hover:text-[#63B9C5] transition-colors duration-300">
                      {apt.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs sm:text-sm text-[#18222F]/75 line-clamp-2 leading-relaxed mb-4">
                      {apt.shortDescription}
                    </p>

                    {/* Amenities Preview */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {apt.amenities.slice(0, 4).map((amenity, aIdx) => (
                        <span
                          key={aIdx}
                          className="text-[11px] font-medium text-[#18222F]/80 bg-[#F7F5F0] border border-[#DCCDB9]/50 rounded-md px-2.5 py-1"
                        >
                          {amenity}
                        </span>
                      ))}
                      {apt.amenities.length > 4 && (
                        <span className="text-[11px] font-medium text-[#63B9C5] px-1 py-1">
                          +{apt.amenities.length - 4} diğer
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price and CTA Row */}
                  <div className="pt-4 border-t border-[#DCCDB9]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      {(() => {
                        const displayPrice = settings.hideExactPrices !== false
                          ? (settings.startingPriceAmount || 1500)
                          : apt.pricePerNight;

                        return displayPrice ? (
                          <div>
                            <div className="flex items-baseline gap-1.5 flex-wrap">
                              <span className="text-base sm:text-lg font-bold text-[#18222F] font-serif-luxury tabular-nums">
                                {displayPrice.toLocaleString('tr-TR')} TL'den
                              </span>
                              <span className="text-xs font-medium text-[#18222F]/75">
                                başlayan fiyatlar
                              </span>
                            </div>
                            <span className="text-[11px] text-[#18222F]/60 block mt-0.5">
                              Kesin fiyat & müsaitlik WhatsApp'tan teyit edilir
                            </span>
                          </div>
                        ) : (
                          <div className="text-xs text-[#18222F]/70 font-medium">
                            Fiyat & müsaitlik için WhatsApp'tan sorunuz
                          </div>
                        );
                      })()}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onSelectApartment(apt)}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-[#18222F] bg-[#F7F5F0] hover:bg-[#DCCDB9]/40 border border-[#DCCDB9] rounded-xl hover:scale-105 hover:shadow-md active:scale-95 transition-all duration-300 ease-in-out whitespace-nowrap"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#63B9C5]" />
                        <span>Detaylar</span>
                      </button>

                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl shadow-sm hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out whitespace-nowrap"
                        title="WhatsApp üzerinden bilgi al ve rezervasyonu tamamla"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>WhatsApp'tan Rezerve Et</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredApartments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#DCCDB9]/60">
            <p className="text-sm text-[#18222F]/70">
              Bu kategoride şu anda listelenmiş daire bulunmamaktadır.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
