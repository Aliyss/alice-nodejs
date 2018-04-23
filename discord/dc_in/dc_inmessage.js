/*Local Variables*/
let commandFile;
let uID = "";

/*Local Functions*/
//Run File
function RunCommandFile(file, client, db, object, parameter) {

    commandFile = require(file);
    commandFile.run(client, db, object, parameter);

}

//Export: from db_outmessage.js
exports.run = (client, db, message, prefix_result, reset) => {
    if (reset === true) {
        uID = "";
        reset = false;
    }
    else if (prefix_result.toLowerCase() === message.content.toLowerCase() && uID !== `${message.author.id}?${message.channel.id}`){
        uID = `${message.author.id}?${message.channel.id}`;
        RunCommandFile(`./../../dialogflow/df_connector.js`, client, db, message, prefix_result)
    }
    else {
        const args = message.content.slice(prefix_result);
        console.log(args)
    }
};