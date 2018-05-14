/*Local Packages*/
const Discord = require('discord.js');

/*Local Variables*/
let commandFile;

/*Local Functions*/
//Run File
function RunCommandFile(file, client, db, path, object, intent, obOne) {
    commandFile = require(file);
    commandFile.run(client, db, path, object, intent, obOne);
}
//Run File
function RunSenderFile(file, object, content, messageidArr) {
    commandFile = require(file);
    commandFile.run(object, content, messageidArr);
}

exports.run = (client, db, message, firecommands, trueintent, result, messageidArr) =>
{
    let object = message.guild;
    let intent = "prefixChange";
    let obOne;

    if ((message.content.match(/"/g) || []).length === 2) {
        obOne =  message.content.split(/"/)[1];
    }
    else {
        obOne =  "hey alice";
    }

    console.log(obOne);

    path = db.collection('discord').doc('configuration').collection('discord_guilds').doc(message.guild.id);
    RunCommandFile(`./../../database/db_out/db_outguild.js`, client, db, path, object, intent, obOne);

    let content = `${result.fulfillmentText} "${obOne}"`;
    RunSenderFile(`./../../discord/dc_out/dc_outmessage.js`, message, content, messageidArr)
};