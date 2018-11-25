const { inspect } = require('util');

const clean = input => `${input}`.replace(/`/g, '\u200b`');

exports.run = async (client, msg, args) => {
    if (msg.author.id !== '186989309369384960' /* Me ;) */) {
        return msg.channel.send(':wink: Nope.')
    }

    if (args.length < 1) {
        throw 'You must provide some code to evaluate!';
    }

    let output;
    try {
        output = inspect(await eval(args.join(' ')));
    } catch (err) {
        return msg.channel.send(`:x: An error has occurred! \`\`\`\n${clean(err).substring(0, 1950)}\n\`\`\``);
    }

    while (output.indexOf(client.token) > -1) {
        output = output.replace(client.token, 'BOT_TOKEN');
    }

    msg.channel.send(`\`\`\`javascript\n${clean(output).substr(0, 1950)}\`\`\``);
};

exports.info = {
    name: 'eval',
    usage: 'eval <code>',
    hidden: true,
};