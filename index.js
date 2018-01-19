const path = require('path');
const fse = require('fs-extra');
const discord = require('discord.js');

const bot = new discord.Client();
const config = (configFile => {
    try {
        const config = fse.readJSONSync(configFile);

        if (!config.token || !/^[a-zA-Z0-9_.-]+$/.test(config.token)) {
            throw 'The token must consist only of letters, numbers, underscores, dashes, and periods.';
        }

        return config;
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.error('The config file could not be found. Please duplicate example-config.json and rename it to config.json, filling out all required fields.');
        } else {
            console.error('Failed to load config file:', err);
        }
        return process.exit(1);
    }
})('./config.json');
const commands = require('./src/managers/command')(path.join(__dirname, 'src', 'commands'));
const factory = require('./src/factory')(bot);

Object.assign(bot, { config, commands, factory });
Object.assign(global, { bot, config, commands, factory });

const getContent = msg => {
    // Handle DM-input
    if (!msg.guild || !msg.guild.id) {
        return msg.content.trim();
    }

    let { content } = msg;
    let output = '';

    // TODO: Later on, we can use this method to implement per-guild prefixes.
    if (content.startsWith(config.prefix)) {
        output = content.substring(config.prefix.length);
    } else if (content.startsWith(bot.toString())) {
        output = content.substr(bot.toString().length);
    }

    return output.trim();
};

// Yes, this is messy. Yes, it's ugly. BUT IT WOOOORKKKS :DD
const findCommand = bot.findCommand = label => commands.find(command => command.info.name.toLowerCase() === label.toLowerCase())
    || commands.find(command => command.info.aliases && [].concat(command.info.aliases).map(alias => alias.toLowerCase()).indexOf(label.toLowerCase) > -1);

const isOwner = bot.isOwner = id => [].concat(config.owner).indexOf(id) > -1;

const getPermissionErrors = (msg, command) => {
    if (command.info.guildOnly && !msg.guild) throw 'This command can only be used in guilds!';
    if (command.info.ownerOnly && !isOwner(msg.author.id)) throw 'Only the owner can use this command!';
    if (command.info.permissions && msg.guild) {
        let permissions = [].concat(command.info.permissions);
        let missingPerm = permissions.find(perm => !msg.member.hasPermission(perm));
        if (missingPerm) throw `You need the permission \`${missingPerm}\` to use this command.`;
    }
};

bot.canUse = (msg, command) => !getPermissionErrors(msg, command);

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag} (ID: ${bot.user.id})`);
    console.log(`Currently monitoring ${bot.guilds.size} guilds, ${bot.channels.size} channels, and ${bot.users.size} users.`);

    // const updateGame = () => {
    //     bot.user.setGame(`${config.prefix}help | ${bot.users.size} users`);
    // };

    // updateGame();
    // Every 2 minutes
    // bot.setInterval(updateGame, 120000);

    commands.filter(command => typeof command.init === 'function').forEach(command => command.init(bot));
});

bot.on('message', async msg => {
    if (msg.author.bot) return;

    const content = getContent(msg);
    if (!content) return;

    const split = content.split(' ');
    const label = split[0];
    const args = split.slice(1);

    const command = findCommand(label);
    if (!command) return;

    try {
        let permissionErrors = getPermissionErrors(msg, command);
        if (permissionErrors) throw permissionErrors;

        await command.run(bot, msg, args);
    } catch (err) {
        console.error(`Error executing command '${command.info.name}' for user '${msg.author.tag}' (ID: ${msg.author.id}):`, err);
        msg.channel.send(`:x: ${err.message || err || 'An unknown error occurred!'}`)
            .then(m => m.delete(10000))
            .catch(() => { /* well, we can't even show them the error. oh well :) */ });
    }
});

bot.on('error', code => {
    if (code === 4004) {
        console.error('Failed to authenticate with Discord! The token you provided was invalid, please check your config.json and ensure that you are using the correct token.');
        process.exit(1);
    }
});

bot.login(config.token);
