const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fetch = require('node-fetch');
const settings = require("../../Structures/config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Get the status of the key')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  /**
   * 
   * @param {ChatInputCommandInteraction} interaction 
   */
  async execute(interaction) {
    const user = interaction.user;
    const date = new Date();
    const payload = {
      user: user.id,
      client: user.id,
      date: date.toLocaleDateString(),
    };

    fetch(`${settings.siteBase}/user/key/status`, {
      headers: {
        "content-type": "application/json",
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      body: JSON.stringify(payload),
      method: "POST",
      mode: "cors",
    }).then((response) => {
      response.json().then(async function (json) {
        if (response.status === 200) {
          const keyStatusEmbed = new EmbedBuilder()
            .setColor("#5665DA")
            .setTitle("Key Status")
            .addFields(
              { name: "Key", value: json["key"][0]["key"] },
              { name: "Type", value: json["key"][0]["type"] },
              { name: "Created", value: json["key"][0]["created"] }
            );
          await interaction.reply({ embeds: [ keyStatusEmbed ] });
        } else {
          await interaction.reply({ content: 'Something went wrong getting the key status.', ephemeral: true });
        }
      });
    }).catch(async (err) => {
      console.error(err);
      await interaction.reply({ content: 'Something went wrong getting the key status.', ephemeral: true });
    });
  },
};
