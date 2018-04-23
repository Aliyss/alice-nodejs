
//Export: from df_connector.js
exports.run = (client, db, message, sessionClient, sID, messageidArr, collectorAlice) =>
{
    let commandFile;

    try
    {
        const projectId = `aliyssium-discordbot`;
        const sessionId = `${sID}`;
        const query = `hello`;
        const languageCode = 'en-US';

        const sessionPath = sessionClient.sessionPath(projectId, sessionId);

        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: query,
                    languageCode: languageCode,
                }
            },
            queryParams: {
                context: [
                    {
                        name: ""
                    }
                ]
            }
        };

        sessionClient
            .detectIntent(request)
            .then(responses =>
            {

                let result = responses[0].queryResult;
                const intentname = result.intent.displayName;

                //console.log(responses);
                console.log(`    Response: ${result.fulfillmentText}`);

                message.channel.send(`${result.fulfillmentText} ${message.author}`)

            });

    }
    catch (err)
    {
        console.log(err);
    }

};