const openaiProvider = require('./openaiProvider');
const claudeProvider = require('./claudeProvider');
const geminiProvider = require('./geminiProvider');

const providers = {
  openai: openaiProvider,
  claude: claudeProvider,
  gemini: geminiProvider
};

/**
 * Generira ERA model koristeći odabrani provider.
 * @param {string} providerName - "openai" | "claude" | "gemini"
 * @param {string} description - tekstualni opis poslovnog slučaja
 * @returns {Promise<object>} - parsirani ERA model
 */
async function generateModel(providerName, description) {
  const provider = providers[providerName];

  if (!provider) {
    throw new Error(`Nepoznat provider: "${providerName}". Dostupni: ${Object.keys(providers).join(', ')}`);
  }

  return provider.generateModel(description);
}

module.exports = { generateModel, availableProviders: Object.keys(providers) };