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
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false
  })
  .then(() => console.log('The client is now connected to the database.'))
  .catch(err => console.error('An error occurred while connecting to the database:', err));

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
        if (key && typeof key.remove === 'function') {
            await key.remove();
        }
    }

}, 12 * 60 * 60 * 1000);

setInterval(async () => {
    const keys = await Key.find({});

    const formattedKeys = keys.map(key => ({
        key: key.key,
        created: key.created,
        expires: key.expires,
        isBinded: key.isBinded,
        keyType: key.keyType,
        blacklist: key.blacklist,
    }));

    fs.writeFileSync('keys.json', JSON.stringify(formattedKeys, null, 2));

}, 60 * 1000);

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const port = 3000;

app.use(express.static('public'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

let blacklist = [];

app.post('/blacklist', async (req, res) => {
    const { licenseKey, ip, deviceName } = req.body;

    const key = await Key.findOne({ key: licenseKey });
    if (key) {
        key.blacklist = true;
        await key.save();
    }

    blacklist.push({ licenseKey, ip, deviceName });
    res.json({ message: 'User has been blacklisted.' });
});

app.post('/auth', async (req, res) => {
    const { licenseKey, deviceName, deviceID, ip } = req.body;
    console.log(`Received license key: ${licenseKey} from device: ${deviceName}`);

    const userKey = await Key.findOne({ key: licenseKey });

    if (!userKey) {
        return res.status(401).json({ message: 'InvalidLicenseKey' });
      }

    if (userKey.blacklist) {
        return res.status(401).json({ message: 'This user is blacklisted.' });
    }

    if (userKey.expires < new Date()) {
        return res.status(401).send('Authentication failed: License key has expired.');
    }

    const currentDevice = { deviceID, ip };

    if (userKey.activeDevices.length >= 2) {
        for(let device of userKey.activeDevices) {
            if(device.deviceID === deviceID && device.ip === ip) {
                const user = await client.users.fetch(userKey.userId);

                return res.json({
                    message: 'Authentication successful.',
                    discordId: userKey.userId,
                    discordName: user.username,
                });
            }
        }
        return res.status(401).json({ message: 'MaxInstancesReached' });
    }

    userKey.activeDevices.push(currentDevice);
    await userKey.save();

    const user = await client.users.fetch(userKey.userId);

    res.json({
        message: 'Authentication successful.',
        discordId: userKey.userId,
        discordName: user.username,
    });
});

app.listen(port, () => console.log(`Server is running on port ${port}.`));


client.login(client.config.token);
