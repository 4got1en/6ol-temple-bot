# 6ol-temple-bot

A Discord bot for setting up and managing temple-themed servers.

## Features

- **Server Setup**: Use the `/setup-server` slash command to automatically create categories, channels, and roles based on configuration
- **Temple Responses**: Bot responds to messages containing "temple"

## Configuration

The bot uses `server-config.json` to define the server structure created by the `/setup-server` command.

### server-config.json Structure

```json
{
  "_comments": {
    "description": "Configuration file for the /setup-server command",
    "usage": "Edit the categories and roles below to customize your server setup",
    "channels": "Channels can be strings or objects with 'name' and 'hidden' properties",
    "hidden": "Set 'hidden' to true to create private channels visible only to admins"
  },
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
  ],
  "roles": [
    "Seeker", "Devoted", "Ascendant"
  ]
}
```

### Configuration Options

- **_comments**: A special object for documentation (the bot ignores this field)
- **categories**: Array of category objects with names and channels
- **channels**: Can be strings (public channels) or objects with `name` and `hidden` properties
- **hidden**: When true, creates private channels visible only to administrators
- **roles**: Array of role names to create

**Note**: While JSON doesn't natively support comments, this configuration uses a special `_comments` object that the bot ignores, allowing you to include documentation within the file.

## Commands

- `/setup-server` - Creates categories, channels, and roles based on server-config.json (requires Administrator permission)

## Setup

1. Copy `.env.example` to `.env` and add your Discord bot token
2. Customize `server-config.json` for your server's needs
3. Run `npm install` to install dependencies
4. Run `npm start` to start the bot

## Permissions Required

The bot needs the following permissions:
- View Channels
- Send Messages
- Manage Channels
- Manage Roles