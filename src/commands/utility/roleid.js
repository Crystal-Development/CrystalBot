exports.run = function (bot, msg, args) {
    msg.delete();

    if (args.length < 1) {
        return msg.channel.send('❌ Syntax Error. Please supply an argument.\nUse ``' + bot.config.prefix + 'help roleid`` for help.').then(m => m.delete(3000));
    }

    let query = args.join(' ').toLowerCase();
    let role = msg.guild.roles
        .filter(role => role.name.toLowerCase().indexOf(query) > -1)
        .sort((a, b) => a.name.length - b.name.length).first();

    if (!role) {
        return msg.channel.send(':x: That role could not be found!').then(m => m.delete(3000));
    }

    msg.channel.send(':white_check_mark: The ID of ' + role.name + ' is `' + role.id + '`').then(m => m.delete(10000));
}

exports.info = {
    name: 'roleid',
    usage: 'roleid [name of role]',
    description: 'Finds the ID of specified role.'
};