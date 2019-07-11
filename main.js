const Discord = require('discord.js');
const ms = require('ms');
const fs = require("fs");
const mysql = require('mysql');
const config = require("./config.json");
const Rcon = require("rcon");
const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldown = new Set();

/*MySQL Connection*/
var con = mysql.createConnection({
    host: config.MySQL.host,
    user: config.MySQL.user,
    password: config.MySQL.password,
    database: config.MySQL.database
});
  
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL Database.");
});

/*FileSystem*/
fs.readdir("./commands/", (err, files) => {
    if(err) throw(err); 
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
        console.log("---------------------------------------------");
        console.log("[Warning] Couldn't find any file in Commands.");
        console.log("---------------------------------------------");
        return;
    }
    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`)
        client.commands.set(props.help.name, props);
    });
});

client.on('ready', () => {
    console.log(client.user.tag + " with ID " + client.user.id +" logged in.");
    client.user.setPresence('Core-Community', { type: 'Playing' });
});

client.on("message", message => {
    //Checks if the user who send the message is a bot.
    if(message.author.bot) return;
    if(message.guild.id !== config.core.server) return;
    if(message.channel.type == "dm" || message.channel.type == "group") return;

    let messageArray = message.content.split(" ");
    let command =  messageArray[0];
    let args = messageArray.slice(1);
    let commandfile = client.commands.get(command.slice(config.core.prefix.length));
    if(commandfile) commandfile.run(client, message, args, con);

    function generateXP() {
       return Math.floor(Math.random() * (10 - 4 + 1)) + 8;
    }

    con.query(`SELECT * FROM xp WHERE id = '${message.author.id}'`, (err, rows) => {
    if(err) throw err;
    var lvlMultiplier;
    let sql;
    if(cooldown.has(message.author.id)) return;
    if (rows.length < 1) {
        sql = `INSERT INTO xp (id, xp, name) VALUES ('${message.author.id}', '${generateXP()}', '${message.author.tag}')`
    } else {
         
        let generatedXP = generateXP();
        let xp = rows[0].xp;
        sql = `UPDATE xp SET xp = ${xp + generatedXP} WHERE id = '${message.author.id}'`;
        let nameInDatabase = con.query(`SELECT name FROM xp WHERE id = '${message.author.id}'`);
        if (message.author.tag != nameInDatabase) {
            con.query(`UPDATE xp SET name = '${message.author.tag}' WHERE id = '${message.author.id}'`);
        }
        
        let currentExp = con.query(`SELECT xp FROM xp WHERE id = '${message.author.id}'`)
        lvlMultiplier = Math.ceil(currentExp / 300);
        if(lvlMultiplier == 100) return;
        if (currentExp >= (xp - (xp % 300)) + 300 * lvlMultiplier){
            message.channel.reply("du bist ein Level aufgestiegen.");
        }
        cooldown.add(message.author.id);
        setTimeout(() => {
            cooldown.delete(message.author.id);
        }, 60 * 1000);
    }

    con.query(sql);

    });

});

client.login(config.core.login);