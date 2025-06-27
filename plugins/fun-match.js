const { cmd } = require("../command");

// Commande pour sélectionner un garçon aléatoirement
cmd({
  pattern: "bacha",
  alias: ["boy", "larka"],
  desc: "Sélectionne un garçon au hasard dans le groupe",
  react: "👦",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ Cette commande ne peut être utilisée qu'en groupe !");

    const participants = groupMetadata.participants;
    
    // Exclure le bot et sélectionner un participant au hasard
    const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
    
    if (eligible.length < 1) return reply("❌ Aucun participant éligible trouvé !");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
    
    await conn.sendMessage(
      mek.chat,
      { 
        text: `👦 *Voici ton garçon !* \n\n@${randomUser.id.split('@')[0]} est ton beau garçon ! 😎`, 
        mentions: [randomUser.id] 
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Erreur dans la commande .bacha :", error);
    reply(`❌ Erreur : ${error.message}`);
  }
});

// Commande pour sélectionner une fille aléatoirement
cmd({
  pattern: "bachi",
  alias: ["girl", "kuri", "larki"],
  desc: "Sélectionne une fille au hasard dans le groupe",
  react: "👧",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ Cette commande ne peut être utilisée qu'en groupe !");

    const participants = groupMetadata.participants;
    
    // Exclure le bot et sélectionner un participant au hasard
    const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
    
    if (eligible.length < 1) return reply("❌ Aucun participant éligible trouvé !");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
    
    await conn.sendMessage(
      mek.chat,
      { 
        text: `👧 *Voici ta fille !* \n\n@${randomUser.id.split('@')[0]} est ta belle fille ! 💖`, 
        mentions: [randomUser.id] 
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Erreur dans la commande .bachi :", error);
    reply(`❌ Erreur : ${error.message}`);
  }
});
