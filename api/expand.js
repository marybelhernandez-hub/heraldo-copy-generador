// Extensión vertical de fotografías con los modelos de imagen de Gemini
// (familia "Nano Banana"). Imagen quedó deprecado en agosto de 2026.

const MODELS = [
  'gemini-3.1-flash-image',
  'gemini-2.5-flash-image',
  'gemini-3.1-flash-lite-image'
];

const PROMPT = [
  'Extiende esta fotografia UNICAMENTE en sentido vertical (arriba y/o abajo)',
  'hasta alcanzar la proporcion solicitada.',
  '',
  'PERMITIDO: continuar superficies de fondo que ya existen en la imagen',
  '(cielo, muros, piso, pavimento, vegetacion, fondo desenfocado, texturas planas).',
  '',
  'PROHIBIDO ABSOLUTAMENTE:',
  '- Agregar personas, rostros, manos, animales, vehiculos u objetos nuevos.',
  '- Completar, inventar o modificar partes de personas u objetos ya presentes.',
  '- Agregar texto, logotipos, letreros o senalizacion.',
  '- Cambiar colores, iluminacion, encuadre o contenido de la zona original.',
  '- Recortar, escalar o alterar el contenido original en cualquier forma.',
  '',
  'La fotografia original debe quedar intacta y completamente visible.',
  'La zona extendida debe ser visualmente neutra y no debe aportar informacion nueva.'
].join('\n');

// Mismo candado que api/app.js. Se repite aqui a proposito: evita mezclar
// estilos de modulo (este archivo usa import/export, app.js usa require)
// y asegura que nadie pueda gastar la cuota de Gemini sin la contrasena.
function autorizado(req, res) {
  const pass = process.env.APP_PASSWORD;
  if (!pass) { res.status(503).json({ error: 'Falta configurar APP_PASSWORD' }); return false; }
  const user = process.env.APP_USER || 'heraldo';
  const esperado = 'Basic ' + Buffer.from(user + ':' + pass).toString('base64');
  if ((req.headers.authorization || '') !== esperado) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Generador Heraldo", charset="UTF-8"');
    res.status(401).json({ error: 'Acceso restringido' });
    return false;
  }
  return true;
}

export default async function handler(req, res) {
  if (!autorizado(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { imageBase64, mimeType, aspectRatio } = req.body || {};
  if (!imageBase64) return res.status(400).json({ error: 'Falta la imagen' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key no configurada' });

  const ar = aspectRatio === '9:16' ? '9:16' : '4:5';
  const attempts = [];

  for (const model of MODELS) {
    for (const withConfig of [true, false]) {
      try {
        const body = {
          contents: [{
            parts: [
              { inline_data: { mime_type: mimeType || 'image/jpeg', data: imageBase64 } },
              { text: PROMPT + '\n\nProporcion objetivo: ' + ar }
            ]
          }],
          generationConfig: withConfig
            ? { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: ar } }
            : { responseModalities: ['IMAGE'] }
        };

        const r = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
        );

        const raw = await r.text();
        if (!r.ok) { attempts.push({ model, withConfig, status: r.status, detail: raw.slice(0, 300) }); continue; }

        const data = JSON.parse(raw);
        const parts = data?.candidates?.[0]?.content?.parts || [];
        const img = parts.find(p => p.inlineData?.data || p.inline_data?.data);
        const out = img?.inlineData?.data || img?.inline_data?.data;

        if (out) {
          const mt = img?.inlineData?.mimeType || img?.inline_data?.mime_type || 'image/png';
          return res.status(200).json({ image: out, mimeType: mt, model });
        }
        attempts.push({ model, withConfig, status: 200, detail: 'sin imagen en la respuesta' });
      } catch (err) {
        attempts.push({ model, withConfig, status: 'error', detail: err.message });
      }
    }
  }

  return res.status(502).json({ error: 'No se pudo extender la imagen', attempts });
}
