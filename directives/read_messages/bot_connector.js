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
//Set User Profile
function SetUserProfile(client, db, path, bot_id) {
    //Firebase: Create User Document
    let setUser = path.set({
        bot_toggle: bot_id
    }, {
        merge: true
    });

}

exports.run = (client, db, message, firecommands, trueintent, result, messageidArr) =>
{
    let bot_id = result.parameters.fields['connection_integrationbots']['stringValue'];
    //Firebase: Get Bot Toggle from User Document
    let path = db.collection('discord').doc('configuration').collection('discord_users').doc(message.author.id);
    let userprofile = SetUserProfile(client, db, path, bot_id);

    let content = "[Transmission] Initiating Connection...";

    RunSenderFile(`./../../discord/dc_out/dc_outmessage.js`, message, content, messageidArr);

    let connector_channel = "430625594707804161";
    let channl = client.channels.find(channel => channel.id === `${connector_channel}`);

    let command_name = trueintent;
    let parameters = result.parameters.fields;

    let writtencom;

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

    if (bot_id === client.user.id) {
        content = "[Transmission] Connection established!";
        RunSenderFile(`./../../discord/dc_out/dc_outmessage.js`, message, content, messageidArr);
        writtencom = "clos_connec"
    }
    else {
        writtencom = "open_connec";
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
            "command": "${writtencom}",
            "parameters": "${paratext}"
        }
    }
}`;
        channl.send(wrap(json_message_info));
    }




};