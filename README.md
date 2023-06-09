# Discord Auth Bot For Your Applications 🌙
## How To Use
Navigate to the config.json located in the Structures folder and fill out all nessessary inputs. 
The next thing you need to do it navigate to the serverInfo.json file to set your serverName, thumbnail, and hexColor. (This will be the info displayed on the embeds.)
After inputting everything, simply run `npm install or npm i`
Then run `npm start`

#Warning
Though everything I have included makes things almost virtually plug & play, there is still changes you need to make depending on how your app works. There's a lot of things I couldn't account for because everything apps auth, key generation, etc is different. So if you already have a key generation, database, and auth system integrated, **You will have to do a rewrite**. If you **don't** have an auth system or any form of licensing for your app, then this will be perfect for you.

# Deployment
Note: You must input the following required inputs into the config.json located in the Structures folder or it will not execute.
```
# Clone the project
git clone https://github.com/senpai0807/discord-auth-bot.git

# Navigate to the project
cd discord-auth-bot

#Start the discord bot
npm start
```

# Road Of Development
Next updates: 
- Add stripe integration to setup subscription for renewals.

# Usage
I don't really care if you pull this git and make it your own. I made this specifically because I don't see many discord auth bots be open-sourced. 

# Commands
```
# Slash Commands
- /help: Displays instructions to user.
- /key: Displays status of the key such as license key, exp, etc
- /generate <password> <type>: Admin command to generate license keys
- /getunbindedkeys: Admin command to display all keys that are currently unbinded

# Prefix Commands
- !bind <key>: Binds key to user
- !unbind <key>: Unbinds key from user
```

# Notes
I have an unbind cooldown hard set, if you would like that removed, just navigate to the bind commmand located in Events/Bind Commands and remove these lines
```
const now = new Date();
keyDoc.unbindCooldown = new Date(now.setDate(now.getDate() + 45));
```
then navigate to Structures/Schemas/KeysDB.js and remove `unbindCooldown: Date`

# If you would like it to be completely plug and play. Within your application, you can add this:
```
async function promptForLicense() {
  const questions = [
    {
      type: 'input',
      name: 'licenseKey',
      message: 'Enter your license key:',
    },
  ];

  const { licenseKey } = await inquirer.prompt(questions);

  
  const settingsPath = path.join(__dirname, 'User Data', 'settings.json');
  let settings = {};
  if (fs.existsSync(settingsPath)) {
    settings = JSON.parse(fs.readFileSync(settingsPath));
  }
  settings.licenseKey = licenseKey;
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

  return licenseKey;
}

async function authenticateUser(licenseKey) {
  const deviceName = os.hostname();
    console.log(`Sending license key to server: ${licenseKey}, Device Name: ${deviceName}`);
  try {
    const response = await axios.post('http://localhost:3000/auth', {
      licenseKey,
      deviceName,
    });

    if (response.status === 200) {
      return {
        discordId: response.data.discordId,
        discordName: response.data.discordName,
      };
    }
  } catch (err) {
    console.error('Authentication failed:', err.message);
    return false;
  }
}

(async () => {
  let licenseKey;
  const settingsPath = path.join(__dirname, 'User Data', 'settings.json');
  if (fs.existsSync(settingsPath)) {
    const settings = JSON.parse(fs.readFileSync(settingsPath));
    if (settings.licenseKey) {
      licenseKey = settings.licenseKey;
    }
  }

  if (!licenseKey) {
    licenseKey = await promptForLicense();
  }

  const user = await authenticateUser(licenseKey);

  if (!user) {
    console.log('Invalid license key. Shutting down.');
    process.exit(1);
  }

  console.log(`Welcome ${user.discordName}!`);
```
Make sure if you make any changes to the port, you make the changes in both the auth bot and where it says `const response = await axios.post('http://localhost:3000/auth'` => **Update:** You should use an application like Ngrok to forward the request of your express server to auth in your application so you can remove the need to host the application and auth bot on the same machine. In your application replace `const response = await axios.post('http://localhost:3000/auth'` with `const response = await axios.post('<Ngrok Endpoint>/auth'`
