const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "unmute",
    alias: ["groupunmute"],
    react: "🔊",
    desc: "Désactiver le mode muet du groupe (Tout le monde peut envoyer des messages).",
    category: "groupe",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, senderNumber, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans les groupes.");
        if (!isAdmins) return reply("❌ Seuls les admins du groupe peuvent utiliser cette commande.");
        if (!isBotAdmins) return reply("❌ Je dois être admin pour désactiver le mode muet du groupe.");

        await conn.groupSettingUpdate(from, "not_announcement");
        reply("✅ Le groupe n'est plus en mode muet. Tout le monde peut maintenant envoyer des messages.");
    } catch (e) {
        console.error("Erreur lors de la désactivation du mode muet du groupe :", e);
        reply("❌ Échec de la désactivation du mode muet. Veuillez réessayer.");
    }
});
