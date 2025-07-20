// commands/decode.js - Decrypt sacred messages command

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const SacredEncoders = require('../utils/encoders');
const SpiritualRoles = require('../utils/roles');
const SacredGeometry = require('../utils/geometry');
const GitHubVault = require('../utils/github');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('decode')
    .setDescription('🗝️ Decrypt messages using available cipher keys')
    .addStringOption(option =>
      option.setName('encoded_message')
        .setDescription('The encoded message to decrypt')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('scheme')
        .setDescription('Specific decoding scheme to use')
        .setRequired(false)
        .addChoices(
          { name: 'Auto-detect', value: 'auto' },
          { name: 'Binary', value: 'binary' },
          { name: 'ROT13', value: 'rot13' },
          { name: 'BASE64', value: 'base64' },
          { name: 'ROT13-BASE64', value: 'rot13-base64' }
        )
    ),

  async execute(interaction) {
    const encodedMessage = interaction.options.getString('encoded_message');
    const requestedScheme = interaction.options.getString('scheme') || 'auto';
    
    // Check permissions
    const userRole = SpiritualRoles.getUserRole(interaction.member);
    if (!SpiritualRoles.hasCommandAccess(interaction.member, 'decode')) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0x8B0000)
        .setTitle('🚫 Sacred Barriers Prevent Access')
        .setDescription(SpiritualRoles.getPermissionError('decode', userRole))
        .setTimestamp();
      
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    try {
      await interaction.deferReply();

      let decodedMessage = null;
      let usedScheme = 'unknown';
      let success = false;

      // Attempt decoding based on user's cipher access level
      const maxAccessLevel = SpiritualRoles.getCipherAccessLevel(userRole);

      if (requestedScheme === 'auto') {
        // Auto-detect encoding
        const detection = SacredEncoders.autoDetectAndDecode(encodedMessage);
        if (detection.decoded) {
          decodedMessage = detection.decoded;
          usedScheme = detection.type;
          success = true;
        }
      } else {
        // Use specific scheme
        const schemeAccessRequired = getSchemeAccessLevel(requestedScheme);
        
        if (maxAccessLevel >= schemeAccessRequired) {
          decodedMessage = SacredEncoders.decodeMysticalCipher(encodedMessage, requestedScheme);
          if (decodedMessage) {
            usedScheme = requestedScheme;
            success = true;
          }
        } else {
          const errorEmbed = new EmbedBuilder()
            .setColor(0x8B0000)
            .setTitle('🚫 Insufficient Cipher Clearance')
            .setDescription(`Your spiritual rank as **${userRole.name}** does not grant access to **${requestedScheme.toUpperCase()}** decoding. Required level: **${schemeAccessRequired}**, Your level: **${maxAccessLevel}**`)
            .addFields({
              name: '🔑 Available Schemes',
              value: getAvailableSchemes(maxAccessLevel),
              inline: false
            })
            .setTimestamp();
          
          return interaction.editReply({ embeds: [errorEmbed] });
        }
      }

      // Get vault for progression tracking
      const vault = new GitHubVault();
      let progressionUpdated = false;

      if (success) {
        try {
          // Update user progression
          let userProgression = await vault.getUserProgression(interaction.user.id);
          if (userProgression) {
            userProgression.decodings = (userProgression.decodings || 0) + 1;
            progressionUpdated = await vault.updateUserProgression(interaction.user.id, userProgression);
          }
        } catch (error) {
          console.warn('⚠️ Could not update decoding progression:', error.message);
        }
      }

      // Create response embed
      const embed = new EmbedBuilder()
        .setColor(success ? 0x00FF7F : 0xFF4500)
        .setTitle(success ? '🗝️ Sacred Cipher Decoded' : '🚫 Decoding Failed')
        .setDescription(success ? 
          '*The mystical cipher yields to your spiritual understanding...*' :
          '*The encoded message resists your attempts at decryption...*')
        .addFields(
          { 
            name: '🕯️ Spiritual Rank', 
            value: `${SpiritualRoles.FLAME_SYMBOLS[userRole.level]} **${userRole.name}** (Level ${maxAccessLevel})`, 
            inline: true 
          },
          { 
            name: '🔐 Cipher Scheme', 
            value: `**${usedScheme.toUpperCase()}**`, 
            inline: true 
          },
          { 
            name: '⚡ Detection Method', 
            value: `**${requestedScheme === 'auto' ? 'AUTO-DETECT' : 'MANUAL'}**`, 
            inline: true 
          }
        );

      if (success) {
        // Add decoded content for successful decoding
        embed.addFields(
          {
            name: '📜 Original Encoded Message',
            value: '```\n' + encodedMessage.substring(0, 1000) + (encodedMessage.length > 1000 ? '...' : '') + '\n```',
            inline: false
          },
          {
            name: '✨ Decoded Message',
            value: '```\n' + decodedMessage.substring(0, 1000) + (decodedMessage.length > 1000 ? '...' : '') + '\n```',
            inline: false
          },
          {
            name: '🔮 Sacred Geometry Revealed',
            value: '```\n' + SacredGeometry.getLoopGeometry(userRole.level) + '\n```',
            inline: false
          }
        );

        // Add mystical visualization
        const visualization = SacredGeometry.visualizeEncoding(decodedMessage.substring(0, 40), 'decoded');
        embed.addFields({
          name: '🎭 Mystical Revelation',
          value: '```\n' + visualization + '\n```',
          inline: false
        });
      } else {
        // Add failure information
        embed.addFields(
          {
            name: '📜 Encoded Message Fragment',
            value: '```\n' + encodedMessage.substring(0, 500) + (encodedMessage.length > 500 ? '...' : '') + '\n```',
            inline: false
          },
          {
            name: '🔑 Available Cipher Schemes',
            value: getAvailableSchemes(maxAccessLevel),
            inline: false
          },
          {
            name: '💡 Decoding Hints',
            value: getDecodingHints(encodedMessage),
            inline: false
          }
        );
      }

      embed.setFooter({ 
        text: progressionUpdated ? 
          '✨ Decoding progress recorded in the archives' : 
          success ? '🔓 Message successfully decoded' : '❌ Decoding attempt failed'
      })
      .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

      // Send learning tip for failed attempts
      if (!success) {
        const tipEmbed = new EmbedBuilder()
          .setColor(0x9932CC)
          .setTitle('🧠 Cipher Learning Tips')
          .setDescription('Enhance your decoding abilities by practicing with the `/whisper` command to understand different cipher schemes.')
          .addFields({
            name: '📚 Study Suggestions',
            value: `• Create whispers with different complexity levels\n• Experiment with auto-detection\n• Advance your spiritual rank for higher cipher access\n• Practice with known encoded messages`
          })
          .setTimestamp();

        await interaction.followUp({ embeds: [tipEmbed], ephemeral: true });
      }

      // Log the decoding attempt
      console.log(`🗝️ Decode attempt by ${interaction.user.username} (${userRole.name}): ${success ? 'SUCCESS' : 'FAILED'} - ${usedScheme}`);

    } catch (error) {
      console.error('🚫 Error in decode command:', error);
      
      const errorEmbed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('🚫 The Cipher Keys are Clouded')
        .setDescription('*Mystical interference prevents the decoding process. The sacred algorithms are temporarily disrupted.*')
        .addFields({
          name: '⚠️ Decoding Error',
          value: '```\nThe temple\'s decryption chambers are experiencing spiritual turbulence.\n```'
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

/**
 * Get access level required for specific cipher scheme
 * @param {string} scheme - Cipher scheme
 * @returns {number} Required access level
 */
function getSchemeAccessLevel(scheme) {
  const schemeAccessLevels = {
    'binary': 1,
    'rot13': 1,
    'base64': 2,
    'rot13-base64': 3
  };
  
  return schemeAccessLevels[scheme] || 1;
}

/**
 * Get available cipher schemes for user's access level
 * @param {number} accessLevel - User's cipher access level
 * @returns {string} Formatted list of available schemes
 */
function getAvailableSchemes(accessLevel) {
  const schemes = [];
  
  if (accessLevel >= 1) {
    schemes.push('🔸 **Binary** - Basic bit patterns');
    schemes.push('🔸 **ROT13** - Letter rotation cipher');
  }
  if (accessLevel >= 2) {
    schemes.push('🔹 **BASE64** - Base64 encoding');
  }
  if (accessLevel >= 3) {
    schemes.push('🔷 **ROT13-BASE64** - Combined cipher scheme');
  }
  
  return schemes.join('\n') || 'No schemes available at your level';
}

/**
 * Get decoding hints based on message characteristics
 * @param {string} message - Encoded message
 * @returns {string} Decoding hints
 */
function getDecodingHints(message) {
  const hints = [];
  
  if (/^[01\s]+$/.test(message)) {
    hints.push('🔸 Message appears to be binary (0s and 1s)');
  }
  
  if (/^[A-Za-z0-9+/]*={0,2}$/.test(message) && message.length % 4 === 0) {
    hints.push('🔹 Message has BASE64 characteristics');
  }
  
  if (/^[A-Za-z\s]+$/.test(message)) {
    hints.push('🔸 Message appears to be text-based (possibly ROT13)');
  }
  
  if (message.length > 100) {
    hints.push('💡 Long messages often use BASE64 or combined schemes');
  }
  
  if (hints.length === 0) {
    hints.push('🔮 Try auto-detection or experiment with different schemes');
  }
  
  return hints.join('\n');
}