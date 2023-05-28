const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const fetch = require('node-fetch');
const settings = require("../../Structures/config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('generate')
    .setDescription('Generate a new key')
    .addStringOption(option => option.setName('password').setDescription('Enter your password').setRequired(true)),

  /**
   * 
   * @param {ChatInputCommandInteraction} interaction 
   */
  async execute(interaction) {
    const { options } = interaction;
    const user = interaction.user;

    const password = options.getString('password');
    const date = new Date();
    const payload = {
      password: password,
      client: user.id,
      date: date.toLocaleDateString(),
    };

    fetch(`${settings.siteBase}/key/generate/lifetime`, {
      headers: {
        "content-type": "application/json",
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      body: JSON.stringify(payload),
      method: "POST",
      mode: "cors",
    }).then((response) => {
      response.json().then(async function (json) {
        if (json["status"] === "Generated") {
          await interaction.reply("Successfully generated key!");
        } else {
          await interaction.reply({ content: 'Something went wrong with the key generation.', ephemeral: true });
        }
      });
    }).catch(async (err) => {
      console.error(err);
      await interaction.reply({ content: 'Something went wrong with the key generation.', ephemeral: true });
    });
  },
};
