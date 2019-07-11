const config = require("../config.json");
const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    if (message.member.hasPermission("ADMINISTRATOR")) {
        message.delete();
        if (isNaN(args[0]))
            message.channel.send('Please enter a number between two and 100.');
        if (args[0] > 100){
            message.channel.send("You can only purge 100 message at once.");
        }
        
        try{
            message.channel.fetchMessages()
            .then(function(list){
                message.channel.bulkDelete(list);
            }, function(err){
                message.channel.send("This message should not be here.")
            });
        }catch(err){
            message.channel.send("This message should not be here.")
        }

        if(message.guild.channels.find("name", "log") != null) {
            const clearEmbed = new Discord.RichEmbed()
	            .setColor('#0099ff')
	            .setAuthor('Command executed: Clear')
                .addField("Moderator:", message.author)
                .addField("Channel:", message.channel.name)
                .addField("Amount:", args[0])
	            .setTimestamp()
	            .setFooter(client.user.username);
            message.guild.channels.find("name", "log").send(clearEmbed);
        } 
    }
}

module.exports.help = {
    name:"clear"
}