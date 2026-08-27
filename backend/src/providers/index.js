const openaiProvider = require('./openaiProvider');
const claudeProvider = require('./claudeProvider');
const geminiProvider = require('./geminiProvider');

const providers = {
  openai: openaiProvider,
  claude: claudeProvider,
  gemini: geminiProvider
};

async function generateModel(providerName, description) {
  const provider = providers[providerName];

  if (!provider) {
    throw new Error(`Nepoznat provider: "${providerName}". Dostupni: ${Object.keys(providers).join(', ')}`);
  }

  const start = Date.now();
  const { model, usage } = await provider.generateModel(description);
  const durationMs = Date.now() - start;

  return { model, usage, durationMs };
}

module.exports = { generateModel, availableProviders: Object.keys(providers) };