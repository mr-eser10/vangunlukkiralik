import React from 'react';
import { motion } from 'motion/react';
import { SiteSettings } from '../types';
import { MessageCircle, Sparkles, ShieldCheck, MapPin, Clock } from 'lucide-react';
import { generateWhatsAppLink, getGeneralWhatsAppText } from '../services/api';

interface HeroProps {
  settings: SiteSettings;
  onExploreApartments: () => void;
  onOpenBooking: () => void;
}

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const Hero: React.FC<HeroProps> = ({ settings, onExploreApartments, onOpenBooking }) => {
  const whatsappUrl = generateWhatsAppLink(
    settings.whatsappNumber,
    getGeneralWhatsAppText(settings.brandName)
  );

  const features = [
    {
      icon: Sparkles,
      title: 'Kapsamlı Hijyen',
      description: 'Her misafir öncesi profesyonel temizlik ve dezenfeksiyon.'
    },
    {
      icon: ShieldCheck,
      title: 'Güvenli Konaklama',
      description: 'Bağımsız giriş, aile ve çiftler için huzurlu apart ortamı.'
    },
    {
      icon: MapPin,
      title: 'İpekyolu Konumu',
      description: 'Tüm dairelerimiz Van İpekyolu mevkiinde merkezi noktadadır.'
    },
    {
      icon: Clock,
      title: 'Hızlı İletişim',
      description: 'WhatsApp üzerinden anında yanıt ve şeffaf bilgilendirme.'
    }
  ];

  return (
    <section className="relative overflow-hidden pt-3 pb-12 lg:pb-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* Main Hero Card: Balanced proportions on mobile & desktop */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#DCCDB9]/70 shadow-xl shadow-[#18222F]/10 min-h-[470px] sm:min-h-[500px] lg:h-[62vh] lg:min-h-[480px] lg:max-h-[540px] flex items-end">
          {/* Background Photography with subtle entrance zoom settle */}
          <motion.img
            initial={{ scale: 1.07, opacity: 0.85 }}
            animate={{ scale: 1.01, opacity: 1 }}
            transition={{ duration: 1.0, ease: easeCurve }}
            src="/src/assets/images/van_luxury_apartment_hero_1793882173766.jpg"
            alt="Van Günlük Kiralık Daire - İpekyolu Apart Daire"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Bottom-to-top charcoal/black gradient overlay for contrast and depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-[#111827]/60 to-black/15" />

          {/* Content container with staggered fade-in-up */}
          <div className="relative z-10 w-full px-5 pt-20 pb-10 sm:p-9 lg:p-12 max-w-3xl flex flex-col gap-4 sm:gap-5">

            {/* 1. Glassmorphism Pill Badges */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: easeCurve }}
              className="flex flex-wrap items-center gap-2"
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-medium text-[#F7F5F0] tracking-wide">
                Konforlu Apart & Daireler
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-medium text-[#A9D9E1] tracking-wide">
                <MapPin className="w-3 h-3 shrink-0" />
                Van İpekyolu Mevkii
              </span>
            </motion.div>

            {/* 2. Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: easeCurve }}
              className="font-serif-luxury text-3xl sm:text-4xl lg:text-[44px] text-white font-bold tracking-tight leading-tight [text-wrap:balance]"
            >
              Van'da Konforlu ve Güvenilir Konaklama
            </motion.h1>

            {/* 3. Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32, ease: easeCurve }}
              className="text-sm sm:text-base text-[#F7F5F0]/90 font-normal leading-relaxed max-w-xl"
            >
              Van İpekyolu mevkiinde 1+0, 2+1 ve 3+1 apart daire seçeneklerimizle konfor ve huzuru bir arada keşfedin. {(settings.startingPriceAmount || 1500).toLocaleString('tr-TR')} TL'den başlayan fiyatlarla WhatsApp'tan hızlıca bilgi alın.
            </motion.p>

            {/* 4. Staggered Action Buttons with smooth hover scale & shadow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.44, ease: easeCurve }}
              className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white bg-[#25D366] hover:bg-[#1fb857] rounded-full shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                <span>WhatsApp ile İletişime Geç</span>
              </a>

              <button
                type="button"
                onClick={onExploreApartments}
                className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-[#18222F] bg-[#F7F5F0] hover:bg-[#63B9C5] hover:text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out whitespace-nowrap"
              >
                Daireleri Keşfet
              </button>

              <button
                type="button"
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-medium text-white bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out whitespace-nowrap"
              >
                Rezervasyon Talebi
              </button>
            </motion.div>
          </div>
        </div>

        {/* 4-Column Feature Cards with on-scroll stagger and hover lift/scale */}
        <div className="mt-7 sm:mt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: easeCurve }}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-[#DCCDB9]/50 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out flex items-start gap-4"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#63B9C5]/15 text-[#63B9C5] ring-1 ring-[#63B9C5]/25 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#18222F] leading-snug mb-1">{item.title}</h4>
                  <p className="text-xs text-[#18222F]/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
