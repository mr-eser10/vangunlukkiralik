import React from 'react';
import { SiteSettings } from '../types';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin }) => {
  return (
    <footer className="bg-[#18222F] text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="inline-block bg-[#F7F5F0] px-4 py-2.5 rounded-2xl border border-[#D8C29E]/60 shadow-sm mb-4">
              <img
                src="/assets/aistudio/Van_G_nl_k_Kiral_k_Daire_3D_Logosu_f1b36505.png"
                alt="Van Günlük Kiralık Daire Logosu"
                className="h-14 w-auto object-contain mix-blend-multiply"
              />
            </div>

            <p className="text-xs text-white/70 max-w-sm leading-relaxed mb-4">
              Van şehir merkezinde konforlu, hijyenik ve bağımsız günlük kiralık daireler. Misafirlerimize güven, huzur ve üstün yaşam standartları sunuyoruz.
            </p>

            <div className="text-xs text-white/60">
              Hizmet Bölgesi: {settings.district} / {settings.city}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A9D9E1] mb-4">
              Hızlı Erişim
            </h4>
            <ul className="space-y-2.5 text-xs text-white/75">
              <li>
                <a href="#daireler" className="hover:text-white transition-colors">
                  Dairelerimiz & Fiyatlar
                </a>
              </li>
              <li>
                <a href="#neden-biz" className="hover:text-white transition-colors">
                  Neden Biz?
                </a>
              </li>
              <li>
                <a href="#hakkimizda" className="hover:text-white transition-colors">
                  Hakkımızda
                </a>
              </li>
              <li>
                <a href="#rezervasyon" className="hover:text-white transition-colors">
                  Rezervasyon Talebi
                </a>
              </li>
              <li>
                <a href="#sss" className="hover:text-white transition-colors">
                  Sıkça Sorulanlar
                </a>
              </li>
              <li>
                <a href="#iletisim" className="hover:text-white transition-colors">
                  İletişim & Konum
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Summary */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A9D9E1] mb-4">
              İletişim Bilgileri
            </h4>
            <div className="space-y-2.5 text-xs text-white/75">
              <p>
                <span className="text-white/40 block">Telefon:</span>
                <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="hover:text-white">
                  {settings.phone}
                </a>
              </p>
              <p>
                <span className="text-white/40 block">E-Posta:</span>
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </p>
              <p>
                <span className="text-white/40 block">Adres:</span>
                <span>{settings.address}, {settings.district} / {settings.city}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div>
            © {new Date().getFullYear()} {settings.brandName}.{' '}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="hover:text-white/80 transition-colors cursor-default"
              title=""
            >
              Tüm hakları saklıdır.
            </button>
          </div>

          <div className="flex items-center gap-6 text-white/50">
            <span>{settings.district} / {settings.city}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
