import { GoogleGenAI } from "@google/genai";
import { Product, KaratType } from "../types";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateProductDescription = async (product: Partial<Product>): Promise<string> => {
  try {
    const ai = getAIClient();
    const prompt = `
      اكتب وصفاً تسويقياً جذاباً وقصيراً لقطعة مجوهرات بالمواصفات التالية لمحلات ذهب:
      النوع: ${product.name || 'غير محدد'}
      العيار: ${product.karat || 'غير محدد'}
      الوزن: ${product.weight || 0} جرام
      التصنيف: ${product.category || 'عام'}
      
      الرد يجب أن يكون باللغة العربية وجاهز للنشر على وسائل التواصل الاجتماعي.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "عذراً، حدث خطأ أثناء توليد الوصف. يرجى المحاولة لاحقاً.";
  }
};

export const analyzeSalesTrends = async (salesData: any[]): Promise<string> => {
  try {
    const ai = getAIClient();
    const prompt = `
      بصفتك خبير اقتصادي في سوق الذهب، قم بتحليل بيانات المبيعات التالية وقدم نصائح باللغة العربية للمدير:
      ${JSON.stringify(salesData.slice(0, 20))}
      
      ركز على:
      1. العيارات الأكثر مبيعاً.
      2. نصيحة للمخزون.
      3. نصيحة تسويقية.
      اجعل الرد مختصراً في نقاط.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "لا يمكن إجراء التحليل حالياً.";
  }
};