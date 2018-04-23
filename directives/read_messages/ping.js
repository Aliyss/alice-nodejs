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
    const embed = new Discord.RichEmbed()
        .setTitle(`🏓 ${result.fulfillmentText}`)
        .setColor(14495300);

    let content = {embed};

    RunSenderFile(`./../../discord/dc_out/dc_outmessage.js`, message, content, messageidArr)
};