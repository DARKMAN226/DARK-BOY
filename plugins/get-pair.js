const { cmd, commands } = require('../command');
const axios = require('axios');

cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot"],
    react: "✅",
    desc: "Obtenir un code d'appairage pour le bot NEXUS-XMD",
    category: "download",
    use: ".pair 22623XXX",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply }) => {
    try {
        // Extraction du numéro
        const phoneNumber = q ? q.trim().replace(/[^0-9]/g, '') : senderNumber.replace(/[^0-9]/g, '');

        // Vérification du format
        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            return await reply("❌ Veuillez fournir un numéro de téléphone valide sans le `+`\nExemple : `.pair 22670XXXXXX`");
        }

        // Requête vers l’API pour obtenir le code d’appairage
        const response = await axios.get(`https://dark-boy-pair-09qc.onrender.com/code?number=${encodeURIComponent(phoneNumber)}`);

        if (!response.data || !response.data.code) {
            return await reply("❌ Impossible de récupérer le code d’appairage. Veuillez réessayer plus tard.");
        }

        const pairingCode = response.data.code;
        const doneMessage = "> *✔️ APPARIEMENT AVEC 𝔻𝔸ℝ𝕂-𝔹𝕆𝕐 TERMINÉ*";

        // Envoi du message avec code
        await reply(`${doneMessage}\n\n*🎯 Code d’appairage :* ${pairingCode}`);

        // Petite pause
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Renvoi simple du code
        await reply(`${pairingCode}`);

    } catch (error) {
        console.error("Erreur commande pair :", error);
        await reply("❌ Une erreur est survenue lors de la récupération du code. Réessayez plus tard.");
    }
});
