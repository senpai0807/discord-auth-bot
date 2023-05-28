const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../Structures/config.json');
const Key = require('../../Structures/Schemas/KeysDB');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('managekeys')
    .setDescription('Bind or unbind a license key for a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option => option.setName('password').setDescription('Enter your password').setRequired(true))
    .addUserOption(option => option.setName('user').setDescription('Select the user').setRequired(true))
    .addStringOption(option => option.setName('key').setDescription('Enter the license key').setRequired(true))
    .addStringOption(option => 
      option.setName('action')
      .setDescription('Select action')
      .setRequired(true)
      .addChoices(
        { name: 'Bind', value: 'bind' },
        { name: 'Unbind', value: 'unbind' }
    )
),
  /**
   * 
   * @param {ChatInputCommandInteraction} interaction 
   */
  async execute(interaction) {
    const { options } = interaction;

    const password = options.getString('password');
    
    if (password !== config.adminPassword) {
      await interaction.reply({ content: 'Wrong password.', ephemeral: true });
      return;
    }

    const user = options.getUser('user');
    const keyStr = options.getString('key');
    const action = options.getString('action');

    const keyDoc = await Key.findOne({ key: keyStr });
    if (!keyDoc) {
      await interaction.reply({ content: 'Invalid key.', ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`Key Management`)
      .addField('User', user.tag)
      .addField('Key', keyStr)
      .setTimestamp();

    if (action === 'bind') {
      keyDoc.userId = user.id;
      await keyDoc.save();
      embed.setColor('GREEN');
      embed.setDescription(`Key ${keyStr} successfully bound to user ${user.tag}.`);
      await interaction.reply({ embeds: [ embed ] });

    } else if (action === 'unbind') {
      if (keyDoc.userId !== user.id) {
        await interaction.reply({ content: 'This key is not bound to the selected user.', ephemeral: true });
        return;
      }
      keyDoc.userId = null;
      await keyDoc.save();
      embed.setColor('RED');
      embed.setDescription(`Key ${keyStr} successfully unbound from user ${user.tag}.`);
      await interaction.reply({ embeds: [ embed ] });
    }
  },
};
