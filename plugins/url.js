const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require("path");
const { cmd } = require("../command");

cmd({
  pattern: "tourl",
  alias: ["imgtourl", "imgurl", "url", "geturl", "upload"],
  react: '🖇',
  desc: "Convertir un média en URL via Catbox",
  category: "utility",
  use: ".tourl [répondre à un média]",
  filename: __filename
}, async (client, message, args, { reply }) => {
  try {
    // Vérifie si le message cité existe et contient un média
    const quotedMsg = message.quoted ? message.quoted : message;
    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';
    
    if (!mimeType) {
      throw "Veuillez répondre à une image, une vidéo ou un fichier audio";
    }

    // Télécharge le média
    const mediaBuffer = await quotedMsg.download();
    const tempFilePath = path.join(os.tmpdir(), `catbox_upload_${Date.now()}`);
    fs.writeFileSync(tempFilePath, mediaBuffer);

    // Détermine l'extension du fichier selon le type mime
    let extension = '';
    if (mimeType.includes('image/jpeg')) extension = '.jpg';
    else if (mimeType.includes('image/png')) extension = '.png';
    else if (mimeType.includes('video')) extension = '.mp4';
    else if (mimeType.includes('audio')) extension = '.mp3';
    
    const fileName = `file${extension}`;

    // Prépare le formulaire pour Catbox
    const form = new FormData();
    form.append('fileToUpload', fs.createReadStream(tempFilePath), fileName);
    form.append('reqtype', 'fileupload');

    // Envoie vers Catbox
    const response = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders()
    });

    if (!response.data) {
      throw "Erreur lors de l'upload sur Catbox";
    }

    const mediaUrl = response.data;
    fs.unlinkSync(tempFilePath);

    // Détermine le type de média pour la réponse
    let mediaType = 'Fichier';
    if (mimeType.includes('image')) mediaType = 'Image';
    else if (mimeType.includes('video')) mediaType = 'Vidéo';
    else if (mimeType.includes('audio')) mediaType = 'Audio';

    // Envoie la réponse
    await reply(
      `*${mediaType} téléchargé avec succès*\n\n` +
      `*Taille:* ${formatBytes(mediaBuffer.length)}\n` +
      `*URL:* ${mediaUrl}\n\n` +
      `> © Upload par DARK-DEV🍷`
    );

  } catch (error) {
    console.error(error);
    await reply(`Erreur : ${error.message || error}`);
  }
});

// Fonction utilitaire pour formater la taille en octets
function formatBytes(bytes) {
  if (bytes === 0) return '0 Octets';
  const k = 1024;
  const sizes = ['Octets', 'Ko', 'Mo', 'Go'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
