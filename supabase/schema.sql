-- ============================================================================
-- Van Günlük Kiralık Daire — Supabase PostgreSQL, RLS & Storage Kurulum Scripti
-- Supabase Dashboard > SQL Editor üzerinde doğrudan çalıştırabilirsiniz.
-- ============================================================================

-- 1. EKLENTİLER
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. TABLOLAR

-- 2.1. Daireler Tablosu (apartments)
CREATE TABLE IF NOT EXISTS public.apartments (
  id TEXT PRIMARY KEY DEFAULT ('apt-' || floor(extract(epoch from now()) * 1000)::text),
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('1+0', '2+1', '3+1')),
  short_description TEXT NOT NULL DEFAULT '',
  full_description TEXT NOT NULL DEFAULT '',
  cover_image TEXT NOT NULL DEFAULT '',
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  location TEXT NOT NULL DEFAULT 'Van, İpekyolu',
  capacity INTEGER NOT NULL DEFAULT 2 CHECK (capacity >= 1),
  beds TEXT NOT NULL DEFAULT '',
  area_m2 INTEGER NOT NULL DEFAULT 40 CHECK (area_m2 >= 1),
  floor TEXT,
  price_per_night INTEGER,
  weekend_price INTEGER,
  weekly_discount_percent INTEGER,
  deposit_amount INTEGER,
  min_nights INTEGER DEFAULT 1,
  price_note TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
  rules JSONB NOT NULL DEFAULT '{"checkIn": "14:00 ve sonrası", "checkOut": "En geç 11:00", "smoking": false, "pets": false}'::jsonb,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.2. Rezervasyon Talepleri Tablosu (inquiries)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  apartment_id TEXT NOT NULL,
  apartment_title TEXT NOT NULL,
  check_in_date TEXT NOT NULL,
  check_out_date TEXT NOT NULL,
  guest_count INTEGER NOT NULL DEFAULT 1 CHECK (guest_count >= 1),
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'completed')),
  admin_note TEXT
);

-- 2.3. Site Ayarları Tablosu (settings — Tek satırlık yapı: id = 1)
CREATE TABLE IF NOT EXISTS public.settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  brand_name TEXT NOT NULL DEFAULT 'Van Günlük Kiralık Daire',
  phone TEXT NOT NULL DEFAULT '+90 542 180 23 72',
  whatsapp_number TEXT NOT NULL DEFAULT '905421802372',
  email TEXT NOT NULL DEFAULT 'iletisim@vangunlukkiralik.com',
  address TEXT NOT NULL DEFAULT 'İpekyolu Mevkii',
  district TEXT NOT NULL DEFAULT 'İpekyolu',
  city TEXT NOT NULL DEFAULT 'Van',
  google_maps_url TEXT NOT NULL DEFAULT 'https://maps.google.com/?q=Van+Merkez+Ipekyolu',
  google_maps_embed_url TEXT NOT NULL DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49942.3339178977!2d43.3444033!3d38.4945722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x401270c53d122dd1%3A0xe543fa00cb83cbb1!2sVan!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str',
  check_in_hour TEXT NOT NULL DEFAULT '14:00',
  check_out_hour TEXT NOT NULL DEFAULT '11:00',
  hero_announcement TEXT NOT NULL DEFAULT 'Van İpekyolu mevkiinde temiz, güvenli ve bağımsız 1+0, 2+1 ve 3+1 apart daireler.',
  seo_title TEXT NOT NULL DEFAULT 'Van Günlük Kiralık Daire | Merkezde Konforlu Konaklama',
  seo_description TEXT NOT NULL DEFAULT 'Van İpekyolu mevkiinde temiz, güvenli ve konforlu 1+0, 2+1 ve 3+1 günlük kiralık apart daireler. 1.500 TL''den başlayan fiyatlarla WhatsApp''tan bilgi alın.',
  seo_keywords TEXT NOT NULL DEFAULT 'van günlük kiralık daire, van günlük daire, van ipekyolu günlük kiralık daire, van apart konaklama, van 1+0 daire, van 2+1 daire, van 3+1 daire, van konaklama',
  instagram_url TEXT DEFAULT 'https://instagram.com/vangunlukkiralik',
  starting_price_amount INTEGER NOT NULL DEFAULT 1500,
  hide_exact_prices BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. OTOMATİK updated_at TRİGGER'I
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_apartments_updated_at ON public.apartments;
CREATE TRIGGER trg_apartments_updated_at
  BEFORE UPDATE ON public.apartments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_settings_updated_at ON public.settings;
CREATE TRIGGER trg_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. ROW LEVEL SECURITY (RLS) AKTİFLEŞTİRME
ALTER TABLE public.apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 5. RLS POLİTİKALARI

-- 5.1. apartments: Herkes okuyabilir (SELECT), sadece giriş yapmış admin düzenleyebilir
DROP POLICY IF EXISTS "Apartments are viewable by everyone" ON public.apartments;
CREATE POLICY "Apartments are viewable by everyone"
  ON public.apartments
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Only authenticated admin can insert apartments" ON public.apartments;
CREATE POLICY "Only authenticated admin can insert apartments"
  ON public.apartments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Only authenticated admin can update apartments" ON public.apartments;
CREATE POLICY "Only authenticated admin can update apartments"
  ON public.apartments
  FOR UPDATE
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Only authenticated admin can delete apartments" ON public.apartments;
CREATE POLICY "Only authenticated admin can delete apartments"
  ON public.apartments
  FOR DELETE
  TO authenticated
  USING (auth.role() = 'authenticated');

-- 5.2. settings: Herkes okuyabilir (SELECT), sadece giriş yapmış admin düzenleyebilir
DROP POLICY IF EXISTS "Settings are viewable by everyone" ON public.settings;
CREATE POLICY "Settings are viewable by everyone"
  ON public.settings
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Only authenticated admin can insert settings" ON public.settings;
CREATE POLICY "Only authenticated admin can insert settings"
  ON public.settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Only authenticated admin can update settings" ON public.settings;
CREATE POLICY "Only authenticated admin can update settings"
  ON public.settings
  FOR UPDATE
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Only authenticated admin can delete settings" ON public.settings;
CREATE POLICY "Only authenticated admin can delete settings"
  ON public.settings
  FOR DELETE
  TO authenticated
  USING (auth.role() = 'authenticated');

-- 5.3. inquiries: Herkes yeni talep ekleyebilir (INSERT), sadece giriş yapmış admin okuyup düzenleyebilir
DROP POLICY IF EXISTS "Anyone can submit booking inquiries" ON public.inquiries;
CREATE POLICY "Anyone can submit booking inquiries"
  ON public.inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Only authenticated admin can view inquiries" ON public.inquiries;
CREATE POLICY "Only authenticated admin can view inquiries"
  ON public.inquiries
  FOR SELECT
  TO authenticated
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Only authenticated admin can update inquiries" ON public.inquiries;
CREATE POLICY "Only authenticated admin can update inquiries"
  ON public.inquiries
  FOR UPDATE
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Only authenticated admin can delete inquiries" ON public.inquiries;
CREATE POLICY "Only authenticated admin can delete inquiries"
  ON public.inquiries
  FOR DELETE
  TO authenticated
  USING (auth.role() = 'authenticated');

-- 6. STORAGE BUCKET VE POLİTİKALARI ('apartment-gallery')
INSERT INTO storage.buckets (id, name, public)
VALUES ('apartment-gallery', 'apartment-gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read access for apartment-gallery" ON storage.objects;
CREATE POLICY "Public read access for apartment-gallery"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'apartment-gallery');

DROP POLICY IF EXISTS "Authenticated admin can upload to apartment-gallery" ON storage.objects;
CREATE POLICY "Authenticated admin can upload to apartment-gallery"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'apartment-gallery');

DROP POLICY IF EXISTS "Authenticated admin can update apartment-gallery" ON storage.objects;
CREATE POLICY "Authenticated admin can update apartment-gallery"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'apartment-gallery')
  WITH CHECK (bucket_id = 'apartment-gallery');

DROP POLICY IF EXISTS "Authenticated admin can delete from apartment-gallery" ON storage.objects;
CREATE POLICY "Authenticated admin can delete from apartment-gallery"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'apartment-gallery');

-- 7. BAŞLANGIÇ VERİLERİ (SEED DATA)

-- 7.1. Tek Satırlık Site Ayarları
INSERT INTO public.settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- 7.2. 6 Adet İpekyolu Apart Daire (2x 1+0, 2x 2+1, 2x 3+1)
INSERT INTO public.apartments (
  id, code, title, type, short_description, full_description, cover_image, gallery,
  location, capacity, beds, area_m2, floor, price_per_night, price_note, is_available,
  amenities, rules, featured
) VALUES
(
  'apt-ipekyolu-101',
  'VGK-101',
  'İpekyolu Apart — 1+0 Konfor Daire 1',
  '1+0',
  'Bireysel misafirler ve çiftler için pratik mutfak köşeli, temiz ve konforlu 1+0 apart daire.',
  'Van İpekyolu mevkiindeki tesisimizde yer alan 1+0 Konfor Daire 1, ferah aydınlatması, ortopedik yatağı ve düzenli yaşam alanıyla huzurlu bir şehir konaklaması sunar. Yüksek hızlı fiber internet, klima, 7/24 sıcak su ve temel mutfak gereçleriyle evinizin rahatlığını aratmaz.',
  '/src/assets/images/van_living_room_suite_1793882174207.jpg',
  '["/src/assets/images/van_living_room_suite_1793882174207.jpg","/src/assets/images/van_bedroom_deluxe_1793882175293.jpg","/src/assets/images/van_modern_kitchen_1793882174891.jpg"]'::jsonb,
  'Van, İpekyolu',
  2,
  '1 Çift Kişilik Ortopedik Yatak',
  40,
  '1. Kat',
  1500,
  '1.500 TL''den başlayan fiyatlar. Kesin fiyat tarihe göre WhatsApp''tan teyit edilir.',
  true,
  '["Yüksek Hızlı Fiber Wi-Fi","7/24 Kesintisiz Sıcak Su","Akıllı LED TV","Buzdolabı, Ocak & Mutfak Gereçleri","Kişiye Özel Hijyenik Havlu ve Çarşaf Seti","Saç Kurutma Makinesi ve Ütü","Merkezi Isıtma Sistemi","Bağımsız Güvenli Giriş"]'::jsonb,
  '{"checkIn":"14:00 ve sonrası","checkOut":"En geç 11:00","smoking":false,"pets":false}'::jsonb,
  true
),
(
  'apt-ipekyolu-102',
  'VGK-102',
  'İpekyolu Apart — 1+0 Ferah Daire 2',
  '1+0',
  'Sessiz, gün ışığı alan, eksiksiz ev donanımına sahip 1+0 apart daire.',
  'Van İpekyolu mevkiinde bulunan 1+0 Ferah Daire 2, iş seyahatleri ve kısa süreli Van ziyaretleri için özenle hazırlanmıştır. Her konaklama öncesi profesyonel hijyen protokolü uygulanır; temiz tekstil ürünleri ve kullanışlı mutfak alanı ile konforlu bir ortam sunar.',
  '/src/assets/images/van_bedroom_deluxe_1793882175293.jpg',
  '["/src/assets/images/van_bedroom_deluxe_1793882175293.jpg","/src/assets/images/van_living_room_suite_1793882174207.jpg","/src/assets/images/van_modern_kitchen_1793882174891.jpg"]'::jsonb,
  'Van, İpekyolu',
  2,
  '1 Çift Kişilik Ortopedik Yatak',
  42,
  '2. Kat (Asansörlü)',
  1500,
  '1.500 TL''den başlayan fiyatlar. Kesin fiyat tarihe göre WhatsApp''tan teyit edilir.',
  true,
  '["Yüksek Hızlı Fiber Wi-Fi","Klima & Merkezi Isıtma","7/24 Kesintisiz Sıcak Su","Akıllı TV & Çalışma Alanı","Mini Buzdolabı, Kettle & Mutfak Gereçleri","Temiz Havlu ve Nevresim Takımı","Saç Kurutma Makinesi","Bağımsız Güvenli Giriş"]'::jsonb,
  '{"checkIn":"14:00 ve sonrası","checkOut":"En geç 11:00","smoking":false,"pets":false}'::jsonb,
  false
),
(
  'apt-ipekyolu-201',
  'VGK-201',
  'İpekyolu Apart — 2+1 Aile Dairesi 1',
  '2+1',
  'İki ayrı yatak odası, geniş salonu ve tam donanımlı mutfağıyla aileler için ideal 2+1 daire.',
  'Van İpekyolu mevkiinde yer alan 2+1 Aile Dairesi 1, geniş oturma odası ve iki ayrı yatak odasıyla aileler ile kalabalık misafirler için ferah bir yaşam alanı sunar. Çamaşır makinesi, ankastre mutfak ve yüksek hijyen standartlarıyla evinizdeki düzeni konaklama boyunca sürdürebilirsiniz.',
  '/src/assets/images/van_luxury_apartment_hero_1793882173766.jpg',
  '["/src/assets/images/van_luxury_apartment_hero_1793882173766.jpg","/src/assets/images/van_bedroom_deluxe_1793882175293.jpg","/src/assets/images/van_modern_kitchen_1793882174891.jpg","/src/assets/images/van_living_room_suite_1793882174207.jpg"]'::jsonb,
  'Van, İpekyolu',
  4,
  '1 Çift Kişilik Yatak + 2 Tek Kişilik Yatak',
  80,
  '3. Kat (Asansörlü)',
  2000,
  'Kesin fiyat konaklama tarihine göre WhatsApp üzerinden teyit edilir.',
  true,
  '["Yüksek Hızlı Fiber Wi-Fi","Inverter Sessiz Klima","7/24 Kesintisiz Sıcak Su","Akıllı 4K LED TV","Buzdolabı, Ankastre Ocak & Mutfak Gereçleri","Çamaşır Makinesi & Kurutmalık","Kişiye Özel Hijyenik Havlu ve Çarşaf Seti","Saç Kurutma Makinesi ve Ütü"]'::jsonb,
  '{"checkIn":"14:00 ve sonrası","checkOut":"En geç 11:00","smoking":false,"pets":false}'::jsonb,
  true
),
(
  'apt-ipekyolu-202',
  'VGK-202',
  'İpekyolu Apart — 2+1 Balkonlu Daire 2',
  '2+1',
  'Geniş balkon alanı, ferah salonu ve tam teşekküllü mutfağıyla konforlu 2+1 apart daire.',
  'Van İpekyolu mevkiindeki tesisimizde bulunan 2+1 Balkonlu Daire 2, doğal gün ışığı alan geniş pencereleri ve balkon terası ile öne çıkar. Ailelerin ve arkadaş gruplarının rahatlığı için seçilen ortopedik yataklar, çamaşır ve mutfak ekipmanları ile kusursuz bir konaklama deneyimi sunar.',
  '/src/assets/images/van_lake_view_balcony_1793882175493.jpg',
  '["/src/assets/images/van_lake_view_balcony_1793882175493.jpg","/src/assets/images/van_living_room_suite_1793882174207.jpg","/src/assets/images/van_bedroom_deluxe_1793882175293.jpg","/src/assets/images/van_modern_kitchen_1793882174891.jpg"]'::jsonb,
  'Van, İpekyolu',
  5,
  '1 Çift Kişilik + 2 Tek Kişilik Yatak + 1 Kanepe',
  85,
  '4. Kat (Asansörlü)',
  2200,
  'Kesin fiyat konaklama tarihine göre WhatsApp üzerinden teyit edilir.',
  true,
  '["Geniş Balkon","Ultra Hızlı Fiber Wi-Fi","Her Odada Bağımsız Isıtma","Modern Mutfak & Bulaşık Makinesi","Büyük Ekran Akıllı TV","Çamaşır Makinesi, Ütü & Askılık","7/24 Kesintisiz Sıcak Su","Yüksek Hijyen Standartlı Tekstil"]'::jsonb,
  '{"checkIn":"14:00 ve sonrası","checkOut":"En geç 11:00","smoking":false,"pets":false}'::jsonb,
  true
),
(
  'apt-ipekyolu-301',
  'VGK-301',
  'İpekyolu Apart — 3+1 Geniş Aile Dairesi 1',
  '3+1',
  'Üç ayrı yatak odası ve geniş oturma salonuyla kalabalık aileler için ferah 3+1 daire.',
  'Van İpekyolu mevkiinde yer alan 3+1 Geniş Aile Dairesi 1, 115 m² kullanım alanıyla büyük aileler ve uzun süreli grup konaklamaları için tasarlanmıştır. Üç ayrı yatak odası, geniş yemek masalı mutfağı ve tam ev donanımıyla tüm misafirlerinize rahat bir alan sunar.',
  '/src/assets/images/van_modern_kitchen_1793882174891.jpg',
  '["/src/assets/images/van_modern_kitchen_1793882174891.jpg","/src/assets/images/van_luxury_apartment_hero_1793882173766.jpg","/src/assets/images/van_bedroom_deluxe_1793882175293.jpg","/src/assets/images/van_living_room_suite_1793882174207.jpg"]'::jsonb,
  'Van, İpekyolu',
  6,
  '2 Çift Kişilik Yatak + 2 Tek Kişilik Yatak',
  115,
  '4. Kat (Asansörlü)',
  2800,
  'Kalabalık aileler için avantajlı 3+1 konaklama. Net fiyat WhatsApp''tan teyit edilir.',
  true,
  '["3 Ayrı Yatak Odası & Geniş Salon","Yüksek Hızlı Fiber Wi-Fi","Tam Teşekküllü Mutfak & Fırın","Çamaşır & Bulaşık Makinesi","2 Banyo / 7/24 Sıcak Su","Büyük Ekran Akıllı TV","Merkezi Isıtma & Klima","Ütü ve Saç Kurutma Makinesi"]'::jsonb,
  '{"checkIn":"14:00 ve sonrası","checkOut":"En geç 11:00","smoking":false,"pets":false}'::jsonb,
  true
),
(
  'apt-ipekyolu-302',
  'VGK-302',
  'İpekyolu Apart — 3+1 Teraslı Daire 2',
  '3+1',
  'Geniş teras balkonu, 3 yatak odası ve yüksek konfor donanımıyla en geniş 3+1 apart dairemiz.',
  'Van İpekyolu mevkiinde bulunan 3+1 Teraslı Daire 2, 120 m² ferah planı ve geniş balkonuyla kalabalık ailelerin tüm beklentilerini karşılar. Ses yalıtımlı pencereleri, tam donanımlı mutfağı, yüksek hijyen standartları ve merkezi konumuyla ev sıcaklığında konaklama sağlar.',
  '/src/assets/images/van_lake_view_balcony_1793882175493.jpg',
  '["/src/assets/images/van_lake_view_balcony_1793882175493.jpg","/src/assets/images/van_luxury_apartment_hero_1793882173766.jpg","/src/assets/images/van_bedroom_deluxe_1793882175293.jpg","/src/assets/images/van_modern_kitchen_1793882174891.jpg"]'::jsonb,
  'Van, İpekyolu',
  7,
  '2 Çift Kişilik + 2 Tek Kişilik Yatak + 1 Dinlenme Koltuğu',
  120,
  '5. Kat (Asansörlü)',
  3000,
  'Geniş aile ve grup konaklamaları için WhatsApp''tan müsaitlik alınız.',
  true,
  '["Geniş Teras Balkon","3 Ayrı Yatak Odası","Yüksek Hızlı Fiber Wi-Fi","Full Ankastre Mutfak & Yemek Takımı","Çamaşır Makinesi & Kurutma","Büyük Ekran Smart TV","7/24 Telefon / WhatsApp Destek","Bağımsız Güvenli Giriş"]'::jsonb,
  '{"checkIn":"14:00 ve sonrası","checkOut":"En geç 11:00","smoking":false,"pets":false}'::jsonb,
  true
)
ON CONFLICT (id) DO NOTHING;
