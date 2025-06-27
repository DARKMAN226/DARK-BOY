const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "mute",
    alias: ["groupmute"],
    react: "🔇",
    desc: "Mettre le groupe en sourdine (Seuls les admins peuvent envoyer des messages).",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, senderNumber, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans les groupes.");
        if (!isAdmins) return reply("❌ Seuls les administrateurs du groupe peuvent utiliser cette commande.");
        if (!isBotAdmins) return reply("❌ Je dois être administrateur pour mettre le groupe en sourdine.");

        await conn.groupSettingUpdate(from, "announcement");
        reply("✅ Le groupe est maintenant en sourdine. Seuls les admins peuvent envoyer des messages.");
    } catch (e) {
        console.error("Erreur lors de la mise en sourdine du groupe :", e);
        reply("❌ Échec de la mise en sourdine du groupe. Veuillez réessayer.");
    }
});
