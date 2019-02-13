const Discord = require('discord.js');
const FileSystem = require('fs');
const Moment = require('moment');
const Config = JSON.parse(FileSystem.readFileSync('config.json', 'utf8'));
var client = new Discord.Client();

let userData = JSON.parse(FileSystem.readFileSync('Storage/userData.json', 'utf8'));

client.on('message', message => {
    var sender = message.author;
    var msg = message.content.toLowerCase();
    var prefix = Config.prefix;

    if(sender.id === client.user.id) return;

    if(!userData[sender.id + message.guild.id]){
        userData[sender.id + message.guild.id] = {};
    }

    if(!userData[sender.id + message.guild.id].money){
        userData[sender.id + message.guild.id].money = 1000;
    }

    if(!userData[sender.id + message.guild.id].lastDaily){
        userData[sender.id + message.guild.id].lastDaily = 'Not Collected';
    }
    
    FileSystem.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
        if(err){
            console.error(err);
        }
    });

    if(msg === `${prefix}ping`){
        message.channel.send('Pong!')
    }

    if(msg === `${prefix}daily`){
        if(userData[sender.id + message.guild.id].lastDaily !== Moment().format('L')){
            userData[sender.id + message.guild.id].lastDaily = Moment().format('L');
            userData[sender.id + message.guild.id].money += 500;
            message.channel.send({'embed': {
                title: 'Tägliche Belohnung',
                description: 'Deinem Account wurden 500 coins gutgeschrieben!'
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

client.on('ready', () => {
    console.log('Economy System online...');
});

client.login(Config.token);
