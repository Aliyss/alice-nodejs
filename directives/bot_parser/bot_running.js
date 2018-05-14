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
    let connector_channel = "430625594707804161";
    let channl = client.channels.find(channel => channel.id === `${connector_channel}`);

    let command_name = trueintent.name;
    let parameters = result.parameters.fields;

    let paratext = "";

    for(let prop in parameters) {
        if (parameters[prop]['stringValue'] !== command_name) {
            if (paratext === "") {
                paratext += `${parameters[prop]['stringValue']}`
            }
            else {
                paratext += `, ${parameters[prop]['stringValue']}`
            }

        }
    }

    function wrap(text) {
        return '```json\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
    }

    let json_message_info = `
{
    "ac-px-relay":
    {
        "author": "${message.author.id}",
        "channel": "${message.channel.id}",
        "msg_id": "${message.id}",
        "message":
        {
            "content": "${message.content}",
            "command": "${command_name}",
            "parameters": "${paratext}"
        }
    }
}`;

    channl.send(wrap(json_message_info));
};