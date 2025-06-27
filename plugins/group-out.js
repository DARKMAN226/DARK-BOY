const { cmd } = require('../command');

cmd({
    pattern: "out",
    alias: ["ck", "🦶"],
    desc: "Supprime tous les membres avec un indicatif spécifique du groupe",
    category: "admin",
    react: "❌",
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, isBotAdmins, reply, groupMetadata, senderNumber
}) => {
    // Vérifie si la commande est utilisée dans un groupe
    if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans un groupe.");

    // Récupère le numéro du propriétaire du bot dynamiquement
    const botOwner = conn.user.id.split(":")[0];
    if (senderNumber !== botOwner) {
        return reply("❌ Seul le propriétaire du bot peut utiliser cette commande.");
    }

    // Vérifie si le bot est administrateur
    if (!isBotAdmins) return reply("❌ Je dois être administrateur pour exécuter cette commande.");

    if (!q) return reply("❌ Veuillez fournir un indicatif de pays. Exemple : .out 92");

    const countryCode = q.trim();
    if (!/^\d+$/.test(countryCode)) {
        return reply("❌ Code pays invalide. Veuillez n’utiliser que des chiffres (ex. : 92 pour +92)");
    }

    try {
        const participants = await groupMetadata.participants;
        const targets = participants.filter(
            participant => participant.id.startsWith(countryCode) &&
                         !participant.admin // Ne pas exclure les admins
        );

        if (targets.length === 0) {
            return reply(`❌ Aucun membre trouvé avec l’indicatif +${countryCode}`);
        }

        const jids = targets.map(p => p.id);
        await conn.groupParticipantsUpdate(from, jids, "remove");
        
        reply(`✅ ${targets.length} membre(s) avec l’indicatif +${countryCode} ont été supprimé(s) du groupe.`);
    } catch (error) {
        console.error("Erreur dans la commande out :", error);
        reply("❌ Échec lors de la suppression des membres. Erreur : " + error.message);
    }
});
