# 🕯️ 6ol-temple-bot

A Discord bot designed for the 6ol Temple community, providing spiritual guidance, reflection tools, and temple management features.

## 🛕 Overview

The 6ol Temple Bot serves as a digital guardian and guide for the temple community, offering:

- **Spiritual Interactions**: Responds to temple-related messages with wisdom and guidance
- **Slash Commands**: Modern Discord slash commands for temple activities
- **Automated Workflows**: GitHub Actions for scheduled temple maintenance
- **Reflection System**: Tools for spiritual reflection and growth
- **Community Features**: Utilities for linking and managing temple scrolls

## 📁 Project Structure

```
6ol-temple-bot/
├── slash/                    # Slash command implementations
│   ├── whisper.js           # Spiritual whisper commands
│   ├── reflect.js           # Reflection creation tools
│   ├── ascend.js            # Ascension tracking
│   └── link-scrolls.js      # Scroll linking utilities
├── utils/                    # Utility modules
│   ├── github.js            # GitHub integration helpers
│   └── discord.js           # Discord utility functions
├── .github/
│   └── workflows/           # Automated temple maintenance
│       ├── whisper-action.yml      # Scheduled whisper posting
│       ├── sync-reflections.yml    # Reflection synchronization
│       └── daily-temple-update.yml # Daily temple updates
├── bot.js                   # Main bot entry point
├── package.json            # Project dependencies
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- Discord Bot Token
- Discord Server with appropriate permissions

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/4got1en/6ol-temple-bot.git
   cd 6ol-temple-bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Discord bot token
   ```

4. Start the bot:
   ```bash
   npm start
   ```

## 🔧 Configuration

Copy `.env.example` to `.env` and configure the following variables:

- `DISCORD_TOKEN`: Your Discord bot token from the Discord Developer Portal
- Additional environment variables for specific features (see `.env.example`)

## 🌸 Features

### Slash Commands

- `/whisper` - Send spiritual whispers to the temple
- `/reflect` - Create temple reflections for spiritual growth  
- `/ascend` - Begin ascension through temple levels
- `/link-scrolls` - Connect and link temple scrolls

### Ambient Responses

The bot responds to temple-related keywords with appropriate spiritual guidance and creates an ambient temple atmosphere in your Discord server.

### Automated Workflows

- **Whisper Action**: Sends periodic spiritual whispers to designated channels
- **Reflection Sync**: Synchronizes reflections with external systems
- **Daily Updates**: Maintains temple activities and community engagement

## 🤝 Contributing

Contributions to the temple are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

Created with spiritual intention for the 6ol Temple community. May this bot serve as a bridge between the digital and spiritual realms.

---

*"In the silence of code, wisdom speaks."* - Temple Proverb