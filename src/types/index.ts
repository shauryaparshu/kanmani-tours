export interface Category {
  _id: string;
  title: string;
  title_ja?: string;
  key: string;
  color?: string;
  priority?: boolean;
}

export interface Tour {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  category: string;
  shortDescription?: string;
  longDescription?: string;
  startDate?: string; // ISO 8601 date string
  endDate?: string;   // ISO 8601 date string
  isComingSoon?: boolean;
  dateDisplay?: string;
  durationDays?: number;
  location?: string;
  priceJPY?: number;
  priceRangeJPY?: {
    min?: number;
    max?: number;
  };
  seatsLeft?: number;
  coverImage?: any; // Sanity image type
  galleryImages?: any[];
  features?: string[];
  itinerary?: {
    dayNumber?: number;
    title?: string;
    details?: string;
    image?: any;
  }[];
  whatToExpect?: string[];
  inclusions?: string[];
  exclusions?: string[];
  faq?: {
    question?: string;
    answer?: string;
  }[];
  bookingLink?: string;
}
