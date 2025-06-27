const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "updategname",
    alias: ["upgname", "gname"],
    react: "📝",
    desc: "Modifier le nom du groupe.",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, q, reply }) => {
    try {
        if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans les groupes.");
        if (!isAdmins) return reply("❌ Seuls les administrateurs du groupe peuvent utiliser cette commande.");
        if (!isBotAdmins) return reply("❌ Je dois être admin pour modifier le nom du groupe.");
        if (!q) return reply("❌ Veuillez fournir un nouveau nom pour le groupe.");

        await conn.groupUpdateSubject(from, q);
        reply(`✅ Le nom du groupe a été modifié avec succès : *${q}*`);
    } catch (e) {
        console.error("Erreur lors de la modification du nom du groupe :", e);
        reply("❌ Impossible de modifier le nom du groupe. Veuillez réessayer.");
    }
});
