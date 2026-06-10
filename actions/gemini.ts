"use server";

import { geminiConfig } from "@/config/gemini";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateTextAction(prompt: string) {
  try {
    const genAI = new GoogleGenerativeAI(geminiConfig.apiKey);
    const model = genAI.getGenerativeModel({ model: geminiConfig.model });
    
    const result = await model.generateContent(prompt);
    
    return { success: true, data: result.response.text() };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return { success: false, error: error.message || "Đã có lỗi xảy ra khi gọi AI" };
  }
}
