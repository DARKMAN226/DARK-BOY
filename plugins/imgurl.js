const config = require('../config');
const { cmd } = require('../command');

const stylizedChars = {
    a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
    h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
    o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
    v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩',
    '0': '⓿', '1': '➊', '2': '➋', '3': '➌', '4': '➍',
    '5': '➎', '6': '➏', '7': '➐', '8': '➑', '9': '➒'
};

cmd({
    pattern: "chr",
    alias: ["creact"],
    react: "🔤",
    desc: "Réagir aux messages de chaîne avec un texte stylisé",
    category: "owner",
    use: '.chr <lien-channel> <texte>',
    filename: __filename
},
async (conn, mek, m, { q, isCreator, reply }) => {
    try {
        if (!isCreator) return reply("❌ Commande réservée au propriétaire");
        if (!q) return reply(`Usage:\n.chr https://whatsapp.com/channel/1234567890 message`);

        const [link, ...textParts] = q.split(' ');
        if (!link.includes("whatsapp.com/channel/")) return reply("Format du lien de chaîne invalide");

        const inputText = textParts.join(' ').toLowerCase();
        if (!inputText) return reply("Veuillez fournir le texte à convertir");

        const emoji = inputText
            .split('')
            .map(char => char === ' ' ? '―' : (stylizedChars[char] || char))
            .join('');

        const channelId = link.split('/')[4];
        const messageId = link.split('/')[5];
        if (!channelId || !messageId) return reply("Lien invalide : identifiants manquants");

        const channelMeta = await conn.newsletterMetadata("invite", channelId);
        await conn.newsletterReactMessage(channelMeta.id, messageId, emoji);

        return reply(`╭━━━〔 *𝔻𝔸ℝ𝕂-𝔹𝕆𝕐* 〕━━━┈⊷
┃▸ *Succès !* Réaction envoyée
┃▸ *Chaîne :* ${channelMeta.name}
┃▸ *Réaction :* ${emoji}
╰────────────────┈⊷
> *© Propulsé par 𝔻𝔸ℝ𝕂-𝔹𝕆𝕐*`);
    } catch (e) {
        console.error(e);
        reply(`❎ Erreur : ${e.message || "Échec de l'envoi de la réaction"}`);
    }
});
