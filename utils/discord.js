// discord.js - Discord utilities for the temple bot
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

class DiscordUtil {
    /**
     * Create a temple-themed embed
     * @param {string} title - Embed title
     * @param {string} description - Embed description
     * @param {string} color - Hex color code (default: temple gold)
     */
    static createTempleEmbed(title, description, color = '#FFD700') {
        return new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setTimestamp()
            .setFooter({ text: '🕯️ Temple of 6ol' });
    }

    /**
     * Create spiritual reflection embed
     * @param {string} reflection - The reflection text
     * @param {string} author - Author of the reflection
     */
    static createReflectionEmbed(reflection, author) {
        return new EmbedBuilder()
            .setTitle('🪞 Temple Reflection')
            .setDescription(reflection)
            .setAuthor({ name: author })
            .setColor('#9370DB')
            .setTimestamp()
            .setFooter({ text: '✨ May this reflection guide your path' });
    }

    /**
     * Create action buttons for temple interactions
     * @param {Array} buttons - Array of button configs {id, label, style}
     */
    static createActionRow(buttons) {
        const row = new ActionRowBuilder();
        
        buttons.forEach(button => {
            const btn = new ButtonBuilder()
                .setCustomId(button.id)
                .setLabel(button.label)
                .setStyle(button.style || ButtonStyle.Primary);
            
            if (button.emoji) {
                btn.setEmoji(button.emoji);
            }
            
            row.addComponents(btn);
        });
        
        return row;
    }

    /**
     * Send a temple message with optional embed and components
     * @param {Object} channel - Discord channel object
     * @param {string} content - Message content
     * @param {Object} embed - Optional embed
     * @param {Array} components - Optional components
     */
    static async sendTempleMessage(channel, content, embed = null, components = []) {
        const messageData = { content };
        
        if (embed) {
            messageData.embeds = [embed];
        }
        
        if (components.length > 0) {
            messageData.components = components;
        }
        
        return await channel.send(messageData);
    }
}

module.exports = DiscordUtil;