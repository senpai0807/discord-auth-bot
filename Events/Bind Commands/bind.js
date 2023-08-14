const Key = require('../../Structures/Schemas/KeysDB');
const fs = require('fs');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
    if (!message.content.startsWith('!bind ')) return;
    const key = message.content.slice(6);

    const serverData = JSON.parse(fs.readFileSync('serverInfo.json'));
    const serverInfo = serverData;
    const guildId = serverData.guildId;

    const keyDoc = await Key.findOne({ key: key });

    if (!keyDoc || keyDoc.expires < Date.now()) {
      await message.reply('Invalid key or key has expired.');
      return;
    }

    const existingKey = await Key.findOne({ userId: message.author.id });
    if (existingKey) {
      await message.reply('You already have a key bound to your account.');
      return;
    }

    if (keyDoc.userId && keyDoc.userId !== message.author.id) {
      await message.reply('This key is already bound to another user.');
      return;
    }

    keyDoc.userId = message.author.id;
    
    const now = new Date();
    keyDoc.unbindCooldown = new Date(now.setDate(now.getDate() + 45));
    
    await keyDoc.save();

    const guild = message.client.guilds.cache.get(guildId);
    if (!guild) return message.reply('Error: Guild not found.');

    const member = await guild.members.fetch(message.author.id);
    if (!member) return message.reply('Error: Member not found in the guild.');

    const roleId = serverInfo.roleId;
    await member.roles.add(roleId);

    const bindedEmbed = new EmbedBuilder()
      .setTitle(`Welcome 🌙`)
      .setColor(serverInfo.hexColor)
      .setDescription(`Welcome ${message.author.username}, to Lunar Tools`)
      .setThumbnail(serverInfo.thumbnail)
      .setTimestamp()
      .setFooter({ text: serverInfo.serverName, iconURL: serverInfo.thumbnail });

    await message.reply({ embeds: [bindedEmbed] });
}};
