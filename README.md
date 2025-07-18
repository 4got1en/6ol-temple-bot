# 6ol-temple-bot

A Discord bot for managing The Temple community server.

## Features

- **Message Responses**: Responds to messages containing "temple"
- **Server Setup**: `/setup-server` slash command for automated server configuration

## Slash Commands

### `/setup-server`
Sets up the Temple server with default categories and channels.

**Requirements:**
- Administrator permissions
- Bot needs: Manage Channels, Manage Roles, View Channels permissions

**Creates:**
- **Categories:**
  - 🔥 The Temple
  - 🌱 Seekers Start Here
- **Channels:**
  - `rules` (under The Temple)
  - `whispers` (under The Temple)
  - `rituals` (under Seekers Start Here)
  - `reflections` (under Seekers Start Here)

## Setup

1. Create a Discord application and bot at https://discord.com/developers/applications
2. Copy `.env.example` to `.env` and add your bot token
3. Install dependencies: `npm install`
4. Run the bot: `npm start`

## Permissions

The bot requires these permissions:
- View Channels
- Send Messages
- Manage Channels (for setup command)
- Manage Roles (for setup command)