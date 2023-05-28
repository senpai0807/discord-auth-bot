const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const config = require('../../Structures/config.json');
const Key = require('../../Structures/Schemas/KeysDB');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('generate')
    .setDescription('Generate a new key')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option => option.setName('password').setDescription('Enter your password').setRequired(true))
    .addStringOption(option => 
        option.setName('keytype')
        .setDescription('Type of key')
        .setRequired(true)
        .addChoices(
          { name: 'Weekly', value: 'weekly' },
          { name: 'Monthly', value: 'monthly' },
          { name: 'Renewal', value: 'renewal' },
          { name: 'Lifetime', value: 'lifetime' }
        )
    ),
  /**
   * 
   * @param {ChatInputCommandInteraction} interaction 
   */
  async execute(interaction) {
    const { options } = interaction;
    const user = interaction.user;

    const serverData = JSON.parse(fs.readFileSync('serverInfo.json'));
    const serverInfo = serverData;

    const password = options.getString('password');
    
    if (password !== config.adminPassword) {
      await interaction.reply({ content: 'Wrong password.', ephemeral: true });
      return;
    }

    const keytype = options.getString('keytype');

    const date = new Date();
    let expiryDate = new Date();

    switch(keytype) {
      case 'weekly':
        expiryDate.setDate(date.getDate() + 7);
        break;
      case 'monthly':
      case 'renewal':
        expiryDate.setDate(date.getDate() + 30);
        break;
      case 'lifetime':
        expiryDate.setFullYear(date.getFullYear() + 999);
        break;
      default:
        await interaction.reply({ content: 'Invalid key type.', ephemeral: true });
        return;
    }

    const key =
      generate(4) + "-" + generate(4) + "-" + generate(4) + "-" + generate(4);

      const newKey = new Key({
        key,
        created: date,
        expires: expiryDate,
        keyType: keytype,
      });      

    newKey.save()
      .then(async () => {
        const embed = new EmbedBuilder()
          .setTitle('Successfully Generated Key 🌙')
          .setColor(serverInfo.hexColor)
          .setDescription(`Key: ${key}\nExpires: ${expiryDate}\nType: ${keytype}`)
          .setThumbnail(serverInfo.thumbnail)
          .setTimestamp()
          .setFooter({ text: serverInfo.serverName, iconURL: serverInfo.thumbnail })
        await interaction.reply({ embeds: [embed] });

        let keysJSON;
        try {
          keysJSON = JSON.parse(fs.readFileSync('keys.json'));
        } catch(err) {
          keysJSON = [];
        }
        keysJSON.push(newKey);
        fs.writeFileSync('keys.json', JSON.stringify(keysJSON, null, 2));

      }).catch(async (err) => {
        console.error(err);
        await interaction.reply({ content: 'Something went wrong with the key generation.', ephemeral: true });
    });
  },
};

function generate(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678901234567890";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
