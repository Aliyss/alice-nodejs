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
    try {
        /*
        async function purge()
        {
            const fetched = await message.channel.fetchMessages(messageidArr);
            message.channel.bulkDelete(fetched);
        }
        purge();
        */

        messageidArr.forEach((x) => {
            let err_msg = message.channel.fetchMessage(x)
                .then(message => message.delete())
                .catch();
        });

        let content = `${result.fulfillmentText} ${message.author}`;
        RunSenderFile(`./../../discord/dc_out/dc_outmessage.js`, message, content, messageidArr);

    }
    catch (err) {
        console.log(err)
    }

    return messageidArr;
};