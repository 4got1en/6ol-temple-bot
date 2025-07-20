// utils/encoders.js - Sacred encoding utilities for the 6ol system

class SacredEncoders {
  /**
   * Encode message using binary representation
   * @param {string} message - Message to encode
   * @returns {string} Binary encoded message
   */
  static toBinary(message) {
    return message.split('').map(char => 
      char.charCodeAt(0).toString(2).padStart(8, '0')
    ).join(' ');
  }

  /**
   * Decode binary message
   * @param {string} binaryMessage - Binary encoded message
   * @returns {string} Decoded message
   */
  static fromBinary(binaryMessage) {
    try {
      return binaryMessage.split(' ').map(binary => 
        String.fromCharCode(parseInt(binary, 2))
      ).join('');
    } catch (error) {
      return null;
    }
  }

  /**
   * Encode message using ROT13 cipher
   * @param {string} message - Message to encode
   * @returns {string} ROT13 encoded message
   */
  static toROT13(message) {
    return message.replace(/[A-Za-z]/g, char => {
      const start = char <= 'Z' ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
    });
  }

  /**
   * Decode ROT13 message (ROT13 is symmetric)
   * @param {string} message - ROT13 encoded message
   * @returns {string} Decoded message
   */
  static fromROT13(message) {
    return this.toROT13(message); // ROT13 is its own inverse
  }

  /**
   * Encode message using BASE64
   * @param {string} message - Message to encode
   * @returns {string} BASE64 encoded message
   */
  static toBase64(message) {
    return Buffer.from(message, 'utf8').toString('base64');
  }

  /**
   * Decode BASE64 message
   * @param {string} base64Message - BASE64 encoded message
   * @returns {string} Decoded message
   */
  static fromBase64(base64Message) {
    try {
      return Buffer.from(base64Message, 'base64').toString('utf8');
    } catch (error) {
      return null;
    }
  }

  /**
   * Auto-detect encoding type and decode
   * @param {string} message - Encoded message
   * @returns {object} {type: string, decoded: string|null}
   */
  static autoDetectAndDecode(message) {
    // Check if binary (only 0s, 1s, and spaces)
    if (/^[01\s]+$/.test(message)) {
      const decoded = this.fromBinary(message);
      if (decoded) return { type: 'binary', decoded };
    }

    // Check if BASE64 (ending with = or valid BASE64 chars)
    if (/^[A-Za-z0-9+/]*={0,2}$/.test(message) && message.length % 4 === 0) {
      const decoded = this.fromBase64(message);
      if (decoded && decoded !== message) return { type: 'base64', decoded };
    }

    // Try ROT13 (always succeeds, so check if it makes sense)
    const rot13Decoded = this.fromROT13(message);
    if (rot13Decoded !== message) {
      return { type: 'rot13', decoded: rot13Decoded };
    }

    return { type: 'unknown', decoded: null };
  }

  /**
   * Create mystical cipher using combination of methods
   * @param {string} message - Message to encode
   * @param {number} level - Cipher complexity level (1-3)
   * @returns {object} {encoded: string, scheme: string}
   */
  static createMysticalCipher(message, level = 1) {
    switch (level) {
      case 1:
        return { encoded: this.toROT13(message), scheme: 'rot13' };
      case 2:
        return { encoded: this.toBase64(message), scheme: 'base64' };
      case 3:
        const rot13First = this.toROT13(message);
        const base64Second = this.toBase64(rot13First);
        return { encoded: base64Second, scheme: 'rot13-base64' };
      default:
        return { encoded: this.toBinary(message), scheme: 'binary' };
    }
  }

  /**
   * Decode mystical cipher
   * @param {string} encoded - Encoded message
   * @param {string} scheme - Encoding scheme used
   * @returns {string|null} Decoded message
   */
  static decodeMysticalCipher(encoded, scheme) {
    switch (scheme) {
      case 'rot13':
        return this.fromROT13(encoded);
      case 'base64':
        return this.fromBase64(encoded);
      case 'rot13-base64':
        const base64Decoded = this.fromBase64(encoded);
        return base64Decoded ? this.fromROT13(base64Decoded) : null;
      case 'binary':
        return this.fromBinary(encoded);
      default:
        return null;
    }
  }
}

module.exports = SacredEncoders;