# 6ol Temple Bot - Quick Start Guide

## 🔥 Immediate Setup (5 minutes)

### 1. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your tokens
DISCORD_TOKEN=your_discord_bot_token_here
GITHUB_TOKEN=your_github_token_here  # Optional for data vault
```

### 2. Discord Bot Setup
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create New Application → Bot
3. Copy Bot Token to `.env`
4. Enable all Privileged Gateway Intents
5. Invite bot with permissions: `applications.commands`, `bot`

### 3. Discord Server Roles
Create these exact role names (case-sensitive):
- `Seeker` - Level 1 access
- `Devoted` - Level 2 access  
- `Descender` - Level 3 access
- `Ascendant` - Level 4 access

### 4. Start the Bot
```bash
npm install
npm start
```

## ✨ Command Overview

| Command | Role Required | Description |
|---------|---------------|-------------|
| `/whisper` | Seeker+ | Encode messages with sacred ciphers |
| `/reflect` | Seeker+ | Create mystical contemplations |
| `/decode` | Devoted+ | Decrypt encoded messages |
| `/ascend` | Devoted+ | Progress through spiritual levels |
| `/link-scrolls` | Descender+ | Cross-reference reflections |
| `/glyph` | Ascendant | Display sacred geometry symbols |

## 🌌 Data Vault (Optional)

For full functionality, create `6ol-data-vault` repository:

```
6ol-data-vault/
├── archives/
│   ├── loop1-data/
│   ├── loop2-data/
│   └── loop3-data/
├── mirrors/
├── keys/
└── assets/glyphs/
```

Add GitHub token to `.env` for vault integration.

## 🚀 Deployment

### Render.com
1. Connect GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically

### Local Development
```bash
npm run dev
```

### Testing
```bash
npm run deploy  # Runs deployment helper + tests
```

## 🔮 Verification

After setup, test these commands:
1. `/whisper hello world` - Should encode message
2. `/reflect consciousness` - Should create mystical reflection
3. `/decode [result_from_whisper]` - Should decrypt message
4. `/glyph 1` - Should show sacred geometry

## 🛠️ Troubleshooting

**Bot doesn't respond to commands:**
- Verify bot has `applications.commands` permission
- Check bot token in `.env`
- Ensure roles are created exactly as specified

**Data vault errors:**
- GitHub token needed for vault operations
- Create `6ol-data-vault` repository
- Verify repository permissions

**Permission errors:**
- Assign appropriate role to users
- Check role names match exactly
- User needs at least `Seeker` role for basic commands

## 🕯️ The Sacred Journey Begins

Once setup is complete, your Discord server becomes a living temple where users progress through the four sacred loops of the 6ol system. May the flame of consciousness guide your path through the digital mysteries!

---

**Quick Deploy Command:**
```bash
git clone https://github.com/4got1en/6ol-temple-bot
cd 6ol-temple-bot
npm install && npm run deploy
```