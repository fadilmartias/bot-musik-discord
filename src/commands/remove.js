const embed = require('../embeds/embeds');


module.exports = {
    name: 'remove',
    aliases: ['r'],
    description: 'Pilih lagu buat dihapus dari antrian',
    usage: 'remove <song index number>',
    voiceChannel: true,
    options: [],

    async execute(client, message) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying())
            return message.reply({ content: `❌ | Gaada musik yang sedang dimainin sekarang cuy.`, allowedMentions: { repliedUser: false } });


        const tracks = queue.tracks.map((track, index) => `${++index}. ${track.title}`);

        if (tracks.length < 1)
            return message.reply({ content: `❌ | Dah abis musiknya ni terakhir.`, allowedMentions: { repliedUser: false } });


        let nowplaying = `Now Playing : ${queue.currentTrack.title}\n\n`;
        let tracksQueue = '';

        if (tracks.length > 9) {
            tracksQueue = tracks.slice(0, 10).join('\n');
            tracksQueue += `\nand ${tracks.length - 10} other songs`;
        }
        else {
            tracksQueue = tracks.join('\n');
        }

        const instruction = `Pilih musik dari **1** to **${tracks.length}** untuk **dihapus** atau masukin yang lain untuk batalin pilihan. ⬇️`;
        let loopStatus = queue.repeatMode ? (queue.repeatMode === 2 ? 'All' : 'ONE') : 'Off';
        await message.reply({ content: instruction, embeds: [embed.Embed_queue("Hapus lagu", nowplaying, tracksQueue, loopStatus)], allowedMentions: { repliedUser: false } });


        const collector = message.channel.createMessageCollector({
            time: 10000, // 10s
            errors: ['time'],
            filter: m => m.author.id === message.author.id
        });

        collector.on('collect', async (query) => {

            const index = parseInt(query.content);

            if (!index || index <= 0 || index > tracks.length) {
                return message.reply({ content: `✅ | Batal.`, allowedMentions: { repliedUser: false } })
                    && collector.stop();
            }

            collector.stop();
            await queue.node.remove(index - 1);

            query.reply({ embeds: [embed.Embed_remove("Menghapus musik", tracks[index - 1])], allowedMentions: { repliedUser: false } });
            return query.react('👍');
        });

        collector.on('end', (msg, reason) => {
            if (reason === 'time')
                return message.reply({ content: `❌ | Lama amat`, allowedMentions: { repliedUser: false } });
        });
    },

    async slashExecute(client, interaction) {
        const queue = client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: `❌ | Gaada musik yang sedang dimainin sekarang cuy.`, allowedMentions: { repliedUser: false } });


        const tracks = queue.tracks.map((track, index) => `${++index}. ${track.title}`);

        if (tracks.length < 1)
            return interaction.reply({ content: `❌ | Dah abis musiknya ni terakhir.`, allowedMentions: { repliedUser: false } });


        let nowplaying = `Now Playing : ${queue.currentTrack.title}\n\n`;
        let tracksQueue = '';

        if (tracks.length > 9) {
            tracksQueue = tracks.slice(0, 10).join('\n');
            tracksQueue += `\nand ${tracks.length - 10} olagu lainnya`;
        }
        else {
            tracksQueue = tracks.join('\n');
        }

        const instruction = `Pilih musik dari **1** to **${tracks.length}** untuk **dihapus** atau masukin yang lain untuk batalin pilihan. ⬇️`;
        let loopStatus = queue.repeatMode ? (queue.repeatMode === 2 ? 'All' : 'ONE') : 'Off';
        await interaction.reply({ content: instruction, embeds: [embed.Embed_queue("Menghapus musik", nowplaying, tracksQueue, loopStatus)], allowedMentions: { repliedUser: false } });


        const collector = interaction.channel.createMessageCollector({
            time: 10000, // 10s
            errors: ['time'],
            filter: m => m.author.id === interaction.user.id
        });

        collector.on('collect', async (query) => {
            const index = parseInt(query.content);

            if (!index || index <= 0 || index > tracks.length) {
                return query.reply({ content: `✅ | Batal.`, allowedMentions: { repliedUser: false } })
                    && collector.stop();
            }

            collector.stop();
            await queue.node.remove(index - 1);

            query.reply({ embeds: [embed.Embed_remove("Menghapus musik", tracks[index - 1])], allowedMentions: { repliedUser: false } });
            return query.react('👍');
        });

        collector.on('end', (msg, reason) => {
            if (reason === 'time')
                return interaction.reply({ content: `❌ | Lama amat`, allowedMentions: { repliedUser: false } });
        });
    },
};