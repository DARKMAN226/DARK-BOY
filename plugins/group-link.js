const { cmd, commands } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
const path = require('path');

cmd({
    pattern: "invite",
    alias: ["glink", "grouplink"],
    desc: "Obtenir le lien d'invitation du groupe.",
    category: "group", // Déjà groupe
    filename: __filename,
}, async (conn, mek, m, { from, quoted, body, args, q, isGroup, sender, reply }) => {
    try {
        // Vérifier que la commande est utilisée dans un groupe
        if (!isGroup) return reply("Cette fonctionnalité est uniquement disponible pour les groupes ❗");

        // Récupérer le numéro de l'expéditeur
        const senderNumber = sender.split('@')[0];
        const botNumber = conn.user.id.split(':')[0];
        
        // Vérifier si le bot est admin
        const groupMetadata = isGroup ? await conn.groupMetadata(from) : '';
        const groupAdmins = groupMetadata ? groupMetadata.participants.filter(member => member.admin) : [];
        const isBotAdmins = isGroup ? groupAdmins.some(admin => admin.id === botNumber + '@s.whatsapp.net') : false;
        
        if (!isBotAdmins) return reply("Veuillez me donner le rôle d'administrateur ❗");

        // Vérifier si l'expéditeur est admin
        const isAdmins = isGroup ? groupAdmins.some(admin => admin.id === sender) : false;
        if (!isAdmins) return reply("Veuillez me donner le rôle d'administrateur ❗");

        // Récupérer le code d'invitation et générer le lien
        const inviteCode = await conn.groupInviteCode(from);
        if (!inviteCode) return reply("Échec de la récupération du code d'invitation.");

        const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

        // Répondre avec le lien d'invitation
        return reply(`*Voici le lien d'invitation de votre groupe :*\n${inviteLink}`);
        
    } catch (error) {
        console.error("Erreur dans la commande invite :", error);
        reply(`Une erreur est survenue : ${error.message || "Erreur inconnue"}`);
    }
});
