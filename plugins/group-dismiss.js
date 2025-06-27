const { cmd } = require('../command');

cmd({
    pattern: "demote",
    alias: ["d", "dismiss", "removeadmin"],
    desc: "Destitue un administrateur de groupe",
    category: "admin",
    react: "⬇️",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, q, isGroup, sender, botNumber, isBotAdmins, isAdmins, reply
}) => {

    // Vérifier si la commande est utilisée dans un groupe
    if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans les groupes.");

    // Vérifier si l'utilisateur est administrateur
    if (!isAdmins) return reply("❌ Seuls les administrateurs du groupe peuvent utiliser cette commande.");

    // Vérifier si le bot est administrateur
    if (!isBotAdmins) return reply("❌ Je dois être admin du groupe pour pouvoir destituer quelqu’un.");

    let number;
    if (quoted) {
        number = quoted.sender.split("@")[0]; // Si on répond à un message
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, ''); // Si un numéro est mentionné
    } else {
        return reply("❌ Veuillez répondre à un message ou fournir un numéro pour retirer les droits admin.");
    }

    // Empêcher la destitution du bot lui-même
    if (number === botNumber) return reply("❌ Je ne peux pas me destituer moi-même.");

    const jid = number + "@s.whatsapp.net";

    try {
        await conn.groupParticipantsUpdate(from, [jid], "demote");
        reply(`✅ L'utilisateur @${number} a été destitué de ses droits d'administrateur.`, { mentions: [jid] });
    } catch (error) {
        console.error("Erreur dans la commande demote :", error);
        reply("❌ Impossible de retirer les droits admin de cet utilisateur.");
    }
});
