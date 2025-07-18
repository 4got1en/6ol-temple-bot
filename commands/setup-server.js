// commands/setup-server.js - Main setup-server slash command
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ConfigManager = require('../utils/config-manager');
const ServerSetup = require('../utils/server-setup');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-server')
    .setDescription('Set up the server with predefined categories, channels, and roles')
    .addBooleanOption(option =>
      option.setName('test')
        .setDescription('Run in test mode (dry run) - no actual changes will be made')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('config')
        .setDescription('Name of custom configuration to use (optional)')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const testMode = interaction.options.getBoolean('test') || false;
    const configName = interaction.options.getString('config');

    // Check permissions
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return await interaction.reply({
        content: '❌ You need "Manage Server" permissions to use this command.',
        ephemeral: true
      });
    }

    // Defer reply since this might take a while
    await interaction.deferReply();

    try {
      const configManager = new ConfigManager();
      
      // Load configuration
      let config;
      try {
        config = await configManager.loadConfig(configName);
        
        if (configName) {
          await interaction.editReply({
            content: `🔧 Using custom configuration: **${configName}**\n\nLoading configuration...`
          });
        }
      } catch (error) {
        if (configName && error.message.includes('not found')) {
          // Show available configurations
          try {
            const availableConfigs = await configManager.listAvailableConfigs();
            let errorMsg = `❌ Configuration "${configName}" not found.\n\n`;
            
            if (availableConfigs.length > 0) {
              errorMsg += 'Available configurations:\n';
              availableConfigs.forEach(config => {
                errorMsg += `• **${config.name}** (${config.file})\n`;
              });
            } else {
              errorMsg += 'No configuration files found. Please create a `server-config.json` file.';
            }
            
            return await interaction.editReply({ content: errorMsg });
          } catch (listError) {
            return await interaction.editReply({
              content: `❌ Configuration error: ${error.message}`
            });
          }
        }
        
        return await interaction.editReply({
          content: `❌ Configuration error: ${error.message}\n\nPlease ensure you have a valid \`server-config.json\` file.`
        });
      }

      // Validate configuration
      const validationErrors = configManager.validateConfig(config);
      if (validationErrors.length > 0) {
        return await interaction.editReply({
          content: `❌ Configuration validation failed:\n${validationErrors.map(err => `• ${err}`).join('\n')}`
        });
      }

      // Custom configuration handling (if specified)
      if (configName) {
        await interaction.editReply({
          content: `🔧 **Using Custom Configuration: ${configName}**\n\n` + 
                  (testMode ? '🧪 **Test Mode Enabled** - Performing dry run...\n\n' : '🛕 **Setting up server...** This may take a few moments.\n\n') +
                  (testMode ? 'Analyzing configuration and planning changes...' : '⚠️ **Warning:** This will create new roles, categories, and channels. Existing items with the same names will be skipped.')
        });
      } else if (testMode) {
        await interaction.editReply({
          content: '🧪 **Test Mode Enabled** - Performing dry run...\n\nAnalyzing configuration and planning changes...'
        });
      } else {
        await interaction.editReply({
          content: '🛕 **Setting up server...** This may take a few moments.\n\n⚠️ **Warning:** This will create new roles, categories, and channels. Existing items with the same names will be skipped.'
        });
      }

      // Perform server setup
      const serverSetup = new ServerSetup(interaction.guild);
      const result = await serverSetup.setupServer(config, testMode);

      // Format and send results
      const report = serverSetup.formatActionsReport();
      
      let responseContent = '';
      
      if (testMode) {
        responseContent = '🧪 **Dry Run Complete**\n\n';
        responseContent += 'The following actions would be performed:\n\n';
      } else if (result.success) {
        responseContent = '✅ **Server Setup Complete**\n\n';
      } else {
        responseContent = '⚠️ **Server Setup Completed with Issues**\n\n';
      }

      responseContent += report;

      if (!result.success && result.error) {
        responseContent += `\n❌ **Fatal Error:** ${result.error}`;
      }

      // Split long messages if needed
      if (responseContent.length > 2000) {
        const chunks = this.splitMessage(responseContent, 2000);
        await interaction.editReply({ content: chunks[0] });
        
        for (let i = 1; i < chunks.length; i++) {
          await interaction.followUp({ content: chunks[i] });
        }
      } else {
        await interaction.editReply({ content: responseContent });
      }

      // Send additional information for test mode
      if (testMode) {
        await interaction.followUp({
          content: '💡 **Tip:** Run without the `test:true` option to actually perform these changes.',
          ephemeral: true
        });
      }

    } catch (error) {
      console.error('Setup server command error:', error);
      
      const errorMessage = testMode 
        ? `❌ Error during dry run: ${error.message}`
        : `❌ Setup failed: ${error.message}`;
        
      await interaction.editReply({
        content: errorMessage
      });
    }
  },

  splitMessage(text, maxLength) {
    const chunks = [];
    const lines = text.split('\n');
    let currentChunk = '';

    for (const line of lines) {
      if ((currentChunk + line + '\n').length > maxLength) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }
        
        // If a single line is too long, split it
        if (line.length > maxLength) {
          let remainingLine = line;
          while (remainingLine.length > maxLength) {
            chunks.push(remainingLine.substring(0, maxLength));
            remainingLine = remainingLine.substring(maxLength);
          }
          currentChunk = remainingLine + '\n';
        } else {
          currentChunk = line + '\n';
        }
      } else {
        currentChunk += line + '\n';
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }
};