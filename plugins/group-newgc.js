//---------------------------------------------------------------------------
//           DARK-DEV  
//---------------------------------------------------------------------------
//  ⚠️ NE PAS MODIFIER CE FICHIER ⚠️  
//---------------------------------------------------------------------------

const { cmd, commands } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
const path = require('path');

cmd({
  pattern: "newgc",
  category: "group",
  desc: "Créer un nouveau groupe et ajouter des participants.",
  filename: __filename,
}, async (conn, mek, m, { from, isGroup, body, sender, groupMetadata, participants, reply }) => {
  try {
    if (!body) {
      return reply(`Utilisation : !newgc nom_du_groupe;num1,num2,...`);
    }

    const [groupName, numbersString] = body.split(";");
    
    if (!groupName || !numbersString) {
      return reply(`Utilisation : !newgc nom_du_groupe;num1,num2,...`);
    }

    const participantNumbers = numbersString
      .split(",")
      .map(number => `${number.trim()}@s.whatsapp.net`);

    const group = await conn.groupCreate(groupName, participantNumbers);
    console.log('Groupe créé avec l’ID : ' + group.id);

    const inviteLink = await conn.groupInviteCode(group.id);

    await conn.sendMessage(group.id, { text: 'Bienvenue dans le groupe 👋' });

    reply(`✅ Groupe créé avec succès !\n🔗 Lien d’invitation : https://chat.whatsapp.com/${inviteLink}\n📩 Message de bienvenue envoyé.`);
  } catch (e) {
    return reply(`❌ *Une erreur est survenue lors de la création du groupe.*\n\n_Erreur:_ ${e.message}`);
  }
});
