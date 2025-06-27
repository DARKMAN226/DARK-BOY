const { cmd } = require('../command');
const axios = require('axios');

// Clé API Gemini
const GEMINI_API_KEY = "AIzaSyAxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// État global
global.darkAiEnabled = true;
global.darkAiRPmode = false;
global.userChats = {};

const identityTriggers = [
  "t'es qui", "tes qui", "tu es qui", "c'est qui", "c ki", "ki es tu", "qui es-tu", "qui es tu",
  "who are you", "who r u"
];

const identityResponseFR = "👁️‍🗨️ *Je suis Dark-AI, une entité née dans l’obscurité, codée par Dark-DEv...* 🌑";
const identityResponseEN = "👁️‍🗨️ *I am Dark-AI, forged in shadows by the shadow exorcist: Dark-DEv...* 🌑";

function detectLanguage(text) {
  const lower = text.toLowerCase();
  const fr = ["qui", "c'est", "tu es", "tes"];
  const en = ["who", "are", "you", "what"];
  if (fr.some(k => lower.includes(k))) return 'fr';
  if (en.some(k => lower.includes(k))) return 'en';
  return 'fr';
}

// Commande : .darkai on/off, .darkai rp on/off
cmd({
  pattern: "darkai ?(.*)?",
  alias: ["dark", "darkai"],
  desc: "Activer/désactiver DarkAI (Gemini) et RP",
  category: "ai",
  react: "🌑",
  filename: __filename
}, async (conn, mek, m, { q, reply, react, isCreator }) => {
  if (!isCreator) return reply("❌ Commande réservée au propriétaire.");

  const args = q?.trim().split(/\s+/) || [];

  if (!args.length) {
    return reply(`📘 Utilisation :
.darkai on — activer Dark AI
.darkai off — désactiver Dark AI
.darkai rp on — activer mode RP
.darkai rp off — désactiver mode RP`);
  }

  if (args[0] === "on") {
    global.darkAiEnabled = true;
    await react("✅");
    return reply("🌑 *Dark AI (Gemini) activé.*");
  }

  if (args[0] === "off") {
    global.darkAiEnabled = false;
    await react("❌");
    return reply("🌕 *Dark AI désactivé.*");
  }

  if (args[0] === "rp") {
    if (args[1] === "on") {
      global.darkAiRPmode = true;
      await react("👻");
      return reply("🎭 *Mode RP activé.*");
    } else if (args[1] === "off") {
      global.darkAiRPmode = false;
      await react("🛑");
      return reply("🎭 *Mode RP désactivé.*");
    } else {
      return reply("📘 Utilisation : .darkai rp on | .darkai rp off");
    }
  }

  return reply("❓ Commande inconnue. Utilise `.darkai` pour l'aide.");
});

// Réponses automatiques Gemini
cmd({
  pattern: ".*",
  hidden: true,
  onlyInGroup: false,
  dontAddCommandList: true,
  filename: __filename
}, async (conn, mek, m, { reply, isCmd, body }) => {
  try {
    if (!global.darkAiEnabled) return;
    if (!m?.body || m.key.fromMe || isCmd || body.startsWith(".")) return;

    const sender = m.sender;
    const userMsg = body;

    if (identityTriggers.some(t => userMsg.toLowerCase().includes(t))) {
      const lang = detectLanguage(userMsg);
      return reply(lang === 'fr' ? identityResponseFR : identityResponseEN);
    }

    if (!global.userChats[sender]) global.userChats[sender] = [];
    global.userChats[sender].push({ author: "user", content: userMsg });

    const prompt = global.darkAiRPmode
      ? "Tu es DARK-AI, une entité mystérieuse et paranormale. Tes réponses sont étranges, profondes et troublantes."
      : "Tu es DARK-AI, un assistant WhatsApp intelligent, ironique et précis, développé par Dark-DEv.";

    const payload = {
      prompt: {
        context: prompt,
        messages: global.userChats[sender].slice(-10)
      },
      temperature: 0.7,
      candidate_count: 1,
      top_k: 40,
      top_p: 0.95
    };

    const { data } = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generateMessage?key=${GEMINI_API_KEY}`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    const botReply = data?.candidates?.[0]?.content || "🤖 Aucune réponse générée.";
    global.userChats[sender].push({ author: "bot", content: botReply });

    return reply(`🧠 ${botReply}`);
  } catch (err) {
    console.error("Erreur Dark-AI (Gemini):", err.response?.data || err);
    return reply("❌ Erreur avec l'API Gemini.");
  }
});
