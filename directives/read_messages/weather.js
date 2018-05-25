/*Local Packages*/
const Discord = require('discord.js');
const weather = require('weather-js');

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
    let geodata;

    if (!(result.parameters.fields['geo-city']['stringValue'].length === 0))
    {
        geodata = result.parameters.fields['geo-city']['stringValue'];

        weather.find({search: `${geodata}`, degreeType: 'C'}, (err, contextu) =>
        {
            const embed = new Discord.RichEmbed()
                .setColor(3447003)
                .setDescription(`**${result.fulfillmentText} [${contextu[0].current.observationpoint.replace(/ /gi, " ")}](http://www.google.com/search?q=Weather+in+${contextu[0].current.observationpoint.replace(/ /gi, " ").replace(/ /gi, "+")})**`)
                .setFooter(`Requested by ${message.author.tag} | User ID: ${message.author.id}`, message.author.avatarURL)

                .addField('\u200b','**Location**', false)
                .addField('Time', `${contextu[0].current.date}`, true)
                .addField('Timezone', `UTC${contextu[0].location.timezone}`, true)
                .addField('Lat / Long', `${contextu[0].location.lat} / ${contextu[0].location.long}`, true)

                .addField('\u200b','**Weather**', false)

                .addField('Condition', `${contextu[0].current.skytext}`, true)
                .addField('Temperature', `${contextu[0].current.temperature} °C`, true)
                .addField('Feels Like', `${contextu[0].current.feelslike} °C`, true)

                .addField('\u200b','**Further Information**', false)
                .addField('Wind Speed', `${contextu[0].current.winddisplay}`, true)
                .addField('Humidity', `${contextu[0].current.humidity}%`, true)
                .addField('\u200b',`\u200b`, true);

            let content = {embed};

            RunSenderFile(`./../../discord/dc_out/dc_outmessage.js`, message, content, messageidArr)
        });
    }

};