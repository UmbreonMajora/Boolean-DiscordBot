const config = require("../config.json");
const mysql = require("mysql");

var con = mysql.createConnection({
   host: config.MySQL.host,
   user: config.MySQL.user,
   password: config.MySQL.password,
   database: config.MySQL.database
});
 
con.connect(function(err) {
   //if (err) console.log(err);
});

function printRankStatus(target, message, targetMember) {
    var lvlMultiplier;
    /*WENN DER USER VON JEMAND ANDEREM DIE XP ABFRÄGT*/
    if(target !== message.author.id){
        con.query(`SELECT * FROM xp WHERE id = '${target}'`, function(err, results, username){
            if (results) {
                if (results.length > 0){
                    var data = JSON.parse(JSON.stringify(results));
                    var xp = (data[0].xp);
                    lvlMultiplier = Math.ceil(xp / 300);
                    var nextLevel = ((xp - (xp % 300)) + 300 * lvlMultiplier) - xp;
                    message.channel.send("Die Levelstatistiken von **"+ targetMember.user.username + "** sind: \n\n" + "> Level: " + lvlMultiplier + "\n> Erfahrung: " + xp + "/" + nextLevel);
                } else {
                    message.channel.send("Dieser User besitzt noch keine Exp.");
                }
            }  
        })   
    } else {
        /*WENN DER USER SEINE EIGENE XP ABFRÄGT*/
        con.query(`SELECT * FROM xp WHERE id = '${target}'`, function(err, results){   
            if (results) {
                if (results.length > 0){
                    var data = JSON.parse(JSON.stringify(results));
                    var xp = (data[0].xp)
                    console.log(data)
                    console.log(xp)
                    lvlMultiplier = Math.ceil(xp / 300);
                    var nextLevel = ((xp - (xp % 300)) + 300 * lvlMultiplier) - xp;
                    message.channel.send("**" + message.author.username + "**, deine Levelstatistiken sind: \n\n" + "> Level: " + lvlMultiplier + "\n> Erfahrung: " + xp + "/" + nextLevel)
                }
            }
            else {
                message.channel.send("Du besitzt inmoment keine Erfahrung, schreibe um Erfahrungs zu erhalten.").then(d_msg => {d_msg.delete(10000)})
            }
                 
        })
           
    }
    if(lvlMultiplier == 10){
        target.addrole("id", config.reward.first);
    } else if (lvlMultiplier == 20) {
        target.removerole("id", config.reward.first);
        target.addrole("id", config.reward.second);
    }
    
}

module.exports.run = async (bot, message, args) => {

    var target;
    var targetMember;
    if (args[0] == null){
        target = message.author.id;
    } 
    else {
        if(message.mentions.members.first()){
            var temp = message.mentions.members.first();
            var selectedId = temp.id;
            targetMember = temp;
            target = selectedId;
        }
        else{
            message.channel.send("Das ist kein User!");
            return;
        }
        
    }
    setTimeout(printRankStatus, 100, target, message, targetMember)
}

module.exports.help = {
    name:"rank"
}