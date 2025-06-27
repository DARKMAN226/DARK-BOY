const { cmd } = require('../command');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

cmd({
    pattern: "removemembers",
    alias: ["kickall", "endgc", "endgroup"],
    desc: "Supprime tous les membres non-admins du groupe.",
    react: "🧹",
    category: "group",
    filename: __filename,
}, 
async (conn, mek, m, {
    from, groupMetadata, groupAdmins, isBotAdmins, senderNumber, reply, isGroup
}) => {
    try {
        if (!isGroup)
            return reply("❌ Cette commande ne peut être utilisée que dans un groupe.");

        const botOwner = conn.user.id.split(":")[0];
        if (senderNumber !== botOwner)
            return reply("🔒 Seul le propriétaire du bot peut utiliser cette commande.");

        if (!isBotAdmins)
            return reply("🔑 Je dois être administrateur pour pouvoir supprimer des membres.");

        const allParticipants = groupMetadata.participants;
        const nonAdminParticipants = allParticipants.filter(member => !groupAdmins.includes(member.id));

        if (nonAdminParticipants.length === 0)
            return reply("✅ Aucun membre à supprimer : tous sont des administrateurs.");

        reply(`🧹 Début de la suppression de *${nonAdminParticipants.length}* membre(s) non-admin...`);

        for (let participant of nonAdminParticipants) {
            try {
                await conn.groupParticipantsUpdate(from, [participant.id], "remove");
                await sleep(2000); // Attente de 2 secondes entre chaque suppression
            } catch (e) {
                console.error(`❌ Échec de la suppression de ${participant.id} :`, e);
            }
        }

        reply("✅ Tous les membres non-admins ont été supprimés du groupe.");

    } catch (e) {
        console.error("Erreur lors de la suppression :", e);
        reply("❌ Une erreur est survenue pendant la suppression. Veuillez réessayer.");
    }
});


// supprimer uniquement les admins

cmd({
    pattern: "removeadmins",
    alias: ["kickadmins", "kickall3", "deladmins"],
    desc: "Supprime tous les membres admins du groupe, sauf le bot et le propriétaire du bot.",
    react: "🎉",
    category: "groupe",
    filename: __filename,
}, 
async (conn, mek, m, {
    from, isGroup, senderNumber, groupMetadata, groupAdmins, isBotAdmins, reply
}) => {
    try {
        // Vérifie si la commande est utilisée dans un groupe
        if (!isGroup) {
            return reply("❌ Cette commande ne peut être utilisée que dans les groupes.");
        }

        // Récupère le numéro du propriétaire du bot dynamiquement
        const botOwner = conn.user.id.split(":")[0];
        if (senderNumber !== botOwner) {
            return reply("❌ Seul le propriétaire du bot peut utiliser cette commande.");
        }

        if (!isBotAdmins) {
            return reply("❌ Je dois être admin pour exécuter cette commande.");
        }

        const allParticipants = groupMetadata.participants;
        // Filtre les membres admins à supprimer sauf le bot et le propriétaire
        const adminParticipants = allParticipants.filter(member => 
            groupAdmins.includes(member.id) && 
            member.id !== conn.user.id && 
            member.id !== `${botOwner}@s.whatsapp.net`
        );

        if (adminParticipants.length === 0) {
            return reply("ℹ️ Il n'y a pas d'admins à supprimer.");
        }

        reply(`⚠️ Début de la suppression de ${adminParticipants.length} admins, sauf le bot et le propriétaire...`);

        for (let participant of adminParticipants) {
            try {
                await conn.groupParticipantsUpdate(from, [participant.id], "remove");
                await sleep(2000); // Pause de 2 secondes entre chaque suppression
            } catch (e) {
                console.error(`Échec de la suppression de ${participant.id} :`, e);
            }
        }

        reply("✅ Tous les admins (sauf le bot et le propriétaire) ont été supprimés avec succès.");
    } catch (e) {
        console.error("Erreur lors de la suppression des admins :", e);
        reply("❌ Une erreur est survenue lors de la suppression des admins. Veuillez réessayer.");
    }
});

// supprimer tous les admins et membres

cmd({
    pattern: "removeall2",
    alias: ["kickall2", "endgc2", "endgroup2"],
    desc: "Supprime tous les membres et admins du groupe, sauf le bot et le propriétaire du bot.",
    react: "🎉",
    category: "groupe",
    filename: __filename,
}, 
async (conn, mek, m, {
    from, isGroup, senderNumber, groupMetadata, isBotAdmins, reply
}) => {
    try {
        // Vérifie si la commande est utilisée dans un groupe
        if (!isGroup) {
            return reply("❌ Cette commande ne peut être utilisée que dans les groupes.");
        }

        // Récupère dynamiquement le numéro du propriétaire du bot
        const botOwner = conn.user.id.split(":")[0];
        if (senderNumber !== botOwner) {
            return reply("❌ Seul le propriétaire du bot peut utiliser cette commande.");
        }

        if (!isBotAdmins) {
            return reply("❌ Je dois être admin pour exécuter cette commande.");
        }

        const allParticipants = groupMetadata.participants;

        if (allParticipants.length === 0) {
            return reply("ℹ️ Le groupe ne contient aucun membre à supprimer.");
        }

        // Exclut le bot et le propriétaire du bot de la liste
        const participantsToRemove = allParticipants.filter(
            participant => participant.id !== conn.user.id && participant.id !== `${botOwner}@s.whatsapp.net`
        );

        if (participantsToRemove.length === 0) {
            return reply("ℹ️ Aucun membre à supprimer après exclusion du bot et du propriétaire.");
        }

        reply(`⚠️ Début de la suppression de ${participantsToRemove.length} membres, sauf le bot et le propriétaire...`);

        for (let participant of participantsToRemove) {
            try {
                await conn.groupParticipantsUpdate(from, [participant.id], "remove");
                await sleep(2000); // Pause de 2 secondes entre chaque suppression
            } catch (e) {
                console.error(`Échec de la suppression de ${participant.id} :`, e);
            }
        }

        reply("✅ Tous les membres (sauf le bot et le propriétaire) ont été supprimés avec succès du groupe.");
    } catch (e) {
        console.error("Erreur lors de la suppression des membres :", e);
        reply("❌ Une erreur est survenue lors de la suppression des membres. Veuillez réessayer.");
    }
});
