const { cmd } = require("../command");
const axios = require('axios');
const fs = require('fs');
const path = require("path");
const AdmZip = require("adm-zip");
const { setCommitHash, getCommitHash } = require('../data/updateDB');

cmd({
    pattern: "update",
    alias: ["upgrade", "sync"],
    react: '🆕',
    desc: "Met à jour le bot vers la dernière version.",
    category: "misc",
    filename: __filename
}, async (client, message, args, { reply, isOwner }) => {
    if (!isOwner) return reply("❌ Cette commande est réservée au propriétaire du bot.");

    try {
        await reply("🔍 Vérification des mises à jour de 𝔻𝔸ℝ𝕂-𝔹𝕆𝕐...");

        // Récupérer le dernier hash de commit sur GitHub
        const { data: commitData } = await axios.get("https://api.github.com/repos/DARKMAN226/DARK-BOY/commits/main");
        const latestCommitHash = commitData.sha;

        // Récupérer le hash actuel depuis la base de données
        const currentHash = await getCommitHash();

        if (latestCommitHash === currentHash) {
            return reply("✅ Ton bot 𝔻𝔸ℝ𝕂-𝔹𝕆𝕐 est déjà à jour !");
        }

        await reply("🚀 Mise à jour du bot 𝔻𝔸ℝ𝕂-𝔹𝕆𝕐 en cours...");

        // Télécharger le dernier code source
        const zipPath = path.join(__dirname, "latest.zip");
        const { data: zipData } = await axios.get("https://github.com/DARKMAN226/DARK-BOY/archive/main.zip", { responseType: "arraybuffer" });
        fs.writeFileSync(zipPath, zipData);

        // Extraire l'archive ZIP
        await reply("📦 Extraction du code le plus récent...");
        const extractPath = path.join(__dirname, 'latest');
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(extractPath, true);

        // Copier les fichiers mis à jour en préservant config.js et app.json
        await reply("🔄 Remplacement des fichiers...");
        const sourcePath = path.join(extractPath, "DARK-BOY-main"); // Nom du dossier extrait (sensible à la casse)
        const destinationPath = path.join(__dirname, '..');
        copyFolderSync(sourcePath, destinationPath);

        // Enregistrer le nouveau hash dans la base de données
        await setCommitHash(latestCommitHash);

        // Nettoyage
        fs.unlinkSync(zipPath);
        fs.rmSync(extractPath, { recursive: true, force: true });

        await reply("✅ Mise à jour terminée ! Redémarrage du bot...");
        process.exit(0);

    } catch (error) {
        console.error("Erreur mise à jour :", error);
        return reply("❌ Échec de la mise à jour. Merci d'essayer manuellement.");
    }
});

// Fonction d'aide pour copier les dossiers tout en préservant config.js et app.json
function copyFolderSync(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }

    const items = fs.readdirSync(source);
    for (const item of items) {
        const srcPath = path.join(source, item);
        const destPath = path.join(target, item);

        // Ignorer config.js et app.json pour ne pas écraser les réglages personnalisés
        if (item === "config.js" || item === "app.json") {
            console.log(`Ignoré ${item} pour préserver les paramètres personnalisés.`);
            continue;
        }

        if (fs.lstatSync(srcPath).isDirectory()) {
            copyFolderSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}
