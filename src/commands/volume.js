module.exports = {
    name: 'volume',
    aliases: ['v'],
    description: `Atur volume bot`,
    usage: 'v <0-100>',
    voiceChannel: true,
    options: [
        {
            name: "volume",
            description: "Berapa?",
            type: 4,
            required: true,
            min_value: 1
        }
    ],

    async execute(client, message, args) {
        const maxVolume = client.config.maxVolume;
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying())
            return message.reply({ content: `❌ | Gaada musik yang sedang dimainin sekarang cuy.`, allowedMentions: { repliedUser: false } });


        await message.react('👍');
        const vol = parseInt(args[0], 10);

        if (!vol)
            return message.reply({ content: `Volume sekarang: **${queue.node.volume}** 🔊\n**Untuk ganti volume, masukin angka \`1\` ampe \`${maxVolume}\`.**`, allowedMentions: { repliedUser: false } });

        if (queue.volume === vol)
            return message.reply({ content: `❌ | Itu volume sekarang blokk.`, allowedMentions: { repliedUser: false } });

        if (vol < 0 || vol > maxVolume)
            return message.reply({ content: `❌ | **Ketik angka antara \`1\` ampe \`${maxVolume}\` untuk ganti volume.**`, allowedMentions: { repliedUser: false } });


        const success = queue.node.setVolume(vol);
        const replymsg = success ? `🔊 **${vol}**/**${maxVolume}**%` : `❌ | Ada yang gaberes nih.`;
        return message.reply({ content: replymsg, allowedMentions: { repliedUser: false } });
    },

    async slashExecute(client, interaction) {
        const maxVolume = client.config.maxVolume;
        const queue = client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: `❌ | Gaada musik yang sedang dimainin sekarang cuy.`, allowedMentions: { repliedUser: false } });

        const vol = parseInt(interaction.options.getInteger("volume"), 10);

        if (!vol)
            return interaction.reply({ content: `Current volume: **${queue.node.volume}** 🔊\n**To change the volume, with \`1\` to \`${maxVolume}\` Type a number between.**`, allowedMentions: { repliedUser: false } });

        if (queue.volume === vol)
            return interaction.reply({ content: `❌ | Itu volume sekarang blokk.`, allowedMentions: { repliedUser: false } });

        if (vol < 0 || vol > maxVolume)
            return interaction.reply({ content: `❌ | **Ketik angka antara \`1\` ampe \`${maxVolume}\` untuk ganti volume.**`, allowedMentions: { repliedUser: false } });


        const success = queue.node.setVolume(vol);
        const replymsg = success ? `🔊 **${vol}**/**${maxVolume}**%` : `❌ | Ada yang ga beres nih.`;
        return interaction.reply({ content: replymsg, allowedMentions: { repliedUser: false } });
    },
};