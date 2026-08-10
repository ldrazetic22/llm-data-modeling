const { GoogleGenAI } = require('@google/genai');
const systemPrompt = require('../prompts/systemPrompt');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Gemini koristi pojednostavljeni OpenAPI-stil sheme - bez "additionalProperties"
// i bez nekih strict-mode ključnih riječi koje OpenAI podržava. Zato definiramo
// posebnu verziju sheme ovdje, umjesto da re-koristimo modelSchema.js 1:1.
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

/**
 * Generira ERA model iz tekstualnog opisa poslovnog slučaja koristeći Gemini.
 * @param {string} description - tekstualni opis poslovnog slučaja
 * @returns {Promise<object>} - parsirani ERA model (entities, relationships)
 */
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