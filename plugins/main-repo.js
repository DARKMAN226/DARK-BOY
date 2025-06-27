const fetch = require('node-fetch');
const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Récupérer les informations du dépôt GitHub",
    react: "📂",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    const githubRepoURL = 'https://github.com/DARKMAN226/DARK-BOY';

    try {
        const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);

        if (!response.ok) throw new Error(`Erreur API GitHub : ${response.status}`);
        const repoData = await response.json();

        // Styles ASCII variés pour l'affichage

        const style1 = `╭───『 ${config.BOT_NAME} DÉPÔT 』───⳹
│
│ 📦 *Dépôt* : ${repoData.name}
│ 👑 *Propriétaire* : ${repoData.owner.login}
│ ⭐ *Étoiles* : ${repoData.stargazers_count}
│ ⑂ *Forks* : ${repoData.forks_count}
│ 🔗 *URL* : ${repoData.html_url}
│
│ 📝 *Description* :
│ ${repoData.description || 'Aucune description'}
│
╰────────────────⳹
> ${config.DESCRIPTION}`;

        const style2 = `•——[ INFO GITHUB ]——•
│
├─ 🏷️ ${repoData.name}
├─ 👤 ${repoData.owner.login}
├─ ✨ ${repoData.stargazers_count} étoiles
├─ ⑂ ${repoData.forks_count} forks
│
•——[ ${config.BOT_NAME} ]——•
> ${config.DESCRIPTION}`;

        const style3 = `▄▀▄▀▄ INFOS DÉPÔT ▄▀▄▀▄

♢ *Projet* : ${repoData.name}
♢ *Auteur* : ${repoData.owner.login}
♢ *Étoiles* : ${repoData.stargazers_count} ✨
♢ *Forks* : ${repoData.forks_count} ⑂
♢ *Mise à jour* : ${new Date(repoData.updated_at).toLocaleDateString()}

🔗 ${repoData.html_url}

> ${config.DESCRIPTION}`;

        const style4 = `┌──────────────────────┐
│  ⚡ ${config.BOT_NAME} DÉPÔT  ⚡  │
├──────────────────────┤
│ • Nom : ${repoData.name}
│ • Propriétaire : ${repoData.owner.login}
│ • Étoiles : ${repoData.stargazers_count}
│ • Forks : ${repoData.forks_count}
│ • URL : ${repoData.html_url}
│ • Description : ${repoData.description || 'Aucune'}
└──────────────────────┘
> ${config.DESCRIPTION}`;

        const style5 = `▰▰▰▰▰ INFOS DÉPÔT ▰▰▰▰▰

🏷️  *${repoData.name}*
👨‍💻  ${repoData.owner.login}

⭐ ${repoData.stargazers_count}  ⑂ ${repoData.forks_count}
🔗 ${repoData.html_url}

📜 ${repoData.description || 'Aucune description'}

> ${config.DESCRIPTION}`;

        const style6 = `╔══════════════════════╗
║   ${config.BOT_NAME} DÉPÔT    ║
╠══════════════════════╣
║ > NOM : ${repoData.name}
║ > PROPRIÉTAIRE : ${repoData.owner.login}
║ > ÉTOILES : ${repoData.stargazers_count}
║ > FORKS : ${repoData.forks_count}
║ > URL : ${repoData.html_url}
║ > DESC : ${repoData.description || 'Aucune'}
╚══════════════════════╝
> ${config.DESCRIPTION}`;

        const style7 = `┌───────────────┐
│  📂  DÉPÔT  │
└───────────────┘
│
│ *Projet* : ${repoData.name}
│ *Auteur* : ${repoData.owner.login}
│
│ ✨ ${repoData.stargazers_count} étoiles
│ ⑂ ${repoData.forks_count} forks
│
│ 🔗 ${repoData.html_url}
│
┌───────────────┐
│  📝  DESC  │
└───────────────┘
${repoData.description || 'Aucune description'}

> ${config.DESCRIPTION}`;

        const style8 = `✦ ${config.BOT_NAME} Dépôt GitHub ✦

📌 *${repoData.name}*
👤 @${repoData.owner.login}

⭐ ${repoData.stargazers_count} étoiles | ⑂ ${repoData.forks_count} forks
🔄 Dernière mise à jour : ${new Date(repoData.updated_at).toLocaleDateString()}

🔗 GitHub : ${repoData.html_url}

${repoData.description || 'Pas de description disponible'}

> ${config.DESCRIPTION}`;

        const style9 = `╔♫═🎧═♫══════════╗
   ${config.BOT_NAME} DÉPÔT
╚♫═🎧═♫══════════╝

•・゜゜・* ✧  *・゜゜・•
 ✧ *Nom* : ${repoData.name}
 ✧ *Propriétaire* : ${repoData.owner.login}
 ✧ *Étoiles* : ${repoData.stargazers_count}
 ✧ *Forks* : ${repoData.forks_count}
•・゜゜・* ✧  *・゜゜・•

🔗 ${repoData.html_url}

${repoData.description || 'Aucune description'}

> ${config.DESCRIPTION}`;

        const style10 = `┏━━━━━━━━━━━━━━━━━━┓
┃  RAPPORT DU DÉPÔT  ┃
┗━━━━━━━━━━━━━━━━━━┛

◈ Projet : ${repoData.name}
◈ Mainteneur : ${repoData.owner.login}
◈ Popularité : ★ ${repoData.stargazers_count} | ⑂ ${repoData.forks_count}
◈ Dernière mise à jour : ${new Date(repoData.updated_at).toLocaleDateString()}
◈ URL : ${repoData.html_url}

Description :
${repoData.description || 'Aucune description fournie'}

> ${config.DESCRIPTION}`;

        const styles = [style1, style2, style3, style4, style5, style6, style7, style8, style9, style10];
        const selectedStyle = styles[Math.floor(Math.random() * styles.length)];

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/u4g4te.png' },
            caption: selectedStyle,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363422353392657@newsletter',
                    newsletterName: config.OWNER_NAME || 'DARK-DEV🍷',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // Envoi d'un audio ptt de notification
        await conn.sendMessage(from, {
            audio: { url: 'https://files.catbox.moe/lgnhqx.mp3' },
            mimetype: 'audio/mp4',
            ptt: true,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Erreur commande repo :", error);
        reply(`❌ Erreur : ${error.message}`);
    }
});
