const { loadCommands } = require('../../Structures/Handlers/commandHandler');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.username}`);

        loadCommands(client);
    }
}
