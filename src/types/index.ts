export type RoomType = '1+0' | '2+1' | '3+1';

export interface Apartment {
  id: string;
  code: string;
  title: string;
  type: RoomType;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  gallery: string[];
  location: string;
  capacity: number;
  beds: string;
  areaM2: number;
  floor?: string;
  pricePerNight: number | null;
  weekendPrice?: number | null;
  weeklyDiscountPercent?: number | null;
  depositAmount?: number | null;
  minNights?: number;
  priceNote?: string;
  isAvailable: boolean;
  amenities: string[];
  rules: {
    checkIn: string;
    checkOut: string;
    smoking: boolean;
    pets: boolean;
  };
  featured?: boolean;
}

export type InquiryStatus = 'pending' | 'confirmed' | 'rejected' | 'completed';

export interface Inquiry {
  id: string;
  code: string;
  createdAt: string;
  fullName: string;
  phone: string;
  apartmentId: string;
  apartmentTitle: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  notes?: string;
  status: InquiryStatus;
  adminNote?: string;
}

export interface SiteSettings {
  brandName: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  district: string;
  city: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
  checkInHour: string;
  checkOutHour: string;
  heroAnnouncement: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  instagramUrl?: string;
  startingPriceAmount?: number;
  hideExactPrices?: boolean;
}
