const fs = require('fs');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { Guilds, GuildMembers, GuildMessages, GuildMessageReactions, MessageContent, GuildVoiceStates, DirectMessages, DirectMessageTyping } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Channel } = Partials;

const client = new Client ({ 
    intents: [ Guilds, GuildMembers, GuildMessages, GuildMessageReactions, MessageContent, GuildVoiceStates, DirectMessages, DirectMessageTyping ],
    partials: [ User, Message, Channel, GuildMember, ThreadMember ] 
});

const { loadEvents } = require('./Handlers/eventHandler');

client.config = require('./config.json');
client.commands = new Collection();
client.events = new Collection();


const { connect } = require('mongoose');
connect(client.config.DatabaseURL, {
}).then(() => console.log('The client is now connected to the database.'));

loadEvents(client);

const Key = require('../Structures/Schemas/KeysDB');

setInterval(async () => {
    const currentDate = new Date();

    const keys = await Key.find({
        isBinded: false,
        $or: [
            { created: { $lte: new Date(currentDate.getTime() - 24 * 60 * 60 * 1000) } },
            { unbindCooldown: { $lte: new Date(currentDate.getTime() - 24 * 60 * 60 * 1000) } }
        ]
    });

    for (let key of keys) {
        await key.remove();
    }

}, 12 * 60 * 60 * 1000);

setInterval(async () => {
    const keys = await Key.find({});

    const formattedKeys = keys.map(key => ({
        key: key.key,
        created: key.created,
        expires: key.expires,
        isBinded: key.isBinded,
        keyType: key.keyType
    }));

    fs.writeFileSync('keys.json', JSON.stringify(formattedKeys, null, 2));

}, 60 * 60 * 1000);


client.login(client.config.token);
