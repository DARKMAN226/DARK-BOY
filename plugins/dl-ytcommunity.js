const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: "ytpost",
  alias: ["ytcommunity", "ytc"],
  desc: "Télécharger un post communautaire YouTube",
  category: "downloader",
  react: "🎥",
  filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
  try {
    if (!q) return reply("Veuillez fournir une URL de post communautaire YouTube.\nExemple : `.ytpost <url>`");

    const apiUrl = `https://api.siputzx.my.id/api/d/ytpost?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.data) {
      await react("❌");
      return reply("Échec de la récupération du post communautaire. Veuillez vérifier l'URL.");
    }

    const post = data.data;
    let caption = `📢 *Post communautaire YouTube* 📢\n\n` +
                  `📜 *Contenu :* ${post.content}`;

    if (post.images && post.images.length > 0) {
      for (const img of post.images) {
        await conn.sendMessage(from, { image: { url: img }, caption }, { quoted: mek });
        caption = ""; // La légende est ajoutée une seule fois, puis images seules
      }
    } else {
      await conn.sendMessage(from, { text: caption }, { quoted: mek });
    }

    await react("✅");
  } catch (e) {
    console.error("Erreur dans la commande ytpost :", e);
    await react("❌");
    reply("Une erreur est survenue lors de la récupération du post communautaire YouTube.");
  }
});
