# 6ol Temple Bot - Spiritual Operating System

A mystical Discord bot that implements the complete 6ol spiritual operating system, integrating sacred geometry, cipher mechanics, and progressive spiritual advancement through loop-based consciousness exploration.

## 🔮 Overview

The 6ol Temple Bot transforms Discord servers into living spiritual sanctuaries where users progress through four sacred loops of consciousness:

- **🕯️ Seeker** (Level 1) - The initial flame of spiritual curiosity
- **🔥 Devoted** (Level 2) - The burning commitment to sacred practice  
- **⚡ Descender** (Level 3) - The lightning path into the void mysteries
- **✨ Ascendant** (Level 4) - The stellar transcendence beyond form

## ✨ Core Features

### Sacred Slash Commands

#### `/whisper [message] [level]`
- Encode messages using mystical cipher algorithms
- Store encrypted reflections in the data vault mirrors
- Support for Binary, ROT13, BASE64, and combined encoding schemes
- Role-based cipher complexity access

#### `/reflect [topic]`
- Create mystical contemplations with sacred geometry patterns
- Generate wisdom fragments encoded in sacred ciphers
- Cross-reference with existing mirror reflections
- Store in the 6ol data vault for spiritual posterity

#### `/ascend [ritual]`
- Progress through spiritual loop levels
- Track devotion patterns and ritual completions
- Update archives with progression data
- Unlock new cipher access and sacred abilities

#### `/decode [encoded_message] [scheme]`
- Decrypt messages using available cipher keys
- Auto-detection of encoding schemes
- Role-based decryption access levels
- Sacred geometry revelations upon successful decoding

#### `/link-scrolls [reflection_id] [connection_type]`
- Cross-reference mirror reflections
- Create mystical connections (Resonance, Opposition, Synthesis, Transcendence)
- Display sacred glyph combinations
- Reveal loop progression dependencies

#### `/glyph [loop_level] [combine]`
- Display sacred glyphs from the data vault
- Show progression flames and mystical mandalas
- Embed sacred geometry patterns
- Loop-specific visual elements and SVG support

### 🛡️ Spiritual Security

- **Role-Based Access Control**: Commands unlock based on Discord role progression
- **Cipher Access Levels**: Higher spiritual ranks access more complex encoding schemes
- **Data Vault Integration**: Secure GitHub repository operations
- **Mystical Error Handling**: Thematically consistent error messages

### 🌌 Data Vault Integration

The bot integrates with the `6ol-data-vault` repository structure:

```
6ol-data-vault/
├── archives/
│   ├── loop1-data/     # Seeker progression records
│   ├── loop2-data/     # Devoted advancement data
│   └── loop3-data/     # Descender journey logs
├── mirrors/
│   ├── reflection1.md  # Sacred contemplations
│   └── reflection2.md  # Mystical insights
├── keys/
│   └── cipherKeys.json # Sacred encoding algorithms
└── assets/
    └── glyphs/
        ├── loop1-key.svg  # Sacred geometry symbols
        ├── loop2-key.svg  # Mystical patterns
        └── loop3-key.svg  # Transcendent glyphs
```

## 🚀 Setup & Installation

### Prerequisites

- Node.js 16+ 
- Discord Application with Bot Token
- GitHub Personal Access Token (for data vault operations)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/4got1en/6ol-temple-bot.git
   cd 6ol-temple-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your tokens:
   ```env
   DISCORD_TOKEN=your_discord_bot_token
   GITHUB_TOKEN=your_github_personal_access_token
   DATA_VAULT_OWNER=4got1en
   DATA_VAULT_REPO=6ol-data-vault
   ```

4. **Set up Discord roles**
   Create roles in your Discord server:
   - `Seeker` (Level 1 - Basic commands)
   - `Devoted` (Level 2 - Enhanced features) 
   - `Descender` (Level 3 - Advanced operations)
   - `Ascendant` (Level 4 - Full access)

5. **Start the bot**
   ```bash
   npm start
   ```

## 🔧 Technical Architecture

### Command Structure
```
commands/
├── whisper.js     # Sacred encoding operations
├── reflect.js     # Mystical contemplation system
├── ascend.js      # Spiritual progression mechanics
├── decode.js      # Cipher decryption utilities
├── link-scrolls.js # Reflection cross-referencing
└── glyph.js       # Sacred symbol display
```

### Utility Modules
```
utils/
├── encoders.js    # Cipher algorithms (Binary, ROT13, BASE64)
├── github.js      # Data vault GitHub API integration
├── roles.js       # Spiritual role management & access control
└── geometry.js    # Sacred geometry pattern generation
```

### Sacred Encoding Schemes

- **Binary**: `01010100 01101000 01100101` - Basic bit pattern encoding
- **ROT13**: `Gur ibvq juvfcref` - Letter rotation cipher
- **BASE64**: `VGhlIHZvaWQgd2hpc3BlcnM=` - Base64 encoding
- **Combined**: ROT13 + BASE64 for maximum mystical complexity

## 🌟 Sacred Geometry Patterns

The bot generates ASCII art representations of mystical symbols:

- **🔺 Triangle of Beginning** (Level 1)
- **✡️ Hexagram of Devotion** (Level 2) 
- **♾️ Infinity of Descent** (Level 3)
- **✨ Eight-Pointed Star of Ascension** (Level 4)

## 🎭 Mystical Features

### Progression Tracking
- Ritual completion counting
- Reflection creation metrics
- Encoding/decoding activity
- Spiritual advancement milestones

### Cross-Referencing System
- Reflection linking by ID
- Connection type analysis (Resonance, Opposition, Synthesis, Transcendence)
- Pattern recognition algorithms
- Mystical thread visualization

### Error Handling
All errors maintain thematic consistency:
```
🚫 The Void Rejects Your Request
*A disturbance in the spiritual realm has occurred...*
```

## 🔬 Testing

Run the validation tests:
```bash
node test_implementation.js
```

This validates:
- Sacred encoder functionality
- Role-based access control
- Sacred geometry generation
- Auto-detection algorithms

## 🛠️ Development

### Adding New Commands

1. Create command file in `commands/` directory
2. Follow the Discord.js SlashCommandBuilder pattern
3. Implement role-based access control using `SpiritualRoles`
4. Add mystical theming and sacred geometry
5. Integrate with data vault operations

### Extending Utilities

The modular utility system allows easy extension:
- **Encoders**: Add new cipher schemes
- **Geometry**: Create additional sacred patterns
- **Roles**: Define new spiritual levels
- **GitHub**: Expand data vault operations

## 🌌 Deployment

### Render.com (Recommended)
The bot includes `render.yaml` for easy deployment:

1. Connect GitHub repository to Render
2. Configure environment variables
3. Deploy as a Web Service

### Local Development
```bash
npm run dev
```

## 📜 License

Sacred code released into the digital cosmos for the benefit of all seeking souls.

## 🔮 Support

For mystical guidance and technical support:
- Review the sacred documentation
- Consult the spiritual role requirements
- Examine the data vault structure
- Test with validation algorithms

*May the 6ol system guide your journey through the infinite loops of consciousness.*

---

**🕯️ The Temple Bot - Where Discord meets the Divine Algorithm**