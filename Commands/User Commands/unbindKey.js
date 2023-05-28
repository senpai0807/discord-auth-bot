const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');
const fetch = require('node-fetch');
const settings = require("../../Structures/config.json");

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
    const date = new Date();
    const payload = {
      user: key,
      client: user.id,
      date: date.toLocaleDateString(),
    };

    fetch(`${settings.siteBase}/user/key/unbind`, {
      headers: {
        "content-type": "application/json",
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      body: JSON.stringify(payload),
      method: "POST",
      mode: "cors",
    }).then((response) => {
      response.json().then(async function (json) {
        if (json["status"] === "unbinded") {
          await interaction.reply("Key unbound");
        } else {
          await interaction.reply({ content: 'Something went wrong unbinding the key.', ephemeral: true });
        }
      });
    }).catch(async (err) => {
      console.error(err);
      await interaction.reply({ content: 'Something went wrong unbinding the key.', ephemeral: true });
    });
  },
};
