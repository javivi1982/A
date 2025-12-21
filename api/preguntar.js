export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Only POST allowed" });
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { pregunta } = req.body;

    const hfResponse = await fetch(
      "https://router.huggingface.co/hf-inference/models/google/flan-t5-base",
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

    let texto = "Sin respuesta";

    if (Array.isArray(data) && data[0]?.generated_text) {
      texto = data[0].generated_text;
    } else if (data.generated_text) {
      texto = data.generated_text;
    }

    res.json({
      ok: true,
      respuesta: texto
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: "Fallo en el servidor",
      detalle: error.message
    });
  }
}

