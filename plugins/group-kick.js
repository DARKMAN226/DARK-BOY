const { cmd } = require('../command');

cmd({
    pattern: "remove",
    alias: ["kick", "k"],
    desc: "Supprime un membre du groupe",
    category: "admin",
    react: "❌",
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, isBotAdmins, reply, quoted, senderNumber
}) => {
    // Vérifie si la commande est utilisée dans un groupe
    if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans les groupes.");

    // Récupère dynamiquement le numéro du propriétaire du bot à partir de conn.user.id
    const botOwner = conn.user.id.split(":")[0];
    if (senderNumber !== botOwner) {
        return reply("❌ Seul le propriétaire du bot peut utiliser cette commande.");
    }

    // Vérifie si le bot est administrateur
    if (!isBotAdmins) return reply("❌ Je dois être administrateur pour utiliser cette commande.");

    let number;
    if (m.quoted) {
        number = m.quoted.sender.split("@")[0]; // Si la commande répond à un message, récupère le numéro de l'expéditeur
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, ''); // Si un utilisateur est mentionné
    } else {
        return reply("❌ Veuillez répondre à un message ou mentionner un utilisateur à supprimer.");
    }

    const jid = number + "@s.whatsapp.net";

    try {
        await conn.groupParticipantsUpdate(from, [jid], "remove");
        reply(`✅ Membre @${number} supprimé avec succès`, { mentions: [jid] });
    } catch (error) {
        console.error("Erreur commande remove :", error);
        reply("❌ Échec de la suppression du membre.");
    }
});
