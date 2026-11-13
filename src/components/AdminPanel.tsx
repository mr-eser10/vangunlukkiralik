import React, { useState, useEffect, useRef } from 'react';
import { Apartment, Inquiry, SiteSettings, RoomType, InquiryStatus } from '../types';
import {
  adminLogin,
  adminLogout,
  getAdminSession,
  onAdminAuthStateChange,
  createApartment,
  updateApartment,
  deleteApartment,
  fetchInquiries,
  updateInquiryStatus,
  deleteInquiry,
  updateSettings,
  uploadPhoto,
  generateWhatsAppLink
} from '../services/api';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  X,
  Lock,
  Mail,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  MessageCircle,
  Phone,
  LogOut,
  RefreshCw,
  Save,
  Clock,
  MapPin,
  Upload,
  Image as ImageIcon,
  Star,
  ArrowLeft,
  ArrowRight,
  Sliders,
  DollarSign,
  AlertCircle,
  Check
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  apartments: Apartment[];
  settings: SiteSettings;
  onRefreshData: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  apartments,
  settings,
  onRefreshData,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'apartments' | 'inquiries' | 'settings' | 'seo'>('apartments');

  // Inquiries State
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [inquiryFilter, setInquiryFilter] = useState<string>('all');
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  // Edit / Add Apartment Modal State
  const [editingApartment, setEditingApartment] = useState<Partial<Apartment> | null>(null);
  const [isNewApartment, setIsNewApartment] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [newAmenityInput, setNewAmenityInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editable Settings State
  const [tempSettings, setTempSettings] = useState<SiteSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  // Supabase Auth Session Check & Listener
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      setAuthChecking(true);
      try {
        const session = await getAdminSession();
        if (!isMounted) return;
        setIsAuthenticated(Boolean(session));
        setAdminEmail(session?.user?.email || '');
      } catch {
        if (!isMounted) return;
        setIsAuthenticated(false);
        setAdminEmail('');
      } finally {
        if (isMounted) setAuthChecking(false);
      }
    };

    checkSession();

    const { data } = onAdminAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setIsAuthenticated(Boolean(session));
      setAdminEmail(session?.user?.email || '');
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      loadInquiriesList();
    }
  }, [isAuthenticated, isOpen]);

  const loadInquiriesList = async () => {
    setLoadingInquiries(true);
    try {
      const data = await fetchInquiries();
      setInquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoggingIn(true);
    try {
      const res = await adminLogin(email, password);
      if (res.success) {
        setIsAuthenticated(true);
        setAdminEmail(res.userEmail || email);
        setPassword('');
        loadInquiriesList();
      } else {
        setAuthError(res.error || 'E-posta veya şifre hatalı');
      }
    } catch {
      setAuthError('Supabase kimlik doğrulama servisine bağlanılamadı');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    setIsAuthenticated(false);
    setAdminEmail('');
    setInquiries([]);
  };

  // Apartment CRUD
  const handleSaveApartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApartment || !editingApartment.title) {
      alert('Lütfen daire adını doldurunuz.');
      return;
    }

    // Ensure gallery has at least coverImage or fallback
    const gallery = editingApartment.gallery && editingApartment.gallery.length > 0
      ? editingApartment.gallery
      : [editingApartment.coverImage || '/src/assets/images/van_luxury_apartment_hero_1793882173766.jpg'];

    const coverImage = editingApartment.coverImage || gallery[0];

    const payload = {
      ...editingApartment,
      gallery,
      coverImage,
    };

    try {
      if (isNewApartment) {
        await createApartment(payload);
      } else if (editingApartment.id) {
        await updateApartment(editingApartment.id, payload);
      }
      setEditingApartment(null);
      onRefreshData();
    } catch (err) {
      alert('Daire kaydedilirken hata oluştu.');
    }
  };

  const handleDeleteApartment = async (id: string) => {
    if (confirm('Bu daireyi ve ilgili tüm verilerini silmek istediğinize emin misiniz?')) {
      await deleteApartment(id);
      onRefreshData();
    }
  };

  // Quick Price / Availability Update
  const handleQuickAvailabilityToggle = async (apt: Apartment) => {
    try {
      await updateApartment(apt.id, { isAvailable: !apt.isAvailable });
      onRefreshData();
    } catch (err) {
      alert('Müsaitlik güncellenemedi.');
    }
  };

  const handleQuickPriceUpdate = async (apt: Apartment, newPrice: number) => {
    if (isNaN(newPrice) || newPrice < 0) return;
    try {
      await updateApartment(apt.id, { pricePerNight: newPrice });
      onRefreshData();
    } catch (err) {
      alert('Fiyat güncellenemedi.');
    }
  };

  // Photo Management functions for the currently editing apartment
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingApartment) return;

    setUploadingImage(true);
    try {
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadRes = await uploadPhoto(file, file.name);
        if (uploadRes.success && uploadRes.url) {
          newUrls.push(uploadRes.url);
        }
      }

      if (newUrls.length > 0) {
        const currentGallery = editingApartment.gallery || [];
        const updatedGallery = [...currentGallery, ...newUrls];
        const cover = editingApartment.coverImage || updatedGallery[0];
        setEditingApartment({
          ...editingApartment,
          gallery: updatedGallery,
          coverImage: cover
        });
      }
    } catch (err: any) {
      alert('Görsel yüklenirken hata oluştu: ' + (err.message || 'Bilinmeyen hata'));
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim() || !editingApartment) return;
    const currentGallery = editingApartment.gallery || [];
    const updatedGallery = [...currentGallery, imageUrlInput.trim()];
    const cover = editingApartment.coverImage || updatedGallery[0];
    setEditingApartment({
      ...editingApartment,
      gallery: updatedGallery,
      coverImage: cover
    });
    setImageUrlInput('');
  };

  const handleRemovePhoto = (index: number) => {
    if (!editingApartment) return;
    const currentGallery = [...(editingApartment.gallery || [])];
    const removedUrl = currentGallery[index];
    currentGallery.splice(index, 1);

    // If removed photo was cover, select next available or empty
    let newCover = editingApartment.coverImage;
    if (newCover === removedUrl) {
      newCover = currentGallery[0] || '';
    }

    setEditingApartment({
      ...editingApartment,
      gallery: currentGallery,
      coverImage: newCover
    });
  };

  const handleSetCoverPhoto = (url: string) => {
    if (!editingApartment) return;
    setEditingApartment({
      ...editingApartment,
      coverImage: url
    });
  };

  const handleMovePhoto = (fromIdx: number, toIdx: number) => {
    if (!editingApartment || !editingApartment.gallery) return;
    const gallery = [...editingApartment.gallery];
    if (toIdx < 0 || toIdx >= gallery.length) return;
    const item = gallery.splice(fromIdx, 1)[0];
    gallery.splice(toIdx, 0, item);
    setEditingApartment({
      ...editingApartment,
      gallery
    });
  };

  // Amenities management inside apartment edit modal
  const handleAddAmenity = () => {
    if (!newAmenityInput.trim() || !editingApartment) return;
    const current = editingApartment.amenities || [];
    if (!current.includes(newAmenityInput.trim())) {
      setEditingApartment({
        ...editingApartment,
        amenities: [...current, newAmenityInput.trim()]
      });
    }
    setNewAmenityInput('');
  };

  const handleRemoveAmenity = (amenity: string) => {
    if (!editingApartment) return;
    setEditingApartment({
      ...editingApartment,
      amenities: (editingApartment.amenities || []).filter((a) => a !== amenity)
    });
  };

  // Inquiry actions
  const handleStatusChange = async (id: string, newStatus: InquiryStatus) => {
    try {
      await updateInquiryStatus(id, newStatus);
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
      );
    } catch {
      alert('Durum güncellenemedi');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (confirm('Bu talebi silmek istediğinize emin misiniz?')) {
      await deleteInquiry(id);
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(tempSettings);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
      onRefreshData();
    } catch {
      alert('Ayarlar kaydedilemedi.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden sm:overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-0 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full h-[100dvh] sm:h-auto sm:max-w-5xl bg-white rounded-none sm:rounded-3xl overflow-hidden shadow-2xl border-0 sm:border border-[#DCCDB9]/80 my-0 sm:my-6 flex flex-col sm:max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#18222F] text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-[#F7F5F0] px-2 py-1 rounded-lg border border-[#D8C29E]/60 shrink-0">
              <img
                src="/assets/aistudio/Van_G_nl_k_Kiral_k_Daire_3D_Logosu_f1b36505.png"
                alt="Van Günlük Kiralık Daire"
                className="h-7 sm:h-8 w-auto object-contain mix-blend-multiply"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury text-sm sm:text-base font-bold leading-tight truncate">
                  Gizli Yönetim Konsolu
                </h3>
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-medium border border-emerald-800 whitespace-nowrap">
                  Supabase Auth
                </span>
              </div>
              <span className="text-[11px] text-[#A9D9E1] font-medium tracking-wide block truncate">
                {isAuthenticated && adminEmail ? adminEmail : 'Mobil & Masaüstü Yönetim'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-xs text-rose-300 hover:text-white flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg bg-white/10 hover:bg-rose-900/40 transition-colors"
                title="Yönetim Çıkışı"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Çıkış</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Check View */}
        {authChecking ? (
          <div className="p-12 text-center max-w-md mx-auto my-auto w-full">
            <RefreshCw className="w-7 h-7 animate-spin text-[#63B9C5] mx-auto mb-3" />
            <p className="text-xs text-[#18222F]/70 font-medium">
              Yönetici oturumu kontrol ediliyor...
            </p>
          </div>
        ) : !isAuthenticated ? (
          <div className="p-6 sm:p-12 text-center max-w-md mx-auto my-auto w-full overflow-y-auto">
            <div className="inline-block bg-[#F7F5F0] px-4 py-2.5 rounded-2xl border border-[#D8C29E]/60 mx-auto mb-5 shadow-xs">
              <img
                src="/assets/aistudio/Van_G_nl_k_Kiral_k_Daire_3D_Logosu_f1b36505.png"
                alt="Van Günlük Kiralık Daire Logosu"
                className="h-14 w-auto object-contain mix-blend-multiply"
              />
            </div>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#18222F] mb-2">
              Yönetici Girişi
            </h3>
            <p className="text-xs text-[#18222F]/70 mb-6 leading-relaxed">
              Dairelerin görsellerini düzenlemek, fiyatları ve talepleri yönetmek için yönetici hesabınızla giriş yapın.
            </p>

            {!isSupabaseConfigured && (
              <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 text-left flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>
                  <strong>Yapılandırma Eksik:</strong> <code className="bg-amber-100 px-1 rounded">.env.local</code> içinde <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_URL</code> ve <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> tanımlı değil.
                </span>
              </div>
            )}

            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3.5 text-left">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#18222F]/40" />
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="Yönetici E-posta Adresi"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 min-h-[44px] text-sm sm:text-xs bg-[#F7F5F0] border border-[#DCCDB9] rounded-xl focus:outline-none focus:border-[#63B9C5] text-[#18222F]"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#18222F]/40" />
                <input
                  type="password"
                  required
                  placeholder="Yönetici Şifresi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 min-h-[44px] text-sm sm:text-xs bg-[#F7F5F0] border border-[#DCCDB9] rounded-xl focus:outline-none focus:border-[#63B9C5] text-[#18222F]"
                />
              </div>
              <button
                type="submit"
                disabled={loggingIn}
                className="w-full py-3.5 min-h-[44px] text-xs font-semibold text-white bg-[#18222F] hover:bg-[#63B9C5] rounded-xl transition-all shadow-md disabled:opacity-50"
              >
                {loggingIn ? 'Giriş Yapılıyor...' : 'Yönetim Paneline Giriş Yap'}
              </button>
            </form>

            <div className="mt-6 p-3.5 rounded-xl bg-[#F7F5F0] border border-[#DCCDB9]/60 text-[11px] text-[#18222F]/70 text-left space-y-1">
              <div className="font-semibold text-[#18222F]">📱 Telefondan Gizli Erişim:</div>
              <div>• Adres sonuna <code className="bg-[#EAE5DC] px-1 py-0.5 rounded text-[#18222F]">#admin</code> ekleyip sık kullanılanlara kaydedebilirsiniz.</div>
              <div>• Üstteki logoya art arda <strong>5 kez</strong> dokunarak veya sayfa altındaki <strong>Tüm hakları saklıdır.</strong> yazısına dokunarak açabilirsiniz.</div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex flex-col flex-1 overflow-hidden">
            
            {/* Nav Tabs (Mobile Scrollable Touch Bar) */}
            <div className="flex items-center gap-1.5 px-3 sm:px-6 py-2.5 bg-[#F7F5F0] border-b border-[#DCCDB9]/60 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('apartments')}
                className={`px-3.5 py-2.5 min-h-[40px] text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  activeTab === 'apartments'
                    ? 'bg-white text-[#18222F] shadow-xs'
                    : 'text-[#18222F]/70 hover:text-[#18222F]'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#63B9C5]" />
                <span>Daireler & Görseller ({apartments.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`px-3.5 py-2.5 min-h-[40px] text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  activeTab === 'inquiries'
                    ? 'bg-white text-[#18222F] shadow-xs'
                    : 'text-[#18222F]/70 hover:text-[#18222F]'
                }`}
              >
                <span>Talepler</span>
                {inquiries.filter((i) => i.status === 'pending').length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                    {inquiries.filter((i) => i.status === 'pending').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3.5 py-2.5 min-h-[40px] text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'settings'
                    ? 'bg-white text-[#18222F] shadow-xs'
                    : 'text-[#18222F]/70 hover:text-[#18222F]'
                }`}
              >
                Fiyat & WhatsApp Ayarı
              </button>

              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3.5 py-2.5 min-h-[40px] text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'overview'
                    ? 'bg-white text-[#18222F] shadow-xs'
                    : 'text-[#18222F]/70 hover:text-[#18222F]'
                }`}
              >
                Özet & Erişim
              </button>

              <button
                onClick={() => setActiveTab('seo')}
                className={`px-3.5 py-2.5 min-h-[40px] text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'seo'
                    ? 'bg-white text-[#18222F] shadow-xs'
                    : 'text-[#18222F]/70 hover:text-[#18222F]'
                }`}
              >
                SEO
              </button>
            </div>

            {/* Main Scrollable View */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-7 bg-[#FAF9F5]">
              
              {/* TAB: APARTMENTS, PHOTOS & PRICING */}
              {activeTab === 'apartments' && (
                <div className="space-y-5">
                  
                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 bg-white p-4 rounded-2xl border border-[#DCCDB9]/60 shadow-xs">
                    <div>
                      <h4 className="text-sm font-bold text-[#18222F]">
                        Daire Listesi, Fotoğraflar ve Fiyatlandırma
                      </h4>
                      <p className="text-xs text-[#18222F]/65 mt-0.5">
                        {settings.hideExactPrices !== false
                          ? `Şu anda sitede net fiyat gizli; tüm dairelerde "${(settings.startingPriceAmount || 1500).toLocaleString('tr-TR')} TL'den başlayan fiyatlar" gösteriliyor.`
                          : 'Şu anda dairelere özel başlangıç fiyatları gösteriliyor.'}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsNewApartment(true);
                        setEditingApartment({
                          title: '',
                          code: `VGK-${Math.floor(100 + Math.random() * 900)}`,
                          type: '1+0',
                          shortDescription: '',
                          fullDescription: '',
                          coverImage: apartments[0]?.coverImage || '',
                          gallery: [apartments[0]?.coverImage || ''],
                          location: 'Van, İpekyolu',
                          capacity: 2,
                          beds: '1 Çift Kişilik Yatak',
                          areaM2: 55,
                          pricePerNight: settings.startingPriceAmount || 1500,
                          weekendPrice: null,
                          weeklyDiscountPercent: null,
                          priceNote: 'Kesin fiyat tarihe göre WhatsApp üzerinden teyit edilir.',
                          isAvailable: true,
                          amenities: ['Wi-Fi', 'Klima', '7/24 Sıcak Su', 'Mutfak', 'Akıllı TV'],
                          rules: { checkIn: '14:00', checkOut: '11:00', smoking: false, pets: false }
                        });
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 min-h-[44px] text-xs font-semibold text-white bg-[#18222F] hover:bg-[#63B9C5] rounded-xl transition-all shadow-sm shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Yeni Daire Ekle</span>
                    </button>
                  </div>

                  {/* Apartment Cards */}
                  <div className="grid grid-cols-1 gap-4">
                    {apartments.map((apt) => {
                      return (
                        <div
                          key={apt.id}
                          className="p-4 sm:p-5 rounded-2xl bg-white border border-[#DCCDB9]/70 shadow-xs flex flex-col md:flex-row gap-4 sm:gap-5 items-stretch md:items-center justify-between"
                        >
                          {/* Image Thumbnail and Details */}
                          <div className="flex gap-3.5 sm:gap-4 items-start sm:items-center flex-1 min-w-0">
                            <div className="relative w-24 h-24 sm:w-28 sm:h-24 rounded-xl overflow-hidden bg-[#EAE5DC] border border-[#DCCDB9]/60 shrink-0">
                              <img
                                src={apt.coverImage}
                                alt={apt.title}
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                                {apt.gallery?.length || 1} Foto
                              </span>
                            </div>

                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#18222F] text-white font-mono">
                                  {apt.code}
                                </span>
                                <h4 className="text-sm font-bold text-[#18222F] leading-snug">
                                  {apt.title}
                                </h4>
                              </div>

                              <div className="text-xs text-[#18222F]/70">
                                {apt.type} · {apt.capacity} Kişi · {apt.areaM2} m²
                              </div>

                              {/* Price tags */}
                              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                <span className="text-xs font-semibold text-[#18222F] bg-[#F7F5F0] border border-[#DCCDB9] px-2.5 py-1 rounded-md tabular-nums">
                                  {settings.hideExactPrices !== false
                                    ? `${(settings.startingPriceAmount || 1500).toLocaleString('tr-TR')} TL'den başlayan (Genel)`
                                    : apt.pricePerNight
                                    ? `${apt.pricePerNight.toLocaleString('tr-TR')} TL'den başlayan`
                                    : 'WhatsApp\'tan Sorunuz'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Controls & Actions (Mobile Full-Width Stack) */}
                          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-[#DCCDB9]/40">
                            <button
                              type="button"
                              onClick={() => handleQuickAvailabilityToggle(apt)}
                              className={`px-3 py-2 min-h-[42px] text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 ${
                                apt.isAvailable
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${apt.isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                              <span>{apt.isAvailable ? 'Müsait' : 'Dolu'}</span>
                            </button>

                            <button
                              onClick={() => {
                                setIsNewApartment(false);
                                setEditingApartment({ ...apt });
                              }}
                              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[42px] text-xs font-semibold text-white bg-[#18222F] hover:bg-[#63B9C5] rounded-xl transition-all shadow-xs whitespace-nowrap"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Görseller & Fiyatı Düzenle</span>
                            </button>

                            <button
                              onClick={() => handleDeleteApartment(apt.id)}
                              className="p-2.5 min-w-[42px] min-h-[42px] flex items-center justify-center text-rose-500 hover:text-white hover:bg-rose-600 rounded-xl transition-colors border border-rose-200"
                              title="Daireyi Sil"
                              aria-label="Daireyi Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB: INQUIRIES */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#DCCDB9]/60">
                    <div className="flex items-center gap-1.5">
                      {['all', 'pending', 'confirmed', 'rejected', 'completed'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setInquiryFilter(st)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                            inquiryFilter === st
                              ? 'bg-[#18222F] text-white'
                              : 'bg-[#F7F5F0] text-[#18222F]/70 hover:bg-[#DCCDB9]/40'
                          }`}
                        >
                          {st === 'all' ? 'Tümü' :
                           st === 'pending' ? 'Bekleyenler' :
                           st === 'confirmed' ? 'Onaylananlar' :
                           st === 'rejected' ? 'Reddedilenler' : 'Tamamlananlar'}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={loadInquiriesList}
                      className="p-2 text-xs text-[#18222F]/70 hover:text-[#18222F] flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Yenile</span>
                    </button>
                  </div>

                  {inquiries.length === 0 ? (
                    <div className="p-10 text-center bg-white rounded-2xl border border-[#DCCDB9]/60 text-xs text-[#18222F]/70">
                      Henüz herhangi bir talep bulunmamaktadır.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {inquiries
                        .filter((i) => inquiryFilter === 'all' || i.status === inquiryFilter)
                        .map((inq) => {
                          const directWhatsApp = generateWhatsAppLink(
                            inq.phone,
                            `Merhaba Sayın ${inq.fullName},\nVan Günlük Kiralık Daire'den ulaşıyoruz.\n${inq.code} kodlu talebiniz doğrultusunda ${inq.apartmentTitle} için ${inq.checkInDate} - ${inq.checkOutDate} tarihleri arasındaki konaklama detaylarını teyit etmek isteriz.`
                          );

                          return (
                            <div
                              key={inq.id}
                              className="p-5 rounded-2xl bg-white border border-[#DCCDB9]/70 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                              <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-[#18222F]">
                                    {inq.fullName}
                                  </span>
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#F7F5F0] border border-[#DCCDB9] font-mono font-semibold">
                                    {inq.code}
                                  </span>
                                  <span className="text-[11px] text-[#18222F]/50">
                                    ({new Date(inq.createdAt).toLocaleDateString('tr-TR')} {new Date(inq.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })})
                                  </span>
                                </div>

                                <div className="text-xs text-[#18222F]/80">
                                  <strong>Daire:</strong> {inq.apartmentTitle}
                                </div>

                                <div className="text-xs text-[#18222F]/70 flex flex-wrap gap-3">
                                  <span>📅 {inq.checkInDate} - {inq.checkOutDate}</span>
                                  <span>👥 {inq.guestCount} Kişi</span>
                                  <span>📞 {inq.phone}</span>
                                </div>

                                {inq.notes && (
                                  <div className="text-xs text-[#18222F]/75 bg-[#F7F5F0] p-2.5 rounded-xl border border-[#DCCDB9]/40 italic">
                                    "{inq.notes}"
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex flex-wrap items-center gap-2 shrink-0">
                                <a
                                  href={directWhatsApp}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-2 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl flex items-center gap-1.5 shadow-xs"
                                  title="Müşteriye WhatsApp'tan Mesaj Yaz"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                                  <span>WhatsApp</span>
                                </a>

                                <a
                                  href={`tel:${inq.phone.replace(/\s+/g, '')}`}
                                  className="px-3 py-2 text-xs font-semibold text-[#18222F] bg-[#F7F5F0] hover:bg-[#DCCDB9]/40 border border-[#DCCDB9] rounded-xl flex items-center gap-1.5"
                                  title="Müşteriyi Telefonla Ara"
                                >
                                  <Phone className="w-3.5 h-3.5 text-[#63B9C5]" />
                                  <span>Ara</span>
                                </a>

                                <select
                                  value={inq.status}
                                  onChange={(e) => handleStatusChange(inq.id, e.target.value as InquiryStatus)}
                                  className="px-3 py-2 text-xs bg-[#F7F5F0] border border-[#DCCDB9] rounded-xl font-medium focus:outline-none"
                                >
                                  <option value="pending">Beklemede</option>
                                  <option value="confirmed">Onaylandı</option>
                                  <option value="rejected">Reddedildi</option>
                                  <option value="completed">Tamamlandı</option>
                                </select>

                                <button
                                  onClick={() => handleDeleteInquiry(inq.id)}
                                  className="p-2 text-rose-500 hover:text-white hover:bg-rose-600 rounded-xl transition-colors border border-rose-200"
                                  title="Talebi Sil"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-white border border-[#DCCDB9]/60">
                      <span className="text-xs text-[#18222F]/60 block mb-1">Toplam Daire</span>
                      <div className="text-3xl font-bold font-serif-luxury text-[#18222F]">
                        {apartments.length}
                      </div>
                      <span className="text-[11px] text-emerald-600 font-medium">
                        {apartments.filter((a) => a.isAvailable).length} Daire Müsait
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-[#DCCDB9]/60">
                      <span className="text-xs text-[#18222F]/60 block mb-1">Bekleyen Talepler</span>
                      <div className="text-3xl font-bold font-serif-luxury text-amber-600">
                        {inquiries.filter((i) => i.status === 'pending').length}
                      </div>
                      <span className="text-[11px] text-[#18222F]/60">
                        Toplam {inquiries.length} rezervasyon talebi
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-[#DCCDB9]/60">
                      <span className="text-xs text-[#18222F]/60 block mb-1">WhatsApp İletişim Hattı</span>
                      <div className="text-base font-bold text-[#18222F] truncate">
                        {settings.phone}
                      </div>
                      <span className="text-[11px] text-[#63B9C5] font-medium">
                        Müşteriler buraya bağlanıyor
                      </span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#EAE5DC]/60 border border-[#DCCDB9] text-xs text-[#18222F]/80 space-y-2.5">
                    <div className="font-bold text-[#18222F]">🔒 Gizli Yönetim Paneli — Mobil ve Masaüstü Erişim:</div>
                    <ul className="list-disc list-inside space-y-1.5">
                      <li><strong>Gizlilik:</strong> Bu panel sitede normal ziyaretçilere görünmez.</li>
                      <li><strong>Telefondan Açma:</strong> Site adresinin sonuna <strong>#admin</strong> yazın (örn: <code>siteadi.com/#admin</code>), üstteki <strong>logoya art arda 5 kez</strong> dokunun ya da en alttaki <strong>Tüm hakları saklıdır.</strong> yazısına dokunun.</li>
                      <li><strong>Bilgisayardan Açma:</strong> Yukarıdaki yöntemlere ek olarak klavyeden <strong>Ctrl + Shift + A</strong> tuşlarına basabilirsiniz.</li>
                      <li><strong>Fiyat Politikası:</strong> Fiyatlar ziyaretçilere kesin fiyat olarak değil, <em>"{(settings.startingPriceAmount || 1500).toLocaleString('tr-TR')} TL'den başlayan fiyatlar"</em> şeklinde gösterilir ve müşteriler rezervasyonu tamamlamak için WhatsApp hattınıza yönlendirilir.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB: SETTINGS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="bg-white p-5 sm:p-6 rounded-2xl border border-[#DCCDB9]/70 space-y-5 max-w-2xl">
                  {settingsSaved && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Ayarlar başarıyla kaydedildi.</span>
                    </div>
                  )}

                  {/* Pricing Policy Block */}
                  <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#DCCDB9]/80 space-y-3.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#18222F] flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-[#63B9C5]" />
                      <span>Fiyat Gösterim Politikası & WhatsApp Yönlendirme</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      <div>
                        <label className="block text-xs font-semibold text-[#18222F] mb-1">
                          Başlangıç Fiyatı Tutarı (TL)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={tempSettings.startingPriceAmount ?? 1500}
                          onChange={(e) => setTempSettings({ ...tempSettings, startingPriceAmount: parseInt(e.target.value, 10) || 1500 })}
                          className="w-full px-3 py-2.5 min-h-[42px] text-xs bg-white border border-[#DCCDB9] rounded-xl font-bold tabular-nums"
                        />
                        <span className="text-[11px] text-[#18222F]/60 block mt-1">
                          Sitede "{(tempSettings.startingPriceAmount ?? 1500).toLocaleString('tr-TR')} TL'den başlayan fiyatlar" olarak görünür.
                        </span>
                      </div>

                      <div>
                        <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#DCCDB9] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={tempSettings.hideExactPrices !== false}
                            onChange={(e) => setTempSettings({ ...tempSettings, hideExactPrices: e.target.checked })}
                            className="mt-0.5 rounded"
                          />
                          <span className="text-xs text-[#18222F] leading-snug">
                            <strong>Kesin Fiyatları Gizle</strong>
                            <span className="block text-[11px] text-[#18222F]/65 mt-0.5">
                              Aktifken tüm dairelerde genel başlangıç fiyatı gösterilir ve müşteri net fiyat için WhatsApp'a yönlendirilir.
                            </span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#18222F] mb-1">Marka Adı</label>
                      <input
                        type="text"
                        value={tempSettings.brandName}
                        onChange={(e) => setTempSettings({ ...tempSettings, brandName: e.target.value })}
                        className="w-full px-3 py-2.5 min-h-[42px] text-xs bg-[#F7F5F0] border border-[#DCCDB9] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#18222F] mb-1">Görünür Telefon Numarası</label>
                      <input
                        type="text"
                        value={tempSettings.phone}
                        onChange={(e) => setTempSettings({ ...tempSettings, phone: e.target.value })}
                        className="w-full px-3 py-2.5 min-h-[42px] text-xs bg-[#F7F5F0] border border-[#DCCDB9] rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#18222F] mb-1">WhatsApp Numara (Örn: 905421802372)</label>
                      <input
                        type="text"
                        value={tempSettings.whatsappNumber}
                        onChange={(e) => setTempSettings({ ...tempSettings, whatsappNumber: e.target.value })}
                        className="w-full px-3 py-2.5 min-h-[42px] text-xs bg-[#F7F5F0] border border-[#DCCDB9] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#18222F] mb-1">E-Posta Adresi</label>
                      <input
                        type="email"
                        value={tempSettings.email}
                        onChange={(e) => setTempSettings({ ...tempSettings, email: e.target.value })}
                        className="w-full px-3 py-2.5 min-h-[42px] text-xs bg-[#F7F5F0] border border-[#DCCDB9] rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#18222F] mb-1">Adres Satırı</label>
                      <input
                        type="text"
                        value={tempSettings.address}
                        onChange={(e) => setTempSettings({ ...tempSettings, address: e.target.value })}
                        className="w-full px-3 py-2.5 min-h-[42px] text-xs bg-[#F7F5F0] border border-[#DCCDB9] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#18222F] mb-1">İlçe</label>
                      <input
                        type="text"
                        value={tempSettings.district}
                        onChange={(e) => setTempSettings({ ...tempSettings, district: e.target.value })}
                        className="w-full px-3 py-2.5 min-h-[42px] text-xs bg-[#F7F5F0] border border-[#DCCDB9] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#18222F] mb-1">Şehir</label>
                      <input
                        type="text"
                        value={tempSettings.city}
                        onChange={(e) => setTempSettings({ ...tempSettings, city: e.target.value })}
                        className="w-full px-3 py-2.5 min-h-[42px] text-xs bg-[#F7F5F0] border border-[#DCCDB9] rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#18222F] mb-1">Standart Giriş Saati</label>
                      <input
                        type="text"
                        value={tempSettings.checkInHour}
                        onChange={(e) => setTempSettings({ ...tempSettings, checkInHour: e.target.value })}
                        className="w-full px-3 py-2.5 min-h-[42px] text-xs bg-[#F7F5F0] border border-[#DCCDB9] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#18222F] mb-1">Standart Çıkış Saati</label>
                      <input
                        type="text"
                        value={tempSettings.checkOutHour}
                        onChange={(e) => setTempSettings({ ...tempSettings, checkOutHour: e.target.value })}
                        className="w-full px-3 py-2.5 min-h-[42px] text-xs bg-[#F7F5F0] border border-[#DCCDB9] rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#18222F] mb-1">Ana Sayfa Üst Duyuru Bandı</label>
                    <input
                      type="text"
                      value={tempSettings.heroAnnouncement}
                      onChange={(e) => setTempSettings({ ...tempSettings, heroAnnouncement: e.target.value })}
                      className="w-full px-3 py-2.5 min-h-[42px] text-xs bg-[#F7F5F0] border border-[#DCCDB9] rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 min-h-[44px] text-xs font-semibold text-white bg-[#18222F] hover:bg-[#63B9C5] rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Ayarları Kaydet</span>
                  </button>
                </form>
              )}

              {/* TAB: SEO */}
              {activeTab === 'seo' && (
                <form onSubmit={handleSaveSettings} className="bg-white p-4 sm:p-6 rounded-2xl border border-[#DCCDB9]/70 space-y-5 max-w-2xl">
                  {settingsSaved && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>SEO ayarları kaydedildi ve yayındaki meta etiketlere uygulandı.</span>
                    </div>
                  )}

                  {/* Google Search Preview */}
                  <div className="p-4 rounded-xl bg-[#F7F5F0] border border-[#DCCDB9]/70">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#63B9C5] mb-2">
                      Google Arama Önizlemesi
                    </div>
                    <div className="text-[11px] text-[#18222F]/60 truncate">
                      {typeof window !== 'undefined' ? window.location.origin : 'https://vangunlukkiralik.com'}
                    </div>
                    <div className="text-sm sm:text-base font-medium text-[#1a0dab] leading-snug mt-0.5 line-clamp-1">
                      {tempSettings.seoTitle || 'Van Günlük Kiralık Daire | Merkezde Konforlu Konaklama'}
                    </div>
                    <div className="text-xs text-[#4d5156] mt-1 line-clamp-2 leading-relaxed">
                      {tempSettings.seoDescription}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-[#18222F]">SEO Sayfa Başlığı (Title)</label>
                      <span className={`text-[11px] font-medium ${
                        (tempSettings.seoTitle?.length || 0) >= 30 && (tempSettings.seoTitle?.length || 0) <= 60
                          ? 'text-emerald-600'
                          : 'text-amber-600'
                      }`}>
                        {tempSettings.seoTitle?.length || 0} / 60 karakter (İdeal: 30–60)
                      </span>
                    </div>
                    <input
                      type="text"
                      value={tempSettings.seoTitle}
                      onChange={(e) => setTempSettings({ ...tempSettings, seoTitle: e.target.value })}
                      className="w-full px-3 py-2.5 min-h-[42px] text-xs bg-[#F7F5F0] border border-[#DCCDB9] rounded-xl"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-[#18222F]">SEO Açıklaması (Meta Description)</label>
                      <span className={`text-[11px] font-medium ${
                        (tempSettings.seoDescription?.length || 0) >= 120 && (tempSettings.seoDescription?.length || 0) <= 160
                          ? 'text-emerald-600'
                          : 'text-amber-600'
                      }`}>
                        {tempSettings.seoDescription?.length || 0} / 160 karakter (İdeal: 120–160)
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={tempSettings.seoDescription}
                      onChange={(e) => setTempSettings({ ...tempSettings, seoDescription: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs bg-[#F7F5F0] border border-[#DCCDB9] rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#18222F] mb-1">Hedef Anahtar Kelimeler (Keywords)</label>
                    <input
                      type="text"
                      value={tempSettings.seoKeywords}
                      onChange={(e) => setTempSettings({ ...tempSettings, seoKeywords: e.target.value })}
                      className="w-full px-3 py-2.5 min-h-[42px] text-xs bg-[#F7F5F0] border border-[#DCCDB9] rounded-xl"
                    />
                  </div>

                  {/* Technical SEO Files Status */}
                  <div className="p-3.5 rounded-xl bg-[#F7F5F0] border border-[#DCCDB9]/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-[#18222F]/80 font-medium">
                      Schema.org (LodgingBusiness + FAQPage), OpenGraph & Sitemap aktif
                    </span>
                    <div className="flex items-center gap-3">
                      <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="text-[#63B9C5] font-semibold underline">
                        sitemap.xml
                      </a>
                      <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="text-[#63B9C5] font-semibold underline">
                        robots.txt
                      </a>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 min-h-[44px] text-xs font-semibold text-white bg-[#18222F] hover:bg-[#63B9C5] rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>SEO Ayarlarını Kaydet</span>
                  </button>
                </form>
              )}

            </div>
          </div>
        )}

        {/* FULL APARTMENT, PHOTO GALLERY & PRICING EDIT MODAL (Mobile Full-Screen Sheet) */}
        {editingApartment && (
          <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-0 sm:p-5">
            <div className="bg-white rounded-none sm:rounded-3xl p-4 sm:p-8 max-w-4xl w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] overflow-y-auto border-0 sm:border border-[#DCCDB9] shadow-2xl flex flex-col">
              
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[#DCCDB9]/60 mb-5 shrink-0">
                <div className="min-w-0 pr-3">
                  <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#18222F] truncate">
                    {isNewApartment ? 'Yeni Daire Ekle' : `${editingApartment.title || 'Daire'} Düzenle`}
                  </h3>
                  <p className="text-xs text-[#18222F]/65 mt-0.5">
                    Telefon galerinizden fotoğraf ekleyin/çıkarın, fiyat ve detayları güncelleyin.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingApartment(null)}
                  className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-[#18222F]/70 hover:text-[#18222F] rounded-full bg-[#F7F5F0]"
                  aria-label="Kapat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveApartment} className="space-y-8 flex-1">
                
                {/* 1. GÖRSEL VE FOTOĞRAF GALERİSİ YÖNETİMİ */}
                <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#DCCDB9]/80 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-[#18222F] flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[#63B9C5]" />
                        <span>Fotoğraf Galerisi Yönetimi ({editingApartment.gallery?.length || 0} Fotoğraf)</span>
                      </h4>
                      <p className="text-[11px] text-[#18222F]/70 mt-0.5">
                        Cihazınızdan yeni fotoğraf yükleyebilir, fotoğraf çıkarabilir, sıralayabilir veya kapak fotoğrafı seçebilirsiniz.
                      </p>
                    </div>

                    {/* File Upload Button */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="apartment-photo-file-input"
                      />
                      <label
                        htmlFor="apartment-photo-file-input"
                        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] text-xs font-semibold text-white bg-[#63B9C5] hover:bg-[#4FA3AE] rounded-xl cursor-pointer shadow-xs transition-all ${
                          uploadingImage ? 'opacity-50 pointer-events-none' : ''
                        }`}
                      >
                        <Upload className="w-4 h-4" />
                        <span>{uploadingImage ? 'Yükleniyor...' : 'Telefondan / Cihazdan Fotoğraf Yükle'}</span>
                      </label>
                    </div>
                  </div>

                  {/* URL Input Row */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      placeholder="Veya görsel bağlantı URL'si yapıştırın (https://...)"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="flex-1 px-3 py-2.5 min-h-[42px] text-xs bg-white border border-[#DCCDB9] rounded-xl text-[#18222F] focus:outline-none focus:border-[#63B9C5]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-4 py-2.5 min-h-[42px] text-xs font-semibold text-[#18222F] bg-white border border-[#DCCDB9] hover:bg-[#F7F5F0] rounded-xl shrink-0"
                    >
                      URL Ekle
                    </button>
                  </div>

                  {/* Gallery Thumbnails List with Reorder, Delete, and Set As Cover */}
                  {(!editingApartment.gallery || editingApartment.gallery.length === 0) ? (
                    <div className="p-8 text-center bg-white rounded-xl border border-dashed border-[#DCCDB9] text-xs text-[#18222F]/60">
                      Bu daireye henüz fotoğraf eklenmemiş. Yukarıdaki butona tıklayarak fotoğraf yükleyin.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {editingApartment.gallery.map((photoUrl, idx) => {
                        const isCover = (editingApartment.coverImage === photoUrl) || (idx === 0 && !editingApartment.coverImage);
                        return (
                          <div
                            key={idx}
                            className={`group relative rounded-xl overflow-hidden bg-white border-2 transition-all flex flex-col ${
                              isCover ? 'border-[#63B9C5] shadow-sm' : 'border-[#DCCDB9]/60'
                            }`}
                          >
                            <div className="relative aspect-4/3 w-full bg-[#EAE5DC]">
                              <img
                                src={photoUrl}
                                alt={`Fotoğraf ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />

                              {/* Cover Badge */}
                              {isCover && (
                                <div className="absolute top-1.5 left-1.5 bg-[#63B9C5] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-white" />
                                  <span>Kapak</span>
                                </div>
                              )}

                              {/* Index tag */}
                              <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                                #{idx + 1}
                              </div>
                            </div>

                            {/* Control Bar under image */}
                            <div className="p-2 bg-white flex items-center justify-between gap-1 border-t border-[#DCCDB9]/40">
                              {/* Set cover button */}
                              {!isCover ? (
                                <button
                                  type="button"
                                  onClick={() => handleSetCoverPhoto(photoUrl)}
                                  className="text-[11px] py-1 text-[#63B9C5] hover:underline font-semibold"
                                >
                                  Kapak Yap
                                </button>
                              ) : (
                                <span className="text-[11px] text-emerald-700 font-semibold">
                                  Ana Kapak
                                </span>
                              )}

                              <div className="flex items-center gap-0.5">
                                {/* Move Left / Right */}
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMovePhoto(idx, idx - 1)}
                                  className="p-1.5 text-[#18222F]/60 hover:text-[#18222F] disabled:opacity-20"
                                  title="Sola / Öne Taşı"
                                >
                                  <ArrowLeft className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === (editingApartment.gallery?.length || 1) - 1}
                                  onClick={() => handleMovePhoto(idx, idx + 1)}
                                  className="p-1.5 text-[#18222F]/60 hover:text-[#18222F] disabled:opacity-20"
                                  title="Sağa / Arkaya Taşı"
                                >
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete / Remove Photo */}
                                <button
                                  type="button"
                                  onClick={() => handleRemovePhoto(idx)}
                                  className="p-1.5 text-rose-500 hover:text-white hover:bg-rose-600 rounded transition-colors ml-0.5"
                                  title="Fotoğrafı Çıkar"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. FİYAT BİLGİLERİ VE MÜSAİTLİK YÖNETİMİ */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F5] border border-[#DCCDB9]/80 space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#18222F] flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span>Başlangıç Fiyatı & Müsaitlik Koşulları</span>
                    </h4>
                    <p className="text-[11px] text-[#18222F]/65 mt-0.5">
                      Not: Ayarlarda "Kesin Fiyatları Gizle" açık olduğu sürece sitede genel başlangıç fiyatı ({(settings.startingPriceAmount || 1500).toLocaleString('tr-TR')} TL'den başlayan fiyatlar) gösterilir ve müşteriler WhatsApp'a yönlendirilir.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#18222F] mb-1">
                        Standart Gecelik Fiyat (₺) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min={0}
                        placeholder="Örn: 1850"
                        value={editingApartment.pricePerNight ?? ''}
                        onChange={(e) => setEditingApartment({ ...editingApartment, pricePerNight: parseInt(e.target.value, 10) || null })}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#DCCDB9] rounded-xl font-bold tabular-nums text-[#18222F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#18222F] mb-1">
                        Hafta Sonu Fiyatı (₺ - Opsiyonel)
                      </label>
                      <input
                        type="number"
                        min={0}
                        placeholder="Örn: 2200"
                        value={editingApartment.weekendPrice ?? ''}
                        onChange={(e) => setEditingApartment({ ...editingApartment, weekendPrice: parseInt(e.target.value, 10) || null })}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#DCCDB9] rounded-xl tabular-nums text-[#18222F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#18222F] mb-1">
                        Haftalık İndirim Oranı (%)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="Örn: 10"
                        value={editingApartment.weeklyDiscountPercent ?? ''}
                        onChange={(e) => setEditingApartment({ ...editingApartment, weeklyDiscountPercent: parseInt(e.target.value, 10) || null })}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#DCCDB9] rounded-xl tabular-nums text-[#18222F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#18222F] mb-1">
                        Fiyat Açıklama Notu
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: Gecelik taban fiyat. Sezonluk dönemlerde teyit edilir."
                        value={editingApartment.priceNote || ''}
                        onChange={(e) => setEditingApartment({ ...editingApartment, priceNote: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#DCCDB9] rounded-xl text-[#18222F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#18222F] mb-1">
                        Müsaitlik Durumu
                      </label>
                      <select
                        value={editingApartment.isAvailable ? 'yes' : 'no'}
                        onChange={(e) => setEditingApartment({ ...editingApartment, isAvailable: e.target.value === 'yes' })}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#DCCDB9] rounded-xl text-[#18222F] font-semibold"
                      >
                        <option value="yes">✅ Daire Müsait (Rezervasyona Açık)</option>
                        <option value="no">⛔ Daire Dolu / Tarih Sorunuz</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. DAİRE GENEL BİLGİLERİ VE OLANAKLAR */}
                <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#DCCDB9]/80 space-y-4">
                  <h4 className="text-sm font-bold text-[#18222F] flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#63B9C5]" />
                    <span>Daire Bilgileri & Olanaklar</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#18222F] mb-1">
                        Daire Başlığı / Adı <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Örn: İpekyolu Apart — 2+1 Aile Dairesi"
                        value={editingApartment.title || ''}
                        onChange={(e) => setEditingApartment({ ...editingApartment, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#DCCDB9] rounded-xl text-[#18222F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#18222F] mb-1">
                        Daire Kodu (Örn: VGK-101)
                      </label>
                      <input
                        type="text"
                        placeholder="VGK-101"
                        value={editingApartment.code || ''}
                        onChange={(e) => setEditingApartment({ ...editingApartment, code: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#DCCDB9] rounded-xl text-[#18222F] font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#18222F] mb-1">Daire Tipi</label>
                      <select
                        value={editingApartment.type || '1+0'}
                        onChange={(e) => setEditingApartment({ ...editingApartment, type: e.target.value as RoomType })}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#DCCDB9] rounded-xl text-[#18222F]"
                      >
                        <option value="1+0">1+0</option>
                        <option value="2+1">2+1</option>
                        <option value="3+1">3+1</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#18222F] mb-1">Kapasite (Kişi)</label>
                      <input
                        type="number"
                        min={1}
                        max={15}
                        value={editingApartment.capacity || 2}
                        onChange={(e) => setEditingApartment({ ...editingApartment, capacity: parseInt(e.target.value, 10) || 1 })}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#DCCDB9] rounded-xl text-[#18222F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#18222F] mb-1">Alan (m²)</label>
                      <input
                        type="number"
                        min={10}
                        value={editingApartment.areaM2 || 50}
                        onChange={(e) => setEditingApartment({ ...editingApartment, areaM2: parseInt(e.target.value, 10) || 40 })}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#DCCDB9] rounded-xl text-[#18222F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#18222F] mb-1">Kat Bilgisi</label>
                      <input
                        type="text"
                        placeholder="Örn: 3. Kat (Asansörlü)"
                        value={editingApartment.floor || ''}
                        onChange={(e) => setEditingApartment({ ...editingApartment, floor: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#DCCDB9] rounded-xl text-[#18222F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#18222F] mb-1">Yatak Düzeni</label>
                      <input
                        type="text"
                        placeholder="Örn: 1 Çift Kişilik Yatak + 1 Açılır Kanepe"
                        value={editingApartment.beds || ''}
                        onChange={(e) => setEditingApartment({ ...editingApartment, beds: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#DCCDB9] rounded-xl text-[#18222F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#18222F] mb-1">Konum Açıklaması</label>
                      <input
                        type="text"
                        placeholder="Örn: Van Merkez, İpekyolu (Çarşıya Yakın)"
                        value={editingApartment.location || ''}
                        onChange={(e) => setEditingApartment({ ...editingApartment, location: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#DCCDB9] rounded-xl text-[#18222F]"
                      />
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div>
                    <label className="block text-xs font-semibold text-[#18222F] mb-1">Kısa Açıklama (Kart Görünümü İçin)</label>
                    <textarea
                      rows={2}
                      placeholder="Geniş oturma odası ve ferah yatak odasıyla huzurlu bir konaklama..."
                      value={editingApartment.shortDescription || ''}
                      onChange={(e) => setEditingApartment({ ...editingApartment, shortDescription: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#DCCDB9] rounded-xl text-[#18222F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#18222F] mb-1">Detaylı Açıklama (Modal İçi)</label>
                    <textarea
                      rows={4}
                      placeholder="Dairenin tüm konfor unsurlarını ve detaylarını anlatan metin..."
                      value={editingApartment.fullDescription || ''}
                      onChange={(e) => setEditingApartment({ ...editingApartment, fullDescription: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#DCCDB9] rounded-xl text-[#18222F]"
                    />
                  </div>

                  {/* Dynamic Amenities Management */}
                  <div>
                    <label className="block text-xs font-semibold text-[#18222F] mb-1.5">
                      Daire Olanakları
                    </label>
                    
                    {/* Active amenities tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(editingApartment.amenities || []).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-white border border-[#DCCDB9] rounded-lg text-[#18222F]"
                        >
                          <span>{amenity}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAmenity(amenity)}
                            className="text-rose-500 hover:text-rose-700"
                            title="Olanak Çıkar"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Add new amenity input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Yeni olanak yazın (Örn: Jakuzi, Netflix, Balkon...)"
                        value={newAmenityInput}
                        onChange={(e) => setNewAmenityInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddAmenity();
                          }
                        }}
                        className="flex-1 px-3 py-2 text-xs bg-white border border-[#DCCDB9] rounded-xl text-[#18222F]"
                      />
                      <button
                        type="button"
                        onClick={handleAddAmenity}
                        className="px-4 py-2 text-xs font-semibold text-[#18222F] bg-white border border-[#DCCDB9] hover:bg-[#F7F5F0] rounded-xl shrink-0"
                      >
                        + Olanak Ekle
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-4 border-t border-[#DCCDB9]/60 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-3">
                  <button
                    type="button"
                    onClick={() => setEditingApartment(null)}
                    className="px-5 py-2.5 text-xs font-semibold text-[#18222F]/70 hover:text-[#18222F] rounded-xl hover:bg-[#F7F5F0]"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-[#18222F] hover:bg-[#63B9C5] rounded-xl transition-all shadow-md flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Daireyi & Görselleri Kaydet</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
