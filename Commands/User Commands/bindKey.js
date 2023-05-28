const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');
const Key = require('../../Structures/Schemas/KeysDB');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bind')
    .setDescription('Bind a key')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
    .addStringOption(option => option.setName('key').setDescription('Enter your key').setRequired(true)),
  /**
   * 
   * @param {ChatInputCommandInteraction} interaction 
   */
  async execute(interaction) {
    const { options } = interaction;
    const user = interaction.user;
    let server = interaction.guild;
    var memberRole = server.roles.cache.get('1088740102370492466');
    let member = server.members.cache.get(user.id);
    const bindChannel = server.channels.cache.find(channel => channel.name === "bind-key");

    const serverData = JSON.parse(fs.readFileSync('serverInfo.json'));
    const guildId = interaction.guildId;
    const serverInfo = serverData[guildId];

    const key = options.getString('key');

    const keyDoc = await Key.findOne({ key: key });

    if (!keyDoc || keyDoc.expires < Date.now()) {
      await interaction.reply({ content: 'Invalid key or key has expired.', ephemeral: true });
      return;
    }

    if (keyDoc.userId && keyDoc.userId !== user.id) {
      await interaction.reply({ content: 'This key is already bound to another user.', ephemeral: true });
      return;
    }

    keyDoc.userId = user.id;
    await keyDoc.save();

    const bindedEmbed = new EmbedBuilder()
      .setTitle(`Welcome to LunarAIO 🌙`)
      .setColor(serverInfo.hexColor)
      .setDescription(`Welcome ${member}, to Lunar AIO`)
      .setThumbnail(serverInfo.thumbnail)
      .setTimestamp()
      .setFooter({ text: serverInfo.serverName, iconURL: serverInfo.thumbnail });

    await interaction.reply({ embeds: [bindedEmbed], ephemeral: true });
    member.roles.add(memberRole);

    bindChannel.permissionOverwrites.edit(member, { ViewChannel: false });
  },
};
