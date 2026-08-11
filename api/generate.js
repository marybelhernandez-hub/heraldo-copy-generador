const MODELS = [
  'gemini-2.0-flash',
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-1.5-flash'
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { system, message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Missing message' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  const prompt = system ? `${system}\n\n${message}` : message;
  const attempts = [];

  for (const model of MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 8000,
            responseMimeType: 'application/json'
          }
        })
      });

      const rawText = await response.text();

      if (response.ok) {
        const data = JSON.parse(rawText);
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (text) return res.status(200).json({ text, model });
        attempts.push({ model, status: response.status, detail: 'Respuesta vacia' });
        continue;
      }

      attempts.push({ model, status: response.status, detail: rawText.slice(0, 400) });

    } catch (err) {
      attempts.push({ model, status: 'fetch_error', detail: err.message });
    }
  }

  return res.status(502).json({
    error: 'Gemini API error',
    attempts
  });
}
