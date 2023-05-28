# Discord Auth Bot For Your Applications 🌙
## How To Use
This bot is pretty much plug and play. Navigate to the config.json located in the Structures folder and fill out all nessessary inputs. 
The next thing you need to do it navigate to the serverInfo.json file to set your serverName, thumbnail, and hexColor. (This will be the info displayed on the embeds.)
After inputting everything, simply run `npm install or npm i`
Then run `npm start`

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
- Integrate something that deletes the keys after x amount of time
- Removing the use of a sitebase and have it locally running using Express server.
- Update /reset command to work with the removal of the sitebase.
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
