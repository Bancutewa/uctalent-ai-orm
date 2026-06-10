"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/config/supabase-client";
import { fetchReviewsAction } from "@/actions/serp";
import type { SerpPlaceInfo, SerpReview } from "@/lib/types";

// ==========================================
// FETCH PREVIEW
// ==========================================
export async function fetchPlacePreview(placeId: string) {
  try {
    const result = await fetchReviewsAction(placeId);
    if (!result.success || !result.data) {
      return {
        success: false as const,
        error: result.error || "Không lấy được dữ liệu",
      };
    }
    return { success: true as const, data: result.data };
  } catch (error: any) {
    console.error("Error fetching preview:", error);
    return { success: false as const, error: error.message };
  }
}

// ==========================================
// CONFIRM SAVE
// ==========================================
export async function confirmSaveReviews(
  placeId: string,
  placeInfo: SerpPlaceInfo,
  reviews: SerpReview[],
) {
  try {
    // 1. Upsert place (nếu đã tồn tại thì cập nhật info mới)
    const { error: placeError } = await supabase
      .from("places")
      .upsert(
        {
          id: placeId,
          title: placeInfo.title,
          address: placeInfo.address,
          rating: placeInfo.rating,
          total_reviews: placeInfo.reviews,
          type: placeInfo.type,
        },
        { onConflict: "id" },
      );

    if (placeError) throw placeError;

    // 2. Upsert reviews with place_id to avoid duplicates
    if (reviews.length > 0) {
      const reviewsToInsert = reviews.map((r) => ({
        ...r,
        place_id: placeId,
      }));

      const { error: reviewError } = await supabase
        .from("reviews")
        .upsert(reviewsToInsert, { onConflict: "review_id" });

      if (reviewError) throw reviewError;
    }

    // 3. Revalidate trang
    revalidatePath("/");

    return {
      success: true as const,
      message: `Đã lưu ${reviews.length} đánh giá từ "${placeInfo.title}"`,
    };
  } catch (error: any) {
    console.error("Error saving reviews:", error);
    return { success: false as const, error: error.message };
  }
}

// ==========================================
// QUERY functions
// ==========================================

// Lấy danh sách places kèm reviews và replies
export async function getPlaces() {
  try {
    const { data, error } = await supabase
      .from("places")
      .select(
        `
        *,
        reviews (
          *,
          replies (*)
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true as const, data };
  } catch (error: any) {
    console.error("Error fetching places:", error);
    return { success: false as const, error: error.message };
  }
}


// Lấy reviews theo place_id kèm replies
export async function getReviewsByPlace(placeId: string) {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        *,
        replies (*)
      `,
      )
      .eq("place_id", placeId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true as const, data };
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return { success: false as const, error: error.message };
  }
}

// ==========================================
// APPROVE flow (Epic 4)
// ==========================================

// Lưu duy nhất 1 câu trả lời AI được chọn vào bảng replies và đánh dấu là approved
export async function saveAndApproveReply(reviewId: string, content: string) {
  try {
    // 1. Xóa các replies cũ của review này để tránh rác DB (chỉ giữ duy nhất 1 câu đã duyệt)
    const { error: deleteError } = await supabase
      .from("replies")
      .delete()
      .eq("review_id", reviewId);

    if (deleteError) throw deleteError;

    // 2. Insert câu trả lời được duyệt
    const { data, error } = await supabase
      .from("replies")
      .insert({
        review_id: reviewId,
        content,
        status: "approved",
      })
      .select();

    if (error) throw error;

    // 3. Kích hoạt revalidate để cập nhật UI
    revalidatePath("/");

    return { success: true as const, data };
  } catch (error: any) {
    console.error("Error saving and approving reply:", error);
    return { success: false as const, error: error.message };
  }
}
