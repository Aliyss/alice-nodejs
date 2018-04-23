/*Local Packages*/
const Discord = require('discord.js');
const FeedParser = require('feedparser');
const request = require('request');
const extract = require('meta-extractor');
const favicon = require('favicon');

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
        let news_link;
        let contextv = [];
        console.log(result.parameters);
        if (!(result.parameters.fields['news_section']['stringValue'].length === 0))
        {
            let news_section = result.parameters.fields['news_section']['stringValue'];
            news_link = `https://news.google.com/news/rss/explore/section/q/${news_section}?ned=us&hl=en&gl=US`;
        }
        else
        {
            news_link = `https://news.google.com/news/rss/headlines/section/topic/WORLD?ned=us&hl=en&gl=US`;
        }

        let req = request(news_link);
        let feedparser = new FeedParser();

        req.on('error', function (error)
        {

        });

        req.on('response', function (res)
        {
            let stream = this;

            if (res.statusCode !== 200) {
                this.emit('error', new Error('Bad status code'));
            }
            else {
                stream.pipe(feedparser);
            }
        });

        feedparser.on('error', function (error)
        {

        });

        feedparser.on('readable', function ()
        {
            let stream = this;
            let meta = this.meta;
            let item;

            while (item = stream.read())
            {
                contextv.push(item)
            }
        });

        feedparser.on('end', function ()
        {
            extract({ uri: contextv[0].link }, (err, contextu) =>
            {

                favicon(`http://${contextu.host}​`, function(err, favicon_url) {

                const embed = new Discord.RichEmbed()
                    .setColor(14495300)
                    .setDescription(`${contextu.ogDescription}​`)
                    .setFooter(`Requested by ${message.author.tag} | User ID: ${message.author.id}`, message.author.avatarURL)
                    .setTitle(`${contextu.ogTitle}​`)
                    .setAuthor(`${contextu.ogSiteName}​`, `${favicon_url.replace('\u200B', "")}`, `http://${contextu.host}​`)
                    .setImage(`${contextu.ogImage.replace('\u200B', "")}​`)
                    .setURL(`${contextv[0].link.replace('\u200B', "")}​`);

                let content = {embed};

                RunSenderFile(`./../../discord/dc_out/dc_outmessage.js`, message, content, messageidArr)

                });
            });

        });

    }
    catch (err)
    {
        console.log(err)
    }

};