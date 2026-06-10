"use server";

import { serpConfig } from "@/config/serp";
import { getJson } from "serpapi";

export async function fetchReviewsAction(placeId: string) {
  try {
    if (!placeId) {
      return { success: false, error: "Place ID is required" };
    }

    // Dùng SDK có sẵn của SerpApi thay vì tự nối chuỗi URL và dùng fetch
    const response = await getJson({
      engine: "google_maps_reviews",
      place_id: placeId,
      hl: "vi",
      sort_by: "newestFirst",
      api_key: serpConfig.apiKey,
    });

    if (response.error) {
      return { success: false, error: response.error };
    }

    const reviews = (response.reviews ?? [])
      .slice(0, 5)
      .map((r: any) => ({
        author_name: r.user?.name ?? "Ẩn danh",
        rating: r.rating,
        content: r.snippet ?? "Không có nội dung",
        source: "google",
        url: r.user?.link,
        created_at: r.iso_date ? new Date(r.iso_date).toISOString() : new Date().toISOString(),
      }));

    return { success: true, data: reviews };
  } catch (error: any) {
    console.error("SerpApi Error:", error);
    return {
      success: false,
      error: error.message || "Đã có lỗi xảy ra khi gọi SerpApi",
    };
  }
}
