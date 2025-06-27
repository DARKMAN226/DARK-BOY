const { cmd } = require("../command");

cmd({
  pattern: "vv2",
  alias: ["wah", "ohh", "oho", "🙂", "nice", "ok"],
  desc: "Propriétaire uniquement - Récupère un message vu une fois",
  category: "owner",
  filename: __filename
}, async (client, message, match, { from, isCreator }) => {
  try {
    // Vérifie si l'utilisateur est le propriétaire du bot
    if (!isCreator) {
      return; // Ne rien faire si ce n'est pas le créateur
    }

    // Vérifie si un message est cité
    if (!match.quoted) {
      return await client.sendMessage(from, {
        text: "*🍁 Veuillez répondre à un message 'vu une seule fois' !*"
      }, { quoted: message });
    }

    const buffer = await match.quoted.download();
    const mtype = match.quoted.mtype;
    const options = { quoted: message };

    let messageContent = {};

    switch (mtype) {
      case "imageMessage":
        messageContent = {
          image: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "image/jpeg"
        };
        break;
      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "video/mp4"
        };
        break;
      case "audioMessage":
        messageContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: match.quoted.ptt || false
        };
        break;
      default:
        return await client.sendMessage(from, {
          text: "❌ Seuls les messages *image*, *vidéo* ou *audio* sont pris en charge."
        }, { quoted: message });
    }

    // Envoie le média directement dans les messages privés de l'utilisateur
    await client.sendMessage(message.sender, messageContent, options);
    
  } catch (error) {
    console.error("Erreur vv :", error);
    await client.sendMessage(from, {
      text: "❌ Une erreur est survenue lors de la récupération du message :\n" + error.message
    }, { quoted: message });
  }
});
