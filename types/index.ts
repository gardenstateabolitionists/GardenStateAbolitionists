export interface User {
  id?: string;
  email: string;
  password?: string;
  name?: string;
  role?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  published: boolean;
  /**
   * When true (default), publishing this article auto-posts to Facebook +
   * Instagram. Uncheck in the editor to publish silently — useful for
   * testing, minor content, or articles you'll share manually.
   */
  auto_post_to_social?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PetitionSignature {
  id: string;
  name: string;
  email: string;
  city?: string;
  state?: string;
  zipcode?: string;
  subscribed?: boolean;
  created_at?: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string;
  sortOrder?: number;
  created_at?: string;
}

export interface DashboardStats {
  totalInquiries: number;
  totalNews: number;
  totalSignatures: number;
  totalPhotos: number;
  pendingInquiries: number;
  totalSubscribers: number;
}
