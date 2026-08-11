const Anthropic = require('@anthropic-ai/sdk');
const modelSchema = require('../schema/modelSchema');
const systemPrompt = require('../prompts/systemPrompt');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function generateModel(description) {
  const response = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      { role: "user", content: description }
    ],
    tools: [
      {
        name: "return_era_model",
        description: "Vraća strukturirani ERA model (entiteti, atributi, relacije) izveden iz opisa poslovnog slučaja.",
        input_schema: modelSchema.schema
      }
    ],
    tool_choice: { type: "tool", name: "return_era_model" }
  });

  const toolUseBlock = response.content.find((block) => block.type === "tool_use");

  if (!toolUseBlock) {
    throw new Error("Claude nije vratio očekivani tool_use odgovor.");
  }

  return toolUseBlock.input;
}

module.exports = { generateModel };