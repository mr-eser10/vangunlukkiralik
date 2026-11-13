import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Armchair, PhoneCall, MapPin, HeartHandshake, CalendarCheck2 } from 'lucide-react';

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const WhyUsSection: React.FC = () => {
  const reasons = [
    {
      icon: Sparkles,
      title: 'Temiz ve Bakımlı Daireler',
      description: 'Her giriş öncesinde detaylı hijyen protokolü uygulanır. Nevresimler, havlular ve tüm yüzeyler titizlikle hazırlanır.'
    },
    {
      icon: Armchair,
      title: 'Konforlu Yaşam Alanları',
      description: 'Yüksek kaliteli yataklar, ergonomik koltuk takımları, hızlı fiber Wi-Fi ve tam donanımlı mutfak ekipmanları mevcuttur.'
    },
    {
      icon: PhoneCall,
      title: 'Kolay ve Hızlı İletişim',
      description: 'Rezervasyon öncesinde ve konaklamanız boyunca WhatsApp veya telefonla anında ulaşabileceğiniz kesintisiz destek.'
    },
    {
      icon: MapPin,
      title: 'Merkezi Konum Avantajı',
      description: 'Van şehir merkezinde, ulaşım ağlarına, restoranlara, alışveriş noktalarına ve tarihi alanlara rahat erişim imkanı.'
    },
    {
      icon: HeartHandshake,
      title: 'Misafir Odaklı Yaklaşım',
      description: 'Kişisel alanınıza ve mahremiyetinize saygılı, huzurlu ve güvenli bir konaklama ortamı sunuyoruz.'
    },
    {
      icon: CalendarCheck2,
      title: 'Kolay Rezervasyon Talebi',
      description: 'Karmaşık ödeme şartları ve belirsizlikler olmadan, hızlıca talebinizi iletip doğrudan onay alabilirsiniz.'
    }
  ];

  return (
    <section id="neden-biz" className="py-16 lg:py-24 bg-white border-b border-[#DCCDB9]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55, ease: easeCurve }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-[#63B9C5] mb-2">
            Hizmet Kalitemiz
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#18222F] font-bold tracking-tight leading-tight">
            Neden Van Günlük Kiralık Daire?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#18222F]/75 leading-relaxed">
            Şehir dışından gelen misafirlerimizin Van ziyaretlerini unutulmaz kılan temel prensiplerimiz.
          </p>
        </motion.div>

        {/* 6 Feature Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.08, ease: easeCurve }}
                className="p-7 rounded-3xl bg-[#F7F5F0] border border-[#DCCDB9]/70 hover:border-[#63B9C5]/60 hover:bg-[#F2EFE8] shadow-xs hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#DCCDB9]/60 text-[#63B9C5] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#63B9C5] group-hover:text-white transition-all duration-300 ease-in-out shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-[#18222F] mb-2.5">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#18222F]/70 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
