const config = require("../config.json");

module.exports.run = async (client, message, args) => {
    if (message.member.hasPermission("MUTE_MEMBERS")){
        message.delete();
        let target = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!target)
            message.channel.send("Der angegebene User wurde nicht gefunden oder es wurde keiner angegeben.").then(d_msg => { 
                d_msg.delete(5000); 
            });
        if (!target.roles.find("name","muted"))
            message.channel.send("Dieser User ist nicht gemutet!").then(d_msg => { 
                d_msg.delete(5000); 
            });
        if(args.slice(1).join(" ")){
            target.removeRole(target.roles.find("name","muted"));
            client.channels.get(config.log).send({embed:{
                color: 0x00ff00,
                description: `**Unmute**\nModerator: ${message.author}\nUser: <@${target.id}>\nReason: ${args.slice(1).join(" ")}`
            }});
        } else {
            target.removeRole(target.roles.find("name","muted"));
            client.channels.get(config.log).send({embed:{
                color: 0x00ff00,
                description: `**Unmute**\nModerator: ${message.author}\nUser: <@${target.id}>`
            }});
        }
    }
}

module.exports.help = {
    name:"unmute"
}