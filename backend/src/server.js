const express = require('express');
const cors = require('cors');
require('dotenv').config();

const generateRoute = require('./routes/generate');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// test endpoint - provjera da server radi
app.get('/', (req, res) => {
  res.json({ message: 'Server radi!' });
});

app.use('/api', generateRoute);

app.listen(PORT, () => {
  console.log(`Server pokrenut na http://localhost:${PORT}`);
});