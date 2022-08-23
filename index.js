const Discord = require ('discord.js');
const { Client, Attachment, MessageEmbed, Message, Intents, WebhookClient } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
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
        // If message is a embed,
        
        let title = message.embeds[0].title? message.embeds[0].title : 'New Message';
        let description = message.embeds[0].description? message.embeds[0].description : 'No Description';
        let color = message.embeds[0].color? message.embeds[0].color : GREEN;
        const embed = new MessageEmbed()
            .setTitle(`${title}`)
            .setDescription(`${description}`)
            .setColor(color)
            .addFields(
                {
                    name: 'Author',
                    value: `${message.author.tag}`,
                },
                {
                    name: 'Channel',
                    value: `${message.channel.name}`,
                },
                {
                    name: 'Sent At',
                    value: `<t:${Math.round(message.createdAt.getTime() / 1000)}:F>`,
                }
            )
            .setFooter({
                text: 'This message was sent from a bot.',
            })
        hook.send({ embeds: [embed] });



    } else {
        // If message is not a embed,
        const embed = new MessageEmbed()
        .setTitle(`New Message`)
        .setDescription(`${message.content}`)
        .setThumbnail(message.author.displayAvatarURL())
        .addFields(
            {
                name: `Author`,
                value: `${message.author.tag}`
            },
            {
                name: `Channel`,
                value: `${message.channel.name}`
            },
            {
                name: `Sent At`,
                value: `<t:${Math.round(message.createdAt.getTime() / 1000)}:F>`
            }
        )
        
        .setColor('GREEN');
        
        hook.send({
            embeds: [embed]
        });  
    }
};
});


client.login(token);
