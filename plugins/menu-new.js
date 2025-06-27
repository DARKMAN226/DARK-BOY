const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

cmd({
    pattern: "menu",
    desc: "Show interactive menu system",
    category: "menu",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const menuCaption = `████████ ${config.BOT_NAME} ████████

┌──── USER INFO ────┐
│ 👑 Owner : ${config.OWNER_NAME}
│ 🤖 Baileys : Multi Device
│ 🖥️ Type : NodeJs
│ 🚀 Platform : Heroku
│ ⚙️ Mode : [${config.MODE}]
│ 🔣 Prefix : [${config.PREFIX}]
│ 🏷️ Version : 1.0.0 Aura
└──────────────────┘

┌──── BOT STATUS ────┐
│ ➊ 📥 Download Menu
│ ➋ 👥 Group Menu
│ ➌ 🤣 Fun Menu
│ ➍ 👑 Owner Menu
│ ➎ 🤖 AI Menu
│ ➏ 🎎 Anime Menu
│ ➐ ♻️ Convert Menu
│ ➑ 📌 Other Menu
│ ➒ 💔 Reactions Menu
│ ➊⓿ 🏫 Main Menu
└────────────────────┘
📩 Repond avec un numero
🔖 EXORCICE (ᴰᵃʳᵏ-ᴰᴱᵛ)BF 
> ${config.DESCRIPTION}`;

        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363422353392657@newsletter',
                newsletterName: config.OWNER_NAME,
                serverMessageId: 143
            }
        };

        // Function to send menu image with timeout
        const sendMenuImage = async () => {
            try {
                return await conn.sendMessage(
                    from,
                    {
                        image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/5o09h5.png' },
                        caption: menuCaption,
                        contextInfo: contextInfo
                    },
                    { quoted: mek }
                );
            } catch (e) {
                console.log('Image send failed, falling back to text');
                return await conn.sendMessage(
                    from,
                    { text: menuCaption, contextInfo: contextInfo },
                    { quoted: mek }
                );
            }
        };

        // Function to send menu audio with timeout
        const sendMenuAudio = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay after image
                await conn.sendMessage(from, {
                    audio: { url: 'https://files.catbox.moe/lgnhqx.mp3' },
                    mimetype: 'audio/mp4',
                    ptt: true,
                }, { quoted: mek });
            } catch (e) {
                console.log('Audio send failed, continuing without it');
            }
        };

        // Send image first, then audio sequentially
        let sentMsg;
        try {
            // Send image with 10s timeout
            sentMsg = await Promise.race([
                sendMenuImage(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Image send timeout')), 10000))
            ]);
            
            // Then send audio with 1s delay and 8s timeout
            await Promise.race([
                sendMenuAudio(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Audio send timeout')), 8000))
            ]);
        } catch (e) {
            console.log('Menu send error:', e);
            if (!sentMsg) {
                sentMsg = await conn.sendMessage(
                    from,
                    { text: menuCaption, contextInfo: contextInfo },
                    { quoted: mek }
                );
            }
        }
        
        const messageID = sentMsg.key.id;

        // Menu data (complete version)
        const menuData = {
            '1': {
                title: "📥 *Download Menu* 📥",
                content: ``,
                image: true
            },
            '2': {
                title: "👥 *Group Menu* 👥",
                content: `╭──〔 🛠️ GESTION DU GROUPE 〕──╮
│ • .grouplink
│ • .kickall
│ • .kickall2
│ • .kickall3
│ • .add @utilisateur
│ • .remove @utilisateur
│ • .kick @utilisateur
╰─────────────────────────────╯

╭──〔 ⚡ OUTILS ADMIN 〕──╮
│ • .promote @utilisateur
│ • .demote @utilisateur
│ • .dismiss
│ • .revoke
│ • .mute [durée]
│ • .unmute
│ • .lockgc
│ • .unlockgc
╰────────────────────────╯

╭──〔 🏷️ TAGS & INVITATIONS 〕──╮
│ • .tag @utilisateur
│ • .hidetag [message]
│ • .tagall
│ • .tagadmins
│ • .invite
╰────────────────────────────╯

╭━━━━━━━╮    ╭━━━━━━━╮
┃  ⚡ *${config.BOT_NAME}* ⚡  ┃
╰━━━━━━━╯    ╰━━━━━━━╯
> ${config.DESCRIPTION}`,
                image: true
            },
            '3': {
                title: "🤣 *Menu Fun* 🤣",
 content: `╭━━━━━━━╮    ╭━━━━━━━╮
┃ 🕊️     𝔻𝔸ℝ𝕂-𝔹𝕆𝕐     🕊️ ┃
╰━━━━━━━╯    ╰━━━━━━━╯

╭──〔 🎭 INTERACTIF 〕──╮
│ • .shapar
│ • .rate @utilisateur
│ • .insult @utilisateur
│ • .hack @utilisateur
│ • .ship @utilisateur1 @utilisateur2
│ • .character
│ • .pickup
│ • .joke
╰────────────────────╯

╭──〔 😂 RÉACTIONS 〕──╮
│ • .hrt
│ • .hpy
│ • .syd
│ • .anger
│ • .shy
│ • .kiss
│ • .mon
│ • .cunfuzed
╰───────────────────╯

╭━━━━━━━╮    ╭━━━━━━━╮
┃  ⚡ *${config.BOT_NAME}* ⚡  ┃
╰━━━━━━━╯    ╰━━━━━━━╯
> ${config.DESCRIPTION}`,
                image: true
            },
            '5': {
                title: "🤖 *Menu IA* 🤖",
content: `╭━━━━━━━╮    ╭━━━━━━━╮
┃ 🕊️     𝔻𝔸ℝ𝕂-𝔹𝕆𝕐     🕊️ ┃
╰━━━━━━━╯    ╰━━━━━━━╯

╭──〔 💬 CHAT IA 〕──╮
│ • .ai [question]
│ • .gpt3 [question]
│ • .gpt2 [question]
│ • .gptmini [question]
│ • .gpt [question]
│ • .meta [question]
╰────────────────────╯

╭──〔 🖼️ IMAGE IA 〕──╮
│ • .imagine [texte]
│ • .imagine2 [texte]
╰───────────────────╯

╭──〔 🔍 SPÉCIALISÉ 〕──╮
│ • .blackbox [question]
│ • .luma [question]
│ • .dj [question]
│ • .khan [question]
│ • .darkai [on/off]
╰─────────────────────╯

╭━━━━━━━╮    ╭━━━━━━━╮
┃  ⚡ *${config.BOT_NAME}* ⚡  ┃
╰━━━━━━━╯    ╰━━━━━━━╯
> ${config.DESCRIPTION}`,
                image: true
            },
            '6': {
                title: "🎎 *Menu Anime* 🎎",
content: `╭━━━━━━━╮    ╭━━━━━━━╮
┃ 🌸     𝔻𝔸ℝ𝕂-𝔹𝕆𝕐     🌸 ┃
╰━━━━━━━╯    ╰━━━━━━━╯

╭──〔 🖼️ IMAGES 〕──╮
│ • .fack
│ • .dog
│ • .awoo
│ • .garl
│ • .waifu
│ • .neko
│ • .megnumin
│ • .maid
│ • .loli
╰──────────────────╯

╭──〔 🎭 PERSONNAGES 〕──╮
│ • .animegirl
│ • .animegirl1-5
│ • .anime1-5
│ • .foxgirl
│ • .naruto
╰────────────────────╯

╭━━━━━━━╮    ╭━━━━━━━╮
┃  ⚡ *${config.BOT_NAME}* ⚡  ┃
╰━━━━━━━╯    ╰━━━━━━━╯
> ${config.DESCRIPTION}`,
                image: true
            },
            '7': {
                title: "🔄 *Menu Convertisseur* 🔄",
content: `╭━━━━━━━╮    ╭━━━━━━━╮
┃ 🔄     𝔻𝔸ℝ𝕂-𝔹𝕆𝕐     🔄 ┃
╰━━━━━━━╯    ╰━━━━━━━╯

╭──〔 🖼️ MÉDIA 〕──╮
│ • .sticker [image]
│ • .sticker2 [image]
│ • .emojimix 😎+😂
│ • .take [nom, texte]
│ • .tomp3 [vidéo]
╰──────────────────╯

╭──〔 📝 TEXTE 〕──╮
│ • .fancy [texte]
│ • .tts [texte]
│ • .trt [texte]
│ • .base64 [texte]
│ • .unbase64 [texte]
╰────────────────╯

╭━━━━━━━╮    ╭━━━━━━━╮
┃  ⚡ *${config.BOT_NAME}* ⚡  ┃
╰━━━━━━━╯    ╰━━━━━━━╯
> ${config.DESCRIPTION}`,
                image: true
            },
            '8': {
                title: "📌 *Menu Autres* 📌",
content: `╭━━━━━━━╮    ╭━━━━━━━╮
┃ 📌     𝔻𝔸ℝ𝕂-𝔹𝕆𝕐     📌 ┃
╰━━━━━━━╯    ╰━━━━━━━╯

╭──〔 🕒 UTILITAIRES 〕──╮
│ • .timenow
│ • .date
│ • .count [nombre]
│ • .calculate [expression]
│ • .countx
╰──────────────────────╯

╭──〔 🎲 ALÉATOIRE 〕──╮
│ • .flip
│ • .coinflip
│ • .rcolor
│ • .roll
│ • .fact
╰───────────────────╯

╭──〔 🔍 RECHERCHE 〕──╮
│ • .define [mot]
│ • .news [requête]
│ • .movie [nom]
│ • .weather [lieu]
╰────────────────────╯

╭━━━━━━━╮    ╭━━━━━━━╮
┃  ⚡ *${config.BOT_NAME}* ⚡  ┃
╰━━━━━━━╯    ╰━━━━━━━╯
> ${config.DESCRIPTION}`,
                image: true
            },
            '9': {
                title: "💞 *Menu Réactions* 💞",
content: `╭━━━━━━━╮    ╭━━━━━━━╮
┃ 💞     𝔻𝔸ℝ𝕂-𝔹𝕆𝕐     💞 ┃
╰━━━━━━━╯    ╰━━━━━━━╯

╭──〔 ❤️ AFFECTION 〕──╮
│ • .cuddle @user
│ • .hug @user
│ • .kiss @user
│ • .lick @user
│ • .pat @user
╰─────────────────────╯

╭──〔 😂 DRÔLE 〕──╮
│ • .bully @user
│ • .bonk @user
│ • .yeet @user
│ • .slap @user
│ • .kill @user
╰─────────────────╯

╭──〔 😊 EXPRESSIONS 〕──╮
│ • .blush @user
│ • .smile @user
│ • .happy @user
│ • .wink @user
│ • .poke @user
╰────────────────────╯

╭━━━━━━━╮    ╭━━━━━━━╮
┃  ⚡ *${config.BOT_NAME}* ⚡  ┃
╰━━━━━━━╯    ╰━━━━━━━╯
> ${config.DESCRIPTION}`,
                image: true
            },
            '10': {
                title: "🏠 *Menu Principal* 🏠",
content: `╭━━━━━━━╮    ╭━━━━━━━╮
┃ 🏠     𝔻𝔸ℝ𝕂-𝔹𝕆𝕐     🏠 ┃
╰━━━━━━━╯    ╰━━━━━━━╯

╭──〔 ℹ️ INFOS BOT 〕──╮
│ • .ping
│ • .live
│ • .alive
│ • .runtime
│ • .uptime
│ • .repo
│ • .owner
╰────────────────────╯

╭──〔 🛠️ CONTRÔLES 〕──╮
│ • .menu
│ • .menu2
│ • .restart
╰─────────────────────╯

╭━━━━━━━╮    ╭━━━━━━━╮
┃  ⚡ *${config.BOT_NAME}* ⚡  ┃
╰━━━━━━━╯    ╰━━━━━━━╯
> ${config.DESCRIPTION}`,
                image: true
            }
        };

        // Message handler with improved error handling
        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

                const isReplyToMenu = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
                
                if (isReplyToMenu) {
                    const receivedText = receivedMsg.message.conversation || 
                                      receivedMsg.message.extendedTextMessage?.text;
                    const senderID = receivedMsg.key.remoteJid;

                    if (menuData[receivedText]) {
                        const selectedMenu = menuData[receivedText];
                        
                        try {
                            if (selectedMenu.image) {
                                await conn.sendMessage(
                                    senderID,
                                    {
                                        image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/5o09h5.png' },
                                        caption: selectedMenu.content,
                                        contextInfo: contextInfo
                                    },
                                    { quoted: receivedMsg }
                                );
                            } else {
                                await conn.sendMessage(
                                    senderID,
                                    { text: selectedMenu.content, contextInfo: contextInfo },
                                    { quoted: receivedMsg }
                                );
                            }

                            await conn.sendMessage(senderID, {
                                react: { text: '✅', key: receivedMsg.key }
                            });

                        } catch (e) {
                            console.log('Menu reply error:', e);
                            await conn.sendMessage(
                                senderID,
                                { text: selectedMenu.content, contextInfo: contextInfo },
                                { quoted: receivedMsg }
                            );
                        }

                    } else {
                        await conn.sendMessage(
                            senderID,
                            {
                                text: `❌*Option non valide !* ❌\n\nVeuillez répondre avec un nombre compris entre 1 et 10 pour sélectionner un menu.\n\n*Exemple :* Répondez avec « 1 » pour le menu de téléchargement\n\n> ${config.DESCRIPTION}`,
                                contextInfo: contextInfo
                            },
                            { quoted: receivedMsg }
                        );
                    }
                }
            } catch (e) {
                console.log('Handler error:', e);
            }
        };

        // Add listener
        conn.ev.on("messages.upsert", handler);

        // Remove listener after 5 minutes
        setTimeout(() => {
            conn.ev.off("messages.upsert", handler);
        }, 300000);

    } catch (e) {
        console.error('Menu Error:', e);
        try {
            await conn.sendMessage(
                from,
                { text: `❌ Le système de menus est actuellement occupé. Veuillez réessayer ultérieurement.\n\n> ${config.DESCRIPTION}` },
                { quoted: mek }
            );
        } catch (finalError) {
            console.log('Final error handling failed:', finalError);
        }
    }
});
