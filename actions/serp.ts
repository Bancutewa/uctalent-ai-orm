"use server";

import { serpConfig } from "@/config/serp";
import { getJson } from "serpapi";

interface SerpApiReviewRaw {
  review_id: string;
  user?: {
    name?: string;
    thumbnail?: string;
    link?: string;
  };
  rating: number;
  snippet?: string;
  iso_date?: string;
  images?: string[];
}

export async function fetchReviewsAction(placeId: string) {
  try {
    if (!placeId) {
      return {
        success: false as const,
        error: "Place ID is required",
      };
    }

    const response = await getJson({
      engine: "google_maps_reviews",
      place_id: placeId,
      hl: "vi",
      sort_by: "newestFirst",
      api_key: serpConfig.apiKey,
    });

    if (response.error) {
      return { success: false as const, error: response.error };
    }

    const rawPlace = response.place_info ?? {};
    const place_info = {
      title: rawPlace.title ?? "Không rõ tên",
      address: rawPlace.address,
      rating: rawPlace.rating,
      reviews: rawPlace.reviews,
      type: rawPlace.type,
    };

    const reviews = (response.reviews ?? [])
       .slice(0, 5)
       .map((r: SerpApiReviewRaw) => ({
         review_id: r.review_id,
         author_name: r.user?.name ?? "Ẩn danh",
         author_avatar: r.user?.thumbnail,
         rating: r.rating,
         content: r.snippet ?? "",
         source: "google",
         url: r.user?.link,
         created_at: r.iso_date
           ? new Date(r.iso_date).toISOString()
           : new Date().toISOString(),
         images: r.images ?? [],
       }));

    return { success: true as const, data: { place_info, reviews } };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("SerpApi Error:", error);
    return {
      success: false as const,
      error: errorMessage || "Đã có lỗi xảy ra khi gọi SerpApi",
    };
  }
}

export async function searchPlacesAction(query: string) {
  try {
    if (!query || query.trim() === "") {
      return {
        success: false as const,
        error: "Search query is required",
      };
    }

    const response = await getJson({
      engine: "google_maps",
      q: query,
      hl: "vi",
      api_key: serpConfig.apiKey,
    });

    if (response.error) {
      return { success: false as const, error: response.error };
    }

    const results = (response.local_results ?? []).map((r: any) => ({
      title: r.title,
      place_id: r.place_id,
      address: r.address,
      rating: r.rating,
      reviews: r.reviews,
      type: r.type,
    }));

    return { success: true as const, data: results };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("SerpApi Search Error:", error);
    return {
      success: false as const,
      error: errorMessage || "Đã có lỗi xảy ra khi gọi SerpApi (Search)",
    };
  }
}
