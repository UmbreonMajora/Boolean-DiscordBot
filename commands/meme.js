const config = require("../config.json");
const giphy = require('giphy-api')("qN4cE7486mfIKT3CQKWGKCB5yodm9DMK");

var GphApiClient = require('giphy-js-sdk-core')
client = GphApiClient("qN4cE7486mfIKT3CQKWGKCB5yodm9DMK")

module.exports.run = async (client, message, args) => {
    client.search('gifs', {"q": "memes", "limit": 1000})
    .then((response) => {
        console.log(Math.floor((Math.random() * response.data.length)))
    message.channel.send(response.data[Math.floor((Math.random() * response.data.length))].url)
    })
    .catch((err) => {
  
    })
}

module.exports.help = {
    name:"meme"
}   