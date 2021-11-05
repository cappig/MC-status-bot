const express = require("express");

const router = express.Router()

// Landing page
router.get('/', function(req, res) {
    res.render('index', {user: req.user})
});

// About page
router.get('/about', function(req, res) {
    res.render('about', {user: req.user, subtitle: '- About the bot'});
});

// Invite
router.get('/invite', function(req, res) {
    res.redirect('https://discord.com/oauth2/authorize?client_id=816747912888975362&scope=bot&permissions=268749904');
});

// Commands page
router.get('/commands', function(req, res) {
    const commands = global.commands;
    res.render('commands', {user: req.user, subtitle: '- Bot commands', commands});
});

module.exports = router;