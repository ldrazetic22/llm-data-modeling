const express = require('express');
const router = express.Router();
const { generateModel } = require('../providers');
const { jsonToMermaid } = require('../utils/jsonToMermaid');
const { validateModel } = require('../schema/validate');
const { normalizeModel } = require('../utils/normalize');
const { eraToRelational } = require('../utils/eraToRelational');
const { relationalToText } = require('../utils/relationalToText');
const { logGeneration } = require('../utils/logger');

router.post('/generate-model', async (req, res) => {
  const { description, provider } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'Nedostaje opis poslovnog slučaja (description).' });
  }

  const selectedProvider = provider || 'openai';

  try {
    const { model: rawModel, usage, durationMs } = await generateModel(selectedProvider, description);
    const model = normalizeModel(rawModel);

    const validation = validateModel(model);
    if (!validation.success) {
      return res.status(422).json({
        error: 'Generirani model nije prošao validaciju.',
        details: validation.errors
      });
    }

    const mermaid = jsonToMermaid(model);
    const relationalSchema = eraToRelational(model);
    const relationalText = relationalToText(relationalSchema);

    logGeneration({
      provider: selectedProvider,
      description,
      durationMs,
      usage,
      mermaid,
      valid: true
    });

    res.json({ model, mermaid, relationalSchema, relationalText, provider: selectedProvider, durationMs, usage });
  } catch (error) {
    console.error(`Greška pri pozivu ${selectedProvider} providera:`, error);
    res.status(500).json({ error: 'Greška pri generiranju modela.' });
  }
});

module.exports = router;