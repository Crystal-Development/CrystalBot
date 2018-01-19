exports.run = (bot, msg) => {
    msg.channel.send(':ping_pong: | Ping!').then(m => {
        m.edit(`:ping_pong: | Pong! \`${m.createdTimestamp - msg.createdTimestamp}ms\``);
    });
};

exports.info = {
    name: 'ping',
    description: 'Checks the connection speed to Discord'
};
