require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });
const app = express();
const PORT = 3000;

// Endpoint para subir archivos
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const semana = req.body.semana || 'semana-1';
  if (!file) return res.status(400).send('No se recibió archivo');

  // Lee el archivo y lo convierte a base64
  const content = fs.readFileSync(file.path, { encoding: 'base64' });

  // Configura la petición a GitHub
  const repo = 'josueherrerabastidas7-cmyk/pagina-web-para-los-trabajos';
  const path = `archivos/${semana}/${file.originalname}`;
  const url = `https://api.github.com/repos/${repo}/contents/${path}`;

  try {
    await axios.put(url, {
      message: `Subir archivo a ${semana}`,
      content,
    }, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        'User-Agent': 'trabajos-upla'
      }
    });
    res.send('Archivo subido a GitHub');
  } catch (err) {
    res.status(500).send('Error al subir a GitHub: ' + err.message);
  } finally {
    fs.unlinkSync(file.path); // Borra el archivo temporal
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
