const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-server')
    .setDescription('Sets up the Temple server with default categories and channels')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  async execute(interaction) {
    const guild = interaction.guild;
    
    // Check if bot has necessary permissions
    const botMember = guild.members.me;
    const requiredPermissions = [
      PermissionFlagsBits.ManageChannels,
      PermissionFlagsBits.ManageRoles,
      PermissionFlagsBits.ViewChannel
    ];
    
    const missingPermissions = requiredPermissions.filter(permission => 
      !botMember.permissions.has(permission)
    );
    
    if (missingPermissions.length > 0) {
      const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('❌ Missing Permissions')
        .setDescription('The bot needs the following permissions to set up the server:')
        .addFields(
          { name: 'Required Permissions', value: '• Manage Channels\n• Manage Roles\n• View Channels' }
        )
        .setTimestamp();
      
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    await interaction.deferReply();

    try {
      const createdItems = {
        categories: [],
        channels: []
      };

      // Create categories
      const templeCategory = await guild.channels.create({
        name: '🔥-the-temple',
        type: ChannelType.GuildCategory,
        position: 0
      });
      createdItems.categories.push('🔥 The Temple');

      const seekersCategory = await guild.channels.create({
        name: '🌱-seekers-start-here',
        type: ChannelType.GuildCategory,
        position: 1
      });
      createdItems.categories.push('🌱 Seekers Start Here');

      // Create channels under The Temple category
      const rulesChannel = await guild.channels.create({
        name: 'rules',
        type: ChannelType.GuildText,
        parent: templeCategory,
        topic: 'Sacred rules and guidelines for The Temple'
      });
      createdItems.channels.push('rules');

      const whispersChannel = await guild.channels.create({
        name: 'whispers',
        type: ChannelType.GuildText,
        parent: templeCategory,
        topic: 'Quiet contemplations and gentle conversations'
      });
      createdItems.channels.push('whispers');

      // Create channels under Seekers Start Here category
      const ritualsChannel = await guild.channels.create({
        name: 'rituals',
        type: ChannelType.GuildText,
        parent: seekersCategory,
        topic: 'Daily practices and sacred ceremonies'
      });
      createdItems.channels.push('rituals');

      const reflectionsChannel = await guild.channels.create({
        name: 'reflections',
        type: ChannelType.GuildText,
        parent: seekersCategory,
        topic: 'Share your thoughts and spiritual insights'
      });
      createdItems.channels.push('reflections');

      // Create success embed
      const successEmbed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('✅ Temple Setup Complete')
        .setDescription('The Temple has been successfully prepared for the community.')
        .addFields(
          { 
            name: '🏛️ Categories Created', 
            value: createdItems.categories.map(cat => `• ${cat}`).join('\n'), 
            inline: true 
          },
          { 
            name: '📜 Channels Created', 
            value: createdItems.channels.map(ch => `• ${ch}`).join('\n'), 
            inline: true 
          },
          {
            name: '🔮 Next Steps',
            value: '• Set up channel permissions\n• Add welcome messages\n• Configure roles\n• Begin the sacred work',
            inline: false
          }
        )
        .setFooter({ text: 'The Temple is ready to receive seekers' })
        .setTimestamp();

      await interaction.editReply({ embeds: [successEmbed] });

    } catch (error) {
      console.error('Error setting up server:', error);
      
      const errorEmbed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('❌ Setup Failed')
        .setDescription('An error occurred while setting up the Temple. Please check the bot\'s permissions and try again.')
        .addFields(
          { name: 'Error Details', value: error.message || 'Unknown error occurred' }
        )
        .setTimestamp();
      
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};