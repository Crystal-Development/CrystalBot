const snekfetch = require('snekfetch');

const searchFor = term => snekfetch.get(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`);

exports.run = async (bot, msg, args) => {
    if (args.length < 0) {
        throw 'Please provide a term to search for.';
    }

    const results = await searchFor(args[0]);

    if (!results.body || !results.body.list || !results.body.list[0]) {
        throw 'That term could not be found.';
    }

    const result = results.body.list[0];
    msg.channel.send({
        embed: global.factory.embed()
            .setTitle(result.word)
            .setURL(result.permalink)
            .setDescription(result.definition)
            .setFooter(`Author: ${result.author} || +${result.thumbs_up}/-${result.thumbs_down}`)
    });
};

exports.info = {
    name: 'urban',
    usage: 'urban <term>',
    description: 'Searches UrbanDictionary for the given term',
    aliases: ['urbandict', 'urbandictionary', 'udict']
};
