const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "fb",
  alias: ["facebook", "fbdl"],
  desc: "Télécharger des vidéos Facebook",
  category: "download",
  filename: __filename,
  use: "<URL Facebook>",
}, async (conn, m, store, { from, args, q, reply }) => {
  try {
    // Vérifie si une URL valide a été fournie
    if (!q || !q.startsWith("http")) {
      return reply("*`Veuillez fournir une URL Facebook valide.`*\n\n📌 *Exemple :* `.fb https://www.facebook.com/...`");
    }

    // Réaction de chargement ⏳
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Requête à l'API
    const apiUrl = `https://www.velyn.biz.id/api/downloader/facebookdl?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    // Vérifie la validité de la réponse de l'API
    if (!data.status || !data.data || !data.data.url) {
      return reply("❌ Échec de la récupération de la vidéo. Essaie un autre lien.");
    }

    // Envoie de la vidéo à l'utilisateur
    const videoUrl = data.data.url;
    await conn.sendMessage(from, {
      video: { url: videoUrl },
      caption: "📥 *Vidéo Facebook téléchargée avec succès !*\n\n— Propulsé par DARK-DEV 👨🏽‍💻",
    }, { quoted: m });

  } catch (error) {
    console.error("Erreur :", error); // Pour debug en console
    reply("❌ Une erreur est survenue lors du téléchargement de la vidéo. Veuillez réessayer plus tard.");
  }
});
