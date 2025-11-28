import { GoogleGenAI, Type } from "@google/genai";
import { Template } from "../types";

export const parseCaseDescription = async (
  description: string,
  template: Template
): Promise<Record<string, any>> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found. Returning empty object.");
    return {};
  }

  const ai = new GoogleGenAI({ apiKey });

  // Construct a schema based on the template fields
  const properties: Record<string, any> = {};
  const requiredFields: string[] = [];

  template.fields.forEach(field => {
    properties[field.key] = {
      type: Type.STRING,
      description: `Field label: ${field.label}. Context: ${field.section}`,
      nullable: true
    };
    requiredFields.push(field.key);
  });

  const prompt = `
    You are a legal assistant specializing in Chinese law.
    Extract structured legal case information from the following user description.
    Map the information to the provided JSON schema.
    If a field is missing in the description, leave it null or empty string.
    
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
          required: [], // Make fields optional to avoid errors on partial data
        },
      },
    });

    const result = response.text ? JSON.parse(response.text) : {};
    return result;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};