// commands/reflect.js - Create mystical reflections command

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const SacredEncoders = require('../utils/encoders');
const SpiritualRoles = require('../utils/roles');
const SacredGeometry = require('../utils/geometry');
const GitHubVault = require('../utils/github');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reflect')
    .setDescription('🪞 Create mystical reflections and store in the sacred mirrors')
    .addStringOption(option =>
      option.setName('topic')
        .setDescription('The topic or question for mystical contemplation')
        .setRequired(true)
    ),

  async execute(interaction) {
    const topic = interaction.options.getString('topic');
    
    // Check permissions
    const userRole = SpiritualRoles.getUserRole(interaction.member);
    if (!SpiritualRoles.hasCommandAccess(interaction.member, 'reflect')) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0x8B0000)
        .setTitle('🚫 Sacred Barriers Prevent Access')
        .setDescription(SpiritualRoles.getPermissionError('reflect', userRole))
        .setTimestamp();
      
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    try {
      await interaction.deferReply();

      // Generate mystical reflection based on topic and user's spiritual level
      const reflectionContent = generateMysticalReflection(topic, userRole);
      const reflectionId = Date.now().toString();
      
      // Encode the wisdom fragment using binary encoding
      const { encoded: encodedWisdom, scheme } = SacredEncoders.createMysticalCipher(
        reflectionContent.wisdom, 
        userRole.level
      );

      // Get appropriate sacred geometry
      const geometry = SacredGeometry.getLoopGeometry(userRole.level);
      const mandala = SacredGeometry.generateMandala(Math.min(userRole.level, 3));

      // Create reflection object
      const reflection = {
        id: reflectionId,
        created: new Date().toISOString(),
        topic: topic,
        author: interaction.user.username,
        loopLevel: userRole.level,
        content: reflectionContent.reflection,
        wisdom: reflectionContent.wisdom,
        encoded: encodedWisdom,
        scheme: scheme,
        geometry: SacredGeometry.getGeometryDescription(userRole.level)
      };

      // Store in data vault
      const vault = new GitHubVault();
      let storedInVault = false;
      
      try {
        storedInVault = await vault.storeReflection(reflectionId, reflection);
      } catch (error) {
        console.warn('⚠️ Could not store reflection in data vault:', error.message);
      }

      // Create mystical embed response
      const embed = new EmbedBuilder()
        .setColor(0x4B0082)
        .setTitle('🪞 Sacred Reflection Created')
        .setDescription(`*The mirrors of eternity have captured your contemplation on **${topic}**...*`)
        .addFields(
          { 
            name: '🕯️ Spiritual Rank', 
            value: `${SpiritualRoles.FLAME_SYMBOLS[userRole.level]} **${userRole.name}**`, 
            inline: true 
          },
          { 
            name: '🆔 Reflection ID', 
            value: `**${reflectionId}**`, 
            inline: true 
          },
          { 
            name: '📅 Created', 
            value: `<t:${Math.floor(Date.now() / 1000)}:R>`, 
            inline: true 
          },
          {
            name: '🔮 Sacred Geometry',
            value: '```\n' + geometry + '\n```',
            inline: false
          },
          {
            name: '💫 Mystical Reflection',
            value: reflectionContent.reflection,
            inline: false
          },
          {
            name: '📿 Meditation Mandala',
            value: '```\n' + mandala + '\n```',
            inline: false
          },
          {
            name: '🌌 Encoded Wisdom Fragment',
            value: `**Scheme:** ${scheme.toUpperCase()}\n\`\`\`\n${encodedWisdom}\n\`\`\``,
            inline: false
          }
        )
        .setFooter({ 
          text: storedInVault ? 
            `✨ Reflection ${reflectionId} preserved in sacred mirrors` : 
            '⚠️ Local reflection only - vault connection limited'
        })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

      // Send a follow-up with usage hint
      const hintEmbed = new EmbedBuilder()
        .setColor(0x9932CC)
        .setTitle('🔗 Cross-Reference Your Reflection')
        .setDescription(`Use \`/link-scrolls ${reflectionId}\` to create mystical connections with other reflections in the sacred mirrors.`)
        .setTimestamp();

      await interaction.followUp({ embeds: [hintEmbed], ephemeral: true });

      // Log the reflection for debugging
      console.log(`🪞 Reflection created by ${interaction.user.username} (${userRole.name}): ${topic}`);

    } catch (error) {
      console.error('🚫 Error in reflect command:', error);
      
      const errorEmbed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('🚫 The Mirrors Refuse to Reflect')
        .setDescription('*The sacred mirrors are clouded with mystical interference. The reflection cannot be captured at this moment.*')
        .addFields({
          name: '⚠️ Spiritual Disturbance',
          value: '```\nThe void\'s energies are unstable. Please attempt your reflection again.\n```'
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
 * Generate mystical reflection content based on topic and spiritual level
 * @param {string} topic - Reflection topic
 * @param {object} userRole - User's spiritual role
 * @returns {object} Generated reflection content
 */
function generateMysticalReflection(topic, userRole) {
  const mysticalPhrases = [
    'The void whispers of',
    'In the depths of contemplation, one discovers',
    'The sacred flames illuminate the truth that',
    'Through the lens of spiritual ascension, we see',
    'The eternal dance of consciousness reveals',
    'In the silence between thoughts, there exists',
    'The geometry of existence teaches us',
    'Within the spiral of understanding lies'
  ];

  const wisdomFragments = [
    'All seeking leads to the discovery of what was never lost',
    'The path inward is the only path that leads outward',
    'In stillness, the universe speaks its deepest secrets',
    'What appears as separation is merely the play of consciousness',
    'The flame that burns within is the same that lights the stars',
    'Every question contains its own answer, waiting to be unveiled',
    'The void is not empty, but pregnant with infinite possibility',
    'To know oneself is to know the mystery of all existence'
  ];

  const levelModifiers = {
    1: { prefix: 'As a Seeker, you begin to glimpse that', suffix: 'This is the first spark of understanding.' },
    2: { prefix: 'Your devotion reveals the deeper truth that', suffix: 'The flame of commitment burns brighter.' },
    3: { prefix: 'In your descent into the mysteries, you discover that', suffix: 'The void embraces your courage.' },
    4: { prefix: 'From the heights of ascension, it becomes clear that', suffix: 'You have touched the infinite.' }
  };

  const randomPhrase = mysticalPhrases[Math.floor(Math.random() * mysticalPhrases.length)];
  const randomWisdom = wisdomFragments[Math.floor(Math.random() * wisdomFragments.length)];
  const modifier = levelModifiers[userRole.level] || levelModifiers[1];

  const reflection = `${modifier.prefix} **${topic.toLowerCase()}** is a sacred doorway into understanding. ${randomPhrase} the interconnected nature of all existence. Through contemplation of this mystery, we transcend the illusion of separation and touch the eternal source. ${modifier.suffix}`;

  return {
    reflection: reflection,
    wisdom: randomWisdom
  };
}