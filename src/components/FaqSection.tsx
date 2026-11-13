import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { SiteSettings } from '../types';

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface FaqSectionProps {
  settings: SiteSettings;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ settings }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Nasıl rezervasyon yapabilirim?',
      answer: 'Web sitemizdeki Rezervasyon Talebi formunu doldurarak veya doğrudan WhatsApp butonuna tıklayarak seçtiğiniz daire için talebinizi iletebilirsiniz. Ekibimiz dairenin talep ettiğiniz tarihlerdeki müsaitliğini teyit edip size en kısa sürede dönüş sağlar.'
    },
    {
      question: 'Giriş ve çıkış saatleri nelerdir?',
      answer: `Standart giriş saatimiz ${settings.checkInHour} ve sonrası, çıkış saatimiz ise en geç ${settings.checkOutHour}'dir. Uçak veya otobüs saatinize bağlı olarak erken giriş veya geç çıkış taleplerinizi önceden bildirmeniz durumunda müsaitlik doğrultusunda yardımcı olmaktayız.`
    },
    {
      question: 'Ödeme nasıl gerçekleştiriliyor?',
      answer: 'Ödemeler daireye giriş sırasında nakit, banka havalesi / FAST veya güvenli POS cihazı ile gerçekleştirilebilir. Rezervasyon ön talebi aşamasında herhangi bir kredi kartı bilgisi talep edilmemektedir.'
    },
    {
      question: 'Dairelerde hangi olanaklar bulunuyor?',
      answer: 'Tüm dairelerimizde yüksek hızlı Wi-Fi internet, LCD/Smart TV, 7/24 sıcak su, klima/kombi ısıtma sistemi, buzdolabı, ocak, su ısıtıcısı, yemek pişirme ve servis ekipmanları, çamaşır makinesi, ütü, saç kurutma makinesi ve dezenfekte edilmiş nevresim-havlu takımları standart olarak sunulmaktadır.'
    },
    {
      question: 'Dairelerin konumu nerede ve ulaşım kolay mı?',
      answer: `Dairelerimiz ${settings.city} ${settings.district} mevkiinde, merkezi caddelere, toplu taşımaya ve havaalanı servis güzergahlarına yürüme veya kısa sürüş mesafesindedir. Rezervasyonunuz kesinleştiğinde tam konum ve yol tarifi WhatsApp üzerinden paylaşılmaktadır.`
    },
    {
      question: 'Daireler aileler ve çiftler için uygun mudur?',
      answer: 'Evet. Dairelerimiz güvenli, sakin ve saygın apartman bloklarında yer almakta olup ailelerin, çiftlerin ve iş amaçlı seyahat eden misafirlerimizin huzur içinde konaklaması için özenle işletilmektedir.'
    }
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="sss" className="py-16 lg:py-24 bg-[#F7F5F0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55, ease: easeCurve }}
          className="text-center max-w-xl mx-auto mb-14"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-[#63B9C5] mb-2">
            Merak Edilenler
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#18222F] font-bold tracking-tight leading-tight">
            Sıkça Sorulan Sorular
          </h2>
          <p className="mt-3 text-sm text-[#18222F]/70 leading-relaxed">
            Konaklama süreci, olanaklar ve rezervasyon hakkında sıkça yöneltilen soruların yanıtları.
          </p>
        </motion.div>

        {/* Accordion Container */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.45, delay: idx * 0.05, ease: easeCurve }}
                className="rounded-2xl bg-white border border-[#DCCDB9]/70 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 ease-in-out"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-[#18222F]">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-[#F7F5F0] flex items-center justify-center shrink-0 transition-transform duration-200 text-[#18222F] ${
                      isOpen ? 'rotate-180 bg-[#63B9C5] text-white' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#18222F]/75 leading-relaxed border-t border-[#DCCDB9]/40">
                    {faq.answer}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
