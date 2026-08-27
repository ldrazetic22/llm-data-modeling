const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '..', '..', 'logs', 'generation-log.jsonl');

function logGeneration(entry) {
  try {
    const dir = path.dirname(LOG_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const line = JSON.stringify({ timestamp: new Date().toISOString(), ...entry }) + '\n';
    fs.appendFileSync(LOG_FILE, line);
  } catch (error) {
    console.error('Greška pri zapisivanju loga:', error);
  }
}

module.exports = { logGeneration };