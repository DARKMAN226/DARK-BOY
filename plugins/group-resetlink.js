const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

cmd({
    pattern: "revoke",
    react: "🖇️",
    alias: ["revokegrouplink", "resetglink", "revokelink", "f_revoke"],
    desc: "Réinitialiser le lien d'invitation du groupe",
    category: "group",
    use: '.revoke',
    filename: __filename
},
async (conn, mek, m, {
    from, l, quoted, body, isCmd, command, args, q,
    isGroup, sender, senderNumber, botNumber2, botNumber,
    pushname, isMe, isOwner, groupMetadata, groupName,
    participants, groupAdmins, isBotAdmins, isCreator, isDev, isAdmins, reply
}) => {
    try {
        // Messages statiques (tu peux les adapter depuis un JSON externe si besoin)
        const msr = {
            only_gp: "❌ Cette commande ne peut être utilisée que dans un groupe.",
            you_adm: "❌ Seuls les administrateurs du groupe peuvent utiliser cette commande.",
            give_adm: "❌ Je dois être administrateur pour effectuer cette action."
        };

        if (!isGroup) return reply(msr.only_gp);
        if (!isAdmins && !isDev) return reply(msr.you_adm);
        if (!isBotAdmins) return reply(msr.give_adm);

        // Réinitialiser le lien d'invitation du groupe
        await conn.groupRevokeInvite(from);

        await conn.sendMessage(from, {
            text: `✅ *Le lien du groupe a été réinitialisé avec succès.* 🔒`,
        }, { quoted: mek });

    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.error(e);
        reply(`❌ *Une erreur s'est produite !*\n\n${e}`);
    }
});
