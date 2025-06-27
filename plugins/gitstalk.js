const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "githubstalk",
    desc: "Afficher le profil détaillé d'un utilisateur GitHub (photo incluse)",
    category: "menu",
    react: "🖥️",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, args, q, reply
}) => {
    try {
        const username = args[0];
        if (!username) {
            return reply("❌ Veuillez fournir un nom d'utilisateur GitHub.\n\nExemple : `.githubstalk darkmanterrible`");
        }

        const apiUrl = `https://api.github.com/users/${username}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        let userInfo = `🧑‍💻 *Profil GitHub de ${data.login}*\n\n` +
        `👤 *Nom complet :* ${data.name || 'Non renseigné'}\n` +
        `🔗 *Profil :* ${data.html_url}\n` +
        `📝 *Bio :* ${data.bio || 'Aucune bio'}\n` +
        `📍 *Localisation :* ${data.location || 'Inconnue'}\n` +
        `📦 *Dépôts publics :* ${data.public_repos}\n` +
        `👥 *Abonnés :* ${data.followers} | *Abonnements :* ${data.following}\n` +
        `📅 *Créé le :* ${new Date(data.created_at).toLocaleDateString('fr-FR')}\n` +
        `📚 *Gists publics :* ${data.public_gists}\n\n` +
        `> 💡 *Propulsé par DARK-DEV 🍷*`;

        await conn.sendMessage(from, {
            image: { url: data.avatar_url },
            caption: userInfo
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply(`❌ Une erreur est survenue : ${e.response ? e.response.data.message : e.message}`);
    }
});
