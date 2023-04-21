module.exports = {
    name: 'back',
    aliases: ['b', 'rewind'],
    description: 'Balik ke lagu sebelumnya',
    usage: 'back',
    voiceChannel: true,
    options: [],

    async execute(client, message) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying())
            return message.reply({ content: `❌ | Gaada musik yang sedang dimainin sekarang cuy`, allowedMentions: { repliedUser: false } });

        if (!queue.history.previousTrack)
            return message.reply({ content: `❌ | Belum ada musik yang dimainin sebelumnya cuy.`, allowedMentions: { repliedUser: false } });

        await queue.history.back();
        return await message.react('👍');
    },

    async slashExecute(client, interaction) {
        const queue = client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: `❌ | Gaada musik yang sedang dimainin sekarang cuy`, allowedMentions: { repliedUser: false } });

        if (!queue.history.previousTrack)
            return interaction.reply({ content: `❌ | Belum ada musik yang dimainin sebelumnya cuy.`, allowedMentions: { repliedUser: false } });

        await queue.history.back();
        return await interaction.reply("✅ | Sipp! Mainin musik sebelumnya gaskann.");
    },
};