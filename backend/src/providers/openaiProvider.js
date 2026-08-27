const OpenAI = require('openai');
const modelSchema = require('../schema/modelSchema');
const systemPrompt = require('../prompts/systemPrompt');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateModel(description) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
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

  return {
    model: parsed,
    usage: {
      inputTokens: response.usage.prompt_tokens,
      outputTokens: response.usage.completion_tokens,
      totalTokens: response.usage.total_tokens
    }
  };
}

module.exports = { generateModel };