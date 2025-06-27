const config = require('../config');
const { cmd } = require('../command');
const fetch = require('node-fetch');

cmd({
    pattern: "igvid",
    alias: ["insta", "igdl", "instagram"],
    react: "🎥",
    desc: "Télécharger uniquement les vidéos Instagram",
    category: "downloader",
    use: '.igvid <URL Instagram>',
    filename: __filename
},
async (conn, mek, m, { from, prefix, quoted, q, reply }) => {
    try {
        if (!q || !q.startsWith('http')) {
            return reply(`✳️ Veuillez fournir une URL Instagram valide.\nExemple : ${prefix}igvid <URL>`);
        }

        // Réaction d'attente
        await conn.sendMessage(from, {
            react: { text: "⏳", key: m.key }
        });

        const response = await fetch(`https://delirius-apiofc.vercel.app/download/instagram?url=${encodeURIComponent(q)}`);
        if (!response.ok) throw new Error("Échec de la récupération via l'API Instagram");

        const json = await response.json();
        if (!json.data || !Array.isArray(json.data)) throw new Error("Structure de réponse API invalide");

        const videos = json.data.filter(item => item.url && item.url.endsWith('.mp4'));
        if (!videos.length) {
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply("❌ Aucune vidéo trouvée dans la publication Instagram.");
        }

        // Réaction de succès
        await conn.sendMessage(from, {
            react: { text: "✅", key: m.key }
        });

        for (const video of videos) {
            await conn.sendMessage(from, {
                video: { url: video.url },
                mimetype: "video/mp4",
                caption: `╭━━━〔 *𝔻𝔸ℝ𝕂-𝔹𝕆𝕐* 〕━━━┈⊷\n┃▸ *Vidéo Instagram*\n╰────────────────┈⊷\n> *© Powered DARK-DEV🍷*`
            }, { quoted: mek });
        }

    } catch (e) {
        console.error("ERREUR IGVID:", e.message || e);
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
        await reply("❎ Une erreur est survenue lors du traitement de votre requête.");
    }
});
