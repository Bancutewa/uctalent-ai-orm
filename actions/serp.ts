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
        review_id: r.review_id,
        author: r.user?.name ?? "Ẩn danh",
        rating: r.rating,
        text: r.snippet ?? "",
        date: r.iso_date,
        status: "pending",
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
