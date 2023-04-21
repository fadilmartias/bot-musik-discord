module.exports = {
    name: 'resume',
    aliases: [],
    description: 'Lanjutin musik yang dipause',
    usage: 'resume',
    voiceChannel: true,
    options: [],

    execute(client, message) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue)
            return message.reply({ content: `❌ | Gaada musik yang sedang dimainin sekarang cuy.`, allowedMentions: { repliedUser: false } });

        const success = queue.node.resume();
        return success ? message.react('▶️') : message.reply({ content: `❌ | Ada yang ga beres nih.`, allowedMentions: { repliedUser: false } });
    },

    slashExecute(client, interaction) {
        const queue = client.player.nodes.get(interaction.guild.id);

        if (!queue)
            return interaction.reply({ content: `❌ | Gaada musik yang sedang dimainin sekarang cuy.`, allowedMentions: { repliedUser: false } });

        const success = queue.node.resume();
        return success ? interaction.reply("▶️ | Lanjuttt.") : interaction.reply({ content: `❌ | Ada yang ga beres nih.`, allowedMentions: { repliedUser: false } });
    },
};