# MC status bot :robot: :chart_with_upwards_trend:

Let everyone in your Discord server quickly see the status of a minecraft server:

![img1](https://i.ibb.co/kQ05Pjx/example1.png)

Create graphs, and log the status of a server:

![img2](https://i.ibb.co/grR1NY9/chartex.png)

### :arrow_right: **[Add this bot to your server](https://discord.com/oauth2/authorize?client_id=816747912888975362&scope=bot&permissions=268749904)**

## *Commands*
**Admin command:**

`mc!help` List all the commands and what they do.

`mc!log [on/off]` Turn logging on or off. 

`mc!setip [ip]` Set the ip that will be monitored.

`mc!setup` Create the two channels that will display the server status.

`mc!rmchann` Removes the monitoring channels

<br>

**Normal commands:**

`mc!ping [ip]` Ping a specified ip. You can use the command with no arguments to ping the ip specified by using the `mc!setip` command.

`mc!log uptime` Create a chart of players online over time on the server.

`mc!log playersonline` Create a chart of server uptime and calculate the uptime percentage.

`mc!log mostactive` Create a bar chart with the number of minutes each player spent on th server.

`mc!news` Get the latest articles from minecraft.net

## :information_source: *Notes*
* Read the privacy policy [here.](https://github.com/cappig/MC-status-bot/blob/main/miscellaneous/Privacy_policy.md)
* Logging is turned off by default! Turn it on by using the `mc!log on` command.
* The bot logs the status of the server every 5 minutes and it keeps 24 hours of logs. 
* When the bot leaves a server all logs and info connected to that servers guild id will be deleted.
* This bot is still very new so there are bound to be some bugs. Please report any that you encounter [as a issue on github.](https://github.com/cappig/MC-status-bot/issues)