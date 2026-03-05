export default async function handler(req, res) {
  try {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const sheetsUrl = process.env.SHEETS_API_URL || process.env.VITE_SHEETS_API_URL;
    if (!sheetsUrl) {
      return res.status(500).json({ ok: false, error: "Missing SHEETS_API_URL in deployment env" });
    }

    const method = (req.method || "GET").toUpperCase();

    if (method === "GET") {
      const r = await fetch(sheetsUrl, { method: "GET" });
      const text = await r.text();
      res.setHeader("Content-Type", "application/json");
      return res.status(200).send(text);
    }

    if (method === "POST") {
      const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
      const r = await fetch(sheetsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
      });
      const text = await r.text();
      res.setHeader("Content-Type", "application/json");
      return res.status(200).send(text);
    }

    return res.status(405).json({ ok: false, error: "Method not allowed" });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || "Proxy error" });
  }
}
