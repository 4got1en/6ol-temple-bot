// commands/setup-help.js - Help command for setup-server
const { SlashCommandBuilder } = require('discord.js');
const ConfigManager = require('../utils/config-manager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-help')
    .setDescription('Get help with the setup-server command and view available configurations'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const configManager = new ConfigManager();
      const availableConfigs = await configManager.listAvailableConfigs();

      let helpText = `# 🛕 Server Setup Help\n\n`;
      
      helpText += `## Basic Usage\n`;
      helpText += `\`/setup-server\` - Set up server using the default configuration\n`;
      helpText += `\`/setup-server test:true\` - Perform a dry run (shows what would be created)\n`;
      helpText += `\`/setup-server config:academic\` - Use a custom configuration\n`;
      helpText += `\`/setup-server config:academic test:true\` - Dry run with custom config\n\n`;

      helpText += `## Available Configurations\n`;
      if (availableConfigs.length > 0) {
        availableConfigs.forEach(config => {
          helpText += `• **${config.name}** - \`${config.file}\`\n`;
        });
      } else {
        helpText += `No configuration files found. Please create a \`server-config.json\` file.\n`;
      }
      
      helpText += `\n## Features\n`;
      helpText += `✅ **Custom Category/Channel Names** - Define your own server structure\n`;
      helpText += `✅ **Hidden/Locked Channels** - Create private channels for specific roles\n`;
      helpText += `✅ **Role Management** - Automatically create roles with permissions\n`;
      helpText += `✅ **Test Mode** - Preview changes before applying them\n`;
      helpText += `✅ **Multiple Configurations** - Switch between different server setups\n\n`;

      helpText += `## Creating Custom Configurations\n`;
      helpText += `1. Create a new file: \`server-config-{name}.json\`\n`;
      helpText += `2. Copy the structure from \`server-config.json\`\n`;
      helpText += `3. Modify categories, channels, and roles as needed\n`;
      helpText += `4. Use with \`/setup-server config:{name}\`\n\n`;

      helpText += `## Configuration Structure\n`;
      helpText += `\`\`\`json\n`;
      helpText += `{\n`;
      helpText += `  "serverSetup": {\n`;
      helpText += `    "categories": [{\n`;
      helpText += `      "name": "Category Name",\n`;
      helpText += `      "locked": true,\n`;
      helpText += `      "allowedRoles": ["Role1", "Role2"],\n`;
      helpText += `      "channels": [{\n`;
      helpText += `        "name": "channel-name",\n`;
      helpText += `        "type": "text",\n`;
      helpText += `        "description": "Channel description",\n`;
      helpText += `        "hidden": true\n`;
      helpText += `      }]\n`;
      helpText += `    }],\n`;
      helpText += `    "roles": [{\n`;
      helpText += `      "name": "Role Name",\n`;
      helpText += `      "color": "#FF0000",\n`;
      helpText += `      "permissions": ["MANAGE_MESSAGES"],\n`;
      helpText += `      "hoist": true\n`;
      helpText += `    }]\n`;
      helpText += `  }\n`;
      helpText += `}\n`;
      helpText += `\`\`\`\n\n`;

      helpText += `⚠️ **Required Permissions:** You need "Manage Server" permissions to use setup commands.`;

      // Split message if too long
      if (helpText.length > 2000) {
        const chunks = this.splitMessage(helpText, 2000);
        await interaction.editReply({ content: chunks[0] });
        
        for (let i = 1; i < chunks.length; i++) {
          await interaction.followUp({ content: chunks[i] });
        }
      } else {
        await interaction.editReply({ content: helpText });
      }

    } catch (error) {
      console.error('Setup help command error:', error);
      await interaction.editReply({
        content: `❌ Error loading help information: ${error.message}`
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