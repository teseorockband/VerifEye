export type LinkLevel =
  | 'none'
  | 'indirect'
  | 'direct'
  | 'produced_in_israel'
  | 'produced_in_settlements';

export type ProductCategory =
  | 'food'
  | 'cosmetics'
  | 'technology'
  | 'fashion'
  | 'household'
  | 'other';

export type ReportStatus = 'pending' | 'approved' | 'rejected';

export interface Source {
  id: string;
  name: string;
  url: string;
  description: string | null;
  last_checked: string;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  country: string;
  parent_company_id: string | null;
  parent_company?: Company;
  website: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  ean: string;
  name: string;
  brand: string;
  category: ProductCategory;
  country_of_origin: string;
  company_id: string | null;
  company?: Company;
  image_url: string | null;
  link_level: LinkLevel;
  link_summary: string | null;
  last_verified: string;
  created_at: string;
  updated_at: string;
}

export interface Relationship {
  id: string;
  subject_type: 'product' | 'company';
  subject_id: string;
  object_type: 'company' | 'country';
  object_id: string;
  link_type: LinkLevel;
  description: string;
  source_id: string;
  source?: Source;
  verified_at: string;
  created_at: string;
}

export interface Alternative {
  id: string;
  product_id: string;
  alternative_product_id: string;
  alternative_product?: Product;
  reason: string | null;
  created_at: string;
}

export interface UserReport {
  id: string;
  user_id: string | null;
  product_ean: string;
  description: string;
  source_url: string;
  status: ReportStatus;
  moderator_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Dispute {
  id: string;
  product_id: string;
  company_name: string;
  contact_email: string;
  description: string;
  documentation_url: string | null;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
}

// Full product detail returned by the API
export interface ProductDetail extends Product {
  company: Company & { parent_company?: Company };
  relationships: (Relationship & { source: Source })[];
  alternatives: (Alternative & { alternative_product: Product })[];
}
