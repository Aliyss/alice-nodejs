/*Local Variables*/
let commandFile;

/*Local Functions*/
//Run File
function RunCommandFile(file, client, db, message, prefix_result) {

    let result = false;

    commandFile = require(file);
    commandFile.run(client, db, message, prefix_result, result);

}
//Set User Profile
function SetUserProfile(client, db, path, message) {
    //Firebase: Create User Document
    let setUser = path.set({
        id: message.author.id,
        discord_name: message.author.tag,
        first_name: "",
        last_name: "",
        prefix: `hey alice`,
        bot_toggle: client.user.id
    }, {
        merge: true
    });

}
//Get User Profile
function GetUserProfile(client, db, path, message) {
    return new Promise(function(resolve) {
        //Firebase: Get Prefix from User Document
        let getUser = path.get()
            .then(doc => {
                if (!doc.exists) {
                    //Firebase: Create User Document
                    SetUserProfile(client, db, path, message);
                    resolve(`hey alice`)
                }
                else {
                    resolve(doc.data()['prefix']);
                }
            });
    });
}
//Get Guild Profile
function GetGuildProfile(client, db, guildpath, message) {
    return new Promise(function(resolve) {
        //Firebase: Get Prefix from Guild Document
        let getGuild = guildpath.get()
            .then(doc => {
                if (!doc.exists) {
                }
                else {
                    resolve(doc.data()['prefix']);
                }
            });
    });
}

//Export: from db_inserver.js
exports.run = (client, db, path, message, intent) => {
    if (message.author.bot){

    }
    else if (message.guild === null)
    {
        //Firebase: Get Prefix from User Document
        let userprofile = GetUserProfile(client, db, path, message);
        userprofile.then(function (prefix_result) {
            if (message.content.toLowerCase().replace(/ /g,'').startsWith(prefix_result.toLowerCase().replace(/ /g,''))) {
                //Export: to db_inmessage.js
                RunCommandFile(`./../../discord/dc_in/dc_inmessage.js`, client, db, message, prefix_result)
            }
        });
    }
    else
    {
        let guildpath = db.collection('discord').doc('configuration').collection('discord_guilds').doc(message.guild.id);
        //Firebase: Get Prefix from Guild Document
        let guildprofile = GetGuildProfile(client, db, guildpath, message);
        guildprofile.then(function (prefix_result) {
            if (message.content.toLowerCase().replace(/ /g,'').startsWith(prefix_result.toLowerCase().replace(/ /g,''))) {
                //Firebase: Create User Document in case not set
                GetUserProfile(client, db, path, message);
                //Export: to dc_inmessage.js
                RunCommandFile(`./../../discord/dc_in/dc_inmessage.js`, client, db, message, prefix_result)
            }
        });
    }
};
