// utils/geometry.js - Sacred geometry patterns for mystical reflections

class SacredGeometry {
  /**
   * Generate triangular flame pattern
   * @param {number} size - Size of the triangle (3-7)
   * @returns {string} ASCII triangle pattern
   */
  static generateTriangle(size = 5) {
    let triangle = '';
    for (let i = 0; i < size; i++) {
      const spaces = ' '.repeat(size - i - 1);
      const flames = '🔥'.repeat(i * 2 + 1);
      triangle += spaces + flames + '\n';
    }
    return triangle;
  }

  /**
   * Generate hexagram (six-pointed star) pattern
   * @returns {string} ASCII hexagram pattern
   */
  static generateHexagram() {
    return `    ✡️\n` +
           `   /|\\\n` +
           `  / | \\\n` +
           ` /  |  \\\n` +
           `/___|___\\\n` +
           `\\   |   /\n` +
           ` \\  |  /\n` +
           `  \\ | /\n` +
           `   \\|/\n` +
           `    ✡️`;
  }

  /**
   * Generate infinity symbol pattern
   * @returns {string} ASCII infinity pattern
   */
  static generateInfinity() {
    return `  ∞ ～～ ∞\n` +
           ` /       \\\n` +
           `(    ♾️    )\n` +
           ` \\       /\n` +
           `  ∞ ～～ ∞`;
  }

  /**
   * Generate eight-pointed star pattern
   * @returns {string} ASCII eight-pointed star pattern
   */
  static generateEightPointedStar() {
    return `    ✨\n` +
           `   /|\\\n` +
           `  / | \\\n` +
           ` *--+--*\n` +
           `  \\ | /\n` +
           `   \\|/\n` +
           `    ✨`;
  }

  /**
   * Generate sacred circle with mystical symbols
   * @returns {string} ASCII circle pattern
   */
  static generateSacredCircle() {
    return `   🌙 ⭐ 🌙\n` +
           ` ⭐   🔮   ⭐\n` +
           `🌙   ○   🌙\n` +
           ` ⭐   🔮   ⭐\n` +
           `   🌙 ⭐ 🌙`;
  }

  /**
   * Generate void portal pattern
   * @returns {string} ASCII void portal pattern
   */
  static generateVoidPortal() {
    return `🌌 ～～～～～ 🌌\n` +
           `～  ⚫ ⚫ ⚫  ～\n` +
           `～ ⚫ 🕳️ ⚫ ～\n` +
           `～  ⚫ ⚫ ⚫  ～\n` +
           `🌌 ～～～～～ 🌌`;
  }

  /**
   * Get geometry pattern based on loop level
   * @param {number} loopLevel - Loop level (1-4)
   * @returns {string} Sacred geometry pattern
   */
  static getLoopGeometry(loopLevel) {
    switch (loopLevel) {
      case 1:
        return this.generateTriangle();
      case 2:
        return this.generateHexagram();
      case 3:
        return this.generateInfinity();
      case 4:
        return this.generateEightPointedStar();
      default:
        return this.generateSacredCircle();
    }
  }

  /**
   * Get random mystical pattern
   * @returns {string} Random sacred geometry pattern
   */
  static getRandomPattern() {
    const patterns = [
      this.generateTriangle,
      this.generateHexagram,
      this.generateInfinity,
      this.generateEightPointedStar,
      this.generateSacredCircle,
      this.generateVoidPortal
    ];
    
    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
    return randomPattern.call(this);
  }

  /**
   * Create mystical border around text
   * @param {string} text - Text to border
   * @param {string} symbol - Border symbol
   * @returns {string} Bordered text
   */
  static createMysticalBorder(text, symbol = '✨') {
    const lines = text.split('\n');
    const maxLength = Math.max(...lines.map(line => line.length));
    const border = symbol.repeat(maxLength + 4);
    
    let bordered = border + '\n';
    lines.forEach(line => {
      bordered += `${symbol} ${line.padEnd(maxLength)} ${symbol}\n`;
    });
    bordered += border;
    
    return bordered;
  }

  /**
   * Generate meditation mandala
   * @param {number} complexity - Complexity level (1-3)
   * @returns {string} ASCII mandala pattern
   */
  static generateMandala(complexity = 2) {
    switch (complexity) {
      case 1:
        return `  🔮\n` +
               ` ╱ ╲\n` +
               `🔮───🔮\n` +
               ` ╲ ╱\n` +
               `  🔮`;
      case 2:
        return `   ⭐\n` +
               `  ╱|╲\n` +
               ` 🔮─┼─🔮\n` +
               `  ╲|╱\n` +
               `   ⭐`;
      case 3:
        return `    ✨\n` +
               `   ╱|╲\n` +
               `  🌙─┼─🌙\n` +
               ` ╱  |  ╲\n` +
               `⭐───┼───⭐\n` +
               ` ╲  |  ╱\n` +
               `  🌙─┼─🌙\n` +
               `   ╲|╱\n` +
               `    ✨`;
      default:
        return this.generateSacredCircle();
    }
  }

  /**
   * Get geometry description for loop level
   * @param {number} loopLevel - Loop level
   * @returns {string} Geometry description
   */
  static getGeometryDescription(loopLevel) {
    const descriptions = {
      1: '🔺 **Triangle of Beginning** - The foundational flame that sparks the spiritual journey',
      2: '✡️ **Hexagram of Devotion** - The six-pointed star representing perfect balance and divine union',
      3: '♾️ **Infinity of Descent** - The eternal loop diving deep into the mysteries of the void',
      4: '✨ **Eight-Pointed Star of Ascension** - The stellar compass guiding souls beyond material existence'
    };
    
    return descriptions[loopLevel] || 'Unknown Sacred Pattern';
  }

  /**
   * Create mystical encoding visualization
   * @param {string} encoded - Encoded message
   * @param {string} scheme - Encoding scheme
   * @returns {string} Visual representation
   */
  static visualizeEncoding(encoded, scheme) {
    const symbols = {
      'binary': '⚫⚪',
      'rot13': '🔄🔤',
      'base64': '📜🔢',
      'rot13-base64': '🌀📜'
    };
    
    const symbol = symbols[scheme] || '🔮';
    const border = '═'.repeat(Math.min(encoded.length + 4, 50));
    
    return `╔${border}╗\n` +
           `║ ${symbol} SACRED CIPHER ${symbol} ║\n` +
           `╠${border}╣\n` +
           `║ ${encoded.substring(0, 46).padEnd(46)} ║\n` +
           `╚${border}╝`;
  }
}

module.exports = SacredGeometry;