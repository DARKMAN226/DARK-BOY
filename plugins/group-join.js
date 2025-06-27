const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

cmd({
    pattern: "join",
    react: "📬",
    alias: ["joinme", "f_join"],
    desc: "Rejoindre un groupe via un lien d'invitation",
    category: "group",
    use: '.join < lien du groupe >',
    filename: __filename
}, async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator, isDev, isAdmins, reply }) => {
    try {
        const msr = {
            own_cmd: "Vous n'avez pas la permission d'utiliser cette commande."
        };

        // Autoriser uniquement le créateur à utiliser la commande
        if (!isCreator) return reply(msr.own_cmd);

        // Si aucun input, vérifier si le message est une réponse contenant un lien
        if (!q && !quoted) return reply("*Veuillez écrire le lien du groupe* 🖇️");

        let groupLink;

        // Si le message est une réponse à un lien d'invitation de groupe
        if (quoted && quoted.type === 'conversation' && isUrl(quoted.text)) {
            groupLink = quoted.text.split('https://chat.whatsapp.com/')[1];
        } else if (q && isUrl(q)) {
            // Si l'utilisateur a fourni le lien dans la commande
            groupLink = q.split('https://chat.whatsapp.com/')[1];
        }

        if (!groupLink) return reply("❌ *Lien de groupe invalide* 🖇️");

        // Accepter l'invitation au groupe
        await conn.groupAcceptInvite(groupLink);
        await conn.sendMessage(from, { text: `✔️ *Rejoint avec succès*` }, { quoted: mek });

    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.log(e);
        reply(`❌ *Une erreur est survenue !!*\n\n${e}`);
    }
});
