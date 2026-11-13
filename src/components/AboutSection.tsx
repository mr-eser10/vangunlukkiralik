import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const AboutSection: React.FC = () => {
  return (
    <section id="hakkimizda" className="py-16 lg:py-24 bg-[#F7F5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Visual Side */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.55, ease: easeCurve }}
            className="relative"
          >
            <div className="aspect-4/3 rounded-3xl overflow-hidden border border-[#DCCDB9]/70 shadow-lg bg-[#EAE5DC]">
              <img
                src="/src/assets/images/van_living_room_suite_1793882174207.jpg"
                alt="Van Günlük Kiralık Daire - Yaşam Alanı"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Subtle Brand Tag */}
            <div className="absolute -bottom-6 -right-6 hidden sm:block p-6 rounded-2xl bg-[#18222F] text-white shadow-xl max-w-xs border border-white/10">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#63B9C5] block mb-1">
                Hizmet İlkelerimiz
              </span>
              <p className="text-xs text-[#F7F5F0]/80 leading-relaxed">
                Her dairemizde otel kalitesinde hijyen, ev sıcaklığında konfor standartları sağlanır.
              </p>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.55, delay: 0.1, ease: easeCurve }}
            className="lg:pl-6"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-[#63B9C5] mb-2">
              Hakkımızda
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#18222F] font-bold tracking-tight leading-tight mb-6 [text-wrap:balance]">
              Van'da Konforlu Bir Konaklama Deneyimi
            </h2>

            <p className="text-sm sm:text-base text-[#18222F]/80 leading-relaxed mb-6">
              <strong>Van Günlük Kiralık Daire</strong>, Van İpekyolu mevkiinde bulunan tesisimizde 2 adet 1+0, 2 adet 2+1 ve 2 adet 3+1 olmak üzere toplam 6 adet apart daire ile misafirlerimize temiz, güvenilir ve huzurlu bir konaklama hizmeti sunmaktadır.
            </p>

            <p className="text-sm sm:text-base text-[#18222F]/80 leading-relaxed mb-8">
              Standart konaklama alanlarının kısıtlı yapısından uzak; oturma alanı, tam teşekküllü mutfağı ve özel dinlenme odalarıyla ev rahatlığında bağımsız apart konsepti sağlıyoruz. Van İpekyolu'ndaki dairelerimize adım attığınız ilk andan ayrılış sürecine kadar şeffaf, samimi ve kesintisiz iletişimle yanınızdayız.
            </p>

            {/* Core Values List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#63B9C5]/10 text-[#63B9C5] shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#18222F]">Temizlik ve Hijyen</h4>
                  <p className="text-[11px] text-[#18222F]/70">Profesyonel dezenfekte ve taze tekstil ürünleri.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#63B9C5]/10 text-[#63B9C5] shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#18222F]">Konforlu Yaşam</h4>
                  <p className="text-[11px] text-[#18222F]/70">Ergonomik mobilyalar ve eksiksiz ev donanımı.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#63B9C5]/10 text-[#63B9C5] shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#18222F]">Güvenilir İletişim</h4>
                  <p className="text-[11px] text-[#18222F]/70">Tereddütsüz WhatsApp ve telefon desteği.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#63B9C5]/10 text-[#63B9C5] shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#18222F]">Misafir Odaklı Hizmet</h4>
                  <p className="text-[11px] text-[#18222F]/70">Huzurunuz ve memnuniyetiniz önceliğimizdir.</p>
                </div>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
