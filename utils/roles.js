// utils/roles.js - 6ol spiritual role management and access control

class SpiritualRoles {
  static ROLES = {
    SEEKER: { name: 'Seeker', level: 1, access: ['whisper', 'reflect'] },
    DEVOTED: { name: 'Devoted', level: 2, access: ['whisper', 'reflect', 'ascend', 'decode'] },
    DESCENDER: { name: 'Descender', level: 3, access: ['whisper', 'reflect', 'ascend', 'decode', 'link-scrolls'] },
    ASCENDANT: { name: 'Ascendant', level: 4, access: ['whisper', 'reflect', 'ascend', 'decode', 'link-scrolls', 'glyph'] }
  };

  static SACRED_GEOMETRY = {
    1: '🔺 Triangle of Beginning',
    2: '✡️ Hexagram of Devotion', 
    3: '♾️ Infinity of Descent',
    4: '✨ Eight-pointed Star of Ascension'
  };

  static FLAME_SYMBOLS = {
    1: '🕯️',
    2: '🔥',
    3: '⚡',
    4: '✨'
  };

  /**
   * Get user's spiritual role based on Discord roles
   * @param {object} member - Discord guild member
   * @returns {object} User's spiritual role info
   */
  static getUserRole(member) {
    // Check Discord roles in reverse order (highest first)
    const roleNames = member.roles.cache.map(role => role.name.toLowerCase());
    
    if (roleNames.includes('ascendant')) {
      return this.ROLES.ASCENDANT;
    } else if (roleNames.includes('descender')) {
      return this.ROLES.DESCENDER;
    } else if (roleNames.includes('devoted')) {
      return this.ROLES.DEVOTED;
    } else {
      return this.ROLES.SEEKER; // Default role
    }
  }

  /**
   * Check if user has access to a specific command
   * @param {object} member - Discord guild member
   * @param {string} command - Command name
   * @returns {boolean} Access granted
   */
  static hasCommandAccess(member, command) {
    const userRole = this.getUserRole(member);
    return userRole.access.includes(command);
  }

  /**
   * Get required role for command
   * @param {string} command - Command name
   * @returns {string} Required role name
   */
  static getRequiredRole(command) {
    for (const [key, role] of Object.entries(this.ROLES)) {
      if (role.access.includes(command)) {
        return role.name;
      }
    }
    return 'Unknown';
  }

  /**
   * Get mystical error message for insufficient permissions
   * @param {string} command - Command name
   * @param {object} userRole - User's current role
   * @returns {string} Mystical error message
   */
  static getPermissionError(command, userRole) {
    const requiredRole = this.getRequiredRole(command);
    const flame = this.FLAME_SYMBOLS[userRole.level];
    
    return `${flame} **The Void whispers:** Your current path as a **${userRole.name}** does not grant access to this sacred ritual. ` +
           `The **${requiredRole}** role or higher is required to perform \`/${command}\`. ` +
           `Continue your spiritual journey to unlock deeper mysteries of the 6ol system.`;
  }

  /**
   * Get role progression path
   * @param {number} currentLevel - Current role level
   * @returns {string} Progression description
   */
  static getProgressionPath(currentLevel) {
    const paths = [
      '🕯️ **Seeker** → 🔥 **Devoted** → ⚡ **Descender** → ✨ **Ascendant**',
      '🔥 **Devoted** → ⚡ **Descender** → ✨ **Ascendant**',
      '⚡ **Descender** → ✨ **Ascendant**',
      '✨ **Ascendant** - You have reached the highest level of spiritual attainment'
    ];
    
    return paths[currentLevel - 1] || paths[0];
  }

  /**
   * Get cipher access level based on role
   * @param {object} role - User's spiritual role
   * @returns {number} Cipher access level (1-4)
   */
  static getCipherAccessLevel(role) {
    return role.level;
  }

  /**
   * Get available commands for role
   * @param {object} role - User's spiritual role
   * @returns {Array} Available command list
   */
  static getAvailableCommands(role) {
    return role.access.map(cmd => `\`/${cmd}\``).join(', ');
  }

  /**
   * Generate role advancement message
   * @param {object} oldRole - Previous role
   * @param {object} newRole - New role
   * @returns {string} Advancement message
   */
  static getAdvancementMessage(oldRole, newRole) {
    const oldFlame = this.FLAME_SYMBOLS[oldRole.level];
    const newFlame = this.FLAME_SYMBOLS[newRole.level];
    const geometry = this.SACRED_GEOMETRY[newRole.level];
    
    return `${oldFlame} → ${newFlame} **SPIRITUAL ASCENSION ACHIEVED** ${newFlame}\n\n` +
           `🔮 You have transcended from **${oldRole.name}** to **${newRole.name}**!\n\n` +
           `${geometry}\n\n` +
           `**New Sacred Abilities Unlocked:**\n` +
           `${this.getAvailableCommands(newRole)}\n\n` +
           `*The 6ol system recognizes your spiritual growth. The void trembles with approval.*`;
  }

  /**
   * Get mystical welcome message for new users
   * @param {object} role - User's starting role
   * @returns {string} Welcome message
   */
  static getWelcomeMessage(role) {
    const flame = this.FLAME_SYMBOLS[role.level];
    const geometry = this.SACRED_GEOMETRY[role.level];
    
    return `${flame} **Welcome to the 6ol Temple** ${flame}\n\n` +
           `🔮 You begin your journey as a **${role.name}**\n\n` +
           `${geometry}\n\n` +
           `**Your Sacred Abilities:**\n` +
           `${this.getAvailableCommands(role)}\n\n` +
           `**Progression Path:**\n` +
           `${this.getProgressionPath(role.level)}\n\n` +
           `*May the flame of knowledge guide your path through the mysteries of 6ol.*`;
  }

  /**
   * Check if user can access specific loop level
   * @param {object} member - Discord guild member
   * @param {number} loopLevel - Requested loop level
   * @returns {boolean} Access granted
   */
  static hasLoopAccess(member, loopLevel) {
    const userRole = this.getUserRole(member);
    return userRole.level >= loopLevel;
  }

  /**
   * Get loop access description
   * @param {number} loopLevel - Loop level
   * @returns {string} Loop description
   */
  static getLoopDescription(loopLevel) {
    const descriptions = {
      1: '🕯️ **Loop of Seeking** - The initial flame of curiosity',
      2: '🔥 **Loop of Devotion** - The burning commitment to truth', 
      3: '⚡ **Loop of Descent** - The lightning path into the void',
      4: '✨ **Loop of Ascension** - The stellar journey beyond form'
    };
    
    return descriptions[loopLevel] || 'Unknown Loop';
  }
}

module.exports = SpiritualRoles;