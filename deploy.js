#!/usr/bin/env node
// deploy.js - 6ol Temple Bot deployment helper

const fs = require('fs');
const path = require('path');

console.log('🔮 6ol Temple Bot Deployment Helper\n');

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('📋 Creating .env file from template...');
  fs.copyFileSync('.env.example', '.env');
  console.log('✅ .env file created! Please edit it with your tokens.\n');
  
  console.log('🔑 Required Environment Variables:');
  console.log('   DISCORD_TOKEN=your_discord_bot_token');
  console.log('   GITHUB_TOKEN=your_github_personal_access_token');
  console.log('   DATA_VAULT_OWNER=4got1en');
  console.log('   DATA_VAULT_REPO=6ol-data-vault\n');
} else {
  console.log('✅ .env file already exists\n');
}

// Check Discord.js installation
try {
  require('discord.js');
  console.log('✅ Discord.js is installed');
} catch (error) {
  console.log('❌ Discord.js not found. Run: npm install');
  process.exit(1);
}

// Check axios installation
try {
  require('axios');
  console.log('✅ Axios is installed');
} catch (error) {
  console.log('❌ Axios not found. Run: npm install');
  process.exit(1);
}

// Check command files
const commandFiles = [
  'commands/whisper.js',
  'commands/reflect.js', 
  'commands/ascend.js',
  'commands/decode.js',
  'commands/link-scrolls.js',
  'commands/glyph.js'
];

console.log('\n🎭 Checking Sacred Commands:');
commandFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

// Check utility files
const utilFiles = [
  'utils/encoders.js',
  'utils/github.js',
  'utils/roles.js',
  'utils/geometry.js'
];

console.log('\n🔧 Checking Sacred Utilities:');
utilFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

// Check main entry point
console.log('\n🏛️ Checking Temple Entry Point:');
if (fs.existsSync('index.js')) {
  console.log('✅ index.js');
} else {
  console.log('❌ index.js - MISSING');
}

console.log('\n🛡️ Discord Server Setup Instructions:');
console.log('1. Create these roles in your Discord server:');
console.log('   • Seeker (Level 1 - Basic commands)');
console.log('   • Devoted (Level 2 - Enhanced features)');
console.log('   • Descender (Level 3 - Advanced operations)');
console.log('   • Ascendant (Level 4 - Full access)');
console.log('\n2. Invite the bot with these permissions:');
console.log('   • Send Messages');
console.log('   • Use Slash Commands');
console.log('   • Embed Links');
console.log('   • Read Message History');

console.log('\n🌌 Data Vault Setup (Optional):');
console.log('1. Create a GitHub repository named "6ol-data-vault"');
console.log('2. Create the following directory structure:');
console.log('   archives/loop1-data/');
console.log('   archives/loop2-data/');
console.log('   archives/loop3-data/');
console.log('   mirrors/');
console.log('   keys/');
console.log('   assets/glyphs/');
console.log('3. Add your GitHub personal access token to .env');

console.log('\n🚀 Deployment Options:');
console.log('• Local Development: npm run dev');
console.log('• Production: npm start');
console.log('• Render.com: Connect repository and deploy');

console.log('\n✨ The Temple awaits your spiritual journey through the 6ol system!');

// Run validation test if available
if (fs.existsSync('test_implementation.js')) {
  console.log('\n🧪 Running validation tests...');
  require('./test_implementation.js');
}