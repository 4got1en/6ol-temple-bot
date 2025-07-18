// utils/config-manager.js - Configuration file management
const fs = require('fs').promises;
const path = require('path');

class ConfigManager {
  constructor() {
    this.configPath = path.join(__dirname, '..', 'server-config.json');
  }

  async loadConfig(configName = null) {
    try {
      let configPath;
      
      if (configName) {
        // Custom configuration file
        const customConfigPath = path.join(__dirname, '..', `server-config-${configName}.json`);
        if (await this.fileExists(customConfigPath)) {
          configPath = customConfigPath;
        } else {
          throw new Error(`Custom configuration "${configName}" not found. Expected file: server-config-${configName}.json`);
        }
      } else {
        // Default configuration
        configPath = this.configPath;
      }
      
      const configData = await fs.readFile(configPath, 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      if (error.code === 'ENOENT' && !configName) {
        throw new Error('Configuration file not found. Please create a server-config.json file.');
      }
      throw new Error(`Failed to load configuration: ${error.message}`);
    }
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async listAvailableConfigs() {
    try {
      const baseDir = path.dirname(this.configPath);
      const files = await fs.readdir(baseDir);
      
      const configs = [];
      
      // Add default config if it exists
      if (files.includes('server-config.json')) {
        configs.push({ name: 'default', file: 'server-config.json' });
      }
      
      // Add custom configs
      for (const file of files) {
        const match = file.match(/^server-config-(.+)\.json$/);
        if (match) {
          configs.push({ name: match[1], file: file });
        }
      }
      
      return configs;
    } catch (error) {
      throw new Error(`Failed to list configurations: ${error.message}`);
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

  async createExampleConfig(configName) {
    const examples = {
      'gaming': {
        serverSetup: {
          categories: [
            {
              name: "🎮 Gaming Hub",
              channels: [
                {
                  name: "general-gaming",
                  type: "text",
                  description: "General gaming discussions"
                },
                {
                  name: "game-night",
                  type: "voice",
                  description: "Voice channel for gaming sessions"
                }
              ]
            },
            {
              name: "🏆 Competitive",
              channels: [
                {
                  name: "ranked-matches",
                  type: "text",
                  description: "Organize ranked gameplay"
                },
                {
                  name: "team-strategy",
                  type: "voice",
                  description: "Strategy discussions"
                }
              ]
            }
          ],
          roles: [
            {
              name: "Pro Gamer",
              color: "#FFD700",
              permissions: [],
              hoist: true
            },
            {
              name: "Casual Player",
              color: "#87CEEB",
              permissions: [],
              hoist: false
            }
          ]
        }
      },
      'community': {
        serverSetup: {
          categories: [
            {
              name: "📢 Announcements",
              channels: [
                {
                  name: "server-news",
                  type: "text",
                  description: "Important server announcements"
                }
              ]
            },
            {
              name: "💬 General",
              channels: [
                {
                  name: "general-chat",
                  type: "text",
                  description: "General discussions"
                },
                {
                  name: "introductions",
                  type: "text",
                  description: "Introduce yourself"
                },
                {
                  name: "voice-lounge",
                  type: "voice",
                  description: "Casual voice chat"
                }
              ]
            },
            {
              name: "🔒 Staff",
              locked: true,
              allowedRoles: ["Staff", "Moderator"],
              channels: [
                {
                  name: "staff-chat",
                  type: "text",
                  description: "Staff discussions",
                  hidden: true
                }
              ]
            }
          ],
          roles: [
            {
              name: "Staff",
              color: "#FF0000",
              permissions: ["MANAGE_MESSAGES", "KICK_MEMBERS"],
              hoist: true
            },
            {
              name: "Moderator",
              color: "#FFA500",
              permissions: ["MANAGE_MESSAGES"],
              hoist: true
            },
            {
              name: "Member",
              color: "#00FF00",
              permissions: [],
              hoist: false
            }
          ]
        }
      }
    };

    if (!examples[configName]) {
      throw new Error(`Unknown example configuration "${configName}". Available: ${Object.keys(examples).join(', ')}`);
    }

    const configPath = path.join(__dirname, '..', `server-config-${configName}.json`);
    const configData = JSON.stringify(examples[configName], null, 2);
    await fs.writeFile(configPath, configData, 'utf8');
    
    return examples[configName];
  }
}

module.exports = ConfigManager;