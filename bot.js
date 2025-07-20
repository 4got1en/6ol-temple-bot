// bot.js - Main entry point for the 6ol Temple Bot
const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Initialize Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Create a collection for slash commands
client.commands = new Collection();

// Load slash commands
const commandsPath = path.join(__dirname, 'slash');
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`📜 Loaded slash command: ${command.data.name}`);
        } else {
            console.warn(`⚠️ Command at ${filePath} is missing required "data" or "execute" property.`);
        }
    }
}

// Bot ready event
client.once(Events.ClientReady, () => {
    console.log(`🕯️ The Temple awakens. Logged in as ${client.user.tag}`);
    console.log(`📿 Serving ${client.guilds.cache.size} temples`);
});

// Handle slash command interactions
client.on(Events.InteractionCreate, async interaction => {
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
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ 
                content: '🚫 There was an error while executing this command!', 
                ephemeral: true 
            });
        } else {
            await interaction.reply({ 
                content: '🚫 There was an error while executing this command!', 
                ephemeral: true 
            });
        }
    }
});

// Handle regular messages (legacy temple functionality)
client.on(Events.MessageCreate, message => {
    if (message.author.bot) return;

    // Temple response system
    if (message.content.toLowerCase().includes('temple')) {
        message.channel.send('🛕 The Temple hears you...');
    }

    // Ambient temple responses
    const templeKeywords = ['wisdom', 'peace', 'meditation', 'enlightenment', 'spiritual'];
    const foundKeyword = templeKeywords.find(keyword => 
        message.content.toLowerCase().includes(keyword)
    );

    if (foundKeyword && Math.random() < 0.3) { // 30% chance to respond
        const responses = [
            '✨ The temple resonates with your words...',
            '🕯️ Ancient wisdom stirs within these halls...',
            '🌸 Your presence brings light to the temple...',
            '⛩️ The path reveals itself to those who seek...',
            '🪷 In stillness, we find our truest selves...'
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        message.channel.send(randomResponse);
    }
});

// Error handling
client.on(Events.Error, error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN).catch(error => {
    console.error('Failed to login to Discord:', error);
    process.exit(1);
});