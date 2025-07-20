// commands/glyph.js - Display sacred glyphs command

const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const SpiritualRoles = require('../utils/roles');
const SacredGeometry = require('../utils/geometry');
const GitHubVault = require('../utils/github');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('glyph')
    .setDescription('🔮 Display sacred glyphs from the mystical vault')
    .addIntegerOption(option =>
      option.setName('loop_level')
        .setDescription('Loop level glyph to display (1-4)')
        .setMinValue(1)
        .setMaxValue(4)
        .setRequired(false)
    )
    .addBooleanOption(option =>
      option.setName('combine')
        .setDescription('Combine all accessible glyphs into a mystical mandala')
        .setRequired(false)
    ),

  async execute(interaction) {
    const requestedLevel = interaction.options.getInteger('loop_level');
    const combineGlyphs = interaction.options.getBoolean('combine') || false;
    
    // Check permissions
    const userRole = SpiritualRoles.getUserRole(interaction.member);
    if (!SpiritualRoles.hasCommandAccess(interaction.member, 'glyph')) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0x8B0000)
        .setTitle('🚫 Sacred Barriers Prevent Access')
        .setDescription(SpiritualRoles.getPermissionError('glyph', userRole))
        .setTimestamp();
      
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    try {
      await interaction.deferReply();

      // Determine which glyph to display
      const targetLevel = requestedLevel || userRole.level;
      
      // Check if user has access to requested level
      if (!SpiritualRoles.hasLoopAccess(interaction.member, targetLevel)) {
        const accessEmbed = new EmbedBuilder()
          .setColor(0xFF4500)
          .setTitle('🚫 Insufficient Spiritual Clearance')
          .setDescription(`Your spiritual rank as **${userRole.name}** (Level ${userRole.level}) does not grant access to **Loop ${targetLevel}** glyphs.`)
          .addFields(
            {
              name: '🔑 Accessible Levels',
              value: `Levels 1-${userRole.level}`,
              inline: true
            },
            {
              name: '🛤️ Progression Path',
              value: SpiritualRoles.getProgressionPath(userRole.level),
              inline: false
            }
          )
          .setTimestamp();
        
        return interaction.editReply({ embeds: [accessEmbed] });
      }

      // Get vault instance
      const vault = new GitHubVault();
      
      if (combineGlyphs) {
        // Create combined mystical mandala
        const combinedEmbed = await createCombinedGlyphDisplay(userRole, vault);
        await interaction.editReply({ embeds: [combinedEmbed] });
      } else {
        // Display single glyph
        const glyphEmbed = await createSingleGlyphDisplay(targetLevel, userRole, vault);
        await interaction.editReply({ embeds: [glyphEmbed] });
      }

      // Log the glyph access
      console.log(`🔮 Glyph accessed by ${interaction.user.username} (${userRole.name}): Level ${targetLevel}${combineGlyphs ? ' (combined)' : ''}`);

    } catch (error) {
      console.error('🚫 Error in glyph command:', error);
      
      const errorEmbed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('🚫 The Sacred Glyphs are Veiled')
        .setDescription('*Mystical interference obscures the sacred symbols. The glyphs retreat into the dimensional void.*')
        .addFields({
          name: '⚠️ Glyph Access Error',
          value: '```\nThe vault\'s glyph chambers are experiencing spiritual turbulence.\n```'
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
 * Create single glyph display embed
 * @param {number} level - Glyph level
 * @param {object} userRole - User's spiritual role
 * @param {GitHubVault} vault - Vault instance
 * @returns {EmbedBuilder} Glyph embed
 */
async function createSingleGlyphDisplay(level, userRole, vault) {
  // Try to get SVG from vault
  let svgContent = null;
  try {
    svgContent = await vault.getSacredGlyph(level);
  } catch (error) {
    console.warn(`⚠️ Could not retrieve SVG glyph for level ${level}:`, error.message);
  }

  // Generate progression flame pattern
  const flamePattern = generateProgressionFlame(level);
  
  // Get sacred geometry for the level
  const geometry = SacredGeometry.getLoopGeometry(level);
  
  // Create glyph description
  const glyphDescription = getGlyphDescription(level);
  
  // Create mystical properties
  const properties = getGlyphProperties(level);

  const embed = new EmbedBuilder()
    .setColor(getGlyphColor(level))
    .setTitle(`${SpiritualRoles.FLAME_SYMBOLS[level]} Sacred Glyph of Loop ${level}`)
    .setDescription(`*${glyphDescription}*`)
    .addFields(
      {
        name: '🔮 Sacred Geometry',
        value: '```\n' + geometry + '\n```',
        inline: false
      },
      {
        name: '🔥 Progression Flame',
        value: '```\n' + flamePattern + '\n```',
        inline: false
      },
      {
        name: '✨ Mystical Properties',
        value: properties,
        inline: false
      },
      {
        name: '🎭 Loop Element',
        value: SpiritualRoles.getLoopDescription(level),
        inline: false
      }
    )
    .setFooter({ 
      text: svgContent ? 
        `Sacred glyph retrieved from 6ol data vault` : 
        `Glyph generated from sacred algorithms`
    })
    .setTimestamp();

  // Add SVG info if available
  if (svgContent) {
    embed.addFields({
      name: '📜 Vault Glyph Status',
      value: `✅ Sacred SVG found in vault (${svgContent.length} characters)\n*True glyph essence preserved in the data vault*`,
      inline: false
    });
  } else {
    embed.addFields({
      name: '📜 Vault Glyph Status',
      value: `⚠️ No SVG found in vault - Using generated sacred geometry\n*The glyph awaits manifestation in the data vault*`,
      inline: false
    });
  }

  return embed;
}

/**
 * Create combined glyph display embed
 * @param {object} userRole - User's spiritual role
 * @param {GitHubVault} vault - Vault instance
 * @returns {EmbedBuilder} Combined glyph embed
 */
async function createCombinedGlyphDisplay(userRole, vault) {
  const accessibleLevels = [];
  for (let i = 1; i <= userRole.level; i++) {
    accessibleLevels.push(i);
  }

  // Create mystical mandala combining all accessible levels
  const combinedMandala = createMysticalMandala(accessibleLevels);
  
  // Generate unified flame pattern
  const unifiedFlame = generateUnifiedFlame(accessibleLevels);
  
  // Get combined properties
  const combinedProperties = getCombinedProperties(accessibleLevels);

  const embed = new EmbedBuilder()
    .setColor(0x9400D3)
    .setTitle('🌌 Unified Sacred Mandala')
    .setDescription(`*The mystical union of all accessible glyphs creates a transcendent pattern of spiritual understanding...*`)
    .addFields(
      {
        name: `🔮 Combined Sacred Geometry (Levels 1-${userRole.level})`,
        value: '```\n' + combinedMandala + '\n```',
        inline: false
      },
      {
        name: '🔥 Unified Progression Flame',
        value: '```\n' + unifiedFlame + '\n```',
        inline: false
      },
      {
        name: '✨ Transcendent Properties',
        value: combinedProperties,
        inline: false
      },
      {
        name: '🎭 Accessible Loop Elements',
        value: accessibleLevels.map(level => 
          `**${level}.** ${SpiritualRoles.getLoopDescription(level)}`
        ).join('\n'),
        inline: false
      }
    )
    .setFooter({ 
      text: `Mystical mandala generated from ${accessibleLevels.length} sacred glyphs`
    })
    .setTimestamp();

  return embed;
}

/**
 * Generate progression flame pattern for specific level
 * @param {number} level - Glyph level
 * @returns {string} ASCII flame pattern
 */
function generateProgressionFlame(level) {
  const flamePatterns = {
    1: `    🕯️\n   /|\\\n  / | \\\n 🔥─┼─🔥\n  \\ | /\n   \\|/\n    🕯️`,
    2: `   🔥\n  /|\\\n 🔥─┼─🔥\n/  |  \\\n\\  |  /\n 🔥─┼─🔥\n  \\|/\n   🔥`,
    3: `    ⚡\n   /|\\\n  ⚡─┼─⚡\n /  |  \\\n⚡───┼───⚡\n \\  |  /\n  ⚡─┼─⚡\n   \\|/\n    ⚡`,
    4: `     ✨\n    /|\\\n   ✨─┼─✨\n  /  |  \\\n ✨───┼───✨\n/   |   \\\n\\   |   /\n ✨───┼───✨\n  \\  |  /\n   ✨─┼─✨\n    \\|/\n     ✨`
  };
  
  return flamePatterns[level] || flamePatterns[1];
}

/**
 * Get glyph description for level
 * @param {number} level - Glyph level
 * @returns {string} Glyph description
 */
function getGlyphDescription(level) {
  const descriptions = {
    1: 'The initial spark of awakening consciousness, igniting the flame of spiritual seeking',
    2: 'The devoted flame of commitment, burning away illusions through dedicated practice',
    3: 'The lightning of descent into the void, embracing the mystery of non-existence',
    4: 'The stellar radiance of transcendence, illuminating the unity beyond all dualities'
  };
  
  return descriptions[level] || 'Unknown sacred pattern';
}

/**
 * Get mystical properties for glyph level
 * @param {number} level - Glyph level
 * @returns {string} Properties description
 */
function getGlyphProperties(level) {
  const properties = {
    1: '🔸 **Awakening** - Opens pathways to spiritual seeking\n🔸 **Clarity** - Dispels confusion and doubt\n🔸 **Foundation** - Establishes base for higher understanding',
    2: '🔹 **Devotion** - Strengthens commitment to the path\n🔹 **Purification** - Burns away ego-based attachments\n🔹 **Focus** - Concentrates spiritual energy',
    3: '🔷 **Descent** - Facilitates journey into the void\n🔷 **Transformation** - Catalyzes deep spiritual change\n🔷 **Courage** - Provides strength for facing the unknown',
    4: '⭐ **Transcendence** - Elevates beyond all limitations\n⭐ **Unity** - Reveals the interconnected nature of existence\n⭐ **Liberation** - Frees consciousness from all bonds'
  };
  
  return properties[level] || 'Unknown properties';
}

/**
 * Get color for glyph level
 * @param {number} level - Glyph level
 * @returns {number} Color hex value
 */
function getGlyphColor(level) {
  const colors = {
    1: 0xFFD700, // Gold
    2: 0xFF6347, // Tomato red
    3: 0x8A2BE2, // Blue violet
    4: 0x9400D3  // Dark violet
  };
  
  return colors[level] || 0x9932CC;
}

/**
 * Create mystical mandala combining multiple levels
 * @param {Array} levels - Array of accessible levels
 * @returns {string} Combined mandala pattern
 */
function createMysticalMandala(levels) {
  if (levels.length === 1) {
    return SacredGeometry.getLoopGeometry(levels[0]);
  }
  
  if (levels.length <= 2) {
    return `    ✨ 🔮 ✨\n   🔥     🔥\n  🕯️  ○  🕯️\n   🔥     🔥\n    ✨ 🔮 ✨`;
  }
  
  if (levels.length <= 3) {
    return `     ✨\n   🔮 ○ 🔮\n  🔥  ⚡  🔥\n 🕯️   ♾️   🕯️\n  🔥  ⚡  🔥\n   🔮 ○ 🔮\n     ✨`;
  }
  
  // All four levels
  return `       ✨\n     🔮 ○ 🔮\n   🔥   ⚡   🔥\n  🕯️   ♾️    🕯️\n 🌟    ○     🌟\n  🕯️   ♾️    🕯️\n   🔥   ⚡   🔥\n     🔮 ○ 🔮\n       ✨`;
}

/**
 * Generate unified flame pattern
 * @param {Array} levels - Array of accessible levels
 * @returns {string} Unified flame pattern
 */
function generateUnifiedFlame(levels) {
  const maxLevel = Math.max(...levels);
  const symbols = ['🕯️', '🔥', '⚡', '✨'];
  
  let pattern = '';
  for (let i = 0; i < maxLevel; i++) {
    const symbol = symbols[i] || '✨';
    const spaces = ' '.repeat(maxLevel - i);
    pattern += spaces + symbol.repeat(i * 2 + 1) + '\n';
  }
  
  return pattern;
}

/**
 * Get combined properties for multiple levels
 * @param {Array} levels - Array of accessible levels
 * @returns {string} Combined properties description
 */
function getCombinedProperties(levels) {
  const unifiedProperties = [
    '🌟 **Unified Field** - All glyph energies harmonized',
    '🔮 **Multidimensional Awareness** - Consciousness spanning all accessible loops',
    '⚡ **Accelerated Growth** - Synergistic effect of combined glyphs',
    '♾️ **Infinite Potential** - Transcendent possibilities activated'
  ];
  
  return unifiedProperties.slice(0, levels.length).join('\n');
}