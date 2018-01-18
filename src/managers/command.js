const path = require('path');
const readdir = require('readdir-recursive');

/**
 * @typedef {object} CommandInfo
 * @property {string} name The name of the command.
 * @property {string} [usage] The usage of the command.
 * @property {string} [description] The description of the command.
 * @property {string | string[]} [aliases] The aliases of the command.
 * @property {string | string[]} [permissions] The required permissions for the command.
 * @property {boolean} [ownerOnly] Whether or not the command is only allowed to be used by the owner.
 * @property {boolean} [guildOnly] Whether or not the command can only be used in a guild.
 */

/**
 * @typedef {object} Command
 * @property {(bot: any, msg: any, args: string[]) => void | Promise} run The method to run when the command is executed. 
 * @property {(bot: any) => void} [init] The method to run when the bot loads.
 * @property {CommandInfo} info The info for the command.
 */

const validateCommand = (file, command) => {
    const fail = message => console.error(`Error loading commands in file '${file}': ${message}`);
    if (typeof command !== 'object') {
        return fail('type of command was not object');
    } else if (typeof command.info !== 'object') {
        return fail('type of command.info was not object');
    } else if (typeof command.info.name !== 'string') {
        return fail('type of command.info.name was not string');
    } else if (typeof command.run !== 'function') {
        return fail('type of command.run was not function');
    }
    return true;
};

/**
 * Loads all commands from a given directory.
 * 
 * @param {string} dir The directory to load the commands from.
 * @returns {Command[]} The loaded commands.
 */
module.exports = dir => {
    const files = readdir.fileSync(dir).filter(file => file.endsWith('.js') && !path.basename(file).startsWith('_'));

    return files
        .map(file => {
            try {
                const required = require(file);
                if (!required) {
                    return;
                }
                return [].concat(required).filter(command => validateCommand(path.relative(dir, file), command));
            } catch (err) {
                console.error(`Failed to load command file '${file}':`, err);
            }
        })
        .filter(commands => commands && commands.length) // remove empty entries
        .reduce((arr, next) => arr.concat(next), []); // flat map
};
