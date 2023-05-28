const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Key = require('../../Structures/Schemas/KeysDB');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('key')
    .setDescription('Get the status of the key')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  /**
   * 
   * @param {ChatInputCommandInteraction} interaction 
   */
  async execute(interaction) {
    const user = interaction.user;

    const serverData = JSON.parse(fs.readFileSync('serverInfo.json'));
    const guildId = interaction.guildId;
    const serverInfo = serverData[guildId];

    const keyDoc = await Key.findOne({ userId: user.id });

    if (!keyDoc) {
      await interaction.reply({ content: 'You do not have a key bound to your account.', ephemeral: true });
      return;
    }

    const keyStatusEmbed = new EmbedBuilder()
      .setColor(serverInfo.hexColor)
      .setTitle("Current License")
      .addFields(
        { name: "Key", value: keyDoc.key },
        { name: "Created", value: keyDoc.created.toLocaleString() },
        { name: "Expires", value: keyDoc.expires.toLocaleString() },
        { name: "User ID", value: keyDoc.userId },
        { name: "Key Type", value: keyDoc.keyType.charAt(0).toUpperCase() + keyDoc.keyType.slice(1) },
        { name: "Unbind Cooldown", value: keyDoc.unbindCooldown ? keyDoc.unbindCooldown.toLocaleString() : "N/A" }
      )
      .setThumbnail(serverInfo.thumbnail)
      .setTimestamp()
      .setFooter({ text: serverInfo.serverName, iconURL: serverInfo.thumbnail });

    await interaction.reply({ embeds: [keyStatusEmbed] });
  },
};
