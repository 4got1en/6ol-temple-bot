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
    console.error('Error loading server config:', error);
    return null;
  }
}

client.once('ready', async () => {
  console.log(`🕯️ The Temple awakens. Logged in as ${client.user.tag}`);
  
  // Register slash commands
  const setupCommand = new SlashCommandBuilder()
    .setName('setup-server')
    .setDescription('Setup the server with predefined categories, channels, and roles')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

  try {
    await client.application.commands.create(setupCommand);
    console.log('🛠️ Slash commands registered successfully');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'setup-server') {
    await handleSetupServer(interaction);
  }
});

async function handleSetupServer(interaction) {
  await interaction.deferReply({ ephemeral: true });

  try {
    const config = loadServerConfig();
    if (!config) {
      await interaction.editReply('❌ Failed to load server configuration. Please check server-config.json file.');
      return;
    }

    const guild = interaction.guild;
    let results = [];

    // Create roles
    if (config.roles && config.roles.length > 0) {
      results.push('**Creating Roles:**');
      for (const roleName of config.roles) {
        try {
          const existingRole = guild.roles.cache.find(role => role.name === roleName);
          if (!existingRole) {
            await guild.roles.create({ name: roleName });
            results.push(`✅ Created role: ${roleName}`);
          } else {
            results.push(`⚠️ Role already exists: ${roleName}`);
          }
        } catch (error) {
          results.push(`❌ Failed to create role ${roleName}: ${error.message}`);
        }
      }
    }

    // Create categories and channels
    if (config.categories && config.categories.length > 0) {
      results.push('\n**Creating Categories and Channels:**');
      for (const categoryConfig of config.categories) {
        try {
          // Check if category already exists
          let category = guild.channels.cache.find(
            channel => channel.type === ChannelType.GuildCategory && channel.name === categoryConfig.name
          );

          if (!category) {
            category = await guild.channels.create({
              name: categoryConfig.name,
              type: ChannelType.GuildCategory
            });
            results.push(`✅ Created category: ${categoryConfig.name}`);
          } else {
            results.push(`⚠️ Category already exists: ${categoryConfig.name}`);
          }

          // Create channels in the category
          if (categoryConfig.channels && categoryConfig.channels.length > 0) {
            for (const channelConfig of categoryConfig.channels) {
              let channelName, isHidden = false;
              
              if (typeof channelConfig === 'string') {
                channelName = channelConfig;
              } else {
                channelName = channelConfig.name;
                isHidden = channelConfig.hidden || false;
              }

              try {
                const existingChannel = guild.channels.cache.find(
                  channel => channel.name === channelName && channel.parentId === category.id
                );

                if (!existingChannel) {
                  const channelOptions = {
                    name: channelName,
                    type: ChannelType.GuildText,
                    parent: category
                  };

                  // If channel is hidden, set permissions to hide from @everyone
                  if (isHidden) {
                    channelOptions.permissionOverwrites = [
                      {
                        id: guild.roles.everyone.id,
                        deny: [PermissionFlagsBits.ViewChannel]
                      }
                    ];
                  }

                  await guild.channels.create(channelOptions);
                  results.push(`✅ Created channel: #${channelName}${isHidden ? ' (hidden)' : ''}`);
                } else {
                  results.push(`⚠️ Channel already exists: #${channelName}`);
                }
              } catch (error) {
                results.push(`❌ Failed to create channel ${channelName}: ${error.message}`);
              }
            }
          }
        } catch (error) {
          results.push(`❌ Failed to create category ${categoryConfig.name}: ${error.message}`);
        }
      }
    }

    const response = results.join('\n');
    if (response.length > 2000) {
      // Split into multiple messages if too long
      const chunks = response.match(/.{1,1900}/g);
      await interaction.editReply(chunks[0]);
      for (let i = 1; i < chunks.length; i++) {
        await interaction.followUp({ content: chunks[i], ephemeral: true });
      }
    } else {
      await interaction.editReply(response);
    }

  } catch (error) {
    console.error('Error in setup-server command:', error);
    await interaction.editReply('❌ An error occurred while setting up the server. Please check the bot\'s permissions and try again.');
  }
}

client.on('messageCreate', message => {
  if (message.author.bot) return;
  if (message.content.toLowerCase().includes('temple')) {
    message.channel.send('🛕 The Temple hears you...');
  }
});

client.login(process.env.DISCORD_TOKEN);
