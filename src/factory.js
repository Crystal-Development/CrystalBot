const { RichEmbed } = require('discord.js');

module.exports = bot => {
    return {
        embed(options) {
            return new RichEmbed(options)
                // Apply default values:
                .setColor(bot.config.embedColor);
        }
    };
};

