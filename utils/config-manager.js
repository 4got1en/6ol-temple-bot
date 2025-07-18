// utils/config-manager.js - Configuration file management
const fs = require('fs').promises;
const path = require('path');

class ConfigManager {
  constructor() {
    this.configPath = path.join(__dirname, '..', 'server-config.json');
  }

  async loadConfig() {
    try {
      const configData = await fs.readFile(this.configPath, 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error('Configuration file not found. Please create a server-config.json file.');
      }
      throw new Error(`Failed to load configuration: ${error.message}`);
    }
  }

  async saveConfig(config) {
    try {
      const configData = JSON.stringify(config, null, 2);
      await fs.writeFile(this.configPath, configData, 'utf8');
      return true;
    } catch (error) {
      throw new Error(`Failed to save configuration: ${error.message}`);
    }
  }

  validateConfig(config) {
    const errors = [];

    if (!config.serverSetup) {
      errors.push('Missing serverSetup section');
      return errors;
    }

    const { categories, roles } = config.serverSetup;

    if (!Array.isArray(categories)) {
      errors.push('Categories must be an array');
    } else {
      categories.forEach((category, index) => {
        if (!category.name) {
          errors.push(`Category ${index} missing name`);
        }
        if (!Array.isArray(category.channels)) {
          errors.push(`Category "${category.name}" missing channels array`);
        } else {
          category.channels.forEach((channel, channelIndex) => {
            if (!channel.name) {
              errors.push(`Channel ${channelIndex} in category "${category.name}" missing name`);
            }
            if (!channel.type || !['text', 'voice'].includes(channel.type)) {
              errors.push(`Channel "${channel.name}" must have type "text" or "voice"`);
            }
          });
        }
      });
    }

    if (roles && !Array.isArray(roles)) {
      errors.push('Roles must be an array');
    }

    return errors;
  }

  async createDefaultConfig() {
    const defaultConfig = {
      serverSetup: {
        categories: [
          {
            name: "🛕 Temple Grounds",
            channels: [
              {
                name: "temple-entrance",
                type: "text",
                description: "Welcome to the Temple"
              }
            ]
          }
        ],
        roles: [
          {
            name: "Pilgrim",
            color: "#DDA0DD",
            permissions: [],
            hoist: false
          }
        ]
      }
    };

    await this.saveConfig(defaultConfig);
    return defaultConfig;
  }
}

module.exports = ConfigManager;