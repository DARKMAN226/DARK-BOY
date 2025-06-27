const config = require('../config');
const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
    pattern: "ginfo",
    alias: ["groupinfo"],
    desc: "Afficher les informations du groupe.",
    react: "🥏",
    category: "group",
    use: '.ginfo',
    filename: __filename,
},
async (conn, mek, m, {
    from, isGroup, isAdmins, isBotAdmins, isDev, groupMetadata, participants, reply
}) => {
    try {
        // Messages d'erreur (optionnel : depuis une API ou fichier distant)
        const msr = (await fetchJson('https://raw.githubusercontent.com/JawadTech3/KHAN-DATA/refs/heads/main/MSG/mreply.json')).replyMsg;

        if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans les groupes.");
        if (!isAdmins && !isDev) return reply("🚫 Seuls les administrateurs peuvent utiliser cette commande.");
        if (!isBotAdmins) return reply("⚠️ Je dois être administrateur du groupe pour récupérer les informations.");

        // Récupération de la photo du groupe
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(from, 'image');
        } catch {
            ppUrl = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png';
        }

        const owner = groupMetadata.owner || 'inconnu';
        const adminList = participants
            .filter(p => p.admin)
            .map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`)
            .join('\n');

        const groupInfo = `╭───〔 *📌 Informations du Groupe* 〕───✧
│
├─ 🎯 *Nom:* ${groupMetadata.subject}
├─ 🆔 *JID:* ${groupMetadata.id}
├─ 👥 *Membres:* ${groupMetadata.size}
├─ 👑 *Créateur:* @${owner.split('@')[0]}
├─ 📝 *Description:* ${groupMetadata.desc || 'Aucune description définie.'}
│
╰─ 🔐 *Administrateurs:*
${adminList || 'Aucun'}
`;

        await conn.sendMessage(from, {
            image: { url: ppUrl },
            caption: groupInfo,
            mentions: participants.map(p => p.id),
        }, { quoted: mek });

    } catch (e) {
        console.error("Erreur ginfo:", e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply("❌ Une erreur est survenue lors de la récupération des informations.");
    }
});
