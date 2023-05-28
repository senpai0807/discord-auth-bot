const Key = require('../../Structures/Schemas/KeysDB');
const fs = require('fs');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
    if (!message.content.startsWith('!unbind ')) return;
    const key = message.content.slice(8);

    const serverData = JSON.parse(fs.readFileSync('serverInfo.json'));
    const serverInfo = serverData;

    const keyDoc = await Key.findOne({ key: key });

    if (!keyDoc || keyDoc.userId !== message.author.id) {
      await message.reply('This key does not exist or it is not bound to your account.');
      return;
    }

    if (keyDoc.unbindCooldown && keyDoc.unbindCooldown > Date.now()) {
      await message.reply('This key cannot be unbound yet due to cooldown.');
      return;
    }

    const roleId = serverInfo.roleId;
    const member = message.guild.members.cache.get(message.author.id);
    await member.roles.remove(roleId);

    keyDoc.userId = null;
    await keyDoc.save();


    const unbindEmbed = new EmbedBuilder()
        .setTitle('Success')
        .setColor(serverInfo.hexColor)
        .setDescription('License key has been unbinded.')
    await message.reply({ embeds: [ unbindEmbed ] });
}};
