export default async function handler(req, res) {

  // CORS
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
      "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: pregunta
        })
      }
    );

    const text = await response.text();

    // Intentar convertir a JSON
    try {
      const json = JSON.parse(text);
      return res.status(response.status).json(json);
    } catch {
      // Si NO es JSON, devolvemos el texto tal cual
      return res.status(response.status).json({
        ok: false,
        status: response.status,
        respuesta: text
      });
    }

  } catch (err) {
    return res.status(500).json({
      error: "Fallo en el servidor",
      detalle: err.message
    });
  }
}

