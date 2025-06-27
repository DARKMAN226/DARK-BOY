const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["status", "online", "a"],
    desc: "Vérifier si le bot est actif",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const status = `
╔══════════════════════════════════╗
║      🤖 𝗦𝗧𝗔𝗧𝗨𝗦 𝗗𝗨 𝗕𝗢𝗧 - ${config.BOT_NAME}      ║
╠══════════════════════════════════╣
║ ✨ Statut: *En ligne et actif !*      
║                                  
║ 🧠 Propriétaire: ${config.OWNER_NAME}        
║ ⚡ Version: 1.0.0                
║ 📝 Préfixe: [${config.PREFIX}]           
║ 📳 Mode: [${config.MODE}]           
║ 💾 RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB
║ 🖥️ Hôte: ${os.hostname()}                
║ ⌛ Temps actif: ${runtime(process.uptime())}         
╚══════════════════════════════════╝
> ${config.DESCRIPTION}
`;

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL },
            caption: status,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1000,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363422353392657@newsletter',
                    newsletterName: 'DARK-DEV',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Erreur Alive:", e);
        reply(`Une erreur est survenue : ${e.message}`);
    }
});
