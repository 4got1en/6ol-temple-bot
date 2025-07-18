// index.js - Entry point for the 6ol Temple Bot
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Initialize commands collection
client.commands = new Collection();

// Load commands from commands directory
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

client.once('ready', async () => {
  console.log(`🕯️ The Temple awakens. Logged in as ${client.user.tag}`);
  
  // Register slash commands
  const commands = [];
  client.commands.forEach(command => {
    commands.push(command.data.toJSON());
  });

  if (commands.length > 0) {
    const rest = new REST().setToken(process.env.DISCORD_TOKEN);
    
    try {
      console.log(`🔄 Started refreshing ${commands.length} application (/) commands.`);
      
      const data = await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands },
      );
      
      console.log(`✅ Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
      console.error('Error registering commands:', error);
    }
  }
});

// Handle slash command interactions
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error('Error executing command:', error);
    
    const errorMessage = { content: 'There was an error while executing this command!', ephemeral: true };
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

// Keep existing message-based functionality
client.on('messageCreate', message => {
  if (message.author.bot) return;
  if (message.content.toLowerCase().includes('temple')) {
    message.channel.send('🛕 The Temple hears you...');
  }
});

client.login(process.env.DISCORD_TOKEN);