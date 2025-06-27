const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "movie",
    desc: "Obtenir des informations détaillées sur un film.",
    category: "utilitaire",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender, args }) => {
    try {
        // Récupérer le nom du film depuis les arguments ou le message
        const movieName = args.length > 0 ? args.join(' ') : m.text.replace(/^[\.\#\$\!]?movie\s?/i, '').trim();
        
        if (!movieName) {
            return reply("📽️ Veuillez fournir le nom du film.\nExemple : .movie Iron Man");
        }

        const apiUrl = `https://apis.davidcyriltech.my.id/imdb?query=${encodeURIComponent(movieName)}`;
        const response = await axios.get(apiUrl);

        if (!response.data.status || !response.data.movie) {
            return reply("🚫 Film introuvable. Veuillez vérifier le nom et réessayer.");
        }

        const movie = response.data.movie;
        
        // Format du message
        const dec = `
╔════════════════════════════════════════╗
║           🎬 Informations Film         ║
╚════════════════════════════════════════╝

🎥 Titre : *${movie.title}* (${movie.year}) ${movie.rated || ''}
⭐ IMDb : ${movie.imdbRating || 'N/A'} | 🍅 Rotten Tomatoes : ${movie.ratings.find(r => r.source === 'Rotten Tomatoes')?.value || 'N/A'} | 💰 Box Office : ${movie.boxoffice || 'N/A'}

📅 Date de sortie : ${new Date(movie.released).toLocaleDateString()}
⏳ Durée : ${movie.runtime}
🎭 Genre : ${movie.genres}

📝 Résumé :
${movie.plot}

🎬 Réalisateur : ${movie.director}
✍️ Scénariste : ${movie.writer}
🌟 Acteurs : ${movie.actors}

🌍 Pays : ${movie.country}
🗣️ Langue(s) : ${movie.languages}
🏆 Récompenses : ${movie.awards || 'Aucune'}

🔗 [Voir sur IMDb](${movie.imdbUrl})
`;



        // Send message with the requested format
        await conn.sendMessage(
            from,
            {
                image: { 
                    url: movie.poster && movie.poster !== 'N/A' ? movie.poster : 'https://files.catbox.moe/u4g4te.png'
                },
                caption: dec,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363422353392657@newsletter',
                        newsletterName: 'DARK-BOY',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error('Movie command error:', e);
        reply(`❌ Error: ${e.message}`);
    }
});
