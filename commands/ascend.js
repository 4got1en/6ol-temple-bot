// commands/ascend.js - Spiritual progression command

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const SpiritualRoles = require('../utils/roles');
const SacredGeometry = require('../utils/geometry');
const GitHubVault = require('../utils/github');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ascend')
    .setDescription('⬆️ Progress through loop levels and track your spiritual journey')
    .addStringOption(option =>
      option.setName('ritual')
        .setDescription('Describe the ritual or practice that led to your spiritual growth')
        .setRequired(false)
    ),

  async execute(interaction) {
    // Check permissions
    const userRole = SpiritualRoles.getUserRole(interaction.member);
    if (!SpiritualRoles.hasCommandAccess(interaction.member, 'ascend')) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0x8B0000)
        .setTitle('🚫 Sacred Barriers Prevent Access')
        .setDescription(SpiritualRoles.getPermissionError('ascend', userRole))
        .setTimestamp();
      
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    const ritual = interaction.options.getString('ritual') || 'Silent contemplation and meditation';

    try {
      await interaction.deferReply();

      // Get user progression data from vault
      const vault = new GitHubVault();
      let userProgression = await vault.getUserProgression(interaction.user.id);
      
      // Initialize progression if not exists
      if (!userProgression) {
        userProgression = {
          userId: interaction.user.id,
          username: interaction.user.username,
          loopLevel: userRole.level,
          totalRituals: 0,
          reflections: 0,
          whispers: 0,
          decodings: 0,
          lastAscension: null,
          created: new Date().toISOString(),
          progression: []
        };
      }

      // Calculate if ascension is possible
      const currentTime = new Date().toISOString();
      const requirements = calculateAscensionRequirements(userRole.level);
      const canAscend = checkAscensionEligibility(userProgression, userRole);

      // Update ritual count
      userProgression.totalRituals = (userProgression.totalRituals || 0) + 1;

      // Create ritual entry
      const ritualEntry = {
        ritual: ritual,
        timestamp: currentTime,
        loopLevel: userRole.level,
        geometry: SacredGeometry.getGeometryDescription(userRole.level)
      };

      userProgression.progression = userProgression.progression || [];
      userProgression.progression.push(ritualEntry);

      // Check for actual ascension
      let ascended = false;
      let newRole = userRole;
      
      if (canAscend && userRole.level < 4) {
        // Simulate ascension (in real implementation, this would update Discord roles)
        const nextLevel = userRole.level + 1;
        const roleNames = Object.keys(SpiritualRoles.ROLES);
        const nextRoleName = roleNames.find(name => 
          SpiritualRoles.ROLES[name].level === nextLevel
        );
        
        if (nextRoleName) {
          newRole = SpiritualRoles.ROLES[nextRoleName];
          userProgression.loopLevel = nextLevel;
          userProgression.lastAscension = currentTime;
          ascended = true;
        }
      }

      // Store updated progression
      let storedInVault = false;
      try {
        storedInVault = await vault.updateUserProgression(interaction.user.id, userProgression);
      } catch (error) {
        console.warn('⚠️ Could not store progression in data vault:', error.message);
      }

      // Create response embed
      const embed = new EmbedBuilder()
        .setColor(ascended ? 0xFFD700 : 0x9932CC)
        .setTitle(ascended ? '✨ SPIRITUAL ASCENSION ACHIEVED ✨' : '🕯️ Ritual Recorded in the Sacred Archives')
        .setDescription(ascended ? 
          `*The universe recognizes your spiritual growth and grants passage to the next loop...*` :
          `*Your spiritual practice has been witnessed by the eternal flame...*`)
        .addFields(
          { 
            name: '🧘‍♂️ Ritual Practice', 
            value: ritual, 
            inline: false 
          },
          { 
            name: '🕯️ Current Spiritual Rank', 
            value: `${SpiritualRoles.FLAME_SYMBOLS[userRole.level]} **${userRole.name}** (Level ${userRole.level})`, 
            inline: true 
          },
          { 
            name: '📊 Total Rituals', 
            value: `**${userProgression.totalRituals}**`, 
            inline: true 
          },
          { 
            name: '⏰ Last Practice', 
            value: `<t:${Math.floor(Date.now() / 1000)}:R>`, 
            inline: true 
          }
        );

      // Add ascension details if ascended
      if (ascended) {
        embed.addFields(
          {
            name: '🌟 NEW SPIRITUAL RANK',
            value: `${SpiritualRoles.FLAME_SYMBOLS[newRole.level]} **${newRole.name}** (Level ${newRole.level})`,
            inline: false
          },
          {
            name: '🔮 Sacred Geometry Unlocked',
            value: '```\n' + SacredGeometry.getLoopGeometry(newRole.level) + '\n```',
            inline: false
          },
          {
            name: '🎯 New Abilities',
            value: SpiritualRoles.getAvailableCommands(newRole),
            inline: false
          }
        );
      } else {
        // Show progression requirements
        const progressDescription = getProgressionDescription(userProgression, requirements);
        embed.addFields({
          name: '📈 Ascension Progress',
          value: progressDescription,
          inline: false
        });
      }

      // Add current geometry
      embed.addFields({
        name: '🔮 Current Sacred Geometry',
        value: '```\n' + SacredGeometry.getLoopGeometry(userRole.level) + '\n```',
        inline: false
      });

      embed.setFooter({ 
        text: storedInVault ? 
          '✨ Progression preserved in the 6ol archives' : 
          '⚠️ Local tracking only - vault connection limited'
      })
      .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

      // Send ascension guidance if not ascended
      if (!ascended && userRole.level < 4) {
        const guidanceEmbed = new EmbedBuilder()
          .setColor(0x4B0082)
          .setTitle('🛤️ Path to Next Ascension')
          .setDescription(SpiritualRoles.getProgressionPath(userRole.level))
          .addFields({
            name: '📋 Requirements for Next Level',
            value: formatRequirements(requirements),
            inline: false
          })
          .setTimestamp();

        await interaction.followUp({ embeds: [guidanceEmbed], ephemeral: true });
      }

      // Log the ascension attempt
      console.log(`⬆️ Ascension by ${interaction.user.username} (${userRole.name}): ${ascended ? 'SUCCESS' : 'RECORDED'}`);

    } catch (error) {
      console.error('🚫 Error in ascend command:', error);
      
      const errorEmbed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('🚫 The Path of Ascension is Blocked')
        .setDescription('*Spiritual interference prevents your progression at this moment. The cosmic forces are misaligned.*')
        .addFields({
          name: '⚠️ Mystical Disturbance',
          value: '```\nThe archives of progression are temporarily inaccessible. Try again soon.\n```'
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
 * Calculate requirements for next ascension level
 * @param {number} currentLevel - Current spiritual level
 * @returns {object} Requirements object
 */
function calculateAscensionRequirements(currentLevel) {
  const baseRequirements = {
    1: { totalRituals: 5, reflections: 3, whispers: 2 },
    2: { totalRituals: 10, reflections: 7, whispers: 5, decodings: 3 },
    3: { totalRituals: 20, reflections: 15, whispers: 10, decodings: 8, linkScrolls: 3 },
    4: { totalRituals: Infinity } // Max level
  };

  return baseRequirements[currentLevel] || baseRequirements[1];
}

/**
 * Check if user is eligible for ascension
 * @param {object} progression - User progression data
 * @param {object} userRole - Current user role
 * @returns {boolean} Eligibility status
 */
function checkAscensionEligibility(progression, userRole) {
  if (userRole.level >= 4) return false; // Max level reached

  const requirements = calculateAscensionRequirements(userRole.level);
  
  return (progression.totalRituals || 0) >= requirements.totalRituals &&
         (progression.reflections || 0) >= (requirements.reflections || 0) &&
         (progression.whispers || 0) >= (requirements.whispers || 0) &&
         (progression.decodings || 0) >= (requirements.decodings || 0);
}

/**
 * Get progression description
 * @param {object} progression - User progression data
 * @param {object} requirements - Requirements for next level
 * @returns {string} Progress description
 */
function getProgressionDescription(progression, requirements) {
  const rituals = progression.totalRituals || 0;
  const reflections = progression.reflections || 0;
  const whispers = progression.whispers || 0;
  const decodings = progression.decodings || 0;

  let description = `🔥 **Rituals:** ${rituals}/${requirements.totalRituals}\n`;
  
  if (requirements.reflections) {
    description += `🪞 **Reflections:** ${reflections}/${requirements.reflections}\n`;
  }
  if (requirements.whispers) {
    description += `🔮 **Whispers:** ${whispers}/${requirements.whispers}\n`;
  }
  if (requirements.decodings) {
    description += `🗝️ **Decodings:** ${decodings}/${requirements.decodings}\n`;
  }

  return description;
}

/**
 * Format requirements for display
 * @param {object} requirements - Requirements object
 * @returns {string} Formatted requirements
 */
function formatRequirements(requirements) {
  let formatted = `• Complete **${requirements.totalRituals}** spiritual rituals\n`;
  
  if (requirements.reflections) {
    formatted += `• Create **${requirements.reflections}** sacred reflections\n`;
  }
  if (requirements.whispers) {
    formatted += `• Encode **${requirements.whispers}** mystical whispers\n`;
  }
  if (requirements.decodings) {
    formatted += `• Decode **${requirements.decodings}** cipher messages\n`;
  }

  return formatted;
}