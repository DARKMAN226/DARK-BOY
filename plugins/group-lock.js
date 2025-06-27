const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "lockgc",
    alias: ["lock"],
    react: "🔒",
    desc: "Verrouille le groupe (Empêche les nouveaux membres de rejoindre).",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans les groupes.");
        if (!isAdmins) return reply("❌ Seuls les administrateurs du groupe peuvent utiliser cette commande.");
        if (!isBotAdmins) return reply("❌ Je dois être administrateur pour verrouiller le groupe.");

        await conn.groupSettingUpdate(from, "locked");
        reply("✅ Le groupe a été verrouillé. Les nouveaux membres ne peuvent plus rejoindre.");
    } catch (e) {
        console.error("Erreur lors du verrouillage du groupe :", e);
        reply("❌ Échec du verrouillage du groupe. Veuillez réessayer.");
    }
});
