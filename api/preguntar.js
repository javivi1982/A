export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  let body;
  try {
    body = req.body;
  } catch (e) {
    return res.status(400).json({
      ok: false,
      error: "Invalid JSON",
    });
  }

  const pregunta = body?.pregunta;

  if (!pregunta) {
    return res.status(400).json({
      ok: false,
      error: "No se recibió la pregunta",
    });
  }

  // Respuesta de prueba (SIN Hugging Face aún)
  return res.status(200).json({
    ok: true,
    respuesta: "Recibido correctamente: " + pregunta
  });
}

