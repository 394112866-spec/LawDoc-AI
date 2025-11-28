import { GoogleGenAI, Type } from "@google/genai";
import { Template, ContractAnalysisResult } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// --- Legal Doc Generator ---
export const parseCaseDescription = async (
  description: string,
  template: Template
): Promise<Record<string, any>> => {
  const ai = getAiClient();
  if (!ai) return {};

  const properties: Record<string, any> = {};
  template.fields.forEach(field => {
    properties[field.key] = {
      type: Type.STRING,
      description: `Field label: ${field.label}. Context: ${field.section}`,
      nullable: true
    };
  });

  const prompt = `
    You are a legal assistant specializing in Chinese law.
    Extract structured legal case information from the following user description.
    Map the information to the provided JSON schema.
    If a field is missing, leave it empty.
    
    User Description:
    ${description}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: properties,
          required: [],
        },
      },
    });

    return response.text ? JSON.parse(response.text) : {};
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};

// --- LegalAI: General Consultation ---
export const sendLegalChatMessage = async (history: {role: string, content: string}[], newMessage: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "API Key Error";

  // Convert history to Gemini format
  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));
  
  // Add new message
  contents.push({ role: 'user', parts: [{ text: newMessage }] });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: "You are 'Legal Mind', an expert Chinese AI Legal Consultant. Provide professional, concise, and legally grounded advice based on PRC laws. Always clarify that you are an AI and your advice does not constitute formal legal representation."
      }
    });
    return response.text || "I could not generate a response.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Sorry, I encountered an error processing your legal query.";
  }
};

// --- LegalCtrct: Contract Analysis ---
export const analyzeContractRisk = async (contractText: string, requirements: string): Promise<ContractAnalysisResult> => {
  const ai = getAiClient();
  if (!ai) throw new Error("API Key Missing");

  const prompt = `
    Analyze the following contract text based on the user's specific requirements and general risk control standards under Chinese Law.
    
    User Requirements/Focus: ${requirements}
    
    Contract Text:
    ${contractText.substring(0, 20000)} 
    // Truncated for safety, though model supports large context.
    
    Output JSON format matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Brief summary of the contract" },
            riskLevel: { type: Type.STRING, enum: ["low", "medium", "high"] },
            risks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  clause: { type: Type.STRING, description: "The problematic clause text or reference" },
                  issue: { type: Type.STRING, description: "Description of the risk" },
                  suggestion: { type: Type.STRING, description: "How to modify it" }
                }
              }
            },
            missingClauses: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}") as ContractAnalysisResult;
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
}