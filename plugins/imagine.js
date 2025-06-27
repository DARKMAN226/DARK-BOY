const { cmd } = require("../command");
const axios = require("axios");
const fs = require("fs");

cmd({
  pattern: "fluxai",
  alias: ["flux", "imagine"],
  react: "🚀",
  desc: "Générer une image avec l'IA.",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { q, reply }) => {
  try {
    if (!q) return reply("Veuillez fournir une description pour l'image.");

    await reply("> *CRÉATION DE L'IMAGE ...🔥*");

    const apiUrl = `https://api.siputzx.my.id/api/ai/flux?prompt=${encodeURIComponent(q)}`;

    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    if (!response || !response.data) {
      return reply("Erreur : L'API n'a pas renvoyé d'image valide. Réessayez plus tard.");
    }

    const imageBuffer = Buffer.from(response.data, "binary");

    await conn.sendMessage(m.chat, {
      image: imageBuffer,
      caption: `💸 *Image générée par 𝔻𝔸ℝ𝕂-𝔹𝕆𝕐* 👻\n✨ Prompt : *${q}*`
    });

  } catch (error) {
    console.error("Erreur FluxAI :", error);
    reply(`Une erreur est survenue : ${error.response?.data?.message || error.message || "Erreur inconnue"}`);
  }
});

cmd({
  pattern: "stablediffusion",
  alias: ["sdiffusion", "imagine2"],
  react: "🚀",
  desc: "Générer une image avec l'IA.",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { q, reply }) => {
  try {
    if (!q) return reply("Veuillez fournir une description pour l'image.");

    await reply("> *CRÉATION DE L'IMAGE ...🔥*");

    const apiUrl = `https://api.siputzx.my.id/api/ai/stable-diffusion?prompt=${encodeURIComponent(q)}`;

    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    if (!response || !response.data) {
      return reply("Erreur : L'API n'a pas renvoyé d'image valide. Réessayez plus tard.");
    }

    const imageBuffer = Buffer.from(response.data, "binary");

    await conn.sendMessage(m.chat, {
      image: imageBuffer,
      caption: `💸 *Image générée par 𝔻𝔸ℝ𝕂-𝔹𝕆𝕐* 👻\n✨ Prompt : *${q}*`
    });

  } catch (error) {
    console.error("Erreur FluxAI :", error);
    reply(`Une erreur est survenue : ${error.response?.data?.message || error.message || "Erreur inconnue"}`);
  }
});

cmd({
  pattern: "stabilityai",
  alias: ["stability", "imagine3"],
  react: "🚀",
  desc: "Générer une image avec l'IA.",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { q, reply }) => {
  try {
    if (!q) return reply("Veuillez fournir une description pour l'image.");

    await reply("> *CRÉATION DE L'IMAGE ...🔥*");

    const apiUrl = `https://api.siputzx.my.id/api/ai/stabilityai?prompt=${encodeURIComponent(q)}`;

    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    if (!response || !response.data) {
      return reply("Erreur : L'API n'a pas renvoyé d'image valide. Réessayez plus tard.");
    }

    const imageBuffer = Buffer.from(response.data, "binary");

    await conn.sendMessage(m.chat, {
      image: imageBuffer,
      caption: `💸 *Image générée par 𝔻𝔸ℝ𝕂-𝔹𝕆𝕐* 👻\n✨ Prompt : *${q}*`
    });

  } catch (error) {
    console.error("Erreur FluxAI :", error);
    reply(`Une erreur est survenue : ${error.response?.data?.message || error.message || "Erreur inconnue"}`);
  }
});
