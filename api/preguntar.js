export default async function handler(req, res) {
  // 👉 CABECERAS CORS (ESTO ES CLAVE)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // 👉 Respuesta al preflight CORS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).send("Only POST allowed");
  }

  try {
    const { pregunta } = req.body;

    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-small",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: pregunta
        })
      }
    );

    const data = await hfResponse.json();

    res.status(200).json({
      ok: true,
      respuesta: data[0]?.generated_text || "Sin respuesta"
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: "Fallo en el servidor",
      detalle: error.message
    });
  }
}

