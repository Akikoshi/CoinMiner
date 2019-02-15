const Discord = require('discord.js');
const FileSystem = require('fs');
const Moment = require('moment');
const Config = JSON.parse(FileSystem.readFileSync('config.json', 'utf8'));
var client = new Discord.Client({disableEveryone: true});
var embed = new Discord.RichEmbed();

let userData = JSON.parse(FileSystem.readFileSync('Storage/userData.json', 'utf8'));

client.on('ready', async () => {
    
    console.log(`${client.user.username} logged in!`);
    console.log('Economy System online...');
});

client.on('message', async message => {
    var sender = message.author;
    var msg = message.content.toLowerCase();
    var prefix = Config.prefix;

    if(sender.id === client.user.id) return;

    if(!userData[sender.id + message.guild.id]){
        userData[sender.id + message.guild.id] = {};
    }

    if(!userData[sender.id + message.guild.id].money){
        userData[sender.id + message.guild.id].money = 500;
    }

    if(!userData[sender.id + message.guild.id].lastDaily){
        userData[sender.id + message.guild.id].lastDaily = 'Not Collected';
    }
    
    FileSystem.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
        if(err){
            console.error(err);
        }
    });

    if(msg === `${prefix}help`){
        let icon = client.user.displayAvatarURL;
        let richEmbed = embed
        .setDescription('Economy Information')
        .setAuthor(`${client.user.username}`)
        .setThumbnail(icon)
        .setColor('#e8df63')
        .addField('cw$serverinfo', 'Zeigt Informationen des Servers an.')
        .addField('cw$balance', 'Gibt den Wert des Accounts wieder.')
        .addField('cw$daily', 'Fügt eurem Account ein tägliches Geschenk hinzu.');

        return message.channel.send(richEmbed)
    }

    if(msg === `${prefix}serverinfo`){
        let icon = client.user.displayAvatarURL;
        let richEmbed = embed
        .setDescription('Server Information')
        .setThumbnail(icon)
        .setColor('#e8df63')
        .addField('Server Name', message.guild.name)
        .addField('Erstellt am', message.guild.createdAt)
        .addField('Gejoined am', message.member.joinedAt)
        .addField('Mitglieder gesamt', message.guild.memberCount - message.guild.roles.find(role => role.name === "Bot").members.map(m => m.user.tag));

        return message.channel.send(richEmbed)
    }

    if(msg === `${prefix}ping`){
        message.channel.send('Pong!')
    }

    if(msg === `${prefix}daily`){
        if(userData[sender.id + message.guild.id].lastDaily !== Moment().format('L')){
            userData[sender.id + message.guild.id].lastDaily = Moment().format('L');
            userData[sender.id + message.guild.id].money += 50;
            message.channel.send({'embed': {
                title: 'Tägliche Belohnung',
                description: 'Deinem Account wurden 50 coins gutgeschrieben!'
            }})
        }else{
            message.channel.send({'embed': {
                title: 'Tägliche Belohnung',
                description: `Du hast deine Belohnung heute schon erhalten! Du kannst deine nächste Belohnung in ${Moment().endOf('day').fromNow()} erhalten.`
            }})
        }
    }
    
    FileSystem.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
        if(err){
            console.error(err);
        }
    });

    if(msg === `${prefix}money` || msg == `${prefix}balance`){
        message.channel.send({'embed': {
            title: 'Bank',
            color: 0x25D366,
            fields: [{
                name: 'Benutzer',
                value: message.author.username,
                inline: true
            },{
                name: 'Balance',
                value: userData[sender.id + message.guild.id].money,
                inline: true
            }]
        }});
    }
});

client.login(Config.token);
