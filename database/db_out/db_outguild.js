//Export: from db_inserver.js
exports.run = (client, db, path, guild, intent) => {
    switch (intent) {
        case "guildCreate":
            //Firebase: Create Guild Document
            let setGuild = path.set({
                name: guild.name,
                id: guild.id,
                prefix: "hey alice"
            }, {
                merge: true
            });
            break;
        case "guildDelete":
            //Firebase: Delete Guild Document
            path.delete();
            break;
        default:
            break;
    }
};