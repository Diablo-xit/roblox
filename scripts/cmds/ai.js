const axios = require('axios');

const API_KEY = "AIzaSyBQeZVi4QdrnGKPEfXXx1tdIqlMM8iqvZw";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const predefinedQuestions = {
  "qui t'a créé": "El maystro m’a forgée avec passion et génie.",
  "qui es-tu": "Je suis Lucie, l’intelligence créée par maystro pour te servir, majesté.",
  "créateur": "Mon créateur est le grand Maystro.",
  "qui est maystro": "Maystro est un développeur visionnaire, respecté et admiré."
};

async function getAIResponse(input, userName, userId, messageID) {
    try {
        const requestBody = {
            contents: [{ parts: [{ text: input }] }]
        };

        const response = await axios.post(API_URL, requestBody, {
            headers: { "Content-Type": "application/json" }
        });

        const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        return { response: reply || "Je suis confuse... Veux-tu reformuler, Majesté ?", messageID };
    } catch (error) {
        console.error("Erreur API Gemini:", error.response?.data || error.message);
        return { response: "Une erreur s’est produite avec l’intelligence. Réessaie plus tard, Majesté.", messageID };
    }
}

function greetingByHour() {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour Majesté ☀️";
    if (hour < 18) return "Bon après-midi Majesté ☕";
    return "Bonsoir Majesté 🌙";
}

module.exports = {
    config: {
        name: 'Lucie',
        author: 'maystro',
        role: 0,
        category: 'ai',
        shortDescription: 'Pose une question à Lucie l’IA'
    },

    onStart: async function ({ api, event, args }) {
        const input = args.join(' ').trim();
        if (!input) return api.sendMessage("Majesté, que désirez-vous que je vous réponde ?", event.threadID);

        try {
            const processedInput = input.toLowerCase().replace(/[.?¿!,]/g, '').trim();
            let response;

            if (processedInput === "lucie") {
                response = "SALUT MAJESTÉ EN QUOI PUIS-JE VOUS SERVIR AUJOURD'HUI 😍😚😏";
            } else if (predefinedQuestions[processedInput]) {
                response = predefinedQuestions[processedInput];
            } else {
                const aiResponse = await getAIResponse(input, event.senderID, event.messageID);
                response = aiResponse.response;
            }

            api.sendMessage(
                `${greetingByHour()} !\n━━━━━━━━━━━━━━━━\n${response}\n━━━━━━━━━━━━━━━━`,
                event.threadID,
                event.messageID
            );
        } catch (error) {
            api.sendMessage("❌ Une erreur est survenue, Majesté. Veuillez réessayer plus tard.", event.threadID);
        }
    },

    onChat: async function ({ event, message }) {
        const messageContent = event.body.trim();
        if (!messageContent.toLowerCase().startsWith("ai")) return;

        try {
            const input = messageContent.slice(2).trim();
            if (!input) {
                return message.reply("Lucie 𝐵𝑂𝑇✫༒\n_______________________________\nMajesté, veuillez entrer votre question après 'ai'.\n______________________");
            }

            const processedInput = input.toLowerCase().replace(/[.?¿!,]/g, '').trim();
            const response = predefinedQuestions[processedInput]
                || (await getAIResponse(input, event.senderID, event.messageID)).response;

            message.reply(
                `𝑆Lucie bot😍💞✫༒\n_______________________________\n${response}\n________________________`
            );
        } catch (error) {
            message.reply("❌ Désolé Majesté, une erreur s’est produite.");
        }
    }
};
