// Sreate a API to allow communications between bot and dashboard
const express = require("express");

const port = process.env.PORT || 3100;
const app = express();

app.get('/commands', function(req, res) {
    commands = [ ...global.client.commands.values()]

    res.json({commands});
});

app.get('/guild/:id', function(req, res) {
    res.json({data: global.client.guilds.cache.get(req.params.id)});
});

// Only accept local requests
app.listen(port, 'localhost', () => console.log(` Dashboard is up and running on port ${port}`))