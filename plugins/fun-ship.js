const axios = require("axios");
const fetch = require("node-fetch");
const { sleep } = require('../lib/functions');
const { cmd, commands } = require("../command");
const config = require("../config");

cmd({
  pattern: "ship",
  alias: ["match", "love"],
  desc: "Associe aléatoirement l'utilisateur de la commande avec un autre membre du groupe.",
  react: "❤️",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { from, isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ Cette commande ne peut être utilisée qu'en groupe.");

    const specialNumber = config.DEV ? `${config.DEV}@s.whatsapp.net` : null; // Format WhatsApp
    const participants = groupMetadata.participants.map(user => user.id);
    
    let randomPair;

    if (specialNumber && participants.includes(specialNumber) && sender !== specialNumber) {
      randomPair = specialNumber; // Associer toujours avec ce numéro si disponible
    } else {
      // Associer aléatoirement en s'assurant que ce n'est pas la même personne
      do {
        randomPair = participants[Math.floor(Math.random() * participants.length)];
      } while (randomPair === sender);
    }

    const message = `💘 *Match trouvé !* 💘\n❤️ @${sender.split("@")[0]} + @${randomPair.split("@")[0]}\n💖 Félicitations ! 🎉`;

    await conn.sendMessage(from, {
      text: message,
      contextInfo: {
        mentionedJid: [sender, randomPair],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363422353392657@newsletter",
          newsletterName: "DARK-BOY",
          serverMessageId: 143
        }
      }
    });

  } catch (error) {
    console.error("❌ Erreur dans la commande ship :", error);
    reply("⚠️ Une erreur est survenue lors du traitement de la commande. Veuillez réessayer.");
  }
});
