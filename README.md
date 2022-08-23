# Discord Message Logger

A way to log all messages in a Discord Guild/Server, with a Discord Application or with a self bot.

# Requirements

- [Node.js v16 or higher](https://nodejs.org/en/)
- [Discord.JS v13](https://discord.js.org/#/)

# How to Install 

```
$ git clone https://github.com/ignshifts/MessageLogger.git
```

- Replace the config.json with your configuration

```
$ npm install 
```
**This will install all needed packages for the repo to work.**

### How to Install with a User Account

- [Discord.JS-Selfbot](https://github.com/aiko-chan-ai/discord.js-selfbot-v13)

- Replace `('discord.js')` with `('discord.js-selfbot-v13')`
- Remove `intents` from the Client Constructor.

**Example**:
```js
const { Client, MessageEmbed, WebhookClient } = require('discord.js-selfbot-v13');
const client = new Client();

client.on('ready', () => {
console.log(`${client.user.tag` has logged in.`)
});
```


# Plans
- [ ] [Detect Slash / Interaction Commands](https://discord.com/developers/docs/interactions/application-commands)
