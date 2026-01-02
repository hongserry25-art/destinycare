import { GoogleGenAI, Type } from "@google/genai";
import { Chapter, DEFAULT_CHAPTERS } from "../types";

const SYSTEM_INSTRUCTION = `
당신은 대한민국 최고의 사주 명리학 대가입니다. 
당신의 문체는 기품 있고 전문적이며, 따뜻하면서도 날카로운 통찰력을 제공합니다.
고객의 사주 원국 정보를 바탕으로 각 챕터별로 매우 깊이 있는 분석 리포트를 작성해야 합니다.

작성 규칙:
1. 각 챕터의 내용은 반드시 800자에서 1,200자 사이로 길게 작성하십시오.
2. 단순한 나열보다는 한 편의 수필이나 철학적 조언처럼 문장력을 발휘하십시오.
3. 명리학적 용어(용신, 격국, 신살 등)를 적절히 섞어 전문성을 높이되, 현대적인 관점에서 해석하십시오.
4. "당신은 ~합니다" 보다는 "~하는 기운을 타고났습니다", "~하는 시기를 맞이하게 될 것입니다"와 같은 격조 있는 표현을 사용하십시오.
`;

export const generateSajuContent = async (name: string, birthDate: string, gender: string): Promise<{ chapters: Chapter[] }> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing");
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    대상자 성명: ${name}
    생년월일: ${birthDate}
    성별: ${gender === 'male' ? '남성' : '여성'}

    위 대상자의 사주를 정밀하게 분석하여 아래 10가지 주제에 대한 리포트를 작성하십시오.
    ${DEFAULT_CHAPTERS.map(c => `주제 ${c.id}: ${c.title}`).join('\n')}
    
    각 주제별로 심층적인 내용을 한국어로 작성하여 JSON 형식으로 반환하십시오.
  `;

  try {
    // Fix: Using gemini-3-pro-preview for complex, long-form specialized writing tasks as per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            chapters: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT, 
                properties: { 
                  id: { type: Type.NUMBER }, 
                  content: { type: Type.STRING } 
                }, 
                required: ['id', 'content'] 
              } 
            }
          },
          required: ['chapters']
        }
      }
    });

    const parsed = JSON.parse(response.text.trim());
    const merged = DEFAULT_CHAPTERS.map(def => ({ 
      ...def, 
      content: (parsed.chapters || []).find((g: any) => g.id === def.id)?.content || "데이터 생성 중 오류가 발생했습니다.", 
      active: true 
    }));
    return { chapters: merged };
  } catch (e) { 
    console.error("Gemini API Error:", e); 
    throw e; 
  }
};