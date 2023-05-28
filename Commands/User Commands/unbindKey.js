const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');
const Key = require('../../Structures/Schemas/KeysDB');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unbind')
    .setDescription('Unbind the key')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
    .addStringOption(option => option.setName('key').setDescription('The key to unbind').setRequired(true)),
  /**
   * 
   * @param {ChatInputCommandInteraction} interaction 
   */
  async execute(interaction) {
    const user = interaction.user;
    const key = interaction.options.getString('key');

    const keyDoc = await Key.findOne({ key: key });

    if (!keyDoc || keyDoc.userId !== user.id) {
      await interaction.reply({ content: 'This key does not exist or it is not bound to your account.', ephemeral: true });
      return;
    }

    if (keyDoc.unbindCooldown && keyDoc.unbindCooldown > Date.now()) {
      await interaction.reply({ content: 'This key cannot be unbound yet due to cooldown.', ephemeral: true });
      return;
    }

    keyDoc.userId = null;

    const cooldownDate = new Date();
    cooldownDate.setDate(cooldownDate.getDate() + 30);
    keyDoc.unbindCooldown = cooldownDate;

    await keyDoc.save();

    await interaction.reply("Key unbound");
  },
};
