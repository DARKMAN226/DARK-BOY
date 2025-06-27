const axios = require('axios');
const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "weather",
    desc: "🌤 Obtenir les informations météo pour une localisation",
    react: "🌤",
    category: "other",
    filename: __filename
},
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("❗ Veuillez fournir un nom de ville. Exemple : .weather Paris");
        
        const apiKey = '2d61a72574c11c4f36173b627f8cb177'; 
        const ville = q;
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${apiKey}&units=metric`;
        
        const response = await axios.get(url);
        const data = response.data;
        
        const meteo = `
> 🌍 *Informations météo pour ${data.name}, ${data.sys.country}* 🌍
> 🌡️ *Température* : ${data.main.temp}°C
> 🌡️ *Ressentie* : ${data.main.feels_like}°C
> 🌡️ *Température min* : ${data.main.temp_min}°C
> 🌡️ *Température max* : ${data.main.temp_max}°C
> 💧 *Humidité* : ${data.main.humidity}%
> ☁️ *État du ciel* : ${data.weather[0].main}
> 🌫️ *Description* : ${data.weather[0].description}
> 💨 *Vitesse du vent* : ${data.wind.speed} m/s
> 🔽 *Pression* : ${data.main.pressure} hPa

> *© Powered By DARK-DEV🍷*
`;
        return reply(meteo);
    } catch (e) {
        console.log(e);
        if (e.response && e.response.status === 404) {
            return reply("🚫 Ville non trouvée. Vérifiez l'orthographe et réessayez.");
        }
        return reply("⚠️ Une erreur est survenue lors de la récupération des informations météo. Veuillez réessayer plus tard.");
    }
});
