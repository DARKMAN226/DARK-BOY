const { cmd } = require('../command');

cmd({
    pattern: "add",
    alias: ["a", "invite"],
    desc: "Ajoute un membre au groupe",
    category: "admin",
    react: "➕",
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, isBotAdmins, reply, quoted, senderNumber
}) => {
    // Vérifie si la commande est utilisée dans un groupe
    if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans un groupe.");

    // Récupère dynamiquement le numéro du propriétaire du bot
    const botOwner = conn.user.id.split(":")[0];
    if (senderNumber !== botOwner) {
        return reply("❌ Seul le propriétaire du bot peut utiliser cette commande.");
    }

    // Vérifie si le bot est administrateur
    if (!isBotAdmins) return reply("❌ Je dois être administrateur pour utiliser cette commande.");

    let number;
    if (m.quoted) {
        number = m.quoted.sender.split("@")[0]; // Si réponse à un message
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, ''); // Si mentionné manuellement
    } else if (q && /^\d+$/.test(q)) {
        number = q; // Si numéro direct
    } else {
        return reply("❌ Veuillez répondre à un message, mentionner un utilisateur, ou fournir un numéro à ajouter.");
    }

    const jid = number + "@s.whatsapp.net";

    try {
        await conn.groupParticipantsUpdate(from, [jid], "add");
        reply(`✅ Membre ajouté avec succès : @${number}`, { mentions: [jid] });
    } catch (error) {
        console.error("Erreur commande .add :", error);
        reply("❌ Échec de l’ajout du membre. Vérifiez que le numéro est correct et qu’il n’a pas quitté récemment.");
    }
});
