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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching preview:", error);
    return { success: false as const, error: errorMessage };
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
    // 1. Upsert place (update if already exists)
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

    // 3. Revalidate page to refresh cache
    revalidatePath("/");

    return {
      success: true as const,
      message: `Đã lưu ${reviews.length} đánh giá từ "${placeInfo.title}"`,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error saving reviews:", error);
    return { success: false as const, error: errorMessage };
  }
}

// ==========================================
// QUERY functions
// ==========================================

// Get all places with their reviews and replies
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching places:", error);
    return { success: false as const, error: errorMessage };
  }
}


// Get reviews by place ID including replies
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching reviews:", error);
    return { success: false as const, error: errorMessage };
  }
}

// ==========================================
// APPROVE flow (Epic 4)
// ==========================================

// Save selected AI reply and mark as approved
export async function saveAndApproveReply(reviewId: string, content: string) {
  try {
    // 1. Delete old replies for this review to prevent DB clutter
    const { error: deleteError } = await supabase
      .from("replies")
      .delete()
      .eq("review_id", reviewId);

    if (deleteError) throw deleteError;

    // 2. Insert the approved reply
    const { data, error } = await supabase
      .from("replies")
      .insert({
        review_id: reviewId,
        content,
        status: "approved",
      })
      .select();

    if (error) throw error;

    // 3. Revalidate path to update UI
    revalidatePath("/");

    return { success: true as const, data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error saving and approving reply:", error);
    return { success: false as const, error: errorMessage };
  }
}
