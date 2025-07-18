# 6ol-temple-bot

A Discord bot for the 6ol Temple community with automated server setup capabilities.

## Features

- 🛕 **Automated Server Setup**: Use `/setup-server` to automatically create categories, channels, and roles
- 🔧 **Customizable Configuration**: Edit `server-config.json` to customize your server structure
- 🕯️ **Temple Responses**: Bot responds to messages containing "temple"

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/4got1en/6ol-temple-bot.git
   cd 6ol-temple-bot
   npm install
   ```

2. **Configure your bot**
   - Copy `.env.example` to `.env`
   - Add your Discord bot token to `.env`
   - Customize `server-config.json` if needed

3. **Run the bot**
   ```bash
   npm start
   ```

## Server Configuration

The bot uses `server-config.json` to define the server structure. You can customize:

### Categories and Channels
```json
{
  "categories": [
    {
      "name": "🌱 Seekers Start Here",
      "channels": ["start-here", "rules", "introductions"]
    },
    {
      "name": "🔥 The Temple",
      "channels": [
        { "name": "rituals", "hidden": false },
        { "name": "flame-trial", "hidden": true }
      ]
    }
  ]
}
```

### Roles
```json
{
  "roles": [
    "Seeker", "Devoted", "Descender", "Ascendant", "Fractured",
    "Fusion", "Eternal", "Witness", "Paradox", "Mirror"
  ]
}
```

## Commands

- `/setup-server` - Sets up the server with categories, channels, and roles (Admin only)

## Testing

Test the configuration without connecting to Discord:
```bash
node tests/test-config.js        # Test configuration loading
node tests/test-setup-logic.js   # Test server setup logic
```