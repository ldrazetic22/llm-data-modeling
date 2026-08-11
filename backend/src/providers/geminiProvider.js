const { GoogleGenAI } = require('@google/genai');
const systemPrompt = require('../prompts/systemPrompt');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const geminiResponseSchema = {
  type: "object",
  properties: {
    entities: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          attributes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                type: {
                  type: "string",
                  enum: ["string", "int", "float", "boolean", "date", "datetime"]
                },
                isPK: { type: "boolean" }
              },
              required: ["name", "type", "isPK"]
            }
          }
        },
        required: ["name", "attributes"]
      }
    },
    relationships: {
      type: "array",
      items: {
        type: "object",
        properties: {
          from: { type: "string" },
          to: { type: "string" },
          type: {
            type: "string",
            enum: ["1:1", "1:N", "N:M"]
          },
          description: { type: "string" }
        },
        required: ["from", "to", "type", "description"]
      }
    }
  },
  required: ["entities", "relationships"]
};

async function generateModel(description) {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: description,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: geminiResponseSchema
    }
  });

  const parsed = JSON.parse(response.text);
  return parsed;
}

module.exports = { generateModel };