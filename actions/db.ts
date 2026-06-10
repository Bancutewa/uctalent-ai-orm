"use server";

import { supabase } from "@/config/supabase-client";

// Lấy danh sách reviews kèm replies
export async function getReviews() {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        replies (*)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return { success: false, error: error.message };
  }
}

// Lưu mảng reviews mới vào DB
export async function saveReviews(reviews: any[]) {
  try {
    if (!reviews || reviews.length === 0) {
      return { success: false, error: "Không có reviews nào để lưu" };
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert(reviews)
      .select();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error("Error saving reviews:", error);
    return { success: false, error: error.message };
  }
}

// Cập nhật trạng thái approve cho reply
export async function approveReply(reviewId: string, replyId: string) {
  try {
    // Cập nhật reply thành đã được chọn và duyệt
    const { data, error } = await supabase
      .from("replies")
      .update({ status: "approved", is_selected: true })
      .eq("id", replyId)
      .eq("review_id", reviewId) // Ensure it belongs to the correct review
      .select();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error("Error approving reply:", error);
    return { success: false, error: error.message };
  }
}

// Hàm phụ: Sinh 3 câu trả lời AI (sẽ được dùng ở Epic 4) và lưu vào bảng replies
export async function saveGeneratedReplies(reviewId: string, repliesContent: string[]) {
  try {
    const repliesToInsert = repliesContent.map(content => ({
      review_id: reviewId,
      content,
      status: "pending",
      is_selected: false,
    }));

    const { data, error } = await supabase
      .from("replies")
      .insert(repliesToInsert)
      .select();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error("Error saving generated replies:", error);
    return { success: false, error: error.message };
  }
}
