// Sirve el generador solo a quien pase la contraseña.
// El HTML vive en /app, fuera de /public, para que Vercel NO lo publique solo.
const fs = require('fs');
const path = require('path');
const { requireAuth } = require('./_auth');

let cache = null;

module.exports = (req, res) => {
  if (!requireAuth(req, res)) return;

  try {
    if (!cache) {
      cache = fs.readFileSync(path.join(process.cwd(), 'app', 'index.html'), 'utf8');
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'private, no-store');
    res.status(200).send(cache);
  } catch (e) {
    res.status(500).send('No se pudo leer el generador: ' + e.message);
  }
};
