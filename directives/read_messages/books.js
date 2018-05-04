/*Local Packages*/
const Discord = require('discord.js');
const libgen = require('libgen');

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
    console.log(result.parameters);

    booksdata = result.parameters.fields['books_section']['stringValue'];

    const options = {
        mirror: 'http://libgen.io',
        query: booksdata,
        count: 10,
        sort_by: 'def',
        reverse: false
    };

    libgen.search(options, (err, bookdata) => {
        if (err)
            return console.error(err);

        console.log(bookdata);
        const embed = new Discord.RichEmbed()
            .setDescription(`**:books: Book Search**`)
            .setColor(3447003)

            .setFooter(`Requested by ${message.author.username}#${message.author.discriminator} | User ID: ${message.author.id}`, `${message.author.avatarURL}`)

            .addField('\u200b','**Book Information**')
            .addField(":closed_book: Title", `${bookdata[0].title.replace(/.{54}\S*\s+/g, "$&@").split(/\s+@/).join("\n")}\n`, true)
            .addField(":page_facing_up: Pages", `${bookdata[0].pages}`, true)
            .addField(":pen_ballpoint: Author", `${bookdata[0].author.replace(/.{20}\S*\s+/g, "$&@").split(/\s+@/).join("\n")}\u200b`, true)

            .addField('\u200b','**Further Information**')
            .addField(":printer: Publisher", `${bookdata[0].publisher.replace(/.{20}\S*\s+/g, "$&@").split(/\s+@/).join("\n")}\u200b`, true)
            .addField(":speech_balloon: Language", `${bookdata[0].language}\u200b`, true)
            .addField(":calendar: Year", `${bookdata[0].year}\u200b`, true)
            .addField(":link: Link", `[Download Link](${'http://download1.libgen.io/ads.php?md5=' + bookdata[0].md5.toLowerCase()})`, true);

        if (!(bookdata[0].coverurl === 0))
        {
            embed.setImage(`http://www.libgen.io/covers/${bookdata[0].coverurl}`);
            embed.setThumbnail(`https://i.imgur.com/6Y0v9zq.png`, true)
        }
        else
        {
            embed.setThumbnail(`https://i.imgur.com/6Y0v9zq.png`, true)
        }

        let content = {embed};
        RunSenderFile(`./../../discord/dc_out/dc_outmessage.js`, message, content, messageidArr)
    });


};