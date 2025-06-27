const { cmd } = require('../command');

//✨ Développé et amélioré par DARK-DEV
cmd({
  pattern: "hidetag",
  alias: ["tag", "h"],  
  react: "🔊",
  desc: "Taguer tous les membres avec un message ou un média",
  category: "group",
  use: '.hidetag Bonjour à tous !',
  filename: __filename
},
async (conn, mek, m, {
  from, q, isGroup, isCreator, isAdmins,
  participants, reply
}) => {
  try {
    const isUrl = (url) => {
      return /https?:\/\/(www\.)?[\w\-@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([\w\-@:%_\+.~#?&//=]*)/.test(url);
    };

    if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans un groupe.");
    if (!isAdmins && !isCreator) return reply("🚫 Seuls les administrateurs peuvent utiliser cette commande.");

    const mentionAll = { mentions: participants.map(u => u.id) };

    if (!q && !m.quoted) {
      return reply("📌 Veuillez envoyer un message ou répondre à un message pour taguer tout le monde.");
    }

    // ➤ Si c'est une réponse à un message
    if (m.quoted) {
      const type = m.quoted.mtype || '';
      
      // ➤ Si c’est un message texte
      if (type === 'extendedTextMessage') {
        return await conn.sendMessage(from, {
          text: `📣 *Annonce :*\n${m.quoted.text || 'Pas de contenu.'}`,
          ...mentionAll
        }, { quoted: mek });
      }

      // ➤ Si c'est un média
      if (['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage'].includes(type)) {
        try {
          const buffer = await m.quoted.download?.();
          if (!buffer) return reply("❌ Échec du téléchargement du média cité.");

          let content;
          switch (type) {
            case "imageMessage":
              content = { image: buffer, caption: "📷 Image taguée à tous", ...mentionAll };
              break;
            case "videoMessage":
              content = { 
                video: buffer, 
                caption: "🎥 Vidéo taguée à tous", 
                gifPlayback: m.quoted.message?.videoMessage?.gifPlayback || false, 
                ...mentionAll 
              };
              break;
            case "audioMessage":
              content = { 
                audio: buffer, 
                mimetype: "audio/mp4", 
                ptt: m.quoted.message?.audioMessage?.ptt || false, 
                ...mentionAll 
              };
              break;
            case "stickerMessage":
              content = { sticker: buffer, ...mentionAll };
              break;
            case "documentMessage":
              content = {
                document: buffer,
                mimetype: m.quoted.message?.documentMessage?.mimetype || "application/octet-stream",
                fileName: m.quoted.message?.documentMessage?.fileName || "fichier",
                caption: m.quoted.text || "",
                ...mentionAll
              };
              break;
          }

          if (content) {
            return await conn.sendMessage(from, content, { quoted: mek });
          }
        } catch (e) {
          console.error("Erreur média :", e);
          return reply("⚠️ Échec du traitement du média. Envoi en mode texte...");
        }
      }

      // ➤ Pour les autres types de message
      return await conn.sendMessage(from, {
        text: `📝 ${m.quoted.text || "Message tagué à tous"}`,
        ...mentionAll
      }, { quoted: mek });
    }

    // ➤ Si c’est un message direct (non cité)
    if (q) {
      const message = isUrl(q) ? `🔗 *Lien partagé :*\n${q}` : `📣 *Annonce :*\n${q}`;

      await conn.sendMessage(from, {
        text: message,
        ...mentionAll
      }, { quoted: mek });
    }

  } catch (e) {
    console.error(e);
    reply(`❌ *Une erreur est survenue !*\n\n${e.message}`);
  }
});
