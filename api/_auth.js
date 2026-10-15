// Verificación de contraseña del lado del servidor.
// La contraseña vive en la variable de entorno APP_PASSWORD de Vercel,
// nunca en el código ni en el HTML que llega al navegador.
const crypto = require('crypto');

function sameString(a, b) {
  const A = Buffer.from(String(a));
  const B = Buffer.from(String(b));
  if (A.length !== B.length) return false;          // longitudes distintas: no coincide
  return crypto.timingSafeEqual(A, B);              // comparación de tiempo constante
}

// Devuelve true si la petición viene autenticada.
// Si no, ya respondió con 401 y quien llama debe cortar.
function requireAuth(req, res) {
  const user = process.env.APP_USER || 'heraldo';
  const pass = process.env.APP_PASSWORD;

  if (!pass) {
    res.status(503).send('Falta configurar APP_PASSWORD en Vercel.');
    return false;
  }

  const header = req.headers.authorization || '';
  const expected = 'Basic ' + Buffer.from(user + ':' + pass).toString('base64');

  if (!sameString(header, expected)) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Generador Heraldo", charset="UTF-8"');
    res.setHeader('Cache-Control', 'no-store');
    res.status(401).send('Acceso restringido.');
    return false;
  }
  return true;
}

module.exports = { requireAuth };
