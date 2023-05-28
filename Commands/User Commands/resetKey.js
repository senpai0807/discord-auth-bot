const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require('discord.js');
const fetch = require('node-fetch');
const settings = require("../../Structures/config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reset')
    .setDescription('Reset key command')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    
  /**
   * 
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction) {
    const user = interaction.user;
    var date = new Date();
    var payload = {
      client: user.id,
      avatar: user.avatar,
      date: date.toLocaleDateString(),
    };

    fetch(`${settings.siteBase}/user/key/reset`, {
      headers: {
        "content-type": "application/json",
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      body: JSON.stringify(payload),
      method: "POST",
      mode: "cors",
    }).then((response) => {
      response.json().then(function (json) {
        if (json["status"] === "reset") {
          interaction.reply("Key reset");
        }
      });
    });
  }
};
