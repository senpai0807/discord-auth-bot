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
- Removing the use of a sitebase and have it locally running using Express server.
- Update /reset command to work with the removal of the sitebase.
- Add stripe integration to setup subscription for renewals.

# Usage
I don't really care if you pull this git and make it your own. I made this specifically because I don't see many discord auth bots be open-sourced. 

# Notes
This auth bot is created with DiscordJS v13 using interactions so users can't bind the keys through DMs. You'll have to create a channel named "bind-keys" and set the View Channel permission to let everyone see. The bot will automatically remove the permission for them to see after they bind their key. The resonse is also ephemeral so you don't have to worry about others seeing. But if you're still worried about that, then you're more than welcome to rewrite the entire bot to use MessageCreate instead of interactions.
