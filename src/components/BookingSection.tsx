import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Apartment, SiteSettings, Inquiry } from '../types';
import { submitInquiry, generateWhatsAppLink } from '../services/api';
import { Calendar, Users, Phone, User, CheckCircle, MessageCircle, AlertCircle, Sparkles } from 'lucide-react';

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface BookingSectionProps {
  apartments: Apartment[];
  settings: SiteSettings;
  selectedApartment: Apartment | null;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  apartments,
  settings,
  selectedApartment,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [apartmentId, setApartmentId] = useState(selectedApartment ? selectedApartment.id : (apartments[0]?.id || ''));
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successInquiry, setSuccessInquiry] = useState<Inquiry | null>(null);

  // Sync selected apartment prop
  useEffect(() => {
    if (selectedApartment) {
      setApartmentId(selectedApartment.id);
    }
  }, [selectedApartment]);

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Lütfen ad ve soyadınızı belirtiniz.');
      return;
    }

    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Lütfen geçerli bir telefon numarası giriniz (en az 10 hane).');
      return;
    }

    if (!checkInDate || !checkOutDate) {
      setErrorMessage('Lütfen giriş ve çıkış tarihlerini seçiniz.');
      return;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      setErrorMessage('Çıkış tarihi, giriş tarihinden sonraki bir gün olmalıdır.');
      return;
    }

    const currentApt = apartments.find((a) => a.id === apartmentId);
    const apartmentTitle = currentApt ? currentApt.title : 'Genel Daire Talebi';

    setLoading(true);

    try {
      const response = await submitInquiry({
        fullName: fullName.trim(),
        phone: phone.trim(),
        apartmentId,
        apartmentTitle,
        checkInDate,
        checkOutDate,
        guestCount,
        notes: notes.trim(),
      });

      if (response.success && response.inquiry) {
        setSuccessInquiry(response.inquiry);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Rezervasyon talebi iletilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessInquiry(null);
    setFullName('');
    setPhone('');
    setCheckInDate('');
    setCheckOutDate('');
    setNotes('');
  };

  return (
    <section id="rezervasyon" className="py-16 lg:py-24 bg-[#EFECE6] border-y border-[#DCCDB9]/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55, ease: easeCurve }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-[#63B9C5] mb-2">
            Hızlı Rezervasyon & Fiyat Teklifi
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#18222F] font-bold tracking-tight leading-tight">
            Rezervasyonunuzu WhatsApp Üzerinden Tamamlayın
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#18222F]/75 leading-relaxed">
            {(settings.startingPriceAmount || 1500).toLocaleString('tr-TR')} TL'den başlayan fiyatlarla konaklama için tarihlerinizi seçip talebinizi oluşturun; ardından tek tıkla WhatsApp'a geçerek kesin fiyat ve müsaitlik onayınızı alın.
          </p>
        </motion.div>

        {/* Success Modal / Card State */}
        {successInquiry ? (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#63B9C5]/40 shadow-lg text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div className="inline-block px-3.5 py-1 text-xs font-semibold rounded-md bg-[#F7F5F0] text-[#18222F] border border-[#DCCDB9] mb-3">
              Talep Referans Kodu: <span className="font-mono">{successInquiry.code}</span>
            </div>

            <h3 className="font-serif-luxury text-2xl font-bold text-[#18222F] mb-3">
              Ön Talebiniz Kaydedildi — Son Adım: WhatsApp
            </h3>

            <p className="text-sm text-[#18222F]/80 max-w-md mx-auto leading-relaxed mb-6">
              Sayın <strong>{successInquiry.fullName}</strong>, <strong>{successInquiry.apartmentTitle}</strong> için talebiniz kaydedildi. Tarihinize özel net fiyat bilgisini öğrenmek ve rezervasyonunuzu kesinleştirmek için aşağıdaki butondan WhatsApp'a geçin.
            </p>

            <div className="bg-[#F7F5F0] rounded-2xl p-4 max-w-md mx-auto mb-8 text-xs text-[#18222F]/70 text-left space-y-1.5 border border-[#DCCDB9]/50">
              <div className="flex justify-between">
                <span>Giriş Tarihi:</span>
                <strong className="text-[#18222F]">{successInquiry.checkInDate}</strong>
              </div>
              <div className="flex justify-between">
                <span>Çıkış Tarihi:</span>
                <strong className="text-[#18222F]">{successInquiry.checkOutDate}</strong>
              </div>
              <div className="flex justify-between">
                <span>Kişi Sayısı:</span>
                <strong className="text-[#18222F]">{successInquiry.guestCount} Kişi</strong>
              </div>
            </div>

            {/* Faster WhatsApp Follow-up */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={generateWhatsAppLink(
                  settings.whatsappNumber,
                  `Merhaba, web sitenizden rezervasyon talebi oluşturdum.\nTalep Kodum: ${successInquiry.code}\nİsim: ${successInquiry.fullName}\nDaire: ${successInquiry.apartmentTitle}\nTarihler: ${successInquiry.checkInDate} - ${successInquiry.checkOutDate}\nKişi Sayısı: ${successInquiry.guestCount}\n\nSeçtiğim tarihler için güncel fiyat ve müsaitlik bilgisini paylaşabilir misiniz?`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-semibold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out whitespace-nowrap"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                WhatsApp'ta Rezervasyonu Tamamla
              </a>

              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-5 py-3.5 text-xs font-medium text-[#18222F] bg-[#F7F5F0] hover:bg-[#DCCDB9]/40 rounded-xl hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Yeni Talep Oluştur
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.55, delay: 0.08, ease: easeCurve }}
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 sm:p-10 border border-[#DCCDB9]/70 shadow-sm"
          >
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#18222F] mb-1.5">
                  Adınız ve Soyadınız <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#18222F]/40" />
                  <input
                    type="text"
                    required
                    placeholder="Örn: Ahmet Yılmaz"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-xs bg-[#F7F5F0] border border-[#DCCDB9] rounded-xl focus:outline-none focus:border-[#63B9C5] focus:bg-white transition-all text-[#18222F]"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-[#18222F] mb-1.5">
                  Telefon Numaranız <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#18222F]/40" />
                  <input
                    type="tel"
                    required
                    placeholder="Örn: 0532 000 00 00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-xs bg-[#F7F5F0] border border-[#DCCDB9] rounded-xl focus:outline-none focus:border-[#63B9C5] focus:bg-white transition-all text-[#18222F]"
                  />
                </div>
              </div>
            </div>

            {/* Apartment Selection */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-[#18222F] mb-1.5">
                Konaklamak İstediğiniz Daire <span className="text-rose-500">*</span>
              </label>
              <select
                value={apartmentId}
                onChange={(e) => setApartmentId(e.target.value)}
                className="w-full px-4 py-3 text-xs bg-[#F7F5F0] border border-[#DCCDB9] rounded-xl focus:outline-none focus:border-[#63B9C5] focus:bg-white transition-all text-[#18222F]"
              >
                {apartments.map((apt) => (
                  <option key={apt.id} value={apt.id}>
                    {apt.title} ({apt.type} - {apt.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Dates & Guest Count */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
              <div>
                <label className="block text-xs font-semibold text-[#18222F] mb-1.5">
                  Giriş Tarihi <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#18222F]/40 pointer-events-none" />
                  <input
                    type="date"
                    required
                    min={today}
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-xs bg-[#F7F5F0] border border-[#DCCDB9] rounded-xl focus:outline-none focus:border-[#63B9C5] focus:bg-white transition-all text-[#18222F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18222F] mb-1.5">
                  Çıkış Tarihi <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#18222F]/40 pointer-events-none" />
                  <input
                    type="date"
                    required
                    min={checkInDate || today}
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-xs bg-[#F7F5F0] border border-[#DCCDB9] rounded-xl focus:outline-none focus:border-[#63B9C5] focus:bg-white transition-all text-[#18222F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18222F] mb-1.5">
                  Kişi Sayısı
                </label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#18222F]/40 pointer-events-none" />
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value, 10))}
                    className="w-full pl-10 pr-4 py-3 text-xs bg-[#F7F5F0] border border-[#DCCDB9] rounded-xl focus:outline-none focus:border-[#63B9C5] focus:bg-white transition-all text-[#18222F]"
                  >
                    <option value={1}>1 Kişi (Yalnız Seyahat)</option>
                    <option value={2}>2 Kişi (Çift / 2 Misafir)</option>
                    <option value={3}>3 Kişi</option>
                    <option value={4}>4 Kişi (Aile / Grup)</option>
                    <option value={5}>5+ Kişi</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Special Requests / Notes */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-[#18222F] mb-1.5">
                Ek Açıklama & Özel İstekler (Opsiyonel)
              </label>
              <textarea
                rows={3}
                placeholder="Örn: Tahmini varış saatimiz 17:00, bebek yatağı talep ediyoruz..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 text-xs bg-[#F7F5F0] border border-[#DCCDB9] rounded-xl focus:outline-none focus:border-[#63B9C5] focus:bg-white transition-all text-[#18222F]"
              />
            </div>

            {/* Transparency Note */}
            <div className="p-4 rounded-2xl bg-[#F7F5F0] border border-[#DCCDB9]/50 text-xs text-[#18222F]/70 flex items-start gap-3 mb-6">
              <Sparkles className="w-4 h-4 text-[#63B9C5] shrink-0 mt-0.5" />
              <span>
                <strong>Bilgilendirme:</strong> Konaklama ücretleri seçtiğiniz tarihe ve kalış süresine göre belirlenmektedir ({(settings.startingPriceAmount || 1500).toLocaleString('tr-TR')} TL'den başlayan fiyatlarla). Ön talebiniz sonrasında kesin rezervasyon WhatsApp üzerinden tamamlanır.
              </span>
            </div>

            {/* Submit & Direct WhatsApp Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 px-5 text-xs font-semibold text-white bg-[#18222F] hover:bg-[#63B9C5] rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 ease-in-out disabled:opacity-50"
              >
                {loading ? 'Talep Kaydediliyor...' : 'Talebi Kaydet & WhatsApp ile Devam Et'}
              </button>

              <a
                href={generateWhatsAppLink(
                  settings.whatsappNumber,
                  `Merhaba, ${settings.brandName} için fiyat ve müsaitlik bilgisi almak istiyorum.${
                    apartments.find((a) => a.id === apartmentId)
                      ? `\nİlgilendiğim Daire: ${apartments.find((a) => a.id === apartmentId)?.title}`
                      : ''
                  }${checkInDate ? `\nGiriş Tarihi: ${checkInDate}` : ''}${checkOutDate ? `\nÇıkış Tarihi: ${checkOutDate}` : ''}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="sm:w-auto inline-flex items-center justify-center gap-2 py-4 px-6 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Hemen WhatsApp'tan Yaz</span>
              </a>
            </div>
          </motion.form>
        )}

      </div>
    </section>
  );
};
