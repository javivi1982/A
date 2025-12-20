export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).send("Only POST allowed");
  }

  try {
    const { pregunta } = req.body;

    const response = await fetch(
      "https://router.huggingface.co/models/google/flan-t5-base",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: pregunta })
      }
    );

    const text = await response.text();

    // 🔎 DEVOLVEMOS TODO, incluso errores
    res.status(200).json({
      ok: response.ok,
      status: response.status,
      respuesta: text
    });

  } catch (err) {
    res.status(500).json({
      error: "Fallo en el servidor",
      detalle: err.message
    });
  }
}

