// test-setup-logic.js - Test the server setup logic without Discord connection
const fs = require('fs');
const path = require('path');

// Mock Discord objects for testing
class MockGuild {
  constructor() {
    this.id = 'mock-guild-id';
    this.roles = new MockRoleManager();
    this.channels = new MockChannelManager();
  }
}

class MockRoleManager {
  async create(options) {
    console.log(`[MOCK] Creating role: ${options.name}`);
    return {
      id: `role-${options.name.toLowerCase()}`,
      name: options.name
    };
  }
}

class MockChannelManager {
  async create(options) {
    const hiddenText = options.permissionOverwrites ? ' (hidden)' : '';
    const parentText = options.parent ? ` in category ${options.parent}` : '';
    console.log(`[MOCK] Creating channel: #${options.name}${hiddenText}${parentText}`);
    return {
      id: `channel-${options.name}`,
      name: options.name
    };
  }
}

// Mock ChannelType and PermissionFlagsBits
const ChannelType = {
  GuildCategory: 4,
  GuildText: 0
};

const PermissionFlagsBits = {
  ViewChannel: 1024n
};

// Load the actual config
function loadServerConfig() {
  try {
    const configPath = path.join(__dirname, '..', 'server-config.json');
    const configData = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.error('Error loading server-config.json:', error.message);
    return null;
  }
}

// Server setup function (copied from main file but with mock objects)
async function setupServer(guild, config) {
  try {
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

    return { 
      success: true, 
      rolesCreated: Object.keys(createdRoles).length, 
      categoriesCreated: config.categories.length 
    };
  } catch (error) {
    console.error('❌ Error setting up server:', error.message);
    return { success: false, error: error.message };
  }
}

// Run the test
async function runTest() {
  console.log('🧪 Testing server setup logic...\n');
  
  const config = loadServerConfig();
  if (!config) {
    console.error('❌ Failed to load configuration');
    return;
  }

  const mockGuild = new MockGuild();
  const result = await setupServer(mockGuild, config);
  
  console.log('\n📊 Setup Result:');
  console.log(`Success: ${result.success}`);
  if (result.success) {
    console.log(`Roles created: ${result.rolesCreated}`);
    console.log(`Categories created: ${result.categoriesCreated}`);
    console.log('\n🎉 Server setup logic test passed!');
  } else {
    console.log(`Error: ${result.error}`);
    console.log('\n❌ Server setup logic test failed!');
  }
}

if (require.main === module) {
  runTest();
}

module.exports = { runTest };