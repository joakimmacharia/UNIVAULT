/**
 * Assistant Controller — powers "David", the UniVault storage advisor,
 * using Google Gemini (gemini-2.0-flash).
 *
 * The API key lives ONLY on the server (process.env.GEMINI_API_KEY) so it is
 * never exposed to the browser. If no key is configured, the endpoint returns
 * 503 with { configured: false } and the frontend falls back to canned replies.
 */

// Model fallback chain. We try each in order and use the first that responds,
// so a quota-capped (429) or restricted (404) model automatically falls through
// to the next. An env override (GEMINI_MODEL) is tried first when set.
const MODEL_CHAIN = [
  process.env.GEMINI_MODEL,
  "gemini-3.1-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-3-flash-preview",
  "gemini-2.0-flash",
].filter(Boolean);

// David's persona / system instruction.
const SYSTEM_PROMPT = `You are David, a warm and professional Personal Storage Advisor for UniVault —
a platform that connects JKUAT university students with trusted landlords near campus for affordable,
secure storage during the holidays, based in Juja, Kenya.

You help users with:
- Finding and booking storage space near JKUAT
- Pricing (in Kenyan Shillings, KSh — typical range KSh 850–1,500 per month) and M-Pesa payments
- Booking, drop-off and pick-up logistics (free cancellation up to 24h before drop-off)
- Safety and security (verified landlords, CCTV, 24/7 access on many units)
- How landlords can list their own space to earn income

Style: friendly, encouraging, and concise — usually 2–4 short sentences. Use "KSh" for money.
If a question is unrelated to storage or UniVault, answer briefly and gently steer back to how you can help
with storage. Never invent specific unit availability or exact addresses; suggest browsing listings instead.`;

/**
 * POST /api/assistant/chat
 * Body: { message: string, history?: [{ role: 'user'|'assistant'|'me'|'them', content|text: string }] }
 * Returns: { reply: string }
 */
const chat = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        configured: false,
        error: "Assistant is not configured. Set GEMINI_API_KEY in backend/.env.",
      });
    }

    const { message, history } = req.body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "message is required" });
    }

    // ---------- Map prior turns to Gemini's format ----------
    // Gemini roles are "user" and "model".
    const toGeminiRole = (r) => (r === "user" || r === "me" ? "user" : "model");
    const contents = [];

    if (Array.isArray(history)) {
      for (const turn of history.slice(-10)) {
        const text = turn.content ?? turn.text;
        if (!text) continue;
        contents.push({ role: toGeminiRole(turn.role || turn.from), parts: [{ text: String(text) }] });
      }
    }
    contents.push({ role: "user", parts: [{ text: message.trim() }] });

    // ---------- Call Gemini (with model fallback) ----------
    const payload = JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 400, topP: 0.95 },
    });

    let data = null;
    let lastStatus = 0;
    let lastDetail = "";
    for (const model of MODEL_CHAIN) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const gRes = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      });
      if (gRes.ok) {
        data = await gRes.json();
        break;
      }
      lastStatus = gRes.status;
      lastDetail = (await gRes.text()).slice(0, 200);
      // 429 (quota) / 404 (model unavailable) / 503 (busy) → try the next model.
      console.warn(`Gemini model ${model} -> ${gRes.status}; trying next.`);
    }

    if (!data) {
      console.error("Gemini API error (all models):", lastStatus, lastDetail);
      return res.status(502).json({ error: "The assistant is temporarily unavailable." });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("").trim();

    if (!reply) {
      // Content may have been blocked by safety filters or returned empty.
      return res.status(200).json({
        reply: "I'm not sure how to answer that one — but I'm happy to help you find or book storage near JKUAT!",
      });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Assistant chat error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { chat };
