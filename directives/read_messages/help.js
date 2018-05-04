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
    try
    {
        if (result.parameters.fields['help_commands']['stringValue'].length !== 0)
        {
            let cmd = result.parameters.fields['help_commands']['stringValue'];

            const embed = new Discord.RichEmbed()
                .setColor(12443124);

            let stringusage = `${firecommands[cmd].name}`;

            for(let val in firecommands[cmd].parameters)
            {
                stringusage += ` ${firecommands[cmd].parameters[val]}`
            }

            embed.addField('\u200b',`**Usage:** ${stringusage}\n**Description:** ${firecommands[cmd].desc}\n**Permissions required:** ${firecommands[cmd].permissions}`);
            embed.setFooter(`Based on the permissions required, you may not be able to use the given command.`);
            embed.setDescription(`🔍 **${firecommands[cmd].name}**\n<> means required, [] means optional`);
            embed.setThumbnail(`${firecommands[cmd].thumbnail}`);

            message.channel.send({embed})
                .then(x => messageidArr.push(x.id))
                .catch(console.error);
        }
        else
        {
            let commandoutlist = message.member.permissionsIn(message.channel).serialize();

            let commandinlist = [];

            for (let cmd in commandoutlist)
            {
                if (commandoutlist[cmd] === true)
                {
                    commandinlist.push(cmd);

                }
            }
            //console.log(commandinlist);

            //Command -help, where bot shows the various commands and how to use them.
            const embed = new Discord.RichEmbed()
                .setColor(12443124);

            let commandsFound = 0;


            for (let comm in commandinlist)
            {
                let AllUserString = [];

                for (let perm in firecommands)
                {
                    if (firecommands[perm].permissions.toUpperCase() === commandinlist[comm])
                    {
                        commandsFound++;
                        AllUserString.push(firecommands[perm].name);
                    }
                }
                if (AllUserString.length > 0)
                {
                    let AllUserlist = AllUserString.sort().join('\n');
                    embed.addField('\u200b', `**${commandinlist[comm]}**\n${AllUserlist}`, true);
                }
            }

            embed.setFooter(`This help message has been personalized to your specific role.`)
            embed.setDescription(`🔍 **${commandsFound} Commands available**\n<> means required, [] means optional`)
            embed.setThumbnail(`https://i.imgur.com/N8CxhMu.jpg`, true)

            message.channel.send({embed})
                .then(x => messageidArr.push(x.id))
                .catch(console.error);

        }

        message.channel.stopTyping(true);
    }
    catch (err)
    {
        console.log(err);
    }
};