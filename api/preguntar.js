export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Método no permitido" });
  }

  try {
    const { pregunta } = req.body;

    if (!pregunta) {
      return res.status(400).json({ ok: false, error: "No hay pregunta" });
    }

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
      const text = await hfResponse.text();
      return res.status(500).json({
        ok: false,
        error: "Error en Hugging Face",
        detalle: text
      });
    }

    const data = await hfResponse.json();

    const respuesta =
      Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text
        : "No se pudo generar respuesta";

    res.status(200).json({ ok: true, respuesta });

  } catch (err) {
    res.status(500).json({
      ok: false,
      error: "Error interno",
      detalle: err.message
    });
  }
}

