import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import {
  Apartment,
  Inquiry,
  InquiryStatus,
  RoomType,
  SiteSettings,
} from '../types';
import {
  APARTMENT_GALLERY_BUCKET,
  isSupabaseConfigured,
  supabase,
} from '../lib/supabase';

export const fallbackSettings: SiteSettings = {
  brandName: 'Van Günlük Kiralık Daire',
  phone: '+90 542 180 23 72',
  whatsappNumber: '905421802372',
  email: 'iletisim@vangunlukkiralik.com',
  address: 'İpekyolu Mevkii',
  district: 'İpekyolu',
  city: 'Van',
  googleMapsUrl: 'https://maps.google.com/?q=Van+Merkez+Ipekyolu',
  googleMapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49942.3339178977!2d43.3444033!3d38.4945722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x401270c53d122dd1%3A0xe543fa00cb83cbb1!2sVan!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str',
  checkInHour: '14:00',
  checkOutHour: '11:00',
  heroAnnouncement:
    'Van İpekyolu mevkiinde temiz, güvenli ve bağımsız 1+0, 2+1 ve 3+1 apart daireler.',
  seoTitle: 'Van Günlük Kiralık Daire | Merkezde Konforlu Konaklama',
  seoDescription:
    "Van İpekyolu mevkiinde temiz, güvenli ve konforlu 1+0, 2+1 ve 3+1 günlük kiralık apart daireler. 1.500 TL'den başlayan fiyatlarla WhatsApp'tan bilgi alın.",
  seoKeywords:
    'van günlük kiralık daire, van günlük daire, van ipekyolu günlük kiralık daire, van apart konaklama, van 1+0 daire, van 2+1 daire, van 3+1 daire, van konaklama',
  instagramUrl: 'https://instagram.com/vangunlukkiralik',
  startingPriceAmount: 1500,
  hideExactPrices: true,
};

export const fallbackApartments: Apartment[] = [
  {
    id: 'apt-ipekyolu-101',
    code: 'VGK-101',
    title: 'İpekyolu Apart — 1+0 Konfor Daire 1',
    type: '1+0',
    shortDescription:
      'Bireysel misafirler ve çiftler için pratik mutfak köşeli, temiz ve konforlu 1+0 apart daire.',
    fullDescription:
      'Van İpekyolu mevkiindeki tesisimizde yer alan 1+0 Konfor Daire 1, ferah aydınlatması, ortopedik yatağı ve düzenli yaşam alanıyla huzurlu bir şehir konaklaması sunar. Yüksek hızlı fiber internet, klima, 7/24 sıcak su ve temel mutfak gereçleriyle evinizin rahatlığını aratmaz.',
    coverImage: '/src/assets/images/van_living_room_suite_1793882174207.jpg',
    gallery: [
      '/src/assets/images/van_living_room_suite_1793882174207.jpg',
      '/src/assets/images/van_bedroom_deluxe_1793882175293.jpg',
      '/src/assets/images/van_modern_kitchen_1793882174891.jpg',
    ],
    location: 'Van, İpekyolu',
    capacity: 2,
    beds: '1 Çift Kişilik Ortopedik Yatak',
    areaM2: 40,
    floor: '1. Kat',
    pricePerNight: 1500,
    priceNote:
      "1.500 TL'den başlayan fiyatlar. Kesin fiyat tarihe göre WhatsApp'tan teyit edilir.",
    isAvailable: true,
    amenities: [
      'Yüksek Hızlı Fiber Wi-Fi',
      '7/24 Kesintisiz Sıcak Su',
      'Akıllı LED TV',
      'Buzdolabı, Ocak & Mutfak Gereçleri',
      'Kişiye Özel Hijyenik Havlu ve Çarşaf Seti',
      'Saç Kurutma Makinesi ve Ütü',
      'Merkezi Isıtma Sistemi',
      'Bağımsız Güvenli Giriş',
    ],
    rules: {
      checkIn: '14:00 ve sonrası',
      checkOut: 'En geç 11:00',
      smoking: false,
      pets: false,
    },
    featured: true,
  },
  {
    id: 'apt-ipekyolu-102',
    code: 'VGK-102',
    title: 'İpekyolu Apart — 1+0 Ferah Daire 2',
    type: '1+0',
    shortDescription:
      'Sessiz, gün ışığı alan, eksiksiz ev donanımına sahip 1+0 apart daire.',
    fullDescription:
      'Van İpekyolu mevkiinde bulunan 1+0 Ferah Daire 2, iş seyahatleri ve kısa süreli Van ziyaretleri için özenle hazırlanmıştır. Her konaklama öncesi profesyonel hijyen protokolü uygulanır; temiz tekstil ürünleri ve kullanışlı mutfak alanı ile konforlu bir ortam sunar.',
    coverImage: '/src/assets/images/van_bedroom_deluxe_1793882175293.jpg',
    gallery: [
      '/src/assets/images/van_bedroom_deluxe_1793882175293.jpg',
      '/src/assets/images/van_living_room_suite_1793882174207.jpg',
      '/src/assets/images/van_modern_kitchen_1793882174891.jpg',
    ],
    location: 'Van, İpekyolu',
    capacity: 2,
    beds: '1 Çift Kişilik Ortopedik Yatak',
    areaM2: 42,
    floor: '2. Kat (Asansörlü)',
    pricePerNight: 1500,
    priceNote:
      "1.500 TL'den başlayan fiyatlar. Kesin fiyat tarihe göre WhatsApp'tan teyit edilir.",
    isAvailable: true,
    amenities: [
      'Yüksek Hızlı Fiber Wi-Fi',
      'Klima & Merkezi Isıtma',
      '7/24 Kesintisiz Sıcak Su',
      'Akıllı TV & Çalışma Alanı',
      'Mini Buzdolabı, Kettle & Mutfak Gereçleri',
      'Temiz Havlu ve Nevresim Takımı',
      'Saç Kurutma Makinesi',
      'Bağımsız Güvenli Giriş',
    ],
    rules: {
      checkIn: '14:00 ve sonrası',
      checkOut: 'En geç 11:00',
      smoking: false,
      pets: false,
    },
    featured: false,
  },
  {
    id: 'apt-ipekyolu-201',
    code: 'VGK-201',
    title: 'İpekyolu Apart — 2+1 Aile Dairesi 1',
    type: '2+1',
    shortDescription:
      'İki ayrı yatak odası, geniş salonu ve tam donanımlı mutfağıyla aileler için ideal 2+1 daire.',
    fullDescription:
      'Van İpekyolu mevkiinde yer alan 2+1 Aile Dairesi 1, geniş oturma odası ve iki ayrı yatak odasıyla aileler ile kalabalık misafirler için ferah bir yaşam alanı sunar. Çamaşır makinesi, ankastre mutfak ve yüksek hijyen standartlarıyla evinizdeki düzeni konaklama boyunca sürdürebilirsiniz.',
    coverImage: '/src/assets/images/van_luxury_apartment_hero_1793882173766.jpg',
    gallery: [
      '/src/assets/images/van_luxury_apartment_hero_1793882173766.jpg',
      '/src/assets/images/van_bedroom_deluxe_1793882175293.jpg',
      '/src/assets/images/van_modern_kitchen_1793882174891.jpg',
      '/src/assets/images/van_living_room_suite_1793882174207.jpg',
    ],
    location: 'Van, İpekyolu',
    capacity: 4,
    beds: '1 Çift Kişilik Yatak + 2 Tek Kişilik Yatak',
    areaM2: 80,
    floor: '3. Kat (Asansörlü)',
    pricePerNight: 2000,
    priceNote: 'Kesin fiyat konaklama tarihine göre WhatsApp üzerinden teyit edilir.',
    isAvailable: true,
    amenities: [
      'Yüksek Hızlı Fiber Wi-Fi',
      'Inverter Sessiz Klima',
      '7/24 Kesintisiz Sıcak Su',
      'Akıllı 4K LED TV',
      'Buzdolabı, Ankastre Ocak & Mutfak Gereçleri',
      'Çamaşır Makinesi & Kurutmalık',
      'Kişiye Özel Hijyenik Havlu ve Çarşaf Seti',
      'Saç Kurutma Makinesi ve Ütü',
    ],
    rules: {
      checkIn: '14:00 ve sonrası',
      checkOut: 'En geç 11:00',
      smoking: false,
      pets: false,
    },
    featured: true,
  },
  {
    id: 'apt-ipekyolu-202',
    code: 'VGK-202',
    title: 'İpekyolu Apart — 2+1 Balkonlu Daire 2',
    type: '2+1',
    shortDescription:
      'Geniş balkon alanı, ferah salonu ve tam teşekküllü mutfağıyla konforlu 2+1 apart daire.',
    fullDescription:
      'Van İpekyolu mevkiindeki tesisimizde bulunan 2+1 Balkonlu Daire 2, doğal gün ışığı alan geniş pencereleri ve balkon terası ile öne çıkar. Ailelerin ve arkadaş gruplarının rahatlığı için seçilen ortopedik yataklar, çamaşır ve mutfak ekipmanları ile kusursuz bir konaklama deneyimi sunar.',
    coverImage: '/src/assets/images/van_lake_view_balcony_1793882175493.jpg',
    gallery: [
      '/src/assets/images/van_lake_view_balcony_1793882175493.jpg',
      '/src/assets/images/van_living_room_suite_1793882174207.jpg',
      '/src/assets/images/van_bedroom_deluxe_1793882175293.jpg',
      '/src/assets/images/van_modern_kitchen_1793882174891.jpg',
    ],
    location: 'Van, İpekyolu',
    capacity: 5,
    beds: '1 Çift Kişilik + 2 Tek Kişilik Yatak + 1 Kanepe',
    areaM2: 85,
    floor: '4. Kat (Asansörlü)',
    pricePerNight: 2200,
    priceNote: 'Kesin fiyat konaklama tarihine göre WhatsApp üzerinden teyit edilir.',
    isAvailable: true,
    amenities: [
      'Geniş Balkon',
      'Ultra Hızlı Fiber Wi-Fi',
      'Her Odada Bağımsız Isıtma',
      'Modern Mutfak & Bulaşık Makinesi',
      'Büyük Ekran Akıllı TV',
      'Çamaşır Makinesi, Ütü & Askılık',
      '7/24 Kesintisiz Sıcak Su',
      'Yüksek Hijyen Standartlı Tekstil',
    ],
    rules: {
      checkIn: '14:00 ve sonrası',
      checkOut: 'En geç 11:00',
      smoking: false,
      pets: false,
    },
    featured: true,
  },
  {
    id: 'apt-ipekyolu-301',
    code: 'VGK-301',
    title: 'İpekyolu Apart — 3+1 Geniş Aile Dairesi 1',
    type: '3+1',
    shortDescription:
      'Üç ayrı yatak odası ve geniş oturma salonuyla kalabalık aileler için ferah 3+1 daire.',
    fullDescription:
      "Van İpekyolu mevkiinde yer alan 3+1 Geniş Aile Dairesi 1, 115 m² kullanım alanıyla büyük aileler ve uzun süreli grup konaklamaları için tasarlanmıştır. Üç ayrı yatak odası, geniş yemek masalı mutfağı ve tam ev donanımıyla tüm misafirlerinize rahat bir alan sunar.",
    coverImage: '/src/assets/images/van_modern_kitchen_1793882174891.jpg',
    gallery: [
      '/src/assets/images/van_modern_kitchen_1793882174891.jpg',
      '/src/assets/images/van_luxury_apartment_hero_1793882173766.jpg',
      '/src/assets/images/van_bedroom_deluxe_1793882175293.jpg',
      '/src/assets/images/van_living_room_suite_1793882174207.jpg',
    ],
    location: 'Van, İpekyolu',
    capacity: 6,
    beds: '2 Çift Kişilik Yatak + 2 Tek Kişilik Yatak',
    areaM2: 115,
    floor: '4. Kat (Asansörlü)',
    pricePerNight: 2800,
    priceNote:
      "Kalabalık aileler için avantajlı 3+1 konaklama. Net fiyat WhatsApp'tan teyit edilir.",
    isAvailable: true,
    amenities: [
      '3 Ayrı Yatak Odası & Geniş Salon',
      'Yüksek Hızlı Fiber Wi-Fi',
      'Tam Teşekküllü Mutfak & Fırın',
      'Çamaşır & Bulaşık Makinesi',
      '2 Banyo / 7/24 Sıcak Su',
      'Büyük Ekran Akıllı TV',
      'Merkezi Isıtma & Klima',
      'Ütü ve Saç Kurutma Makinesi',
    ],
    rules: {
      checkIn: '14:00 ve sonrası',
      checkOut: 'En geç 11:00',
      smoking: false,
      pets: false,
    },
    featured: true,
  },
  {
    id: 'apt-ipekyolu-302',
    code: 'VGK-302',
    title: 'İpekyolu Apart — 3+1 Teraslı Daire 2',
    type: '3+1',
    shortDescription:
      'Geniş teras balkonu, 3 yatak odası ve yüksek konfor donanımıyla en geniş 3+1 apart dairemiz.',
    fullDescription:
      'Van İpekyolu mevkiinde bulunan 3+1 Teraslı Daire 2, 120 m² ferah planı ve geniş balkonuyla kalabalık ailelerin tüm beklentilerini karşılar. Ses yalıtımlı pencereleri, tam donanımlı mutfağı, yüksek hijyen standartları ve merkezi konumuyla ev sıcaklığında konaklama sağlar.',
    coverImage: '/src/assets/images/van_lake_view_balcony_1793882175493.jpg',
    gallery: [
      '/src/assets/images/van_lake_view_balcony_1793882175493.jpg',
      '/src/assets/images/van_luxury_apartment_hero_1793882173766.jpg',
      '/src/assets/images/van_bedroom_deluxe_1793882175293.jpg',
      '/src/assets/images/van_modern_kitchen_1793882174891.jpg',
    ],
    location: 'Van, İpekyolu',
    capacity: 7,
    beds: '2 Çift Kişilik + 2 Tek Kişilik Yatak + 1 Dinlenme Koltuğu',
    areaM2: 120,
    floor: '5. Kat (Asansörlü)',
    pricePerNight: 3000,
    priceNote: "Geniş aile ve grup konaklamaları için WhatsApp'tan müsaitlik alınız.",
    isAvailable: true,
    amenities: [
      'Geniş Teras Balkon',
      '3 Ayrı Yatak Odası',
      'Yüksek Hızlı Fiber Wi-Fi',
      'Full Ankastre Mutfak & Yemek Takımı',
      'Çamaşır Makinesi & Kurutma',
      'Büyük Ekran Smart TV',
      '7/24 Telefon / WhatsApp Destek',
      'Bağımsız Güvenli Giriş',
    ],
    rules: {
      checkIn: '14:00 ve sonrası',
      checkOut: 'En geç 11:00',
      smoking: false,
      pets: false,
    },
    featured: true,
  },
];

// ============================================================================
// DB Row <-> TypeScript Model Mappers (PostgreSQL snake_case <-> App camelCase)
// ============================================================================

interface ApartmentRow {
  id: string;
  code: string;
  title: string;
  type: RoomType;
  short_description: string;
  full_description: string;
  cover_image: string;
  gallery: string[];
  location: string;
  capacity: number;
  beds: string;
  area_m2: number;
  floor: string | null;
  price_per_night: number | null;
  weekend_price: number | null;
  weekly_discount_percent: number | null;
  deposit_amount: number | null;
  min_nights: number | null;
  price_note: string | null;
  is_available: boolean;
  amenities: string[];
  rules: Apartment['rules'];
  featured: boolean | null;
  created_at?: string;
}

interface InquiryRow {
  id: string;
  code: string;
  created_at: string;
  full_name: string;
  phone: string;
  apartment_id: string;
  apartment_title: string;
  check_in_date: string;
  check_out_date: string;
  guest_count: number;
  notes: string | null;
  status: InquiryStatus;
  admin_note: string | null;
}

interface SettingsRow {
  id: number;
  brand_name: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  district: string;
  city: string;
  google_maps_url: string;
  google_maps_embed_url: string;
  check_in_hour: string;
  check_out_hour: string;
  hero_announcement: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  instagram_url: string | null;
  starting_price_amount: number | null;
  hide_exact_prices: boolean | null;
}

function mapApartmentFromDb(row: ApartmentRow): Apartment {
  return {
    id: row.id,
    code: row.code,
    title: row.title,
    type: row.type,
    shortDescription: row.short_description || '',
    fullDescription: row.full_description || '',
    coverImage: row.cover_image || '',
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    location: row.location || 'Van, İpekyolu',
    capacity: row.capacity ?? 2,
    beds: row.beds || '',
    areaM2: row.area_m2 ?? 40,
    floor: row.floor || undefined,
    pricePerNight: row.price_per_night ?? null,
    weekendPrice: row.weekend_price ?? null,
    weeklyDiscountPercent: row.weekly_discount_percent ?? null,
    depositAmount: row.deposit_amount ?? null,
    minNights: row.min_nights ?? undefined,
    priceNote: row.price_note || undefined,
    isAvailable: row.is_available ?? true,
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    rules: row.rules || {
      checkIn: '14:00 ve sonrası',
      checkOut: 'En geç 11:00',
      smoking: false,
      pets: false,
    },
    featured: row.featured ?? false,
  };
}

function mapApartmentToDb(data: Partial<Apartment>): Partial<ApartmentRow> {
  const payload: Partial<ApartmentRow> = {};
  if (data.id !== undefined) payload.id = data.id;
  if (data.code !== undefined) payload.code = data.code;
  if (data.title !== undefined) payload.title = data.title;
  if (data.type !== undefined) payload.type = data.type;
  if (data.shortDescription !== undefined) payload.short_description = data.shortDescription;
  if (data.fullDescription !== undefined) payload.full_description = data.fullDescription;
  if (data.coverImage !== undefined) payload.cover_image = data.coverImage;
  if (data.gallery !== undefined) payload.gallery = data.gallery;
  if (data.location !== undefined) payload.location = data.location;
  if (data.capacity !== undefined) payload.capacity = data.capacity;
  if (data.beds !== undefined) payload.beds = data.beds;
  if (data.areaM2 !== undefined) payload.area_m2 = data.areaM2;
  if (data.floor !== undefined) payload.floor = data.floor || null;
  if (data.pricePerNight !== undefined) payload.price_per_night = data.pricePerNight;
  if (data.weekendPrice !== undefined) payload.weekend_price = data.weekendPrice ?? null;
  if (data.weeklyDiscountPercent !== undefined)
    payload.weekly_discount_percent = data.weeklyDiscountPercent ?? null;
  if (data.depositAmount !== undefined) payload.deposit_amount = data.depositAmount ?? null;
  if (data.minNights !== undefined) payload.min_nights = data.minNights ?? 1;
  if (data.priceNote !== undefined) payload.price_note = data.priceNote || null;
  if (data.isAvailable !== undefined) payload.is_available = data.isAvailable;
  if (data.amenities !== undefined) payload.amenities = data.amenities;
  if (data.rules !== undefined) payload.rules = data.rules;
  if (data.featured !== undefined) payload.featured = data.featured;
  return payload;
}

function mapInquiryFromDb(row: InquiryRow): Inquiry {
  return {
    id: row.id,
    code: row.code,
    createdAt: row.created_at,
    fullName: row.full_name,
    phone: row.phone,
    apartmentId: row.apartment_id,
    apartmentTitle: row.apartment_title,
    checkInDate: row.check_in_date,
    checkOutDate: row.check_out_date,
    guestCount: row.guest_count,
    notes: row.notes || undefined,
    status: row.status,
    adminNote: row.admin_note || undefined,
  };
}

function mapSettingsFromDb(row: SettingsRow): SiteSettings {
  return {
    brandName: row.brand_name || fallbackSettings.brandName,
    phone: row.phone || fallbackSettings.phone,
    whatsappNumber: row.whatsapp_number || fallbackSettings.whatsappNumber,
    email: row.email || fallbackSettings.email,
    address: row.address || fallbackSettings.address,
    district: row.district || fallbackSettings.district,
    city: row.city || fallbackSettings.city,
    googleMapsUrl: row.google_maps_url || fallbackSettings.googleMapsUrl,
    googleMapsEmbedUrl: row.google_maps_embed_url || fallbackSettings.googleMapsEmbedUrl,
    checkInHour: row.check_in_hour || fallbackSettings.checkInHour,
    checkOutHour: row.check_out_hour || fallbackSettings.checkOutHour,
    heroAnnouncement: row.hero_announcement ?? fallbackSettings.heroAnnouncement,
    seoTitle: row.seo_title || fallbackSettings.seoTitle,
    seoDescription: row.seo_description || fallbackSettings.seoDescription,
    seoKeywords: row.seo_keywords || fallbackSettings.seoKeywords,
    instagramUrl: row.instagram_url ?? fallbackSettings.instagramUrl,
    startingPriceAmount: row.starting_price_amount ?? fallbackSettings.startingPriceAmount,
    hideExactPrices: row.hide_exact_prices ?? fallbackSettings.hideExactPrices,
  };
}

function mapSettingsToDb(data: Partial<SiteSettings>): Partial<SettingsRow> {
  const payload: Partial<SettingsRow> = {};
  if (data.brandName !== undefined) payload.brand_name = data.brandName;
  if (data.phone !== undefined) payload.phone = data.phone;
  if (data.whatsappNumber !== undefined) payload.whatsapp_number = data.whatsappNumber;
  if (data.email !== undefined) payload.email = data.email;
  if (data.address !== undefined) payload.address = data.address;
  if (data.district !== undefined) payload.district = data.district;
  if (data.city !== undefined) payload.city = data.city;
  if (data.googleMapsUrl !== undefined) payload.google_maps_url = data.googleMapsUrl;
  if (data.googleMapsEmbedUrl !== undefined)
    payload.google_maps_embed_url = data.googleMapsEmbedUrl;
  if (data.checkInHour !== undefined) payload.check_in_hour = data.checkInHour;
  if (data.checkOutHour !== undefined) payload.check_out_hour = data.checkOutHour;
  if (data.heroAnnouncement !== undefined) payload.hero_announcement = data.heroAnnouncement;
  if (data.seoTitle !== undefined) payload.seo_title = data.seoTitle;
  if (data.seoDescription !== undefined) payload.seo_description = data.seoDescription;
  if (data.seoKeywords !== undefined) payload.seo_keywords = data.seoKeywords;
  if (data.instagramUrl !== undefined) payload.instagram_url = data.instagramUrl || null;
  if (data.startingPriceAmount !== undefined)
    payload.starting_price_amount = data.startingPriceAmount;
  if (data.hideExactPrices !== undefined) payload.hide_exact_prices = data.hideExactPrices;
  return payload;
}

// ============================================================================
// Apartments API (Supabase PostgreSQL)
// ============================================================================

export async function fetchApartments(): Promise<Apartment[]> {
  if (!isSupabaseConfigured) {
    return fallbackApartments;
  }

  try {
    const { data, error } = await supabase
      .from('apartments')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []).map((row) => mapApartmentFromDb(row as ApartmentRow));
  } catch (err) {
    console.warn('Supabase apartments sorgu hatası, yerel yedek veri gösteriliyor:', err);
    return fallbackApartments;
  }
}

export async function fetchApartment(id: string): Promise<Apartment | null> {
  if (!isSupabaseConfigured) {
    return fallbackApartments.find((a) => a.id === id) || null;
  }

  try {
    const { data, error } = await supabase
      .from('apartments')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return null;
    return mapApartmentFromDb(data as ApartmentRow);
  } catch {
    return null;
  }
}

export async function createApartment(data: Partial<Apartment>): Promise<Apartment> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase yapılandırması (.env.local) eksik.');
  }

  const newId = data.id || `apt-${Date.now()}`;
  const newCode = data.code || `VGK-${Math.floor(100 + Math.random() * 900)}`;

  const dbPayload = mapApartmentToDb({
    ...data,
    id: newId,
    code: newCode,
  });

  const { data: inserted, error } = await supabase
    .from('apartments')
    .insert([dbPayload])
    .select()
    .single();

  if (error) {
    throw new Error(error.message || 'Daire oluşturulamadı');
  }

  return mapApartmentFromDb(inserted as ApartmentRow);
}

export async function updateApartment(id: string, data: Partial<Apartment>): Promise<Apartment> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase yapılandırması (.env.local) eksik.');
  }

  const dbPatch = mapApartmentToDb(data);
  delete dbPatch.id;

  const { data: updated, error } = await supabase
    .from('apartments')
    .update(dbPatch)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || 'Daire güncellenemedi');
  }

  return mapApartmentFromDb(updated as ApartmentRow);
}

export async function deleteApartment(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase yapılandırması (.env.local) eksik.');
  }

  const { error } = await supabase.from('apartments').delete().eq('id', id);
  if (error) {
    throw new Error(error.message || 'Daire silinemedi');
  }
  return true;
}

// ============================================================================
// Inquiries API (Supabase PostgreSQL)
// ============================================================================

export async function fetchInquiries(): Promise<Inquiry[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((row) => mapInquiryFromDb(row as InquiryRow));
  } catch (err) {
    console.warn('Supabase inquiries sorgu hatası:', err);
    return [];
  }
}

export async function submitInquiry(data: {
  fullName: string;
  phone: string;
  apartmentId: string;
  apartmentTitle: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  notes?: string;
}): Promise<{ success: boolean; message: string; inquiry: Inquiry }> {
  if (!data.fullName || !data.phone || !data.apartmentId || !data.checkInDate || !data.checkOutDate) {
    throw new Error('Lütfen zorunlu alanları eksiksiz doldurunuz.');
  }

  const sanitizedPhone = data.phone.replace(/\s+/g, '');
  if (sanitizedPhone.length < 10) {
    throw new Error('Geçerli bir telefon numarası giriniz.');
  }

  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `00000000-0000-4000-8000-${Date.now().toString().padStart(12, '0').slice(-12)}`;

  const code = `VGK-${Math.floor(1000 + Math.random() * 9000)}`;
  const createdAt = new Date().toISOString();

  const newInquiry: Inquiry = {
    id,
    code,
    createdAt,
    fullName: data.fullName.trim(),
    phone: data.phone.trim(),
    apartmentId: data.apartmentId,
    apartmentTitle: data.apartmentTitle || 'Genel Talep',
    checkInDate: data.checkInDate,
    checkOutDate: data.checkOutDate,
    guestCount: Number(data.guestCount) || 1,
    notes: data.notes ? data.notes.trim() : undefined,
    status: 'pending',
  };

  if (!isSupabaseConfigured) {
    throw new Error('Supabase yapılandırması (.env.local) eksik.');
  }

  // Note: Do NOT chain .select() here because public/anon visitors only have INSERT RLS permission
  const { error } = await supabase.from('inquiries').insert([
    {
      id: newInquiry.id,
      code: newInquiry.code,
      created_at: newInquiry.createdAt,
      full_name: newInquiry.fullName,
      phone: newInquiry.phone,
      apartment_id: newInquiry.apartmentId,
      apartment_title: newInquiry.apartmentTitle,
      check_in_date: newInquiry.checkInDate,
      check_out_date: newInquiry.checkOutDate,
      guest_count: newInquiry.guestCount,
      notes: newInquiry.notes || null,
      status: newInquiry.status,
    },
  ]);

  if (error) {
    throw new Error(error.message || 'Talep iletilemedi');
  }

  return {
    success: true,
    message: 'Rezervasyon talebiniz başarıyla alındı.',
    inquiry: newInquiry,
  };
}

export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus,
  adminNote?: string
): Promise<Inquiry> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase yapılandırması (.env.local) eksik.');
  }

  const patch: Partial<InquiryRow> = { status };
  if (adminNote !== undefined) {
    patch.admin_note = adminNote;
  }

  const { data, error } = await supabase
    .from('inquiries')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || 'Durum güncellenemedi');
  }

  return mapInquiryFromDb(data as InquiryRow);
}

export async function deleteInquiry(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase yapılandırması (.env.local) eksik.');
  }

  const { error } = await supabase.from('inquiries').delete().eq('id', id);
  if (error) {
    throw new Error(error.message || 'Talep silinemedi');
  }
  return true;
}

// ============================================================================
// Site Settings API (Supabase PostgreSQL - single row id = 1)
// ============================================================================

export async function fetchSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured) {
    return fallbackSettings;
  }

  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error || !data) return fallbackSettings;
    return mapSettingsFromDb(data as SettingsRow);
  } catch {
    return fallbackSettings;
  }
}

export async function updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase yapılandırması (.env.local) eksik.');
  }

  const dbPayload = {
    id: 1,
    ...mapSettingsToDb(data),
  };

  const { data: updated, error } = await supabase
    .from('settings')
    .upsert(dbPayload, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    throw new Error(error.message || 'Ayarlar kaydedilemedi');
  }

  return mapSettingsFromDb(updated as SettingsRow);
}

// ============================================================================
// Admin Auth API (Supabase Auth)
// ============================================================================

export async function adminLogin(
  email: string,
  password: string
): Promise<{ success: boolean; userEmail?: string; error?: string }> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Supabase ortam değişkenleri (.env.local) tanımlı değil.',
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.session) {
    const message = error?.message?.toLowerCase() || '';
    if (message.includes('invalid login credentials')) {
      return { success: false, error: 'E-posta adresi veya şifre hatalı.' };
    }
    if (message.includes('email not confirmed')) {
      return { success: false, error: 'Yönetici e-posta adresi henüz doğrulanmamış.' };
    }
    return {
      success: false,
      error: error?.message || 'Giriş yapılamadı. Bilgilerinizi kontrol edin.',
    };
  }

  return {
    success: true,
    userEmail: data.user?.email || email.trim(),
  };
}

export async function adminLogout(): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.auth.signOut();
}

export async function getAdminSession(): Promise<Session | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session;
}

export function onAdminAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}

// ============================================================================
// Photo Storage Upload API (Supabase Storage -> 'apartment-gallery')
// ============================================================================

function base64ToBlob(base64Input: string): { blob: Blob; ext: string } {
  let mimeType = 'image/jpeg';
  let ext = 'jpg';
  let base64Data = base64Input;

  if (base64Input.startsWith('data:')) {
    const match = base64Input.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      mimeType = match[1];
      base64Data = match[2];
      const sub = mimeType.split('/')[1] || 'jpg';
      ext = sub === 'jpeg' ? 'jpg' : sub === 'svg+xml' ? 'svg' : sub;
    }
  }

  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return { blob: new Blob([byteArray], { type: mimeType }), ext };
}

export async function uploadPhoto(
  input: File | string,
  filename?: string
): Promise<{ success: boolean; url: string; filename?: string }> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase yapılandırması (.env.local) eksik.');
  }

  let fileBody: File | Blob;
  let extension = 'jpg';
  let contentType = 'image/jpeg';

  if (typeof input === 'string') {
    const converted = base64ToBlob(input);
    fileBody = converted.blob;
    extension = converted.ext;
    contentType = converted.blob.type || 'image/jpeg';
  } else {
    fileBody = input;
    contentType = input.type || 'image/jpeg';
    const nameExt = input.name.split('.').pop()?.toLowerCase();
    if (nameExt) {
      extension = nameExt === 'jpeg' ? 'jpg' : nameExt;
    }
  }

  const rawName = filename || (typeof input !== 'string' ? input.name : 'gorsel');
  const baseName = rawName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 24) || 'foto';
  const uniqueName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${baseName}.${extension}`;
  const storagePath = `apartments/${uniqueName}`;

  const { data, error } = await supabase.storage
    .from(APARTMENT_GALLERY_BUCKET)
    .upload(storagePath, fileBody, {
      contentType,
      cacheControl: '3600',
      upsert: false,
    });

  if (error || !data) {
    throw new Error(error?.message || "Fotoğraf Supabase Storage'a yüklenemedi.");
  }

  const { data: publicUrlData } = supabase.storage
    .from(APARTMENT_GALLERY_BUCKET)
    .getPublicUrl(data.path);

  return {
    success: true,
    url: publicUrlData.publicUrl,
    filename: data.path,
  };
}

// ============================================================================
// WhatsApp Link Helpers
// ============================================================================

export function generateWhatsAppLink(cleanPhone: string, text: string): string {
  const sanitized = cleanPhone.replace(/\D/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${sanitized}?text=${encodedText}`;
}

export function getGeneralWhatsAppText(brandName: string): string {
  return `Merhaba, ${brandName} web sitenizden ulaşıyorum. Günlük kiralık daireleriniz ve müsaitlik hakkında bilgi alabilir miyim?`;
}

export function getApartmentWhatsAppText(
  brandName: string,
  apartmentTitle: string,
  code: string,
  dates?: { checkIn?: string; checkOut?: string; guests?: number }
): string {
  let msg = `Merhaba, ${brandName} web sitenizden ulaşıyorum.\n\nİlgilendiğim Daire: ${apartmentTitle} (Kod: ${code})`;
  if (dates?.checkIn && dates?.checkOut) {
    msg += `\nGiriş: ${dates.checkIn} - Çıkış: ${dates.checkOut}`;
  }
  if (dates?.guests) {
    msg += `\nKişi Sayısı: ${dates.guests} Kişi`;
  }
  msg += `\n\nBu tarihler için müsaitlik ve fiyat durumu hakkında bilgi alabilir miyim?`;
  return msg;
}
