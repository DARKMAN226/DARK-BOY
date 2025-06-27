const config = require('../config');
const { cmd, commands } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions');

cmd({
    pattern: "tagall",
    react: "🔊",
    alias: ["gc_tagall"],
    desc: "Taguer tous les membres du groupe avec un message personnalisé.",
    category: "group",
    use: '.tagall [votre message]',
    filename: __filename
},
async (conn, mek, m, {
    from, participants, reply, isGroup, senderNumber, groupAdmins, prefix, command, args, body
}) => {
    try {
        if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans un groupe.");

        const botOwner = conn.user.id.split(":")[0];
        const senderJid = senderNumber + "@s.whatsapp.net";

        if (!groupAdmins.includes(senderJid) && senderNumber !== botOwner) {
            return reply("🚫 Seuls les administrateurs ou le propriétaire du bot peuvent utiliser cette commande.");
        }

        let groupInfo = await conn.groupMetadata(from).catch(() => null);
        if (!groupInfo) return reply("⚠️ Impossible d'obtenir les informations du groupe.");

        let groupName = groupInfo.subject || "Groupe inconnu";
        let totalMembers = participants ? participants.length : 0;
        if (totalMembers === 0) return reply("❌ Aucun membre trouvé dans ce groupe.");

        const emojis = ['📢', '🔊', '🌐', '🔰', '❤‍🩹', '🤍', '🖤', '🩵', '📝', '💗', '🔖', '🪩', '📦', '🎉', '🛡️', '💸', '⏳', '🗿', '🚀', '🎧', '🪀', '⚡', '🚩', '🍁', '🗣️', '👻', '⚠️', '🔥'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        let message = body.slice(body.indexOf(command) + command.length).trim();
        if (!message) message = "📣 *Attention à tous les membres !*";

        let header = `╭━━━「 *TAG DE GROUPE* 」━━━⬣\n`;
        let info = `┃👥 *Groupe* : ${groupName}\n┃📊 *Membres* : ${totalMembers}\n┃🗒️ *Message* : ${message}\n┃\n┃🔔 *Membres mentionnés :*\n`;
        let footer = `╰━━━「 𝔻𝔸ℝ𝕂-𝔹𝕆𝕐 」━━⬣`;

        let tags = participants.map((u, i) => `${randomEmoji} @${u.id.split('@')[0]}`).join('\n');
        let finalMessage = `${header}${info}${tags}\n${footer}`;

        conn.sendMessage(from, {
            text: finalMessage,
            mentions: participants.map(p => p.id)
        }, { quoted: mek });

    } catch (e) {
        console.error("Erreur TagAll :", e);
        reply(`❌ Une erreur est survenue :\n\n${e.message || e}`);
    }
});
