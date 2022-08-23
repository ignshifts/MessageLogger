const Discord = require ('discord.js');
// const { Client, WebhookClient, MessageEmbed, } = require('discord.js-selfbot-v13');
const { Client, Attachment, MessageEmbed, Message, Intents, WebhookClient } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
const config = require('./config.json');
const { token, guildID, webhook } = config;


client.on('ready', () => {
    console.log(`${client.user.tag} has logged in!`)
});

client.on('messageCreate', async (message) => {
if(message.author.bot === client.user.id) return;

const guildM = client.guilds.cache.get(config['guildID:']);
// guildM is where the application will retrieve the messages from.

const hook = new WebhookClient({ url: webhook });
// hook is a webhook in guildL, the messages from channelM will be sent to this webhook.

if(message.guild == guildM) {
    if(message.embeds.length > 0) {
        let embedData = message.embeds[0];
        hook.send({ 
        embeds: [embedData],
        username: message.author.username,
        avatarURL: message.author.avatarURL(), 
    });
    
    } else {
        let content = message.content
        hook.send({ 
        content: content,
        username: message.author.username,
        avatarURL: message.author.avatarURL(),    
        });
    }

}

});



client.login(token);