const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');
const settings = require("../../Structures/config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete a number of messages')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption(option => option.setName('count').setDescription('Number of messages to delete').setRequired(true)),

  /**
   * 
   * @param {ChatInputCommandInteraction} interaction 
   */
  async execute(interaction) {
    const guild = await interaction.client.guilds.fetch(settings.serverID);
    const member = await guild.members.fetch(interaction.user.id);
    const count = interaction.options.getInteger('count');

    if (member.roles.cache.some((role) => role.name === "owner")) {
      try {
        const messages = await interaction.channel.bulkDelete(count);
        console.log(`Bulk deleted ${messages.size} messages`);
        await interaction.reply(`Successfully deleted ${messages.size} messages.`);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Error while trying to delete messages.', ephemeral: true });
      }
    } else {
      await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }
  }
};
