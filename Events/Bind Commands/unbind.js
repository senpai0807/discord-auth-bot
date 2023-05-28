const Key = require('../../Structures/Schemas/KeysDB');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
    if (!message.content.startsWith('!unbind ')) return;
    const key = message.content.slice(8);

    const keyDoc = await Key.findOne({ key: key });

    if (!keyDoc || keyDoc.userId !== message.author.id) {
      await message.reply('This key does not exist or it is not bound to your account.');
      return;
    }

    if (keyDoc.unbindCooldown && keyDoc.unbindCooldown > Date.now()) {
      await message.reply('This key cannot be unbound yet due to cooldown.');
      return;
    }

    keyDoc.userId = null;
    await keyDoc.save();

    await message.reply('Key unbound');
}}; 