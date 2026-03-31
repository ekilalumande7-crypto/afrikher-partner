export type UserRole = 'partner' | 'pending_partner' | 'rejected' | 'admin' | 'user';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  company_name?: string;
  sector?: string;
  website?: string;
  linkedin_url?: string;
  bio?: string;
  country?: string;
  collaboration_types?: string[];
  motivation?: string;
  created_at: string;
}

export interface PartnerSubmission {
  id: string;
  partner_id: string;
  type: 'interview' | 'article' | 'dossier' | 'portrait';
  title: string;
  cover_image: string;
  content: string;
  category_id?: string;
  tags?: string[];
  note_to_editor?: string;
  status: 'pending' | 'reviewing' | 'published' | 'rejected';
  rejection_reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  published_article_id?: string;
  created_at: string;
}

export interface PartnerProduct {
  id: string;
  partner_id: string;
  name: string;
  type: 'Livre' | 'Bouquet' | 'Création artisanale' | 'Service' | 'Autre';
  description: string;
  price: number;
  stock: number;
  unlimited_stock: boolean;
  images: string[];
  status: 'pending_approval' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  created_at: string;
}

export interface PartnerEarning {
  id: string;
  partner_id: string;
  order_id: string;
  product_id: string;
  gross_amount: number;
  commission_rate: number;
  net_amount: number;
  paid: boolean;
  payout_date?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  type: string;
  created_at: number;
}
