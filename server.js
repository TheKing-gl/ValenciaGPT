
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/ask', async (req, res) => {
  const prompt = req.body.prompt;
  const token = process.env.HUGGINGFACE_TOKEN;

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    const data = await response.json();
    res.json(data[0]?.generated_text || 'No response');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al conectar con Hugging Face');
  }
});

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
