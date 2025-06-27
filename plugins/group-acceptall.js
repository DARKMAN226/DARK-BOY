const { cmd } = require('../command');

cmd({
    pattern: "requestlist",
    desc: "Affiche la liste des demandes d'adhésion en attente",
    category: "group",
    react: "📋",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans un groupe.");
        if (!isAdmins) return reply("❌ Seuls les administrateurs peuvent utiliser cette commande.");
        if (!isBotAdmins) return reply("❌ Je dois être admin pour voir les demandes.");

        const demandes = await conn.groupRequestParticipantsList(from);

        if (!demandes.length) return reply("ℹ️ Aucune demande en attente.");

        let texte = `📋 *Demandes d'adhésion en attente (${demandes.length})*\n\n`;
        demandes.forEach((user, i) => {
            texte += `${i + 1}. @${user.jid.split('@')[0]}\n`;
        });

        await conn.sendMessage(from, {
            react: { text: '✅', key: m.key }
        });

        return reply(texte, { mentions: demandes.map(u => u.jid) });

    } catch (error) {
        console.error("Erreur liste demandes :", error);
        reply("❌ Impossible d'obtenir les demandes.");
    }
});

cmd({
    pattern: "acceptall",
    desc: "Accepte toutes les demandes d'adhésion en attente",
    category: "group",
    react: "✅",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans un groupe.");
        if (!isAdmins) return reply("❌ Seuls les administrateurs peuvent utiliser cette commande.");
        if (!isBotAdmins) return reply("❌ Je dois être admin pour accepter des demandes.");

        const demandes = await conn.groupRequestParticipantsList(from);
        if (!demandes.length) return reply("ℹ️ Aucune demande à accepter.");

        const jids = demandes.map(u => u.jid);
        await conn.groupRequestParticipantsUpdate(from, jids, "approve");

        await conn.sendMessage(from, { react: { text: '👍', key: m.key } });
        return reply(`✅ ${jids.length} demande(s) acceptée(s) avec succès.`);

    } catch (error) {
        console.error("Erreur acceptation :", error);
        reply("❌ Impossible d'accepter les demandes.");
    }
});

cmd({
    pattern: "rejectall",
    desc: "Rejette toutes les demandes d’adhésion en attente",
    category: "group",
    react: "❌",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans un groupe.");
        if (!isAdmins) return reply("❌ Seuls les administrateurs peuvent utiliser cette commande.");
        if (!isBotAdmins) return reply("❌ Je dois être admin pour rejeter des demandes.");

        const demandes = await conn.groupRequestParticipantsList(from);
        if (!demandes.length) return reply("ℹ️ Aucune demande à rejeter.");

        const jids = demandes.map(u => u.jid);
        await conn.groupRequestParticipantsUpdate(from, jids, "reject");

        await conn.sendMessage(from, { react: { text: '👎', key: m.key } });
        return reply(`✅ ${jids.length} demande(s) rejetée(s) avec succès.`);

    } catch (error) {
        console.error("Erreur rejet :", error);
        reply("❌ Impossible de rejeter les demandes.");
    }
});


