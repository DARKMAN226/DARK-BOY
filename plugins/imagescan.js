const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require("path");
const { cmd } = require("../command");

// Fonction utilitaire pour formater les tailles en octets
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

cmd({
  pattern: "imgscan",
  alias: ["scanimg", "imagescan", "analyzeimg"],
  react: '🔍',
  desc: "Scanner et analyser les images avec IA",
  category: "utility",
  use: ".imgscan [répondre à une image]",
  filename: __filename
}, async (client, message, { reply, quoted }) => {
  try {
    // Vérifier qu'un message cité existe et contient une image
    const quotedMsg = quoted || message;
    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';
    
    if (!mimeType || !mimeType.startsWith('image/')) {
      return reply("Veuillez répondre à une image (JPEG/PNG)");
    }

    // Télécharger le média
    const mediaBuffer = await quotedMsg.download();
    const fileSize = formatBytes(mediaBuffer.length);
    
    // Déterminer l'extension en fonction du type MIME
    let extension = '';
    if (mimeType.includes('image/jpeg')) extension = '.jpg';
    else if (mimeType.includes('image/png')) extension = '.png';
    else {
      return reply("Format d'image non supporté. Veuillez utiliser JPEG ou PNG");
    }

    const tempFilePath = path.join(os.tmpdir(), `imgscan_${Date.now()}${extension}`);
    fs.writeFileSync(tempFilePath, mediaBuffer);

    // Envoyer le fichier sur Catbox pour hébergement
    const form = new FormData();
    form.append('fileToUpload', fs.createReadStream(tempFilePath), `image${extension}`);
    form.append('reqtype', 'fileupload');

    const uploadResponse = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders()
    });

    const imageUrl = uploadResponse.data;
    fs.unlinkSync(tempFilePath); // Supprimer le fichier temporaire

    if (!imageUrl) {
      throw "Échec de l'envoi de l'image sur Catbox";
    }

    // Scanner l'image via l'API d'analyse
    const scanUrl = `https://apis.davidcyriltech.my.id/imgscan?url=${encodeURIComponent(imageUrl)}`;
    const scanResponse = await axios.get(scanUrl);

    if (!scanResponse.data.success) {
      throw scanResponse.data.message || "Échec de l'analyse de l'image";
    }

    // Envoyer le résultat formaté
    await reply(
      `🔍 *Résultats de l'analyse d'image*\n\n` +
      `${scanResponse.data.result}\n\n` +
      `> © Powered by DARK-DEV🍷`
    );

  } catch (error) {
    console.error('Erreur lors du scan d\'image:', error);
    await reply(`❌ Erreur : ${error.message || error}`);
  }
});
