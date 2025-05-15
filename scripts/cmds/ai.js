const axios = require('axios');

const API_KEY = "AIzaSyBQeZVi4QdrnGKPEfXXx1tdIqlMM8iqvZw";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const predefinedQuestions = {
  "qui t'a créé": "El maystro",
  "qui es-tu": "Je suis l'intelligence artificielle créée par Maystro",
  "créateur": "Mon créateur est Maystro",
  "qui est maystro": "El Maystro est le développeur hors norme qui m'a conçu"
};

async function getAIResponse(input, userId, messageID) {
    try {
        const requestBody = {
            contents: [{
                parts: [{ text: input }]
            }]
        };

        const response = await axios.post(API_URL, requestBody, {
            headers: { "Content-Type": "application/json" }
        });

        const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text 
                    || "Désolé, je n'ai pas de réponse pour le moment.";
        return { response: reply, messageID };
    } catch (error) {
        console.error("Erreur API Gemini:", error.response?.data || error.message);
        return { response: "Une erreur est survenue avec l'IA. Veuillez réessayer plus tard.", messageID };
    }
}

module.exports = {
    config: {
        name: 'Lucie',
        author: 'maystro',
        role: 0,
        category: 'ai',
        shortDescription: 'Posez une question à Lucie',
    },

    onStart: async function ({ api, event, args }) {
        return api.sendMessage("Utilisez 'Lucie [votre message]' pour parler à l'IA.", event.threadID);
    },

    onChat: async function ({ event, message }) {
        const content = event.body?.trim();
        if (!content || !content.toLowerCase().startsWith("lucie")) return;

        const input = content.slice(5).trim(); // enlève "Lucie"
        if (!input) {
            return message.reply("Lucie BOT✫༒\n________________________________\nSalut majesté, comment puis-je vous aider aujourd'hui ?💞😚");
        }

        const cleaned = input.toLowerCase().replace(/[.?¿!,]/g, '').trim();
        const response = predefinedQuestions[cleaned] 
            || (await getAIResponse(input, event.senderID, event.messageID)).response;

        return message.reply(`Lucie BOT✫༒\n________________________________\n${response}\n________________________________`);
    }
};
