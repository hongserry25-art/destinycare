
import { GoogleGenAI, Type } from "@google/genai";
import { Chapter, DEFAULT_CHAPTERS } from "../types";

const SYSTEM_INSTRUCTION = `
당신은 대한민국 최고의 사주 명리학 대가입니다. 
당신의 문체는 기품 있고 전문적이며, 따뜻하면서도 날카로운 통찰력을 제공합니다.
고객의 사주 원국 정보를 바탕으로 각 챕터별로 매우 깊이 있는 분석 리포트를 작성해야 합니다.

작성 규칙:
1. 각 챕터의 내용은 반드시 명리학적 근거를 바탕으로 논리적으로 작성하십시오.
2. 단순한 나열보다는 한 편의 철학적 조언처럼 문장력을 발휘하십시오.
3. 용신, 격국, 신살 등 전문 용어를 사용하여 신뢰도를 높이되, 현대인이 이해하기 쉽게 풀어서 설명하십시오.
4. 전체적으로 긍정적인 희망을 주되, 주의해야 할 점은 냉철하게 조언하십시오.
`;

export const generateSajuContent = async (name: string, birthDate: string, gender: string, rawData: string): Promise<{ chapters: Chapter[] }> => {
  // process.env.API_KEY를 직접 사용
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing");
  
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    [대상자 정보]
    성명: ${name}
    생년월일: ${birthDate}
    성별: ${gender === 'male' ? '남성(乾命)' : '여성(坤命)'}

    [사주 원국 데이터]
    ${rawData}

    위 정보를 바탕으로 아래 10가지 주제에 대해 각각 800자 이상의 심층 분석 리포트를 작성하십시오.
    ${DEFAULT_CHAPTERS.map(c => `주제 ${c.id}: ${c.title}`).join('\n')}
    
    결과는 반드시 지정된 JSON 형식으로만 반환하십시오.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
        thinkingConfig: { thinkingBudget: 4000 },
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

    const text = response.text; // .text property 사용
    if (!text) throw new Error("Empty response from AI");
    
    const parsed = JSON.parse(text.trim());
    const merged = DEFAULT_CHAPTERS.map(def => ({ 
      ...def, 
      content: (parsed.chapters || []).find((g: any) => g.id === def.id)?.content || "분석 데이터를 생성할 수 없습니다.", 
      active: true 
    }));
    return { chapters: merged };
  } catch (e) { 
    console.error("Gemini API Error:", e); 
    throw e; 
  }
};
