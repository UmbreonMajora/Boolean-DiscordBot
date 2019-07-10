const config = require("../config.json");

module.exports.run = async (client, message, args) => {
    let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let muterole = message.guild.roles.find("name","muted");
    if (message.member.hasPermission("MUTE_MEMBERS")) {
        message.delete();
        if (!target) {
            message.channel.send("The entered user clould'd found or there was no user entered.").then(d_msg => {
                d_msg.delete(5000)
            });
            return;
        } 
        if (target.id === message.author.id) {
            message.channel.send('No, don´t mute yourself.').then(d_msg => {
                d_msg.delete(5000)
            });
            return;
        }
        let ttime = args[1];
        let ttimeunit = args[1];
        if (!ttime) { 
            message.channel.send("Bitte gebe an wie lange du den User muten willst.").then(d_msg => {d_msg.delete(5000)});
            return;
        }
        if(target.roles.has(message.guild.roles.find('name','mute'))){
            message.channel.send("This user is already muted.").then(d_msg => {d_msg.delete(5000)});
            return;
        }
        let timeunitLenght = ttimeunit.length;
        let timeunit = ttimeunit.charAt(timeunitLenght - 1).toLowerCase();
        let time = ttime.substring(0, ttime.length - 1); //10s - 1 = 10

        if(args.slice(2).join(" ")){
            switch (timeunit){
                case 's':{
                    unmutetime = time * 1000;
                    target.addRole(muterole);
                    client.channels.get(config.log).send({embed:{
                        color: 0xff0000,
                        description: `**Mute:**\nModerator: ${message.author}\nUser: <@${target.id}>\nTime: ${ttime}\nReason: ${args.slice(2).join(" ")}`
                    }});
                    automaticUnmute(target, muterole, client);
                    break;
                }
                case 'm':{
                    unmutetime = time * 1000 * 60;
                    target.addRole(muterole);
                    client.channels.get(config.log).send({embed:{
                        color: 0xff0000,
                        description: `**Mute:**\nModerator: ${message.author}\nUser: <@${target.id}>\nTime: ${ttime}\nReason: ${args.slice(2).join(" ")}`
                    }});
                    automaticUnmute(target, muterole, client)
                    break;
                }
                case 'h':{
                    unmutetime = time * 1000 * 60 * 60;
                    target.addRole(muterole);
                    client.channels.get(config.log).send({embed:{
                        color: 0xff0000,
                        description: `**Mute:**\nModerator: ${message.author}\nUser: <@${target.id}>\nTime: ${ttime}\nReason: ${args.slice(2).join(" ")}`
                    }});
                    automaticUnmute(target, muterole, client)
                    break;
                }
                case 'd':{
                    unmutetime = time * 1000 * 60 * 60 * 24;
                    target.addRole(muterole);
                    client.channels.get(config.log).send({embed:{
                        color: 0xff0000,
                        description: `**Mute:**\nModerator: ${message.author}\nUser: <@${target.id}>\nTime: ${ttime}\nReason: ${args.slice(2).join(" ")}`
                    }});
                    automaticUnmute(target, muterole, client)
                    break;
                }
                case 't':{
                    if(time == "permanen"){
                        target.addRole(muterole);
                        client.channels.get(config.log).send({embed:{
                            color: 0xff0000,
                            description: `**Mute:**\nModerator: ${message.author}\nUser: <@${target.id}>\nTime: Permanent.\nReason: ${args.slice(2).join(" ")}`
                        }});
                    }
                    break;
                }
            }
        } else {
            switch (timeunit){
                case 's':{
                    unmutetime = time * 1000;
                    target.addRole(muterole);
                    client.channels.get(config.log).send({embed:{
                        color: 0xff0000,
                        description: `**Mute:**\nModerator: ${message.author}\nUser: <@${target.id}>\nTime: ${ttime}`
                    }});
                    automaticUnmute(target, muterole, client)
                    break;
                }
                case 'm':{
                    unmutetime = time * 1000 * 60;
                    target.addRole(muterole);
                    client.channels.get(config.log).send({embed:{
                        color: 0xff0000,
                        description: `**Mute:**\nModerator: ${message.author}\nUser: <@${target.id}>\nTime: ${ttime}`
                    }});
                    automaticUnmute(target, muterole, client)
                    break;
                }
                case 'h':{
                    unmutetime = time * 1000 * 60 * 60;
                    target.addRole(muterole);
                    client.channels.get(config.log).send({embed:{
                        color: 0xff0000,
                        description: `**Mute:**\nModerator: ${message.author}\nUser: <@${target.id}>\nTime: ${ttime}`
                    }});
                    automaticUnmute(target, muterole, client)
                    break;
                }
                case 'd':{
                    unmutetime = time * 1000 * 60 * 60 * 24;
                    muteWithoutReason(target, client, ttime);
                    automaticUnmute(target, muterole, client, message);
                    break;
                }
                case 't':{
                    if(time == "permanen"){
                        target.addRole(muterole);
                        client.channels.get(config.log).send({embed:{
                            color: 0xff0000,
                            description: `**Mute:**\nModerator: ${message.author}\nUser: <@${target.id}>\nTime: Permanent.\nReason: ${args.slice(2).join(" ")}`
                        }});
                    }
                    break;
                }
            }
        }
    } 
}


module.exports.help = {
    name:"mute"
}

function muteWithoutReason(target, client, ttime, message){
    target.addRole(message.guild.roles.find('name', config.mute.role));
    if(message.guild.channels.find('name','log') != null){
        const noReasonMuteEmbed = new Discord.RichEmbed()
	            .setColor('#0099ff')
	            .setAuthor('Command: Mute')
                .addField("Moderator:", message.author)
                .addField("Target:", target.user.username)
                .addField("Mutelength:", ttime)
	            .setTimestamp()
	            .setFooter(client.user.username);
            message.guild.channels.find("name", "log").send(noReasonMuteEmbed);
    }
}




function automaticUnmute(target, muterole, client) {
    setTimeout(function () {
        target.removeRole(muterole);
        client.channels.get(config.log).send({
        embed: {
            color: 0x00ff00,
            description: `**Automatic Unmute:**\nUser: <@${target.id}>`
        }
        });
    }, unmutetime);
}
