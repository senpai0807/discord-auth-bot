const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const Key = require('../../Structures/Schemas/KeysDB');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reset')
    .setDescription('Reset active devices command')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    
  /**
   * 
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction) {
    const user = interaction.user;
    const serverData = JSON.parse(fs.readFileSync('serverInfo.json'));
    const serverInfo = serverData;

    const userKey = await Key.findOne({ userId: user.id });

    if (!userKey) {
      return interaction.reply('No license key found for this user.');
    }

    userKey.activeDevices = [];

    await userKey.save();

    const resetEmbed = new EmbedBuilder()
    .setTitle('Success')
    .setColor(serverInfo.hexColor)
    .setDescription('Key has successfully been reset!')
    .setTimestamp()
    .setFooter({ text: serverInfo.serverName, iconURL: serverInfo.thumbnail });

    interaction.reply({ embeds: [ resetEmbed] });
  }
};
