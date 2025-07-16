// index.js - Entry point for the 6ol Temple Bot
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`🕯️ The Temple awakens. Logged in as ${client.user.tag}`);
});

client.on('messageCreate', message => {
  if (message.author.bot) return;
  if (message.content.toLowerCase().includes('temple')) {
    message.channel.send('🛕 The Temple hears you...');
  }
});

client.login(process.env.DISCORD_TOKEN);
