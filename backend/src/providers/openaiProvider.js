const OpenAI = require('openai');
const modelSchema = require('../schema/modelSchema');
const systemPrompt = require('../prompts/systemPrompt');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generira ERA model iz tekstualnog opisa poslovnog slučaja koristeći OpenAI.
 * @param {string} description - tekstualni opis poslovnog slučaja
 * @returns {Promise<object>} - parsirani ERA model (entities, relationships)
 */
async function generateModel(description) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: description }
    ],
    response_format: {
      type: "json_schema",
      json_schema: modelSchema
    }
  });

  const rawContent = response.choices[0].message.content;
  const parsed = JSON.parse(rawContent);

  return parsed;
}

module.exports = { generateModel };