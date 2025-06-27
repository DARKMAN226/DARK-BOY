const { cmd } = require('../command');

cmd({
    pattern: "jid",
    alias: ["id", "chatid", "gjid"],  
    desc: "Obtenir le JID complet du chat/utilisateur actuel (Créateur uniquement)",
    react: "🆔",
    category: "utility",
    filename: __filename,
}, async (conn, mek, m, { 
    from, isGroup, isCreator, reply, sender 
}) => {
    try {
        if (!isCreator) {
            return reply("❌ *Commande restreinte* - Seul mon créateur peut utiliser cette commande.");
        }

        if (isGroup) {
            // Assurer que le JID de groupe se termine par @g.us
            const groupJID = from.includes('@g.us') ? from : `${from}@g.us`;
            return reply(`👥 *JID du groupe :*\n\`\`\`${groupJID}\`\`\``);
        } else {
            // Assurer que le JID utilisateur se termine par @s.whatsapp.net
            const userJID = sender.includes('@s.whatsapp.net') ? sender : `${sender}@s.whatsapp.net`;
            return reply(`👤 *JID de l'utilisateur :*\n\`\`\`${userJID}\`\`\``);
        }

    } catch (e) {
        console.error("Erreur JID :", e);
        reply(`⚠️ Erreur lors de la récupération du JID :\n${e.message}`);
    }
});
