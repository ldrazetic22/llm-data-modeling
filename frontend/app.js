import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

mermaid.initialize({ startOnLoad: false });

const generateBtn = document.getElementById('generateBtn');
const descriptionInput = document.getElementById('description');
const providerSelect = document.getElementById('provider');
const statusDiv = document.getElementById('status');
const diagramContainer = document.getElementById('diagram-container');
const jsonOutput = document.getElementById('json-output');

generateBtn.addEventListener('click', async () => {
  const description = descriptionInput.value.trim();
  const provider = providerSelect.value;

  if (!description) {
    statusDiv.textContent = 'Molimo unesite opis poslovnog slučaja.';
    return;
  }

  statusDiv.textContent = `Generiram model (${provider})...`;
  diagramContainer.innerHTML = '';
  jsonOutput.textContent = '';

  try {
    const response = await fetch('http://localhost:3000/api/generate-model', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, provider })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server je vratio grešku: ${response.status}`);
    }

    const data = await response.json();

    jsonOutput.textContent = JSON.stringify(data.model, null, 2);

    const { svg } = await mermaid.render('era-diagram', data.mermaid);
    diagramContainer.innerHTML = svg;

    statusDiv.textContent = `Model uspješno generiran (${data.provider}).`;
  } catch (error) {
    console.error(error);
    statusDiv.textContent = `Greška: ${error.message}`;
  }
});