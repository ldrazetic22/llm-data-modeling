import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
import elkLayouts from 'https://cdn.jsdelivr.net/npm/@mermaid-js/layout-elk@0/dist/mermaid-layout-elk.esm.min.mjs';

mermaid.registerLayoutLoaders(elkLayouts);
mermaid.initialize({
  startOnLoad: false,
  layout: 'elk',
  er: {
    diagramPadding: 20,
    entityPadding: 15,
    minEntityWidth: 100,
    minEntityHeight: 75
  }
});

// ---- Theme toggle ----
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ---- Tabs ----
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    tabButtons.forEach((b) => b.classList.remove('active'));
    tabContents.forEach((c) => c.classList.remove('active'));

    btn.classList.add('active');
    document.querySelector(`[data-tab-content="${btn.dataset.tab}"]`).classList.add('active');
  });
});

// ---- Generiranje modela ----
const generateBtn = document.getElementById('generateBtn');
const descriptionInput = document.getElementById('description');
const providerSelect = document.getElementById('provider');
const statusDiv = document.getElementById('status');
const diagramContainer = document.getElementById('diagram-container');
const relationalSchemaDiv = document.getElementById('relational-schema');
const jsonOutput = document.getElementById('json-output');

generateBtn.addEventListener('click', async () => {
  const description = descriptionInput.value.trim();
  const provider = providerSelect.value;

  if (!description) {
    statusDiv.textContent = 'Molimo unesite opis poslovnog slučaja.';
    return;
  }

  statusDiv.textContent = `Generiram model (${provider})...`;
  diagramContainer.classList.add('empty-state');
  diagramContainer.textContent = 'Generiram...';
  relationalSchemaDiv.classList.add('empty-state');
  relationalSchemaDiv.textContent = 'Generiram...';
  jsonOutput.textContent = '';

  try {
    const response = await fetch('https://llm-data-modeling-backend.onrender.com/api/generate-model',/*'http://localhost:3000/api/generate-model',*/{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, provider })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server je vratio grešku: ${response.status}`);
    }

    const data = await response.json();

    jsonOutput.classList.remove('empty-state');
    jsonOutput.textContent = JSON.stringify(data.model, null, 2);

    diagramContainer.classList.remove('empty-state');
    const { svg } = await mermaid.render('era-diagram', data.mermaid);
    diagramContainer.innerHTML = svg;

    relationalSchemaDiv.classList.remove('empty-state');
    relationalSchemaDiv.innerHTML = data.relationalText;

    statusDiv.textContent = `Model uspješno generiran (${data.provider}).`;
  } catch (error) {
    console.error(error);
    statusDiv.textContent = `Greška: ${error.message}`;
    diagramContainer.textContent = 'Došlo je do greške.';
    relationalSchemaDiv.textContent = 'Došlo je do greške.';
  }
});