const axios = require("axios");
const { cmd } = require("../command");
const { fetchGif, gifToVideo } = require("../lib/fetchGif");

cmd({
  pattern: "marige",
  alias: ["shadi", "marriage", "wedding"],
  desc: "Marier aléatoirement deux utilisateurs avec un GIF de mariage",
  react: "💍",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ Cette commande ne peut être utilisée qu'en groupe !");

    const participants = groupMetadata.participants.map(user => user.id);
    
    // Exclure l'expéditeur et le bot
    const eligibleParticipants = participants.filter(id => id !== sender && !id.includes(conn.user.id.split('@')[0]));
    
    if (eligibleParticipants.length < 1) {
      return reply("❌ Pas assez de participants pour effectuer un mariage !");
    }

    // Sélection aléatoire d'un partenaire
    const randomIndex = Math.floor(Math.random() * eligibleParticipants.length);
    const randomPair = eligibleParticipants[randomIndex];

    // Récupérer le GIF de mariage
    const apiUrl = "https://api.waifu.pics/sfw/hug"; // Utilisé ici comme GIF mariage
    let res = await axios.get(apiUrl);
    let gifUrl = res.data.url;

    let gifBuffer = await fetchGif(gifUrl);
    let videoBuffer = await gifToVideo(gifBuffer);

    const message = `💍 *HEUREUX MARIAGE !* 💒\n\n👰 @${sender.split("@")[0]} + 🤵 @${randomPair.split("@")[0]}\n\nQue vous viviez heureux pour toujours ! 💖`;

    await conn.sendMessage(
      mek.chat,
      { 
        video: videoBuffer, 
        caption: message, 
        gifPlayback: true, 
        mentions: [sender, randomPair] 
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("❌ Erreur dans la commande .marige :", error);
    reply(`❌ *Erreur dans la commande .marige :*\n\`\`\`${error.message}\`\`\``);
  }
});
// DARK-DEV