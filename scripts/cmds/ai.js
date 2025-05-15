 const axios = require('axios');
const UPoLPrefix = [
  'lucie',
  'bb',
  'Dori',
  'bot',
  'ask'
]; 

  module.exports = {
  config: {
    name: 'ai',
    version: '1.2.1',
    role: 0,
    category: 'AI',
    author: 'Metoushela walker',
    shortDescription: '',
    longDescription: '',
  },
  
  onStart: async function () {},
  onChat: async function ({ message, event, args, api, threadID, messageID }) {
      
      const ahprefix = UPoLPrefix.find((p) => event.body && event.body.toLowerCase().startsWith(p));
      if (!ahprefix) {
        return; 
      } 
      
     const upol = event.body.substring(ahprefix.length).trim();
   if (!upol) {
        await message.reply('salut majesté , comment puis-je vous aider 😏😍💞?');
        return;
      }
      
      const apply = ['Awww🥹, seigneur Avez vous besoin de quelque chose ?', 'je suis entièrement a vous seigneur 🥹', 'En quoi puis-je vous êtes utile majesté ?', 'Je suis follement amoureuse devine de qui😍💞'];
      
     const randomapply = apply[Math.floor(Math.random() * apply.length)];

     
      if (args[0] === 'hi') {
          message.reply(`${randomapply}`);
          return;
      }
      
    const encodedPrompt = encodeURIComponent(args.join(" "));

   await message.reply('thinking..');
  
    const response = await axios.get(`https://sandipbaruwal.onrender.com/gemini?prompt=${encodedPrompt}`);
 
     const UPoL = response.data.answer; 

      const upolres = `❄️𝘋𝘖𝘙𝘐𝘈𝘕𝘌 𝘉𝘖𝘛❄️ ✨\n━━━━━━━━━━━━━\n${UPoL}`;
      
        message.reply(upolres);
  }
};
