/*Local Variables*/
let commandFile;

/*Local Functions*/
//Run File
function RunCommandFile(file, client, db, message, firecommands, trueintent, result, messageidArr) {
    commandFile = require(file);
    commandFile.run(client, db, message, firecommands, trueintent, result, messageidArr);

}
//Run File
function RunSenderFile(file, object, content, messageidArr) {
    commandFile = require(file);
    commandFile.run(object, content, messageidArr);
}
//Get User Profile
function GetUserProfile(client, db, path, message) {
    return new Promise(function(resolve) {
        //Firebase: Get Prefix from User Document
        let getUser = path.get()
            .then(doc => {
                if (!doc.exists) {
                    resolve(client.user.id)
                }
                else {
                    resolve(doc.data()['bot_toggle']);
                }
            });
    });
}
//Close Connection
function CloseConnec(client, db, message, result, messageidArr, collectorAlice, command_name) {
    let firecommands;
    let trueintent;

    RunCommandFile(`./../../directives/alice_parser/${command_name}.js`, client, db, message, firecommands, trueintent, result, messageidArr);
}

exports.run = (client, db, message, sessionClient, sID, messageidArr, collectorAlice) =>
{
    try
    {
        //Firebase: Get Bot Toggle from User Document
        let path = db.collection('discord').doc('configuration').collection('discord_users').doc(message.author.id);
        let userprofile = GetUserProfile(client, db, path, message);
        userprofile.then(function (bot_toggle) {

            console.log(`${message.author.username}#${message.author.discriminator} requested: ${message.content}`);

            let bot_id = `${bot_toggle}`;
            let botConfig = db.collection('discord').doc('configuration').collection('discord_bots').doc(bot_id);
            let botCommands = botConfig.collection('settings').doc('commands');

            messageidArr.push(message.id);

            const projectId = `aliyssium-discordbot`;
            const sessionId = `${sID}`;
            let query;
            const languageCode = 'en-US';

            if (bot_id !== client.user.id) {
                let chars = {'1':'a','2':'b','3':'c','4':'d','5':'e','6':'f','7':'g','8':'h','9':'i', '0':'z'};
                let jumper = bot_id.replace(/[1234567890]/g, m => chars[m]);
                query = jumper + `: ${message.content}`;
            }
            else {
                query = `${message.content}`;
            }

            const sessionPath = sessionClient.sessionPath(projectId, sessionId);

            const request = {
                session: sessionPath,
                queryInput: {
                    text: {
                        text: query,
                        languageCode: languageCode,
                    },
                }
            };

            sessionClient
                .detectIntent(request)
                .then(responses =>
                {
                    let result = responses[0].queryResult;
                    const intentname = result.intent.displayName;

                    console.log(result.parameters);
                    console.log(`    Response: ${result.fulfillmentText}`);

                    let getDoc = botCommands.get()
                        .then(doc => {
                            let firecommands = doc.data();

                            if (result.intent.displayName === "smalltalk.greetings.bye - yes" || result.intent.displayName === "smalltalk.greetings.bye - no" || result.intent.displayName === "integration.bot.clos_connec") {
                                let command_name;

                                if (result.intent.displayName === "smalltalk.greetings.bye - yes") {
                                    command_name = "alice-close-connec-yes";
                                }
                                else if (result.intent.displayName === "smalltalk.greetings.bye - no") {
                                    command_name = "alice-close-connec-no";
                                }

                                if (command_name === "alice-close-connec-yes" || command_name === "alice-close-connec-no")
                                {
                                    CloseConnec(client, db, message, result, messageidArr, collectorAlice, command_name);

                                    messageidArr = [];
                                    ConversationPurge(true)
                                        .then( () => collectorAlice.stop());
                                }
                            }
                            if (!firecommands[intentname]) {
                                RunSenderFile(`./../../discord/dc_out/dc_outmessage.js`, message, `${result.fulfillmentText}`, messageidArr);
                            }
                            else if (firecommands[intentname]) {
                                let trueintent = firecommands[intentname];
                                let command_name = trueintent.name;
                                let command_group = trueintent.permissions;

                                if (bot_id === client.user.id) {
                                    if (result.allRequiredParamsPresent === true) {
                                        if (message.member.permissionsIn(message.channel).has(command_group.toUpperCase()) === true) {
                                            RunCommandFile(`./../../directives/${command_group}/${command_name}.js`, client, db, message, firecommands, trueintent, result, messageidArr);
                                        }
                                        else {
                                            RunSenderFile(`./../../discord/dc_out/dc_outmessage.js`, message, "You don't have sufficient permissions to initiate the command.", messageidArr);
                                        }
                                    }
                                    else
                                    {
                                        RunSenderFile(`./../../discord/dc_out/dc_outmessage.js`, message, `${result.fulfillmentText}`, messageidArr);
                                    }
                                }
                                else
                                {
                                    if (command_name === "bot_disconnector")
                                    {
                                        RunCommandFile(`./../read_messages/bot_disconnector.js`);
                                    }
                                    else
                                    {
                                        RunCommandFile(`./../../directives/${command_group}/${command_name}.js`, client, db, message, firecommands, trueintent, result, messageidArr);
                                    }
                                }
                            }
                        })
                        .catch(err =>
                        {
                            console.log('Error getting document', err);
                        });

                    async function ConversationPurge()
                    {
                        sID = "";
                        return await true;
                    }

                });

        });
    }
    catch (err)
    {

    }

};