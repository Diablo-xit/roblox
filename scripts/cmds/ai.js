const axios = require('axios');

const API_KEY = "AIzaSyBQeZVi4QdrnGKPEfXXx1tdIqlMM8iqvZw";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const predefinedQuestions = {
  "qui t'a créé": "maystro est mon créateur 💞🤤",
  "qui es-tu": "je suis Lucie bot, une intelligence artificielle créée par maystro 💞",
  "créateur": "mon créateur est maystro 💞",
  "qui est maystro": "maystro est le développeur exceptionnel qui m'a conçue avec amour 🤤💞😍",
  "android": "Android est un système que j’aime beaucoup 🤤"
};

async function getAIResponse(input, userName, userId, messageID) {
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
        name: 'lucie',
        author: 'maystro',
        role: 0,
        category: 'ai',
        shortDescription: 'Lucie bot pour répondre aux questions',
    },
    onStart: async function ({ api, event, args }) {
        const input = args.join(' ').trim();
        if (!input) return api.sendMessage("Pose ta question après le mot 'Lucie'.", event.threadID);

        try {
            const processedInput = input.toLowerCase().replace(/[.?¿!,]/g, '').trim();
            let response;

            if (processedInput === "lucie") {
                response = "𝑆𝐴𝐿𝑈𝑇, 𝐽𝐸 𝑆𝑈𝐼𝑆 𝐿𝑈𝐶𝐼𝐸 𝐵𝑂𝑇, 𝐿'𝐼𝑁𝑇𝐸𝐿𝐿𝐼𝐺𝐸𝑁𝐶𝐸 𝐴𝑅𝑇𝐼𝐹𝐼𝐶𝐼𝐸𝐿𝐿𝐸 𝐶𝑅ÉÉ 𝑃𝐴𝑅 𝑀𝐴𝑌𝑆𝑇𝑅𝑂 💞";
            } else if (predefinedQuestions[processedInput]) {
                response = predefinedQuestions[processedInput];
            } else {
                const aiResponse = await getAIResponse(input, event.senderID, event.messageID);
                response = aiResponse.response;
            }

            api.sendMessage(
                `Lucie bot ❤️\n━━━━━━━━━━━━━━━━\n${response}\n━━━━━━━━━━━━━━━━`,
                event.threadID,
                event.messageID
            );
        } catch (error) {
            api.sendMessage("❌ Une erreur s'est produite lors du traitement de votre demande.", event.threadID);
        }
    },
    onChat: async function ({ event, message }) {
        const messageContent = event.body.trim();
        if (!messageContent.toLowerCase().startsWith("lucie ")) return;

        try {
            const input = messageContent.slice(6).trim();
            if (!input) {
                return message.reply("Lucie bot ❤️\n━━━━━━━━━━━━━━━━\n𝑆𝐴𝐿𝑈𝑇, 𝐽𝐸 𝑆𝑈𝐼𝑆 𝐿𝑈𝐶𝐼𝐸 𝐵𝑂𝑇, 𝐶𝑅ÉÉ 𝑃𝐴𝑅 𝑀𝐴𝑌𝑆𝑇𝑅𝑂 💞\n━━━━━━━━━━━━━━━━");
            }

            const processedInput = input.toLowerCase().replace(/[.?¿!,]/g, '').trim();
            const response = predefinedQuestions[processedInput] 
                || (await getAIResponse(input, event.senderID, event.messageID)).response;

            message.reply(
                `Lucie bot ❤️\n━━━━━━━━━━━━━━━━\n${response}\n━━━━━━━━━━━━━━━━`
            );
        } catch (error) {
            message.reply("❌ Désolé, je n'ai pas pu traiter ta demande.");
        }
    }
};
