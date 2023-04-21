'use strict';

const fs = require('fs');

const dotenv = require('dotenv');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { Player, QueryType } = require('discord-player');
const express = require('express');
require('console-stamp')(console, { format: ':date(yyyy/mm/dd HH:MM:ss)' });

const embed = require(`${__dirname}/embeds/embeds`);


dotenv.config();
const ENV = process.env;


let client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [Partials.Channel],
    disableMentions: 'everyone',
});


client.config = {
    name: 'DilbotZ',
    prefix: 'z!',
    playing: 'z!help | music',
    defaultVolume: 50,
    maxVolume: 100,
    autoLeave: true,
    autoLeaveCooldown: 5000,
    displayVoiceState: true,
    port: 33333,
    urlQuery: QueryType.AUTO,
    textQuery: QueryType.AUTO
};

client.commands = new Collection();
client.player = new Player(client, {
    ytdlOptions: {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 27
    }
});

const player = client.player;
const color = {
    white: '\x1B[0m',
    grey: '\x1B[2m',
    green: '\x1B[32m'
};




const setEnvironment = () => {
    return new Promise((resolve, reject) => {
        client.config.name = typeof (ENV.BOT_NAME) === 'undefined'
            ? client.config.name
            : ENV.BOT_NAME;

        client.config.prefix = typeof (ENV.PREFIX) === 'undefined'
            ? client.config.prefix
            : ENV.PREFIX;

        client.config.playing = typeof (ENV.PLAYING) === 'undefined'
            ? client.config.playing
            : ENV.PLAYING;

        client.config.defaultVolume = typeof (ENV.DEFAULT_VOLUME) === 'undefined'
            ? client.config.defaultVolume
            : Number(ENV.DEFAULT_VOLUME);

        client.config.maxVolume = typeof (ENV.MAX_VOLUME) === 'undefined'
            ? client.config.maxVolume
            : Number(ENV.MAX_VOLUME);

        client.config.autoLeave = typeof (ENV.AUTO_LEAVE) === 'undefined'
            ? client.config.autoLeave
            : (String(ENV.AUTO_LEAVE) === 'true' ? true : false);

        client.config.autoLeaveCooldown = typeof (ENV.AUTO_LEAVE_COOLDOWN) === 'undefined'
            ? client.config.autoLeaveCooldown
            : Number(ENV.AUTO_LEAVE_COOLDOWN);

        client.config.displayVoiceState = typeof (ENV.DISPLAY_VOICE_STATE) === 'undefined'
            ? client.config.displayVoiceState
            : (String(ENV.DISPLAY_VOICE_STATE) === 'true' ? true : false);

        client.config.port = typeof (ENV.PORT) === 'undefined'
            ? client.config.port
            : Number(ENV.PORT);

        client.config.textQuery = typeof (ENV.TEXT_QUERY_TYPE) === 'undefined'
            ? client.config.textQuery
            : ENV.TEXT_QUERY_TYPE

        client.config.urlQuery = typeof (ENV.URL_QUERY_TYPE) === 'undefined'
            ? client.config.urlQuery
            : ENV.URL_QUERY_TYPE;

        //console.log('setEnvironment: ', client.config);
        resolve();
    });
}


const loadFramework = () => {
    console.log(`-> loading Web Framework ......`);
    return new Promise((resolve, reject) => {
        const app = express();
        const port = client.config.port || 33333;

        app.get('/', function (req, res) {
            res.send('200 ok.')
        });

        app.listen(port, function () {
            console.log(`Server start listening port on ${port}`);
            resolve();
        });
    })
}


const loadEvents = () => {
    console.log(`-> loading Events ......`);
    return new Promise((resolve, reject) => {
        const files = fs.readdirSync(`${__dirname}/events/`).filter(file => file.endsWith('.js'));

        console.log(`+--------------------------------+`);
        for (const file of files) {
            try {
                const event = require(`${__dirname}/events/${file}`);
                console.log(`| Loaded event ${file.split('.')[0].padEnd(17, ' ')} |`);

                client.on(file.split('.')[0], event.bind(null, client));
                delete require.cache[require.resolve(`${__dirname}/events/${file}`)];
            } catch (error) {
                reject(error);
            }
        };
        console.log(`+--------------------------------+`);
        console.log(`${color.grey}-- loading Events finished --${color.white}`);

        resolve();
    })
}


const loadCommands = () => {
    console.log(`-> Bentar lagi loading ......`);
    return new Promise((resolve, reject) => {
        const files = fs.readdirSync(`${__dirname}/commands/`).filter(file => file.endsWith('.js'));

        console.log(`+---------------------------+`);
        for (const file of files) {
            try {
                const command = require(`${__dirname}/commands/${file}`);

                console.log(`| Loaded Command ${command.name.toLowerCase().padEnd(10, ' ')} |`);

                client.commands.set(command.name.toLowerCase(), command);
                delete require.cache[require.resolve(`${__dirname}/commands/${file}`)];
            } catch (error) {
                reject(error);
            }
        };
        console.log(`+---------------------------+`);
        console.log(`${color.grey}-- Oke siap --${color.white}`);

        resolve();
    })
}


Promise.resolve()
    .then(() => setEnvironment())
    .then(() => loadFramework())
    .then(() => loadEvents())
    .then(() => loadCommands())
    .then(() => {
        console.log(`${color.green}*** All loaded successfully ***${color.white}`);
        client.login(ENV.TOKEN);
    });




const settings = (queue, song) =>
    `**Volume**: \`${queue.node.volume}%\` | **Loop**: \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'All' : 'ONE') : 'Off'}\``;


player.events.on('playerStart', (queue, track) => {
    if (queue.repeatMode !== 0) return;
    queue.metadata.channel.send({ embeds: [embed.Embed_play("Sedang memutar", track.title, track.url, track.duration, track.thumbnail, settings(queue))] });
});

player.events.on('audioTrackAdd', (queue, track) => {
    if (queue.isPlaying())
        queue.metadata.channel.send({ embeds: [embed.Embed_play("Ditambahkan", track.title, track.url, track.duration, track.thumbnail, settings(queue))] });
});

player.events.on('playerError', (queue, error) => {
    console.log(`I'm having trouble connecting => ${error.message}`);
});

player.events.on('error', (queue, error) => {
    console.log(`There was a problem with the song queue => ${error.message}`);
});

player.events.on('emptyChannel', (queue) => {
    if (!client.config.autoLeave)
        queue.node.stop();
});