const { cmd } = require('../command');
const config = require("../config");

// Système Anti-Mots Interdits
cmd({
  on: "body"
}, async (conn, m, store, {
  from,
  body,
  isGroup,
  isAdmins,
  isBotAdmins,
  reply,
  sender
}) => {
  try {
    // Liste des mots interdits
    const badWords = ["wtf", "mia", "xxx", "fuck", "sex", "huththa", "pakaya", "ponnaya", "hutto"];

    // Ne rien faire si :
    // - ce n'est pas un groupe
    // - l'auteur du message est admin
    // - le bot n'est pas admin
    if (!isGroup || isAdmins || !isBotAdmins) {
      return;
    }

    const messageText = body.toLowerCase(); // On met le message en minuscules
    const containsBadWord = badWords.some(word => messageText.includes(word));

    // Si un mot interdit est trouvé et que l'option est activée
    if (containsBadWord && config.ANTI_BAD_WORD === "true") {
      // Supprimer le message
      await conn.sendMessage(from, { delete: m.key }, { quoted: m });

      // Envoyer un avertissement
      await conn.sendMessage(from, {
        text: "🚫 ⚠️ *Langage inapproprié interdit dans ce groupe !* ⚠️ 🚫"
      }, { quoted: m });
    }
  } catch (error) {
    console.error(error);
    reply("❌ Une erreur s'est produite lors du traitement du message.");
  }
});
