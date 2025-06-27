const axios = require("axios");
const { cmd, commands } = require("../command");

cmd({
  pattern: "ringtone",
  alias: ["ringtones", "ring"],
  desc: "Obtenir une sonnerie aléatoire via l’API.",
  react: "🎵",
  category: "fun",
  filename: __filename,
},
async (conn, mek, m, { from, reply, args }) => {
  try {
    const query = args.join(" ");
    if (!query) {
      return reply("❗ Veuillez fournir un mot-clé de recherche !\n\n📌 Exemple : `.ringtone Suna`");
    }

    const { data } = await axios.get(`https://www.dark-yasiya-api.site/download/ringtone?text=${encodeURIComponent(query)}`);

    if (!data.status || !data.result || data.result.length === 0) {
      return reply("❌ Aucune sonnerie trouvée pour votre recherche. Veuillez essayer un autre mot-clé.");
    }

    const randomRingtone = data.result[Math.floor(Math.random() * data.result.length)];

    await conn.sendMessage(
      from,
      {
        audio: { url: randomRingtone.dl_link },
        mimetype: "audio/mpeg",
        fileName: `${randomRingtone.title}.mp3`,
      },
      { quoted: m }
    );
  } catch (error) {
    console.error("Erreur dans la commande ringtone :", error);
    reply("❌ Désolé, une erreur est survenue lors de la récupération de la sonnerie. Veuillez réessayer plus tard.");
  }
});
