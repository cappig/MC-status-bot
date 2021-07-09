# MC status bot

Let everyone in your Discord server quickly see the status of a mc server:

![img1](https://i.ibb.co/kQ05Pjx/example1.png)

Create graphs, and log the status of a server:

![img2](https://i.ibb.co/grR1NY9/chartex.png)

<br>

## **[Add this bot tou your server](https://discord.com/api/oauth2/authorize?client_id=816747912888975362&permissions=8&scope=bot)**
The bot needs the admin permission to create modify and remove the channels.

<br>

## *Commands*
**Admin command:**

`mc!log [on/off]` Turn logging on or off. 

`mc!setip [ip]` Set the main ip. This will edit config.json

`mc!setup` Create the two channels that will display the server status.

<br>

**Normal commands:**

`mc!ping [ip]` Ping a specified ip. You can use the command with no arguments to ping the ip specified in the config.

`mc!log uptime` Create a chart of players online over time on the server.

`mc!log playersonline` Create a chart of server uptime and calculate the uptime percentage.

<br>

# Logging in the database
```json
{
    "_id":"0000000000000000",
    "logs": {
        1: {
            "online": true,
            "playersOnline": 4,
            "playernamesonline": "player1, player2,player3, player4",
            "timestamp": "2021-06-23T12:26:15.367+00:00"
        },

        . . .

    }
}
```
The `_id` is the discord guild id. 

When the bot leaves a server all logs and info connected to that servers guild id will be deleted.

still working on the readme . . . 