const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "unlockgc",
    alias: ["unlock"],
    react: "🔓",
    desc: "Déverrouiller le groupe (Permet aux nouveaux membres de rejoindre).",
    category: "groupe",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans les groupes.");
        if (!isAdmins) return reply("❌ Seuls les admins du groupe peuvent utiliser cette commande.");
        if (!isBotAdmins) return reply("❌ Je dois être admin pour déverrouiller le groupe.");

        await conn.groupSettingUpdate(from, "unlocked");
        reply("✅ Le groupe a été déverrouillé. Les nouveaux membres peuvent maintenant rejoindre.");
    } catch (e) {
        console.error("Erreur lors du déverrouillage du groupe :", e);
        reply("❌ Échec du déverrouillage du groupe. Veuillez réessayer.");
    }
});
