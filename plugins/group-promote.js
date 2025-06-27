const { cmd } = require('../command');

cmd({
    pattern: "promote",
    alias: ["p", "makeadmin"],
    desc: "Promouvoir un membre en administrateur du groupe",
    category: "admin",
    react: "⬆️",
    filename: __filename
},
async (conn, mek, m, {
    from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator, isDev, isAdmins, reply
}) => {
    // Vérifie si la commande est utilisée dans un groupe
    if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans les groupes.");

    // Vérifie si l'utilisateur est admin
    if (!isAdmins) return reply("❌ Seuls les administrateurs du groupe peuvent utiliser cette commande.");

    // Vérifie si le bot est admin
    if (!isBotAdmins) return reply("❌ Je dois être administrateur pour promouvoir un membre.");

    let number;
    if (m.quoted) {
        number = m.quoted.sender.split("@")[0]; // Si on répond à un message, récupérer le numéro
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, ''); // Si on mentionne un utilisateur
    } else {
        return reply("❌ Veuillez répondre à un message ou fournir un numéro à promouvoir.");
    }

    // Empêche le bot de se promouvoir lui-même
    if (number === botNumber) return reply("❌ Le bot ne peut pas se promouvoir lui-même.");

    const jid = number + "@s.whatsapp.net";

    try {
        await conn.groupParticipantsUpdate(from, [jid], "promote");
        reply(`✅ @${number} a été promu en administrateur.`, { mentions: [jid] });
    } catch (error) {
        console.error("Erreur lors de la promotion :", error);
        reply("❌ Impossible de promouvoir le membre.");
    }
});
