/*Global Packages*/
const Discord = require('discord.js');
const client = new Discord.Client();

/*Local Variables*/
let commandFile;

/*Local Functions*/
//Run File
function RunCommandFile(file, object, intent) {

    commandFile = require(file);
    commandFile.run(client, object, intent);

}


//Client: login
client.login('NDI0NjA5NDMzOTg1ODc1OTg4.DY7X-A.DNZ4tz11m6tu905B0cLwwMimMnI');

//Client: ready
client.on('ready', () => {

    //Console
    console.log('Bot started...');
    console.log(`Logged in as ${client.user.tag}.`);

    //Client: setStatus & setActivity
    client.user.setStatus('dnd');
    client.user.setActivity("in Wonderland");

});

//Client: joined a server
client.on("guildCreate", guild => {

    //Console
    console.log("Joined a new guild: " + guild.name);

    //Export: to db_inserver.js
    RunCommandFile(`./database/db_in/db_inserver.js`, guild, "guildCreate")
    
});

//Client: left a server
client.on("guildDelete", guild => {

    //Console
    console.log("Left a guild: " + guild.name);

    //Export: to db_inserver.js
    RunCommandFile(`./database/db_in/db_inserver.js`, guild, "guildDelete")
    
});

//Client: received a message
client.on("message", message => {

    //Export: to db_inserver.js
    RunCommandFile(`./database/db_in/db_inserver.js`, message, "message")

});