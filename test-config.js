// test-config.js - Test script to verify server-config.json loading
const fs = require('fs');
const path = require('path');

function testConfigLoading() {
  console.log('🧪 Testing server-config.json loading...');
  
  try {
    // Test config file exists
    const configPath = path.join(__dirname, 'server-config.json');
    if (!fs.existsSync(configPath)) {
      throw new Error('server-config.json file not found');
    }
    console.log('✅ Configuration file exists');

    // Test JSON parsing
    const configData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configData);
    console.log('✅ JSON parsing successful');

    // Test required structure
    if (!config.categories || !Array.isArray(config.categories)) {
      throw new Error('Missing or invalid categories array');
    }
    console.log('✅ Categories structure valid');

    if (!config.roles || !Array.isArray(config.roles)) {
      throw new Error('Missing or invalid roles array');
    }
    console.log('✅ Roles structure valid');

    // Test categories structure
    config.categories.forEach((category, index) => {
      if (!category.name || !category.channels) {
        throw new Error(`Category ${index} missing name or channels`);
      }
      
      category.channels.forEach((channel, channelIndex) => {
        if (typeof channel === 'string') {
          // Simple channel name
          console.log(`  📁 ${category.name} > #${channel}`);
        } else if (typeof channel === 'object' && channel.name) {
          // Channel object with name and hidden properties
          const hiddenText = channel.hidden ? ' (hidden)' : '';
          console.log(`  📁 ${category.name} > #${channel.name}${hiddenText}`);
        } else {
          throw new Error(`Invalid channel structure in category ${category.name}, channel ${channelIndex}`);
        }
      });
    });
    console.log('✅ All channels structure valid');

    // Test roles
    config.roles.forEach((role, index) => {
      if (typeof role !== 'string' || role.trim() === '') {
        throw new Error(`Invalid role at index ${index}: must be non-empty string`);
      }
      console.log(`  🎭 Role: ${role}`);
    });
    console.log('✅ All roles structure valid');

    console.log(`\n🎉 Configuration test passed!`);
    console.log(`📊 Summary:`);
    console.log(`   - ${config.categories.length} categories`);
    console.log(`   - ${config.categories.reduce((total, cat) => total + cat.channels.length, 0)} total channels`);
    console.log(`   - ${config.roles.length} roles`);
    
    return { success: true, config };
    
  } catch (error) {
    console.error('❌ Configuration test failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Run the test
if (require.main === module) {
  testConfigLoading();
}

module.exports = { testConfigLoading };