const config = require('../config');
const { cmd } = require('../command');
const axios = require('axios');

cmd({
  on: "body"
}, async (conn, m, { isGroup }) => {
  try {
    if (config.MENTION_REPLY !== 'true' || !isGroup) return;
    if (!m.mentionedJid || m.mentionedJid.length === 0) return;

    const voiceClips = [
      "https://files.catbox.moe/cqmhuy.mp4",
      "https://files.catbox.moe/cqmhuy.mp4",
      "https://files.catbox.moe/cqmhuy.mp4",
      "https://files.catbox.moe/cqmhuy.mp4",
      "https://files.catbox.moe/cqmhuy.mp4",
      "https://files.catbox.moe/cqmhuy.mp4",
      
    ];

    const randomClip = voiceClips[Math.floor(Math.random() * voiceClips.length)];
    const botNumber = conn.user.id.split(":")[0] + '@s.whatsapp.net';

    if (m.mentionedJid.includes(botNumber)) {
      const thumbnailRes = await axios.get(config.MENU_IMAGE_URL || "https://files.catbox.moe/5o09h5.png", {
        responseType: 'arraybuffer'
      });
      const thumbnailBuffer = Buffer.from(thumbnailRes.data, 'binary');

      await conn.sendMessage(m.chat, {
        audio: { url: randomClip },
        mimetype: 'audio/mp4',
        ptt: true,
        waveform: [99, 0, 99, 0, 99],
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: config.BOT_NAME || "DARK-DEV🍷",
            body: config.DESCRIPTION || "POWERED BY DARK-DEV🍷",
            mediaType: 1,
            renderLargerThumbnail: true,
            thumbnail: thumbnailBuffer,
            mediaUrl: "https://files.catbox.moe/u4g4te.png", // Static image URL
            sourceUrl: "https://whatsapp.com/channel/0029VbAfF6f1dAw7hJidqS0i",
            showAdAttribution: true
          }
        }
      }, { quoted: m });
    }
  } catch (e) {
    console.error(e);
    const ownerJid = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    await conn.sendMessage(ownerJid, {
      text: `*Erreur de bot dans le gestionnaire de mentions:*\n${e.message}`
    });
  }
});
