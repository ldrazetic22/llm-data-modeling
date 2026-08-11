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

  return provider.generateModel(description);
}

module.exports = { generateModel, availableProviders: Object.keys(providers) };