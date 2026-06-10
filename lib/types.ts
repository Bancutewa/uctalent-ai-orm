export interface Place {
  id: string; // Google Place ID
  title: string;
  address?: string;
  rating?: number;
  total_reviews?: number;
  type?: string;
  created_at: string;
  reviews?: Review[];
}

export interface Review {
  id: string;
  place_id?: string;
  review_id?: string;
  author_name: string;
  author_avatar?: string;
  rating: number;
  content: string;
  source: string;
  created_at: string;
  url?: string;
  images?: string[];
  replies?: Reply[];
}

export interface Reply {
  id: string;
  review_id: string;
  content: string;
  status: "pending" | "approved" | "rejected" | "published";
  created_at: string;
  updated_at: string;
}

export interface SerpPlaceInfo {
  title: string;
  address?: string;
  rating?: number;
  reviews?: number;
  type?: string;
}

export interface SerpReview {
  review_id: string;
  author_name: string;
  author_avatar?: string;
  rating: number;
  content: string;
  source: string;
  url?: string;
  created_at: string;
  images?: string[];
}

export interface FetchPreviewData {
  place_info: SerpPlaceInfo;
  reviews: SerpReview[];
}
