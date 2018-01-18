exports.run = (bot, msg, args) => {
    const commands = (args.length > 0 ? [bot.findCommand(args[0])].filter(command => command) : bot.commands.slice())
        .filter(command => bot.canUse(msg, command))
        .filter(command => !command.info.hidden || bot.isOwner(msg.author.id));

    if (!commands.length) {
        // This will only happen when searching for commands, therefore no need to worry about args[0] being undefined.
        throw `No commands were found that match \`${args[0]}\``;
    }

    const fields = commands.map(command => ({
        name: `\`${bot.config.prefix}${command.info.usage || command.info.name}\``,
        value: `*${command.info.description || 'No description'}*`
    }));

    while (fields.length) {
        msg.author.send({
            embed: global.factory.embed({ fields: fields.splice(0, 20) })
        });
    }

    if (msg.guild) {
        msg.channel.send(':mailbox_with_mail: | Sent you a DM with help.');
    }
};

exports.info = {
    name: 'help',
    usage: 'help [command]',
    description: 'Shows help for all commands or a specific command'
};
