const { Client, WebhookClient, MessageEmbed, } = require('discord.js-selfbot-v13');
const client = new Client();
const config = require('./config.json');

if(!config.token) return console.log('No token provided.');
if(!config.webhook) return console.log('No webhook provided.');
if(config.channels.length < 1) return console.log('No channels provided.');

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in!`)
});

client.on('messageCreate', async (message) => {
if(message.author.bot === client.user.id) return;

const hook = new WebhookClient({ url: config.webhook });
// hook is a webhook, the messages from guildM will be sent to this webhook.

if(message.author.id === hook.id) return;

if(config.channels.includes(message.channel.id)) {

    // Images - Attachments
    if(message.attachments.size > 0) {
        const attachment = message.attachments.first();
          hook.send({
            files: [attachment.url],
            username: message.author.username,
            avatarURL: message.author.displayAvatarURL(),
          });
    }
    
    // Interactions (Slashies) that return embeds
    else if(message.embeds.length > 0 && message.interaction != null) {
        // This will not work as of now, null is being thrown for some reason. API limitation possibility.
            hook.send({
                username: message.author.username,
                embeds: [message.embeds[0], new MessageEmbed().setDescription(`This message is an interaction (slash command). \n Command Name: ${message.interaction.commandName} \n Invoked by: ${message.interaction.user.username}#${message.interaction.user.discriminator}`).setColor('RED')],
                avatarURL: message.author.displayAvatarURL(),
                embeds: message.embeds,
            });
        
            // Embeds
    } else if (message.embeds.length > 0) {
        let embedData = message.embeds[0];
        hook.send({ 
        embeds: [embedData],
        username: message.author.username,
        avatarURL: message.author.avatarURL(), 
    });

    // Interactions (Slashies)
    } else if (message.interaction != null) {
        hook.send({ 
        content: message.content,
        embeds: [new MessageEmbed().setDescription(`This message is an interaction (slash command). \n Command Name: ${message.interaction.commandName} \n Invoked by: ${message.interaction.user.username}#${message.interaction.user.discriminator}`).setColor('RED')],
        username: message.author.username,
        avatarURL: message.author.avatarURL(), 
    });
       
    } else {

        // Raw Messages
        let content = message.content
        hook.send({ 
        content: content,
        username: message.author.username,
        avatarURL: message.author.avatarURL(),    
        });
    }
}
});

client.login(config.token);
