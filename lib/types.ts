export interface Review {
  id: string;
  author_name: string;
  rating: number;
  content: string;
  source: string; // e.g., 'google', 'facebook'
  created_at: string;
  url?: string;
  replies?: Reply[];
}

export interface Reply {
  id: string;
  review_id: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'published';
  is_selected: boolean;
  created_at: string;
  updated_at: string;
}
