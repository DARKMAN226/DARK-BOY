const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "updategdesc",
    alias: ["upgdesc", "gdesc"],
    react: "📜",
    desc: "Modifier la description du groupe.",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, q, reply }) => {
    try {
        if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans les groupes.");
        if (!isAdmins) return reply("❌ Seuls les administrateurs du groupe peuvent utiliser cette commande.");
        if (!isBotAdmins) return reply("❌ Je dois être admin pour modifier la description du groupe.");
        if (!q) return reply("❌ Veuillez fournir une nouvelle description pour le groupe.");

        await conn.groupUpdateDescription(from, q);
        reply("✅ La description du groupe a été mise à jour avec succès.");
    } catch (e) {
        console.error("Erreur lors de la mise à jour de la description du groupe :", e);
        reply("❌ Échec de la mise à jour de la description. Veuillez réessayer.");
    }
});
