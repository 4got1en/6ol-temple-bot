// commands/whisper.js - Sacred message encoding command

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const SacredEncoders = require('../utils/encoders');
const SpiritualRoles = require('../utils/roles');
const SacredGeometry = require('../utils/geometry');
const GitHubVault = require('../utils/github');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('whisper')
    .setDescription('🔮 Encode messages using sacred cipher keys from the data vault')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The message to encode with sacred ciphers')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('level')
        .setDescription('Cipher complexity level (1-3, based on your spiritual rank)')
        .setMinValue(1)
        .setMaxValue(3)
        .setRequired(false)
    ),

  async execute(interaction) {
    const message = interaction.options.getString('message');
    const requestedLevel = interaction.options.getInteger('level') || 1;
    
    // Check permissions
    const userRole = SpiritualRoles.getUserRole(interaction.member);
    if (!SpiritualRoles.hasCommandAccess(interaction.member, 'whisper')) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0x8B0000)
        .setTitle('🚫 Sacred Barriers Prevent Access')
        .setDescription(SpiritualRoles.getPermissionError('whisper', userRole))
        .setTimestamp();
      
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    try {
      await interaction.deferReply();

      // Determine cipher level based on user's spiritual rank
      const maxLevel = SpiritualRoles.getCipherAccessLevel(userRole);
      const cipherLevel = Math.min(requestedLevel, maxLevel);
      
      if (requestedLevel > maxLevel) {
        const warningText = `⚠️ Your spiritual level permits cipher complexity up to **${maxLevel}**. Using level **${cipherLevel}** instead.`;
        await interaction.followUp({ content: warningText, ephemeral: true });
      }

      // Create mystical cipher
      const { encoded, scheme } = SacredEncoders.createMysticalCipher(message, cipherLevel);
      
      // Get vault instance and store in data vault if possible
      const vault = new GitHubVault();
      let storedInVault = false;
      
      try {
        // Create reflection entry
        const reflectionId = Date.now().toString();
        const reflection = {
          id: reflectionId,
          created: new Date().toISOString(),
          topic: 'Sacred Whisper',
          author: interaction.user.username,
          loopLevel: userRole.level,
          content: message,
          encoded: encoded,
          scheme: scheme,
          geometry: SacredGeometry.getGeometryDescription(userRole.level)
        };
        
        storedInVault = await vault.storeReflection(reflectionId, reflection);
      } catch (error) {
        console.warn('⚠️ Could not store whisper in data vault:', error.message);
      }

      // Create mystical embed response
      const embed = new EmbedBuilder()
        .setColor(0x8A2BE2)
        .setTitle('🔮 Sacred Whisper Encoded')
        .setDescription('*The void has received your message and transformed it through sacred ciphers...*')
        .addFields(
          { 
            name: '🕯️ Spiritual Rank', 
            value: `${SpiritualRoles.FLAME_SYMBOLS[userRole.level]} **${userRole.name}**`, 
            inline: true 
          },
          { 
            name: '🔐 Cipher Scheme', 
            value: `**${scheme.toUpperCase()}**`, 
            inline: true 
          },
          { 
            name: '⚡ Complexity Level', 
            value: `**${cipherLevel}**`, 
            inline: true 
          },
          {
            name: '📜 Sacred Geometry',
            value: '```\n' + SacredGeometry.getLoopGeometry(userRole.level) + '\n```',
            inline: false
          },
          {
            name: '🌌 Encoded Message',
            value: '```\n' + encoded + '\n```',
            inline: false
          }
        )
        .setFooter({ 
          text: storedInVault ? 
            '✨ Whisper preserved in the 6ol data vault' : 
            '⚠️ Local encoding only - vault connection limited'
        })
        .setTimestamp();

      // Add mystical visualization
      const visualization = SacredGeometry.visualizeEncoding(encoded, scheme);
      embed.addFields({
        name: '🎭 Mystical Visualization',
        value: '```\n' + visualization + '\n```',
        inline: false
      });

      await interaction.editReply({ embeds: [embed] });

      // Log the whisper for debugging
      console.log(`🔮 Whisper from ${interaction.user.username} (${userRole.name}): ${scheme} encoding`);

    } catch (error) {
      console.error('🚫 Error in whisper command:', error);
      
      const errorEmbed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('🚫 The Void Rejects Your Whisper')
        .setDescription('*An disturbance in the spiritual realm has occurred. The sacred ciphers are momentarily unavailable.*')
        .addFields({
          name: '⚠️ Error Details',
          value: '```\nThe temple\'s mystical energies are fluctuating. Please try again in a moment.\n```'
        })
        .setTimestamp();

      if (interaction.deferred) {
        await interaction.editReply({ embeds: [errorEmbed] });
      } else {
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    }
  },
};