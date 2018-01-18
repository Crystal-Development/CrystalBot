exports.run = (bot, msg, args) => {
    msg.channel.send(`Your input: *${args.join(' ')}*`);
};

exports.info = {
    name: 'exampleCommand',
    usage: 'exampleCommand <arg> [optional]',
    description: 'The description of the command',
    aliases: ['exCmd'],
    permissions: ['MANAGE_GUILD', 'MANAGE_CHANNEL'],
    ownerOnly: false,
    guildOnly: true
};
