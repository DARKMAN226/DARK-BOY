const { sleep } = require('../lib/functions');
const config = require('../config')
const { cmd, commands } = require('../command')

cmd({
    pattern: "leave",
    alias: ["left", "leftgc", "leavegc"],
    desc: "Quitter le groupe",
    react: "🎉",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply
}) => {
    try {

        if (!isGroup) {
            return reply("Cette commande ne peut être utilisée que dans les groupes.");
        }

        const botOwner = conn.user.id.split(":")[0]; 
        if (senderNumber !== botOwner) {
            return reply("Seul le propriétaire du bot peut utiliser cette commande.");
        }

        reply("Je quitte le groupe...");
        await sleep(1500);
        await conn.groupLeave(from);
        reply("Au revoir ! 👋");
    } catch (e) {
        console.error(e);
        reply(`❌ Erreur : ${e}`);
    }
});
