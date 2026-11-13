import React, { useState, useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import { Apartment, SiteSettings } from './types';
import { fetchApartments, fetchSettings, fallbackSettings } from './services/api';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ApartmentList } from './components/ApartmentList';
import { ApartmentModal } from './components/ApartmentModal';
import { BookingSection } from './components/BookingSection';
import { WhyUsSection } from './components/WhyUsSection';
import { AboutSection } from './components/AboutSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(fallbackSettings);
  const [selectedApartmentForModal, setSelectedApartmentForModal] = useState<Apartment | null>(null);
  const [selectedApartmentForBooking, setSelectedApartmentForBooking] = useState<Apartment | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [aptsData, settingsData] = await Promise.all([
        fetchApartments(),
        fetchSettings(),
      ]);
      if (aptsData && aptsData.length > 0) {
        setApartments(aptsData);
      }
      if (settingsData) {
        setSettings(settingsData);
      }
    } catch (err) {
      console.error('Veri yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Check URL hash or query for secret admin entry
    const checkSecretRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash === '#admin' || hash === '#yonetim' || search.includes('admin=true')) {
        setIsAdminOpen(true);
      }
    };

    checkSecretRoute();
    window.addEventListener('hashchange', checkSecretRoute);

    // Secret keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A or Alt+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      } else if (e.altKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkSecretRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Open specific apartment modal if ?daire=<id> is in URL (for SEO & sitemap deep links)
  useEffect(() => {
    if (apartments.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const daireId = params.get('daire');
    if (daireId) {
      const matched = apartments.find((a) => a.id === daireId);
      if (matched) {
        setSelectedApartmentForModal(matched);
      }
    }
  }, [apartments]);

  // Dynamically sync page title, OpenGraph/Twitter tags, canonical URL, and LodgingBusiness JSON-LD with live settings
  useEffect(() => {
    const title = settings.seoTitle || 'Van Günlük Kiralık Daire | Merkezde Konforlu Konaklama';
    const description = settings.seoDescription || '';
    const keywords = settings.seoKeywords || '';
    const canonicalUrl = `${window.location.origin}${window.location.pathname}`;
    const logoAbsUrl = `${window.location.origin}/assets/aistudio/Van_G_nl_k_Kiral_k_Daire_3D_Logosu_f1b36505.png`;

    document.title = title;

    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector<HTMLMetaElement>(selector);
      if (el && content) {
        el.setAttribute('content', content);
      }
    };

    setMeta('meta[name="description"]', description);
    setMeta('meta[name="keywords"]', keywords);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', canonicalUrl);
    setMeta('meta[property="og:image"]', logoAbsUrl);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:image"]', logoAbsUrl);

    const canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonicalEl) {
      canonicalEl.setAttribute('href', canonicalUrl);
    }

    const jsonLdEl = document.getElementById('lodging-jsonld');
    if (jsonLdEl) {
      const sanitizedPhone = settings.phone.replace(/[^+\d]/g, '');
      const startingPrice = (settings.startingPriceAmount || 1500).toLocaleString('tr-TR');
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'LodgingBusiness',
        name: settings.brandName,
        description,
        url: canonicalUrl,
        image: logoAbsUrl,
        telephone: sanitizedPhone,
        email: settings.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: settings.address,
          addressLocality: settings.district,
          addressRegion: settings.city,
          addressCountry: 'TR',
        },
        areaServed: {
          '@type': 'City',
          name: settings.city,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 38.4946,
          longitude: 43.3832,
        },
        priceRange: `${startingPrice} TL'den başlayan fiyatlarla`,
        checkinTime: settings.checkInHour,
        checkoutTime: settings.checkOutHour,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: sanitizedPhone,
          contactType: 'reservations',
          availableLanguage: ['Turkish'],
        },
      };
      jsonLdEl.textContent = JSON.stringify(schema);
    }
  }, [settings]);

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash.toLowerCase() === '#admin' || window.location.hash.toLowerCase() === '#yonetim') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const handleOpenBookingWithApartment = (apt: Apartment) => {
    setSelectedApartmentForBooking(apt);
    const bookingEl = document.getElementById('rezervasyon');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-[#F7F5F0] text-[#18222F] flex flex-col font-sans selection:bg-[#63B9C5]/30">
      
      {/* Subtle Top Notification Kicker */}
      {settings.heroAnnouncement && (
        <div className="bg-[#18222F] text-white/90 text-center py-2 px-4 text-xs font-medium border-b border-white/10 tracking-wide">
          <span>{settings.heroAnnouncement}</span>
          <span className="hidden sm:inline text-[#63B9C5] ml-2 font-semibold">
            İletişim: {settings.phone}
          </span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenBooking={() => handleScrollToSection('rezervasyon')}
      />

      <main className="flex-1">
        {/* Hero Area */}
        <Hero
          settings={settings}
          onExploreApartments={() => handleScrollToSection('daireler')}
          onOpenBooking={() => handleScrollToSection('rezervasyon')}
        />

        {/* Apartments Catalog */}
        <ApartmentList
          apartments={apartments}
          settings={settings}
          onSelectApartment={(apt) => setSelectedApartmentForModal(apt)}
          onRequestBooking={(apt) => handleOpenBookingWithApartment(apt)}
        />

        {/* Booking Inquiry System */}
        <BookingSection
          apartments={apartments}
          settings={settings}
          selectedApartment={selectedApartmentForBooking}
        />

        {/* Why Choose Us */}
        <WhyUsSection />

        {/* About Brand & Hospitality Standards */}
        <AboutSection />

        {/* Frequently Asked Questions */}
        <FaqSection settings={settings} />

        {/* Direct Contact & Location */}
        <ContactSection settings={settings} />
      </main>

      {/* Site Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppFloatingButton settings={settings} />

      {/* Apartment Detail Modal */}
      <ApartmentModal
        apartment={selectedApartmentForModal}
        settings={settings}
        onClose={() => setSelectedApartmentForModal(null)}
        onOpenBooking={(apt) => handleOpenBookingWithApartment(apt)}
      />

      {/* Admin Management Console */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
        apartments={apartments}
        settings={settings}
        onRefreshData={loadData}
      />

    </div>
    </MotionConfig>
  );
}
