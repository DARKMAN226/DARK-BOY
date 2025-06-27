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
  pattern: "poll",
  category: "group",
  desc: "Créer un sondage avec une question et des options dans le groupe.",
  filename: __filename,
}, async (conn, mek, m, { from, isGroup, body, sender, groupMetadata, participants, prefix, pushname, reply }) => {
  try {
    let [question, optionsString] = body.split(";");
    
    if (!question || !optionsString) {
      return reply(`Utilisation : ${prefix}poll question;option1,option2,option3...`);
    }

    let options = [];
    for (let option of optionsString.split(",")) {
      if (option && option.trim() !== "") {
        options.push(option.trim());
      }
    }

    if (options.length < 2) {
      return reply("*Veuillez fournir au moins deux options pour le sondage.*");
    }

    await conn.sendMessage(from, {
      poll: {
        name: question,
        values: options,
        selectableCount: 1,
        toAnnouncementGroup: true,
      }
    }, { quoted: mek });
    
  } catch (e) {
    return reply(`*Une erreur est survenue lors du traitement de votre demande.*\n\n_Erreur:_ ${e.message}`);
  }
});
