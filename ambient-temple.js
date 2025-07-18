// ambient-temple.js - Entry point for the 6ol Temple Bot
const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
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

// Command collection
client.commands = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      console.log(`🔮 Loaded command: ${command.data.name}`);
    } else {
      console.log(`⚠️ Warning: Command at ${filePath} is missing required "data" or "execute" property.`);
    }
  }
}

client.once('ready', async () => {
  console.log(`🕯️ The Temple awakens. Logged in as ${client.user.tag}`);
  
  // Register slash commands
  try {
    console.log('🔄 Registering slash commands...');
    
    const commands = [];
    client.commands.forEach(command => {
      commands.push(command.data.toJSON());
    });

    const rest = new REST().setToken(process.env.DISCORD_TOKEN);
    
    // Register commands globally (can take up to 1 hour to propagate)
    // For testing, you might want to register guild-specific commands instead
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    
    console.log(`✅ Successfully registered ${commands.length} slash commands.`);
  } catch (error) {
    console.error('❌ Error registering slash commands:', error);
  }
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
    await command.execute(interaction);
  } catch (error) {
    console.error('❌ Error executing command:', error);
    
    const errorResponse = {
      content: '❌ There was an error while executing this command!',
      ephemeral: true
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorResponse);
    } else {
      await interaction.reply(errorResponse);
    }
  }
});

// Keep the original message response for backwards compatibility
client.on('messageCreate', message => {
  if (message.author.bot) return;
  if (message.content.toLowerCase().includes('temple')) {
    message.channel.send('🛕 The Temple hears you...');
  }
});

client.login(process.env.DISCORD_TOKEN);
