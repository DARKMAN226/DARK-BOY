const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "fancy",
  alias: ["font", "style"],
  react: "✍️",
  desc: "Convertir du texte en différentes polices stylées.",
  category: "tools",
  filename: __filename
}, async (conn, m, store, { from, quoted, args, q, reply }) => {
  try {
    // Vérifier qu'un texte est fourni
    if (!q) {
      return reply("❎ Veuillez fournir un texte à convertir.\n\n*Exemple:* .fancy Bonjour");
    }

    // Appeler l'API pour récupérer les différentes polices
    const apiUrl = `https://www.dark-yasiya-api.site/other/font?text=${encodeURIComponent(q)}`;
    const response = await axios.get(apiUrl);

    // Vérifier le statut de la réponse
    if (!response.data.status) {
      return reply("❌ Erreur lors de la récupération des polices. Merci de réessayer plus tard.");
    }

    // Construire le message avec toutes les polices reçues
    const fonts = response.data.result
      .map(item => `*${item.name}:*\n${item.result}`)
      .join("\n\n");

    const resultText = `✨ *Convertisseur de polices stylées* ✨\n\n${fonts}\n\n> *Powered by DARK-DEV*`;

    // Envoyer le résultat à l'utilisateur
    await conn.sendMessage(from, { text: resultText }, { quoted: m });

  } catch (error) {
    console.error("❌ Erreur dans la commande fancy :", error);
    reply("⚠️ Une erreur est survenue lors de la récupération des polices.");
  }
});
