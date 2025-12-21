export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight CORS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Solo POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { pregunta } = req.body;

    if (!pregunta) {
      return res.status(400).json({
        ok: false,
        error: "No se ha enviado ninguna pregunta"
      });
    }

    // --- LLAMADA A HUGGING FACE ---
    const hfResponse = await fetch(
      "https://router.huggingface.co/hf-inference/models/google/flan-t5-base",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: pregunta
        })
      }
    );

    if (!hfResponse.ok) {
      const texto = await hfResponse.text();
      return res.status(500).json({
        ok: false,
        error: "Error en Hugging Face",
        detalle: texto
      });
    }

    const data = await hfResponse.json();

    return res.status(200).json({
      ok: true,
      respuesta: data[0]?.generated_text || "Sin respuesta"
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Fallo en el servidor",
      detalle: error.message
    });
  }
}

