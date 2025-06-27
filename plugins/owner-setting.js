const { cmd } = require('../command');
const config = require('../config');

// 1. Shutdown Bot
cmd({
    pattern: "shutdown",
    desc: "Arrêter le bot.",
    category: "owner",
    react: "🛑",
    filename: __filename
},
async (conn, mek, m, { isOwner, reply }) => {
    if (!isOwner) return reply("❌ Vous n'êtes pas le propriétaire !");
    await reply("🛑 Arrêt en cours...");
    process.exit(0);
});

// 2. Diffuser un message à tous les groupes
cmd({
    pattern: "broadcast",
    desc: "Envoyer un message à tous les groupes.",
    category: "owner",
    react: "📢",
    filename: __filename
},
async (conn, mek, m, { isOwner, args, reply }) => {
    if (!isOwner) return reply("❌ Vous n'êtes pas le propriétaire !");
    if (args.length === 0) return reply("📢 Veuillez fournir un message à diffuser.");

    const message = args.join(' ');
    const groups = Object.keys(await conn.groupFetchAllParticipating());

    for (const groupId of groups) {
        await conn.sendMessage(groupId, { text: message });
    }
    reply("📢 Message diffusé à tous les groupes.");
});

// 3. Changer la photo de profil du bot
cmd({
    pattern: "setpp",
    desc: "Modifier la photo de profil du bot.",
    category: "owner",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { isOwner, quoted, reply }) => {
    if (!isOwner) return reply("❌ Vous n'êtes pas le propriétaire !");
    if (!quoted || !quoted.message.imageMessage) return reply("❌ Veuillez répondre à une image.");

    try {
        const media = await conn.downloadMediaMessage(quoted);
        await conn.updateProfilePicture(conn.user.jid, { url: media });
        reply("🖼️ Photo de profil mise à jour avec succès !");
    } catch (error) {
        reply(`❌ Erreur lors de la mise à jour : ${error.message}`);
    }
});

// 4. Vider tous les chats
cmd({
    pattern: "clearchats",
    desc: "Supprimer toutes les conversations du bot.",
    category: "owner",
    react: "🧹",
    filename: __filename
},
async (conn, mek, m, { isOwner, reply }) => {
    if (!isOwner) return reply("❌ Vous n'êtes pas le propriétaire !");
    try {
        const chats = conn.chats.all();
        for (const chat of chats) {
            await conn.modifyChat(chat.jid, 'delete');
        }
        reply("🧹 Toutes les conversations ont été supprimées !");
    } catch (error) {
        reply(`❌ Erreur lors de la suppression : ${error.message}`);
    }
});

// 5. Liste des JIDs des groupes
cmd({
    pattern: "gjid",
    desc: "Obtenir la liste des JIDs de tous les groupes où le bot est présent.",
    category: "owner",
    react: "📝",
    filename: __filename
},
async (conn, mek, m, { isOwner, reply }) => {
    if (!isOwner) return reply("❌ Vous n'êtes pas le propriétaire !");
    const groups = await conn.groupFetchAllParticipating();
    const groupJids = Object.keys(groups).join('\n');
    reply(`📝 *Liste des JIDs des groupes :*\n\n${groupJids}`);
});

// 6. Supprimer un message (commande .delete ou .del)
cmd({
    pattern: "delete",
    alias: ["del"],
    react: "❌",
    desc: "Supprimer un message.",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { isOwner, isAdmins, reply }) => {
    // L'utilisateur doit être propriétaire ou admin
    if (!isOwner && !isAdmins) return reply("❌ Vous devez être propriétaire ou admin pour utiliser cette commande.");
    if (!m.quoted) return reply("❌ Veuillez répondre au message à supprimer.");

    try {
        const key = {
            remoteJid: m.chat,
            fromMe: false,
            id: m.quoted.id,
            participant: m.quoted.sender
        };
        await conn.sendMessage(m.chat, { delete: key });
        reply("✅ Message supprimé avec succès.");
    } catch (e) {
        console.error(e);
        reply("❌ Une erreur est survenue lors de la suppression.");
    }
});
