const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: "xstalk",
  alias: ["twitterstalk", "twtstalk"],
  desc: "Obtenir les détails d'un utilisateur Twitter/X.",
  react: "🔍",
  category: "search",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q) {
      return reply("❌ Veuillez fournir un nom d'utilisateur Twitter/X valide.");
    }

    // Réaction en attente
    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    const apiUrl = `https://delirius-apiofc.vercel.app/tools/xstalk?username=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data || !data.status || !data.data) {
      return reply("⚠️ Impossible de récupérer les informations. Vérifiez que le nom d'utilisateur est correct.");
    }

    const user = data.data;
    const badgeVerify = user.verified ? "✅ Vérifié" : "❌ Non vérifié";

    const caption = 
`╭━━━〔 *STALKER TWITTER/X* 〕━━━⊷
┃👤 *Nom* : ${user.name}
┃🔹 *Pseudo* : @${user.username}
┃✔️ *Vérifié* : ${badgeVerify}
┃👥 *Abonnés* : ${user.followers_count}
┃👤 *Abonnements* : ${user.following_count}
┃📝 *Tweets* : ${user.tweets_count}
┃📅 *Inscrit depuis* : ${user.created}
┃🔗 *Profil* : [Voir ici](${user.url})
╰━━━⪼

🔹 *Propulsé par DARK-DEV🍷*`;

    await conn.sendMessage(from, {
      image: { url: user.avatar },
      caption: caption
    }, { quoted: m });

  } catch (error) {
    console.error("Erreur :", error);
    reply("❌ Une erreur est survenue lors de la récupération des informations. Veuillez réessayer.");
  }
});
