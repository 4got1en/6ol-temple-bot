// utils/server-setup.js - Core server setup logic
const { ChannelType, PermissionFlagsBits } = require('discord.js');

class ServerSetup {
  constructor(guild) {
    this.guild = guild;
    this.createdRoles = new Map();
    this.createdCategories = new Map();
    this.actions = [];
  }

  async setupServer(config, testMode = false) {
    this.actions = [];
    
    try {
      // Create roles first
      if (config.serverSetup.roles) {
        await this.createRoles(config.serverSetup.roles, testMode);
      }

      // Create categories and channels
      if (config.serverSetup.categories) {
        await this.createCategories(config.serverSetup.categories, testMode);
      }

      return {
        success: true,
        actions: this.actions,
        message: testMode ? 'Dry run completed successfully' : 'Server setup completed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        actions: this.actions
      };
    }
  }

  async createRoles(roles, testMode = false) {
    for (const roleConfig of roles) {
      const action = {
        type: 'role',
        action: 'create',
        name: roleConfig.name,
        config: roleConfig
      };

      if (testMode) {
        action.status = 'planned';
        this.actions.push(action);
        continue;
      }

      try {
        // Check if role already exists
        const existingRole = this.guild.roles.cache.find(role => role.name === roleConfig.name);
        if (existingRole) {
          action.status = 'skipped';
          action.reason = 'Role already exists';
          this.actions.push(action);
          this.createdRoles.set(roleConfig.name, existingRole);
          continue;
        }

        // Create the role
        const roleData = {
          name: roleConfig.name,
          color: roleConfig.color || null,
          hoist: roleConfig.hoist || false,
          mentionable: roleConfig.mentionable || false
        };

        // Convert permission names to flags
        if (roleConfig.permissions && roleConfig.permissions.length > 0) {
          roleData.permissions = this.convertPermissions(roleConfig.permissions);
        }

        const createdRole = await this.guild.roles.create(roleData);
        this.createdRoles.set(roleConfig.name, createdRole);
        
        action.status = 'completed';
        action.roleId = createdRole.id;
        this.actions.push(action);
      } catch (error) {
        action.status = 'failed';
        action.error = error.message;
        this.actions.push(action);
      }
    }
  }

  async createCategories(categories, testMode = false) {
    for (const categoryConfig of categories) {
      const categoryAction = {
        type: 'category',
        action: 'create',
        name: categoryConfig.name,
        config: categoryConfig
      };

      if (testMode) {
        categoryAction.status = 'planned';
        this.actions.push(categoryAction);
        
        // Plan channel creation
        for (const channelConfig of categoryConfig.channels || []) {
          const channelAction = {
            type: 'channel',
            action: 'create',
            name: channelConfig.name,
            parentCategory: categoryConfig.name,
            config: channelConfig,
            status: 'planned'
          };
          this.actions.push(channelAction);
        }
        continue;
      }

      try {
        // Check if category already exists
        const existingCategory = this.guild.channels.cache.find(
          channel => channel.type === ChannelType.GuildCategory && channel.name === categoryConfig.name
        );

        let category;
        if (existingCategory) {
          categoryAction.status = 'skipped';
          categoryAction.reason = 'Category already exists';
          category = existingCategory;
        } else {
          // Create category with permissions
          const categoryData = {
            name: categoryConfig.name,
            type: ChannelType.GuildCategory
          };

          // Set permissions for locked categories
          if (categoryConfig.locked && categoryConfig.allowedRoles) {
            categoryData.permissionOverwrites = await this.buildPermissionOverwrites(
              categoryConfig.allowedRoles, 
              true
            );
          }

          category = await this.guild.channels.create(categoryData);
          categoryAction.status = 'completed';
          categoryAction.categoryId = category.id;
        }

        this.createdCategories.set(categoryConfig.name, category);
        this.actions.push(categoryAction);

        // Create channels in this category
        if (categoryConfig.channels && categoryConfig.channels.length > 0) {
          await this.createChannels(categoryConfig.channels, category, categoryConfig);
        }

      } catch (error) {
        categoryAction.status = 'failed';
        categoryAction.error = error.message;
        this.actions.push(categoryAction);
      }
    }
  }

  async createChannels(channels, parentCategory, categoryConfig) {
    for (const channelConfig of channels) {
      const channelAction = {
        type: 'channel',
        action: 'create',
        name: channelConfig.name,
        parentCategory: parentCategory.name,
        config: channelConfig
      };

      try {
        // Check if channel already exists
        const existingChannel = parentCategory.children?.cache.find(
          channel => channel.name === channelConfig.name
        );

        if (existingChannel) {
          channelAction.status = 'skipped';
          channelAction.reason = 'Channel already exists';
          this.actions.push(channelAction);
          continue;
        }

        // Determine channel type
        const channelType = channelConfig.type === 'voice' 
          ? ChannelType.GuildVoice 
          : ChannelType.GuildText;

        const channelData = {
          name: channelConfig.name,
          type: channelType,
          parent: parentCategory.id,
          topic: channelConfig.description || null
        };

        // Set permissions for hidden channels or locked categories
        const isHidden = channelConfig.hidden;
        const isInLockedCategory = categoryConfig.locked;
        
        if (isHidden || isInLockedCategory) {
          const allowedRoles = channelConfig.allowedRoles || categoryConfig.allowedRoles || [];
          channelData.permissionOverwrites = await this.buildPermissionOverwrites(
            allowedRoles,
            isHidden
          );
        }

        const createdChannel = await this.guild.channels.create(channelData);
        
        channelAction.status = 'completed';
        channelAction.channelId = createdChannel.id;
        this.actions.push(channelAction);

      } catch (error) {
        channelAction.status = 'failed';
        channelAction.error = error.message;
        this.actions.push(channelAction);
      }
    }
  }

  async buildPermissionOverwrites(allowedRoleNames, isHidden = false) {
    const overwrites = [];

    // Deny @everyone access
    overwrites.push({
      id: this.guild.roles.everyone.id,
      deny: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.Connect
      ]
    });

    // Allow specific roles
    for (const roleName of allowedRoleNames) {
      let role = this.createdRoles.get(roleName);
      if (!role) {
        // Try to find existing role
        role = this.guild.roles.cache.find(r => r.name === roleName);
      }

      if (role) {
        overwrites.push({
          id: role.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.Connect,
            PermissionFlagsBits.ReadMessageHistory
          ]
        });
      }
    }

    return overwrites;
  }

  convertPermissions(permissionNames) {
    const permissionMap = {
      'MANAGE_CHANNELS': PermissionFlagsBits.ManageChannels,
      'MANAGE_MESSAGES': PermissionFlagsBits.ManageMessages,
      'MANAGE_ROLES': PermissionFlagsBits.ManageRoles,
      'KICK_MEMBERS': PermissionFlagsBits.KickMembers,
      'BAN_MEMBERS': PermissionFlagsBits.BanMembers,
      'ADMINISTRATOR': PermissionFlagsBits.Administrator,
      'VIEW_CHANNEL': PermissionFlagsBits.ViewChannel,
      'SEND_MESSAGES': PermissionFlagsBits.SendMessages
    };

    let permissions = 0n;
    for (const permissionName of permissionNames) {
      if (permissionMap[permissionName]) {
        permissions |= permissionMap[permissionName];
      }
    }

    return permissions;
  }

  formatActionsReport() {
    let report = '## Server Setup Report\n\n';
    
    const actionsByType = {
      role: this.actions.filter(a => a.type === 'role'),
      category: this.actions.filter(a => a.type === 'category'),
      channel: this.actions.filter(a => a.type === 'channel')
    };

    for (const [type, actions] of Object.entries(actionsByType)) {
      if (actions.length === 0) continue;
      
      report += `### ${type.charAt(0).toUpperCase() + type.slice(1)}s\n`;
      
      for (const action of actions) {
        const emoji = this.getStatusEmoji(action.status);
        report += `${emoji} **${action.name}** - ${action.status}`;
        
        if (action.reason) {
          report += ` (${action.reason})`;
        }
        if (action.error) {
          report += ` - Error: ${action.error}`;
        }
        report += '\n';
      }
      report += '\n';
    }

    return report;
  }

  getStatusEmoji(status) {
    const emojiMap = {
      'planned': '📋',
      'completed': '✅',
      'skipped': '⏭️',
      'failed': '❌'
    };
    return emojiMap[status] || '❓';
  }
}

module.exports = ServerSetup;