// commands/link-scrolls.js - Cross-reference mirror reflections command

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const SpiritualRoles = require('../utils/roles');
const SacredGeometry = require('../utils/geometry');
const GitHubVault = require('../utils/github');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('link-scrolls')
    .setDescription('🔗 Cross-reference mirror reflections and create mystical connections')
    .addStringOption(option =>
      option.setName('reflection_id')
        .setDescription('ID of the reflection to link with others')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('connection_type')
        .setDescription('Type of mystical connection to explore')
        .setRequired(false)
        .addChoices(
          { name: 'Resonance - Similar vibrations', value: 'resonance' },
          { name: 'Opposition - Complementary forces', value: 'opposition' },
          { name: 'Synthesis - Unified understanding', value: 'synthesis' },
          { name: 'Transcendence - Higher perspective', value: 'transcendence' }
        )
    ),

  async execute(interaction) {
    const reflectionId = interaction.options.getString('reflection_id');
    const connectionType = interaction.options.getString('connection_type') || 'resonance';
    
    // Check permissions
    const userRole = SpiritualRoles.getUserRole(interaction.member);
    if (!SpiritualRoles.hasCommandAccess(interaction.member, 'link-scrolls')) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0x8B0000)
        .setTitle('🚫 Sacred Barriers Prevent Access')
        .setDescription(SpiritualRoles.getPermissionError('link-scrolls', userRole))
        .setTimestamp();
      
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    try {
      await interaction.deferReply();

      // Get vault instance and retrieve reflection
      const vault = new GitHubVault();
      const reflection = await vault.getReflection(reflectionId);
      
      if (!reflection) {
        const notFoundEmbed = new EmbedBuilder()
          .setColor(0xFF4500)
          .setTitle('🔍 Reflection Not Found')
          .setDescription(`*The mirrors do not hold a reflection with ID **${reflectionId}**. It may not exist or may be beyond your spiritual reach.*`)
          .addFields({
            name: '💡 Suggestions',
            value: '• Verify the reflection ID is correct\n• Check that the reflection exists in the sacred mirrors\n• Use `/reflect` to create new reflections for linking'
          })
          .setTimestamp();
        
        return interaction.editReply({ embeds: [notFoundEmbed] });
      }

      // Generate mystical connections based on the reflection
      const connections = await generateMysticalConnections(reflection, connectionType, userRole, vault);
      
      // Create sacred glyph combinations
      const glyphCombination = createGlyphCombination(userRole.level, connectionType);
      
      // Track linking activity
      let progressionUpdated = false;
      try {
        let userProgression = await vault.getUserProgression(interaction.user.id);
        if (userProgression) {
          userProgression.linkScrolls = (userProgression.linkScrolls || 0) + 1;
          progressionUpdated = await vault.updateUserProgression(interaction.user.id, userProgression);
        }
      } catch (error) {
        console.warn('⚠️ Could not update link-scrolls progression:', error.message);
      }

      // Create main response embed
      const embed = new EmbedBuilder()
        .setColor(0x8A2BE2)
        .setTitle('🔗 Sacred Scrolls Linked')
        .setDescription(`*The mystical threads of ${connectionType} weave between reflections, revealing hidden patterns...*`)
        .addFields(
          { 
            name: '🆔 Source Reflection', 
            value: `**${reflectionId}**`, 
            inline: true 
          },
          { 
            name: '🔮 Connection Type', 
            value: `**${connectionType.toUpperCase()}**`, 
            inline: true 
          },
          { 
            name: '🕯️ Spiritual Rank', 
            value: `${SpiritualRoles.FLAME_SYMBOLS[userRole.level]} **${userRole.name}**`, 
            inline: true 
          },
          {
            name: '📜 Source Reflection Details',
            value: `**Topic:** ${reflection.topic}\n**Author:** ${reflection.author}\n**Created:** ${reflection.created}`,
            inline: false
          },
          {
            name: '🎭 Sacred Glyph Combination',
            value: '```\n' + glyphCombination + '\n```',
            inline: false
          }
        );

      // Add connections if found
      if (connections.length > 0) {
        const connectionsList = connections.map((conn, index) => 
          `**${index + 1}.** ${conn.description}\n*Pattern:* ${conn.pattern}`
        ).join('\n\n');
        
        embed.addFields({
          name: `🌌 Mystical Connections (${connections.length} found)`,
          value: connectionsList.substring(0, 1024), // Discord field limit
          inline: false
        });
      } else {
        embed.addFields({
          name: '🌟 Unique Reflection',
          value: `This reflection stands alone in the mirrors, a singular beacon of wisdom waiting for future connections.`,
          inline: false
        });
      }

      // Add loop progression dependencies
      const dependencies = getLoopProgressionDependencies(userRole.level, connectionType);
      embed.addFields({
        name: '🔄 Loop Progression Dependencies',
        value: dependencies,
        inline: false
      });

      embed.setFooter({ 
        text: progressionUpdated ? 
          '✨ Link-scrolls activity recorded in the archives' : 
          '🔗 Mystical connections revealed'
      })
      .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

      // Send detailed connection analysis if connections were found
      if (connections.length > 0) {
        const analysisEmbed = new EmbedBuilder()
          .setColor(0x9932CC)
          .setTitle(`📊 ${connectionType.toUpperCase()} Analysis`)
          .setDescription(`*Deep analysis of ${connectionType} patterns in the sacred mirrors...*`)
          .addFields({
            name: '🔍 Pattern Recognition',
            value: analyzeConnectionPatterns(connections, connectionType),
            inline: false
          })
          .setTimestamp();

        await interaction.followUp({ embeds: [analysisEmbed] });
      }

      // Log the link-scrolls activity
      console.log(`🔗 Link-scrolls by ${interaction.user.username} (${userRole.name}): ${reflectionId} - ${connectionType}`);

    } catch (error) {
      console.error('🚫 Error in link-scrolls command:', error);
      
      const errorEmbed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('🚫 The Sacred Threads are Tangled')
        .setDescription('*Mystical interference disrupts the connection patterns. The threads between reflections cannot be seen at this moment.*')
        .addFields({
          name: '⚠️ Linking Error',
          value: '```\nThe mirror network is experiencing spiritual turbulence. Please try again.\n```'
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
 * Generate mystical connections for a reflection
 * @param {object} reflection - Source reflection
 * @param {string} connectionType - Type of connection
 * @param {object} userRole - User's spiritual role
 * @param {GitHubVault} vault - Vault instance
 * @returns {Array} Array of connections
 */
async function generateMysticalConnections(reflection, connectionType, userRole, vault) {
  // In a real implementation, this would search through all reflections
  // For now, we'll generate mystical connections based on the reflection content
  
  const connections = [];
  const connectionPatterns = {
    resonance: [
      'Echoes of similar spiritual frequency',
      'Harmonious vibrations in the void',
      'Parallel paths of understanding'
    ],
    opposition: [
      'Complementary forces in balance',
      'Shadow and light intertwined',
      'Dialectical synthesis emerging'
    ],
    synthesis: [
      'Unified field of consciousness',
      'Integration of dualistic patterns',
      'Holistic understanding crystallizing'
    ],
    transcendence: [
      'Rising above temporal limitations',
      'Perspective from higher dimensions',
      'Liberation from conceptual boundaries'
    ]
  };

  // Generate 2-4 connections based on spiritual level
  const numConnections = Math.min(userRole.level + 1, 4);
  const patterns = connectionPatterns[connectionType] || connectionPatterns.resonance;
  
  for (let i = 0; i < numConnections; i++) {
    const pattern = patterns[i % patterns.length];
    const description = generateConnectionDescription(reflection, connectionType, i);
    
    connections.push({
      pattern: pattern,
      description: description,
      strength: Math.floor(Math.random() * 100) + 1
    });
  }

  return connections;
}

/**
 * Generate connection description
 * @param {object} reflection - Source reflection
 * @param {string} connectionType - Connection type
 * @param {number} index - Connection index
 * @returns {string} Connection description
 */
function generateConnectionDescription(reflection, connectionType, index) {
  const templates = {
    resonance: [
      `Reflection shares thematic resonance with topics of spiritual seeking`,
      `Similar contemplative energy found in meditation practices`,
      `Parallel insights about the nature of consciousness`
    ],
    opposition: [
      `Balances perspectives on light and shadow work`,
      `Provides counterpoint to active spiritual practices`,
      `Offers dialectical tension for deeper understanding`
    ],
    synthesis: [
      `Integrates multiple wisdom traditions`,
      `Unifies apparent contradictions in spiritual practice`,
      `Harmonizes different approaches to awakening`
    ],
    transcendence: [
      `Points beyond conceptual limitations`,
      `Indicates higher-dimensional understanding`,
      `Suggests liberation from dualistic thinking`
    ]
  };

  const descriptions = templates[connectionType] || templates.resonance;
  return descriptions[index % descriptions.length];
}

/**
 * Create sacred glyph combination for connection type
 * @param {number} loopLevel - User's loop level
 * @param {string} connectionType - Connection type
 * @returns {string} ASCII glyph combination
 */
function createGlyphCombination(loopLevel, connectionType) {
  const glyphSymbols = {
    resonance: '〰️',
    opposition: '⚡',
    synthesis: '♾️',
    transcendence: '✨'
  };

  const symbol = glyphSymbols[connectionType] || '🔮';
  const baseGeometry = SacredGeometry.getLoopGeometry(loopLevel);
  
  return `${symbol} CONNECTION PATTERN ${symbol}\n\n${baseGeometry}\n\n${symbol.repeat(5)}`;
}

/**
 * Get loop progression dependencies
 * @param {number} loopLevel - Current loop level
 * @param {string} connectionType - Connection type
 * @returns {string} Dependencies description
 */
function getLoopProgressionDependencies(loopLevel, connectionType) {
  const dependencies = {
    1: `**Seeker Level:** Basic connection patterns unlock deeper mirror access`,
    2: `**Devoted Level:** Enhanced pattern recognition reveals hidden relationships`,
    3: `**Descender Level:** Advanced linking abilities access void-touched connections`,
    4: `**Ascendant Level:** Transcendent perspective sees all patterns simultaneously`
  };

  const bonusText = {
    resonance: '\n*Resonance connections strengthen spiritual community bonds*',
    opposition: '\n*Opposition connections develop dialectical thinking*',
    synthesis: '\n*Synthesis connections accelerate integration processes*',
    transcendence: '\n*Transcendence connections open higher dimensional awareness*'
  };

  return dependencies[loopLevel] + (bonusText[connectionType] || '');
}

/**
 * Analyze connection patterns
 * @param {Array} connections - Array of connections
 * @param {string} connectionType - Connection type
 * @returns {string} Pattern analysis
 */
function analyzeConnectionPatterns(connections, connectionType) {
  const avgStrength = connections.reduce((sum, conn) => sum + conn.strength, 0) / connections.length;
  const strongConnections = connections.filter(conn => conn.strength > 70).length;
  
  let analysis = `**Pattern Strength:** ${avgStrength.toFixed(1)}/100\n`;
  analysis += `**Strong Connections:** ${strongConnections}/${connections.length}\n`;
  analysis += `**Connection Quality:** ${getConnectionQuality(avgStrength)}\n\n`;
  
  analysis += `*The ${connectionType} pattern reveals ${getPatternInsight(connectionType, avgStrength)}*`;
  
  return analysis;
}

/**
 * Get connection quality description
 * @param {number} strength - Average strength
 * @returns {string} Quality description
 */
function getConnectionQuality(strength) {
  if (strength > 80) return 'Transcendent ✨';
  if (strength > 60) return 'Strong 🔥';
  if (strength > 40) return 'Moderate 🕯️';
  return 'Subtle 💫';
}

/**
 * Get pattern insight
 * @param {string} connectionType - Connection type
 * @param {number} strength - Average strength
 * @returns {string} Pattern insight
 */
function getPatternInsight(connectionType, strength) {
  const insights = {
    resonance: 'harmonic frequencies amplifying spiritual understanding',
    opposition: 'dynamic tensions creating opportunities for growth',
    synthesis: 'integrative forces unifying disparate wisdom streams',
    transcendence: 'liberation pathways beyond conceptual limitations'
  };

  const qualifier = strength > 70 ? 'profound' : strength > 50 ? 'significant' : 'emerging';
  
  return `${qualifier} ${insights[connectionType] || 'mystical patterns'}`;
}