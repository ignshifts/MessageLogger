const { Client, Intents, WebhookClient, MessageEmbed } = require('discord.js');
const config = require('./config.json');

if (!config.token) return console.log('No token provided.');
if (!config.channels || config.channels.length < 1) return console.log('No channels provided.');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
    console.log(`${client.user.tag} has logged in!`);
});

client.on('messageCreate', async (message) => {
    // Find the appropriate channel configuration
    const channelConfig = config.channels.find(c => c.id === message.channel.id);
    
    if (!channelConfig || !channelConfig.webhook) {
        console.log(`No webhook configured for channel ${message.channel.id}`);
        return;
    }

    const hook = new WebhookClient({ url: channelConfig.webhook });

    // Function to send a message via webhook
    const sendWebhookMessage = (content, embeds = [], files = []) => {
        if (!content && embeds.length === 0 && files.length === 0) return; // Prevent sending empty messages
        hook.send({
            content: content || undefined,
            embeds,
            files,
            username: message.author.username,
            avatarURL: message.author.displayAvatarURL(),
        }).catch(error => console.error('Error sending webhook message:', error));
    };

    // Allow bot messages if they are interactions
    if (!message.interaction && message.author.bot) return;

    // Handle Slash Commands
    if (message.interaction) {
        const embed = new MessageEmbed()
            .setDescription(`This message is an interaction (slash command). \n Command Name: ${message.interaction.commandName} \n Invoked by: ${message.interaction.user.username}#${message.interaction.user.discriminator}`)
            .setColor('RED');
        sendWebhookMessage(message.content, [embed]);
    }
    // Handle Attachments (Images)
    else if (message.attachments.size > 0) {
        const attachments = message.attachments.map(attachment => attachment.url);
        sendWebhookMessage(message.content || null, [], attachments);
    }
    // Handle Embeds
    else if (message.embeds.length > 0) {
        const embedData = message.embeds[0];
        sendWebhookMessage(message.content || null, [embedData]);
    }
    // Handle Stickers & Emojis
    else if (message.stickers.size > 0 || message.content.match(/<:\w+:\d+>/)) {
        const stickers = message.stickers.map(sticker => `Sticker: ${sticker.name}`).join('\n');
        const emojis = message.content.match(/<:\w+:\d+>/g) ? message.content.match(/<:\w+:\d+>/g).map(emoji => `Emoji: ${emoji}`).join('\n') : '';
        sendWebhookMessage(`${message.content}\n${stickers}\n${emojis}`);
    }
    // Handle Plain Messages
    else {
        sendWebhookMessage(message.content);
    }
});

client.login(config.token);
