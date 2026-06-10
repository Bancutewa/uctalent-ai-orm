"use server";

import { geminiConfig } from "@/config/gemini";
import {
  GoogleGenerativeAI,
  SchemaType,
} from "@google/generative-ai";

export async function generateRepliesAction(
  reviewContent: string,
  rating: number,
) {
  try {
    if (!geminiConfig.apiKey) {
      return {
        success: false as const,
        error: "GEMINI_API_KEY chưa được cấu hình trong môi trường.",
      };
    }

    const hasContent =
      reviewContent && reviewContent.trim().length > 0;
    if (!hasContent && !rating) {
      return {
        success: false as const,
        error: "Đánh giá không có nội dung và không có số sao.",
      };
    }

    const genAI = new GoogleGenerativeAI(geminiConfig.apiKey);

    const model = genAI.getGenerativeModel({
      model: geminiConfig.model,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            standard: {
              type: SchemaType.STRING,
              description:
                "Phản hồi tiêu chuẩn, lịch sự, chuyên nghiệp",
            },
            friendly: {
              type: SchemaType.STRING,
              description: "Phản hồi thân thiện, gần gũi, ấm áp",
            },
            fixing: {
              type: SchemaType.STRING,
              description:
                "Phản hồi khắc phục/hỗ trợ giải quyết vấn đề",
            },
          },
          required: ["standard", "friendly", "fixing"],
        },
      },
    });

    const ratingLabel =
      rating >= 4
        ? "tích cực"
        : rating === 3
          ? "trung lập"
          : "tiêu cực";
    const contentBlock = hasContent
      ? `Nội dung: "${reviewContent}"`
      : `(Khách hàng không để lại nội dung, chỉ đánh giá ${rating} sao)`;

    const apologyInstruction =
      rating <= 2
        ? `\nLƯU Ý QUAN TRỌNG: Đây là đánh giá TIÊU CỰC (${rating}/5 sao). Tất cả 3 phương án phản hồi đều PHẢI: chân thành xin lỗi khách hàng, thừa nhận sự cố/thiếu sót, cam kết cải thiện và mời khách quay lại trải nghiệm dịch vụ tốt hơn.`
        : rating === 3
          ? `\nLƯU Ý: Đây là đánh giá TRUNG LẬP. Hãy cảm ơn và hỏi thêm ý kiến để cải thiện dịch vụ.`
          : "";

    const prompt = `
Bạn là chuyên gia chăm sóc khách hàng chuyên nghiệp của một cơ sở kinh doanh dịch vụ du lịch/địa điểm.
Hãy soạn thảo phản hồi bằng tiếng Việt cho đánh giá của khách hàng dưới đây.

Thông tin đánh giá:
- Số sao: ${rating}/5 (${ratingLabel})
- ${contentBlock}
${apologyInstruction}

Hãy viết đúng 3 phương án phản hồi với 3 phong cách khác nhau:
1. "standard": Phản hồi lịch sự, chuẩn mực, chuyên nghiệp. Cảm ơn và ghi nhận ý kiến (hoặc xin lỗi nếu đánh giá tiêu cực).
2. "friendly": Phản hồi gần gũi, nồng nhiệt, ấm áp và tự nhiên (hoặc xin lỗi chân thành nếu tiêu cực).
3. "fixing": Phản hồi hướng giải quyết/hỗ trợ — nếu tiêu cực: xin lỗi sâu sắc và đề xuất giải pháp cụ thể; nếu tích cực: cam kết duy trì/nâng cấp dịch vụ.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse JSON
    const parsedData = JSON.parse(responseText);

    return {
      success: true as const,
      data: parsedData as {
        standard: string;
        friendly: string;
        fixing: string;
      },
    };
  } catch (error: any) {
    console.error("Gemini Generate Replies Error:", error);
    return {
      success: false as const,
      error:
        error.message || "Không thể tạo phản hồi tự động bằng AI.",
    };
  }
}
