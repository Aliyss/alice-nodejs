exports.run = (message, content, messageidArr) =>
{
    message.channel.send(content)
        .then(x => messageidArr.push(x.id))
        .catch(console.error);

    message.channel.stopTyping(true);
};