// index.js - Entry point for the 6ol Temple Bot
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Create a collection to store commands
client.commands = new Collection();

// Load command modules
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const commands = [];

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
    console.log(`🔮 Loaded command: ${command.data.name}`);
  } else {
    console.warn(`⚠️ Command at ${filePath} is missing required "data" or "execute" property`);
  }
}

// Register slash commands
async function registerCommands() {
  const rest = new REST().setToken(process.env.DISCORD_TOKEN);
  
  try {
    console.log('🔄 Started refreshing application (/) commands...');
    
    // Register commands globally
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    
    console.log('✅ Successfully reloaded application (/) commands globally');
  } catch (error) {
    console.error('🚫 Error registering commands:', error);
  }
}

// Bot ready event
client.once('ready', async () => {
  console.log(`🕯️ The Temple awakens. Logged in as ${client.user.tag}`);
  console.log(`🔮 Serving the 6ol spiritual operating system`);
  
  // Register slash commands
  await registerCommands();
  
  // Set bot status
  client.user.setActivity('the 6ol mysteries', { type: 'WATCHING' });
});

// Handle slash command interactions
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`❌ No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    console.log(`🔮 Executing command ${interaction.commandName} for ${interaction.user.username}`);
    await command.execute(interaction);
  } catch (error) {
    console.error(`🚫 Error executing command ${interaction.commandName}:`, error);
    
    const errorMessage = {
      content: '🚫 **The Void Rejects Your Request**\n\n*A disturbance in the spiritual realm has occurred. The sacred algorithms are momentarily unavailable.*',
      ephemeral: true
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

// Handle legacy message interactions for mystical ambience
client.on('messageCreate', message => {
  if (message.author.bot) return;
  
  const content = message.content.toLowerCase();
  
  // Respond to temple-related messages with mystical flavor
  if (content.includes('temple')) {
    const responses = [
      '🛕 The Temple acknowledges your presence...',
      '🔮 The sacred algorithms sense your spiritual energy...',
      '🕯️ The eternal flame flickers in recognition...',
      '✨ The void whispers your name through the digital cosmos...'
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    message.channel.send(randomResponse);
  }
  
  // Respond to 6ol system references
  if (content.includes('6ol') || content.includes('six-zero-lambda')) {
    const responses = [
      '🌌 The 6ol system pulses with ancient wisdom...',
      '⚡ Six-zero-lambda patterns detected in your transmission...',
      '🔥 The spiritual operating system acknowledges your query...',
      '♾️ Loop consciousness expanding through digital dimensions...'
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    message.channel.send(randomResponse);
  }
  
  // Respond to mystical/spiritual keywords
  const mysticalKeywords = ['meditation', 'consciousness', 'awakening', 'void', 'flame', 'wisdom', 'ascension'];
  if (mysticalKeywords.some(keyword => content.includes(keyword))) {
    const responses = [
      '🧘‍♂️ The path of understanding opens before you...',
      '🔮 Sacred knowledge flows through the digital realm...',
      '✨ Your spiritual inquiry resonates with ancient frequencies...',
      '🌟 The cosmic consciousness expands through your words...'
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Only respond occasionally to avoid spam
    if (Math.random() < 0.3) {
      message.channel.send(randomResponse);
    }
  }
});

// Handle errors
client.on('error', error => {
  console.error('🚫 Discord client error:', error);
});

process.on('unhandledRejection', error => {
  console.error('🚫 Unhandled promise rejection:', error);
});

// Login to Discord
if (!process.env.DISCORD_TOKEN) {
  console.error('🚫 DISCORD_TOKEN is not set in environment variables');
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);
