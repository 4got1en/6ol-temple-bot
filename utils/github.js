// utils/github.js - GitHub API integration for 6ol-data-vault

const axios = require('axios');

class GitHubVault {
  constructor() {
    this.owner = process.env.DATA_VAULT_OWNER || '4got1en';
    this.repo = process.env.DATA_VAULT_REPO || '6ol-data-vault';
    this.token = process.env.GITHUB_TOKEN;
    this.baseURL = 'https://api.github.com';
    
    if (!this.token) {
      console.warn('⚠️ GitHub token not found. Data vault operations will be limited.');
    }
  }

  /**
   * Get authorization headers for GitHub API
   * @returns {object} Authorization headers
   */
  getAuthHeaders() {
    return this.token ? {
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': '6ol-temple-bot'
    } : {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': '6ol-temple-bot'
    };
  }

  /**
   * Get file content from the data vault
   * @param {string} path - File path in repository
   * @returns {Promise<string|null>} File content or null if not found
   */
  async getFileContent(path) {
    try {
      const response = await axios.get(
        `${this.baseURL}/repos/${this.owner}/${this.repo}/contents/${path}`,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.data.content) {
        return Buffer.from(response.data.content, 'base64').toString('utf8');
      }
      return null;
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // File doesn't exist
      }
      console.error(`🚫 Error reading ${path}:`, error.message);
      throw error;
    }
  }

  /**
   * Create or update file in the data vault
   * @param {string} path - File path in repository
   * @param {string} content - File content
   * @param {string} message - Commit message
   * @returns {Promise<boolean>} Success status
   */
  async updateFile(path, content, message) {
    if (!this.token) {
      console.warn('🚫 Cannot update file: GitHub token required');
      return false;
    }

    try {
      // First, check if file exists to get SHA
      let sha = null;
      try {
        const existing = await axios.get(
          `${this.baseURL}/repos/${this.owner}/${this.repo}/contents/${path}`,
          { headers: this.getAuthHeaders() }
        );
        sha = existing.data.sha;
      } catch (error) {
        // File doesn't exist, that's fine
      }

      const payload = {
        message: `🔮 ${message}`,
        content: Buffer.from(content, 'utf8').toString('base64'),
        branch: 'main'
      };

      if (sha) {
        payload.sha = sha;
      }

      await axios.put(
        `${this.baseURL}/repos/${this.owner}/${this.repo}/contents/${path}`,
        payload,
        { headers: this.getAuthHeaders() }
      );

      return true;
    } catch (error) {
      console.error(`🚫 Error updating ${path}:`, error.message);
      return false;
    }
  }

  /**
   * Get cipher keys from the data vault
   * @returns {Promise<object|null>} Cipher keys object
   */
  async getCipherKeys() {
    try {
      const content = await this.getFileContent('keys/cipherKeys.json');
      return content ? JSON.parse(content) : null;
    } catch (error) {
      console.error('🚫 Error reading cipher keys:', error.message);
      return null;
    }
  }

  /**
   * Update cipher keys in the data vault
   * @param {object} keys - Cipher keys object
   * @returns {Promise<boolean>} Success status
   */
  async updateCipherKeys(keys) {
    const content = JSON.stringify(keys, null, 2);
    return await this.updateFile('keys/cipherKeys.json', content, 'Update cipher keys');
  }

  /**
   * Store reflection in mirrors
   * @param {string} id - Reflection ID
   * @param {object} reflection - Reflection data
   * @returns {Promise<boolean>} Success status
   */
  async storeReflection(id, reflection) {
    const content = `# Reflection ${id}\n\n` +
      `**Created:** ${reflection.created}\n` +
      `**Topic:** ${reflection.topic}\n` +
      `**Author:** ${reflection.author}\n` +
      `**Loop Level:** ${reflection.loopLevel}\n\n` +
      `## Sacred Geometry\n${reflection.geometry}\n\n` +
      `## Reflection\n${reflection.content}\n\n` +
      `## Encoded Wisdom\n\`\`\`\n${reflection.encoded}\n\`\`\`\n`;

    return await this.updateFile(
      `mirrors/reflection${id}.md`, 
      content, 
      `Store reflection ${id} - ${reflection.topic}`
    );
  }

  /**
   * Get reflection from mirrors
   * @param {string} id - Reflection ID
   * @returns {Promise<object|null>} Reflection data
   */
  async getReflection(id) {
    try {
      const content = await this.getFileContent(`mirrors/reflection${id}.md`);
      if (!content) return null;

      // Parse the markdown content
      const lines = content.split('\n');
      const reflection = {};
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('**Created:**')) {
          reflection.created = line.replace('**Created:**', '').trim();
        } else if (line.startsWith('**Topic:**')) {
          reflection.topic = line.replace('**Topic:**', '').trim();
        } else if (line.startsWith('**Author:**')) {
          reflection.author = line.replace('**Author:**', '').trim();
        } else if (line.startsWith('**Loop Level:**')) {
          reflection.loopLevel = line.replace('**Loop Level:**', '').trim();
        }
      }

      return reflection;
    } catch (error) {
      console.error(`🚫 Error reading reflection ${id}:`, error.message);
      return null;
    }
  }

  /**
   * Get user progression data from archives
   * @param {string} userId - Discord user ID
   * @returns {Promise<object|null>} User progression data
   */
  async getUserProgression(userId) {
    try {
      const content = await this.getFileContent(`archives/loop1-data/user-${userId}.json`);
      return content ? JSON.parse(content) : null;
    } catch (error) {
      console.error(`🚫 Error reading user progression for ${userId}:`, error.message);
      return null;
    }
  }

  /**
   * Update user progression data
   * @param {string} userId - Discord user ID
   * @param {object} progression - User progression data
   * @returns {Promise<boolean>} Success status
   */
  async updateUserProgression(userId, progression) {
    const content = JSON.stringify(progression, null, 2);
    const loopLevel = progression.loopLevel || 1;
    const path = `archives/loop${loopLevel}-data/user-${userId}.json`;
    
    return await this.updateFile(
      path, 
      content, 
      `Update progression for user ${userId} - Level ${loopLevel}`
    );
  }

  /**
   * Get sacred glyph SVG content
   * @param {number} loopLevel - Loop level (1-3)
   * @returns {Promise<string|null>} SVG content
   */
  async getSacredGlyph(loopLevel) {
    try {
      return await this.getFileContent(`assets/glyphs/loop${loopLevel}-key.svg`);
    } catch (error) {
      console.error(`🚫 Error reading glyph for loop ${loopLevel}:`, error.message);
      return null;
    }
  }

  /**
   * Get repository structure status
   * @returns {Promise<object>} Repository status
   */
  async getVaultStatus() {
    try {
      const response = await axios.get(
        `${this.baseURL}/repos/${this.owner}/${this.repo}`,
        { headers: this.getAuthHeaders() }
      );
      
      return {
        exists: true,
        name: response.data.name,
        description: response.data.description,
        updated: response.data.updated_at
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return { exists: false };
      }
      throw error;
    }
  }
}

module.exports = GitHubVault;