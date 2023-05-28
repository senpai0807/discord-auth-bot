const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');
const fetch = require('node-fetch');
const settings = require("../../Structures/config.json");

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
    var memberRole = server.roles.cache.find((role) => role.name === "member");
    let member = server.members.cache.get(user.id);

    const key = options.getString('key');
    const date = new Date();
    const payload = {
      user: key,
      client: user.id,
      avatar: user.avatar,
      date: date.toLocaleDateString(),
    };

    fetch(`${settings.siteBase}/user/key/bind`, {
      headers: {
        "content-type": "application/json",
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      body: JSON.stringify(payload),
      method: "POST",
      mode: "cors",
    }).then((response) => {
      response.json().then(async function (json) {
        if (json["status"] === "binded") {
          await interaction.reply("Welcome to LunarAIO");
          member.roles.add(memberRole);
        } else {
          await interaction.reply({ content: 'Something went wrong with the binding.', ephemeral: true });
        }
      });
    }).catch(async (err) => {
      console.error(err);
      await interaction.reply({ content: 'Something went wrong with the binding.', ephemeral: true });
    });
  },
};
