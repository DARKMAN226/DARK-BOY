const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

function isEnabled(value) {
    // Function to check if a value represents a "true" boolean state
    return value && value.toString().toLowerCase() === "true";
}

cmd({
    pattern: "env",
    alias: ["config", "settings"],
    desc: "Show all bot configuration variables (Owner Only)",
    category: "system",
    react: "⚙️",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, reply, isCreator }) => {
    try {
        // Owner check
        if (!isCreator) {
            return reply("🚫 *Owner Only Command!* You're not authorized to view bot configurations.");
        }

        const isEnabled = (value) => value && value.toString().toLowerCase() === "true";

let envSettings = `
╭───『 *Configuration de ${config.BOT_NAME}* 』───❏
│
├─❏ *🤖 INFOS DU BOT*
│  ├─∘ *Nom :* ${config.BOT_NAME}
│  ├─∘ *Préfixe :* ${config.PREFIX}
│  ├─∘ *Propriétaire :* ${config.OWNER_NAME}
│  ├─∘ *Numéro :* ${config.OWNER_NUMBER}
│  └─∘ *Mode :* ${config.MODE.toUpperCase()}
│
├─❏ *⚙️ PARAMÈTRES PRINCIPAUX*
│  ├─∘ *Mode Public :* ${isEnabled(config.PUBLIC_MODE) ? "✅" : "❌"}
│  ├─∘ *Toujours en ligne :* ${isEnabled(config.ALWAYS_ONLINE) ? "✅" : "❌"}
│  ├─∘ *Lecture des messages :* ${isEnabled(config.READ_MESSAGE) ? "✅" : "❌"}
│  └─∘ *Lecture des commandes :* ${isEnabled(config.READ_CMD) ? "✅" : "❌"}
│
├─❏ *🔌 AUTOMATISATION*
│  ├─∘ *Réponse auto :* ${isEnabled(config.AUTO_REPLY) ? "✅" : "❌"}
│  ├─∘ *Réaction auto :* ${isEnabled(config.AUTO_REACT) ? "✅" : "❌"}
│  ├─∘ *Réaction personnalisée :* ${isEnabled(config.CUSTOM_REACT) ? "✅" : "❌"}
│  ├─∘ *Emojis de réaction :* ${config.CUSTOM_REACT_EMOJIS}
│  ├─∘ *Sticker auto :* ${isEnabled(config.AUTO_STICKER) ? "✅" : "❌"}
│  └─∘ *Voix auto :* ${isEnabled(config.AUTO_VOICE) ? "✅" : "❌"}
│
├─❏ *📢 PARAMÈTRES DE STATUT*
│  ├─∘ *Statut vu :* ${isEnabled(config.AUTO_STATUS_SEEN) ? "✅" : "❌"}
│  ├─∘ *Réponse statut :* ${isEnabled(config.AUTO_STATUS_REPLY) ? "✅" : "❌"}
│  ├─∘ *Réaction statut :* ${isEnabled(config.AUTO_STATUS_REACT) ? "✅" : "❌"}
│  └─∘ *Message statut :* ${config.AUTO_STATUS_MSG}
│
├─❏ *🛡️ SÉCURITÉ*
│  ├─∘ *Anti-Lien :* ${isEnabled(config.ANTI_LINK) ? "✅" : "❌"}
│  ├─∘ *Anti-Mots :* ${isEnabled(config.ANTI_BAD) ? "✅" : "❌"}
│  ├─∘ *Anti-Vue Unique :* ${isEnabled(config.ANTI_VV) ? "✅" : "❌"}
│  └─∘ *Suppression des liens :* ${isEnabled(config.DELETE_LINKS) ? "✅" : "❌"}
│
├─❏ *🎨 MÉDIA*
│  ├─∘ *Image Alive :* ${config.ALIVE_IMG}
│  ├─∘ *Image Menu :* ${config.MENU_IMAGE_URL}
│  ├─∘ *Message Alive :* ${config.LIVE_MSG}
│  └─∘ *Pack de stickers :* ${config.STICKER_NAME}
│
├─❏ *⏳ DIVERS*
│  ├─∘ *Saisie auto :* ${isEnabled(config.AUTO_TYPING) ? "✅" : "❌"}
│  ├─∘ *Enregistrement auto :* ${isEnabled(config.AUTO_RECORDING) ? "✅" : "❌"}
│  ├─∘ *Chemin Anti-Suppression :* ${config.ANTI_DEL_PATH}
│  └─∘ *Numéro Dev :* ${config.DEV}
│
╰───『 *${config.DESCRIPTION}* 』───❏
`;


        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL },
                caption: envSettings,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true
                }
            },
            { quoted: mek }
        );

        // Optional audio message
        await conn.sendMessage(
            from,
            {
                audio: { url: 'https://files.catbox.moe/6j2z63.mp3' },
                mimetype: 'audio/mp4',
                ptt: true
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error('Env command error:', error);
        reply(`❌ Error displaying config: ${error.message}`);
    }
});
