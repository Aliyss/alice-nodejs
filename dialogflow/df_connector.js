/*Global Packages*/
const Discord = require('discord.js');
const dialogflow = require('dialogflow');

/*Initialization*/
const sessionClient = new dialogflow.SessionsClient(
{
    keyFilename: './settings/serviceAccountKeys.json'
});

/*Local Variables*/
let commandFile;
let lastHelloCommandDate;
let timer = null;

/*Local Functions*/
//Run File
function RunCommandFile(file, client, db, message, sID, messageidArr, collectorAlice) {

    commandFile = require(file);
    commandFile.run(client, db, message, sessionClient, sID, messageidArr, collectorAlice);

}
//Run Timeout
function timeout(collectorAlice, lastHelloCommandDate) {
    const now = new Date();
    if (now.getTime() - lastHelloCommandDate < 160000)
    {
        collectorAlice.stop('time');
    }
    else
    {
        clearTimeout(timer)
    }
}

//Export: from dc_inmessage.js
exports.run = (client, db, message, prefix_result) => {

    try {
        const collectorAlice = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);

        let sID = `${message.author.id}`;
        let messageidArr = [];
        messageidArr.push(message.id);

        lastHelloCommandDate = message.createdTimestamp;
        timer = setTimeout(timeout, 150000, collectorAlice, lastHelloCommandDate);
        console.log(`${message.author.username}#${message.author.discriminator} requested: ${message.content}`);
        message.channel.startTyping(3);

        RunCommandFile(`./df_in/df_inopening.js`, client, db, message, sID, messageidArr, collectorAlice);

        let collectFunc = message => {
            message.channel.startTyping(3);
            lastHelloCommandDate = message.createdTimestamp;
            clearTimeout(timer);
            timer = setTimeout(timeout, 150000, collectorAlice, lastHelloCommandDate);

            RunCommandFile(`./df_in/df_inrunning.js`, client, db, message, sID, messageidArr, collectorAlice);
        };

        collectorAlice.on('collect', collectFunc);

        let collectEnd = (collected, reason) => {
            sID = "";
            let reset = true;
            message.channel.stopTyping(3);

            if (reason === "time")
            {
                message.channel.send(`${message.author} if you're not gonna talk, then I'm leaving.`);
                collectorAlice.removeListener('collect', collectFunc);
                collectorAlice.removeListener('end', collectEnd);
            }

            commandFile = require(`./../discord/dc_in/dc_inmessage.js`);
            commandFile.run(client, db, message, prefix_result, reset);
        };

        collectorAlice.on('end', collectEnd);
    }
    catch (e) {
        console.log(e);
    }

};