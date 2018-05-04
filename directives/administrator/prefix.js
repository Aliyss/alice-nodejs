/*Local Packages*/
const Discord = require('discord.js');

/*Local Variables*/
let commandFile;

/*Local Functions*/
//Run File
function RunSenderFile(file, object, content, messageidArr) {
    commandFile = require(file);
    commandFile.run(object, content, messageidArr);
}

exports.run = (client, db, message, firecommands, trueintent, result, messageidArr) =>
{
    path = db.collection('discord').doc('configuration').collection('discord_guilds').doc(object.id);
    RunCommandFile(`./../../database/db_in/db_inprefix.js`, client, path, object, intent);
    RunSenderFile(`./../../discord/dc_out/dc_outmessage.js`, message, content, messageidArr)
};