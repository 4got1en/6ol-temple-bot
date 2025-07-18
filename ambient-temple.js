// ambient-temple.js - Entry point for the 6ol Temple Bot
const { Client, GatewayIntentBits, SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
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

// Load server configuration
function loadServerConfig() {
  try {
    const configPath = path.join(__dirname, 'server-config.json');
    const configData = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.error('Error loading server-config.json:', error.message);
    return null;
  }
}

// Setup server function
async function setupServer(guild, config) {
  try {
    // Create roles first
    console.log('🔮 Creating roles...');
    const createdRoles = {};
    for (const roleName of config.roles) {
      try {
        const role = await guild.roles.create({
          name: roleName,
          mentionable: true
        });
        createdRoles[roleName] = role;
        console.log(`✅ Created role: ${roleName}`);
      } catch (error) {
        console.error(`❌ Failed to create role ${roleName}:`, error.message);
      }
    }

    // Create categories and channels
    console.log('🏛️ Creating categories and channels...');
    for (const categoryData of config.categories) {
      try {
        // Create category
        const category = await guild.channels.create({
          name: categoryData.name,
          type: ChannelType.GuildCategory
        });
        console.log(`✅ Created category: ${categoryData.name}`);

        // Create channels in this category
        for (const channelData of categoryData.channels) {
          try {
            let channelName, isHidden;
            
            if (typeof channelData === 'string') {
              channelName = channelData;
              isHidden = false;
            } else {
              channelName = channelData.name;
              isHidden = channelData.hidden || false;
            }

            const channelOptions = {
              name: channelName,
              type: ChannelType.GuildText,
              parent: category.id
            };

            // If channel is hidden, set permissions
            if (isHidden) {
              channelOptions.permissionOverwrites = [
                {
                  id: guild.id, // @everyone role
                  deny: [PermissionFlagsBits.ViewChannel]
                }
              ];
            }

            const channel = await guild.channels.create(channelOptions);
            console.log(`✅ Created channel: ${channelName}${isHidden ? ' (hidden)' : ''}`);
          } catch (error) {
            console.error(`❌ Failed to create channel ${channelName}:`, error.message);
          }
        }
      } catch (error) {
        console.error(`❌ Failed to create category ${categoryData.name}:`, error.message);
      }
    }

    return { success: true, rolesCreated: Object.keys(createdRoles).length, categoriesCreated: config.categories.length };
  } catch (error) {
    console.error('❌ Error setting up server:', error.message);
    return { success: false, error: error.message };
  }
}

client.once('ready', async () => {
  console.log(`🕯️ The Temple awakens. Logged in as ${client.user.tag}`);
  
  // Register slash commands
  const commands = [
    new SlashCommandBuilder()
      .setName('setup-server')
      .setDescription('Setup the server with predefined categories, channels, and roles')
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  ];

  try {
    await client.application.commands.set(commands);
    console.log('🔧 Slash commands registered successfully');
  } catch (error) {
    console.error('❌ Failed to register slash commands:', error);
  }
});

// Handle slash command interactions
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'setup-server') {
    // Check if user has administrator permissions
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: '❌ You need Administrator permissions to use this command.',
        ephemeral: true
      });
    }

    await interaction.deferReply();

    // Load server configuration
    const config = loadServerConfig();
    if (!config) {
      return interaction.editReply({
        content: '❌ Failed to load server configuration. Please check server-config.json file.'
      });
    }

    // Setup the server
    const result = await setupServer(interaction.guild, config);
    
    if (result.success) {
      await interaction.editReply({
        content: `🛕 **The Temple has been erected!**\n\n✅ Successfully created:\n- ${result.rolesCreated} roles\n- ${result.categoriesCreated} categories with their channels\n\nThe server setup is complete. Welcome to the Temple! 🕯️`
      });
    } else {
      await interaction.editReply({
        content: `❌ **Server setup failed:**\n${result.error}\n\nPlease check the bot's permissions and try again.`
      });
    }
  }
});

client.on('messageCreate', message => {
  if (message.author.bot) return;
  if (message.content.toLowerCase().includes('temple')) {
    message.channel.send('🛕 The Temple hears you...');
  }
});

client.login(process.env.DISCORD_TOKEN);
