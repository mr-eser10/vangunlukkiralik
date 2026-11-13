import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SiteSettings } from '../types';
import { Phone, MessageCircle, MapPin, Send, CheckCircle, Navigation } from 'lucide-react';
import { generateWhatsAppLink, getGeneralWhatsAppText } from '../services/api';

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface ContactSectionProps {
  settings: SiteSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedWhatsAppUrl, setSubmittedWhatsAppUrl] = useState('');

  const whatsappUrl = generateWhatsAppLink(
    settings.whatsappNumber,
    getGeneralWhatsAppText(settings.brandName)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) return;

    const directMessage = `Merhaba, ${settings.brandName} web sitenizden iletişim formu doldurdum.\nİsim: ${formName}\nTelefon: ${formPhone}\nMesaj: ${formMessage}`;
    const directUrl = generateWhatsAppLink(settings.whatsappNumber, directMessage);

    setSubmittedWhatsAppUrl(directUrl);
    setSubmitted(true);
  };

  return (
    <section id="iletisim" className="py-16 lg:py-24 bg-white border-t border-[#DCCDB9]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55, ease: easeCurve }}
          className="max-w-2xl mb-14"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-[#63B9C5] mb-2">
            Doğrudan İletişim
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#18222F] font-bold tracking-tight leading-tight">
            Bizimle İletişime Geçin
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#18222F]/75 leading-relaxed">
            Van İpekyolu mevkiindeki apart dairelerimiz hakkında müsaitlik sormak veya rezervasyon oluşturmak için dilediğiniz zaman arayabilir ya da WhatsApp üzerinden anında bilgi alabilirsiniz.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Contact Details & Info (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.55, ease: easeCurve }}
            className="lg:col-span-5 space-y-6"
          >
            
            {/* Phone Card */}
            <div className="p-6 rounded-3xl bg-[#F7F5F0] border border-[#DCCDB9]/70 flex items-start gap-4 shadow-xs hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#DCCDB9]/50 text-[#63B9C5] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#18222F]/60 block mb-1">
                  Telefon & Bilgi Hattı
                </span>
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="text-base font-bold text-[#18222F] hover:text-[#63B9C5] transition-colors"
                >
                  {settings.phone}
                </a>
                <p className="text-xs text-[#18222F]/70 mt-1">
                  Haftanın 7 günü 08:00 – 24:00 arası arayabilirsiniz.
                </p>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="p-6 rounded-3xl bg-[#F7F5F0] border border-[#DCCDB9]/70 flex items-start gap-4 shadow-xs hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#DCCDB9]/50 text-[#25D366] flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 fill-[#25D366]" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#18222F]/60 block mb-1">
                  WhatsApp Hızlı Destek
                </span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-bold text-[#18222F] hover:text-[#25D366] transition-colors inline-flex items-center gap-1.5"
                >
                  Mesaj Gönder
                </a>
                <p className="text-xs text-[#18222F]/70 mt-1">
                  Daire fotoğrafları, güncel müsaitlik ve anında İpekyolu konum paylaşımı.
                </p>
              </div>
            </div>

            {/* Address Card */}
            <div className="p-6 rounded-3xl bg-[#F7F5F0] border border-[#DCCDB9]/70 flex items-start gap-4 shadow-xs hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#DCCDB9]/50 text-[#63B9C5] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#18222F]/60 block mb-1">
                  Tesis Konumu & Hizmet Bölgesi
                </span>
                <div className="text-sm font-semibold text-[#18222F]">
                  Van, İpekyolu Mevkii (Tüm 6 dairemiz aynı bölgededir)
                </div>
                <div className="mt-2.5">
                  <a
                    href={settings.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#63B9C5] hover:underline"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Google Haritalar'da Aç
                  </a>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Contact Form & Map (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.55, delay: 0.1, ease: easeCurve }}
            className="lg:col-span-7 space-y-6"
          >
            
            {/* Direct Message Form */}
            <div className="p-7 sm:p-8 rounded-3xl bg-[#F7F5F0] border border-[#DCCDB9]/70">
              <h3 className="font-serif-luxury text-xl font-semibold text-[#18222F] mb-2">
                Hızlı İletişim Formu
              </h3>
              <p className="text-xs text-[#18222F]/70 mb-5">
                Bilgilerinizi bırakın, en kısa sürede arayalım veya WhatsApp'tan yanıt verelim.
              </p>

              {submitted ? (
                <div className="p-5 rounded-2xl bg-white border border-[#63B9C5]/50 text-center space-y-3">
                  <CheckCircle className="w-8 h-8 text-[#63B9C5] mx-auto" />
                  <div>
                    <h4 className="text-sm font-semibold text-[#18222F]">Mesajınız Hazırlandı</h4>
                    <p className="text-xs text-[#18222F]/70 mt-1">
                      Hızlı yanıt için aşağıdaki butona tıklayarak mesajınızı doğrudan WhatsApp üzerinden iletebilirsiniz.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
                    <a
                      href={submittedWhatsAppUrl || whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl transition-all"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>WhatsApp ile Gönder</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="text-xs text-[#18222F]/70 hover:text-[#18222F] font-semibold underline px-3 py-2"
                    >
                      Yeni mesaj yaz
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#18222F] mb-1">
                        Adınız Soyadınız
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ad Soyad"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-white border border-[#DCCDB9] rounded-xl focus:outline-none focus:border-[#63B9C5] text-[#18222F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#18222F] mb-1">
                        Telefon Numaranız
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="05XX XXX XX XX"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-white border border-[#DCCDB9] rounded-xl focus:outline-none focus:border-[#63B9C5] text-[#18222F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#18222F] mb-1">
                      Mesajınız veya Sorunuz
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Konaklamak istediğiniz tarihler veya merak ettikleriniz..."
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs bg-white border border-[#DCCDB9] rounded-xl focus:outline-none focus:border-[#63B9C5] text-[#18222F]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-[#18222F] hover:bg-[#63B9C5] rounded-xl shadow-sm hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>WhatsApp / Mesaj Gönder</span>
                  </button>
                </form>
              )}
            </div>

            {/* Google Maps Preview Embed Frame */}
            <div className="rounded-3xl overflow-hidden border border-[#DCCDB9]/70 h-64 bg-[#EAE5DC] relative">
              <iframe
                title="Van Günlük Kiralık Daire Harita Konumu"
                src={settings.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[20%] contrast-[1.05]"
              />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#DCCDB9] text-[11px] font-semibold text-[#18222F] shadow-xs">
                📍 {settings.district}, {settings.city}
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
