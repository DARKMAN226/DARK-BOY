const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "list",
    alias: ["listcmd", "commands"],
    desc: "Afficher toutes les commandes disponibles avec descriptions",
    category: "menu",
    react: "📜",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Compter le nombre total de commandes et alias
        const totalCommands = Object.keys(commands).length;
        let aliasCount = 0;
        Object.values(commands).forEach(cmd => {
            if (cmd.alias) aliasCount += cmd.alias.length;
        });

        // Obtenir la liste unique des catégories
        const categories = [...new Set(Object.values(commands).map(c => c.category))];

        let menuText = `╭───『 *${config.BOT_NAME} LISTE DES COMMANDES* 』───⳹
│
│ *🛠️ INFORMATIONS BOT*
│ • 🤖 Nom: ${config.BOT_NAME}
│ • 👑 Propriétaire: ${config.OWNER_NAME}
│ • ⚙️ Préfixe: [${config.PREFIX}]
│ • 🌐 Plateforme: Heroku
│ • 📦 Version: 1.0.0
│ • 🕒 Runtime: ${runtime(process.uptime())}
│
│ *📊 STATISTIQUES COMMANDES*
│ • 📜 Total Commandes: ${totalCommands}
│ • 🔄 Total Alias: ${aliasCount}
│ • 🗂️ Catégories: ${categories.length}
│
╰────────────────⳹\n`;

        // Organiser les commandes par catégorie
        const categorized = {};
        categories.forEach(cat => {
            categorized[cat] = Object.values(commands).filter(c => c.category === cat);
        });

        // Générer le menu par catégorie
        for (const [category, cmds] of Object.entries(categorized)) {
            menuText += `╭───『 *${category.toUpperCase()}* 』───⳹
│ • 📂 Commandes: ${cmds.length}
│ • 🔄 Alias: ${cmds.reduce((a, c) => a + (c.alias ? c.alias.length : 0), 0)}
│
`;

            cmds.forEach(c => {
                menuText += `┃▸📄 COMMANDE: .${c.pattern}\n`;
                menuText += `┃▸❕ ${c.desc || 'Pas de description disponible'}\n`;
                if (c.alias && c.alias.length > 0) {
                    menuText += `┃▸🔹 Alias: ${c.alias.map(a => `.${a}`).join(', ')}\n`;
                }
                if (c.use) {
                    menuText += `┃▸💡 Usage: ${c.use}\n`;
                }
                menuText += `│\n`;
            });

            menuText += `╰────────────────⳹\n`;
        }

        menuText += `\n📝 *Note* : Utilisez ${config.PREFIX}help <commande> pour plus d'aide détaillée\n`;
        menuText += `> ${config.DESCRIPTION}`;

        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/5o09h5.png' },
                caption: menuText,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error('Erreur liste des commandes:', e);
        reply(`❌ Erreur lors de la génération de la liste des commandes: ${e.message}`);
    }
});
