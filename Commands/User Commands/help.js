const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const settings = require("../../Structures/config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('commands')
    .setDescription('Show the commands available for the bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  /**
   * 
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction) {
    const commandsEmbed = new EmbedBuilder()
      .setColor("#5665DA")
      .addFields({
        name: "To gain access:",
        value: `DM <@${settings.botID}> "/bind <key goes here>"`,
      });

    await interaction.reply({ embeds: [ commandsEmbed ] });
  }
};
