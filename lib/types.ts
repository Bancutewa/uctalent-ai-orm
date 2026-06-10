export interface Review {
  id: string;
  authorName: string;
  rating: number;
  content: string;
  source: string; // e.g., 'google', 'facebook'
  createdAt: string | Date;
  url?: string;
  reply?: Reply;
}

export interface Reply {
  id: string;
  reviewId: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'published';
  createdAt: string | Date;
  updatedAt: string | Date;
}
