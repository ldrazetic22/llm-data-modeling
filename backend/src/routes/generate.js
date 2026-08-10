const express = require('express');
const router = express.Router();
const { generateModel } = require('../providers');
const { jsonToMermaid } = require('../utils/jsonToMermaid');
const { validateModel } = require('../schema/validate');

router.post('/generate-model', async (req, res) => {
  const { description, provider } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'Nedostaje opis poslovnog slučaja (description).' });
  }

  const selectedProvider = provider || 'openai'; // openai kao default ako nije navedeno

  try {
    const model = await generateModel(selectedProvider, description);

    const validation = validateModel(model);
    if (!validation.success) {
      return res.status(422).json({
        error: 'Generirani model nije prošao validaciju.',
        details: validation.errors
      });
    }

    const mermaid = jsonToMermaid(model);
    res.json({ model, mermaid, provider: selectedProvider });
  } catch (error) {
    console.error(`Greška pri pozivu ${selectedProvider} providera:`, error);
    res.status(500).json({ error: 'Greška pri generiranju modela.' });
  }
});

module.exports = router;