const express = require("express");
const { lookup } = require('../../modules/cache.js');
const {isLoggedIn, findGuildId} = require("../modules/middleware.js");
const {genChart} = require("../modules/chart.js");

const router = express.Router();

router.use(isLoggedIn);

// Dash page
router.get('/', function(req, res) {
    res.render('dashboard', {servers: req.user.guilds, user: req.user, subtitle: '- Dashboard'});
});

// Specific dash config
router.get('/:id/general', findGuildId, async(req, res) => {
    const data = await lookup('Server', req.params.id);

    res.render('panelgeneral', {server: req.guild, serverdata: data, user: req.user, subtitle: '- Dashboard | general'});
});
router.get('/:id/setup', findGuildId, async(req, res) => {
    const data = await lookup('Server', req.params.id);

    res.render('panelsetup', {server: req.guild, serverdata: data, user: req.user, subtitle: '- Dashboard | setup'});
});
router.get('/:id/chart', findGuildId, async(req, res) => {
    const logs = await lookup('Log', req.params.id);
    if (!logs) res.render('panelchart', {server: req.guild, subtitle: '- Dashboard | charts'});

    const optionsP = genChart(logs, 'playersonline')
    const optionsA = genChart(logs, 'mostactive')
    const optionsU = genChart(logs, 'uptime')

    res.render('panelchart', {optionsP: JSON.stringify(optionsP), optionsA: JSON.stringify(optionsA), optionsU: JSON.stringify(optionsU), server: req.guild, user: req.user, subtitle: '- Dashboard | charts'});
});

// Post routes for form submission
router.post('/:id/general', async function(req, res) {
    const client = global.client;
    const commands = [ ...client.commands.values()]

    const guild = client.guilds.cache.get(req.params.id);
    const user =  await client.users.fetch(req.session.passport.user._id);

    const message = {};
    message.guild = guild;
    message.channel = user;

    if (req.body.ip){
        //const setip = commands.find(element => element.name == 'setip');
        //await setip.execute(message, req.body.ip, client, true)
    }
    if (req.body.logging){
        const log = commands.find(element => element.name == 'log');
        await log.execute(message, req.body.logging, client, true)
    }

    res.redirect(`/dash/${req.params.id}/general`)
});
router.post('/:id/setup', async function(req, res) {
    const client = global.client;
    const commands = [ ...client.commands.values()]

    const guild = client.guilds.cache.get(req.params.id);
    const user =  await client.users.fetch(req.session.passport.user._id)
    const setup = commands.find(element => element.name == 'setup');

    const message = {};
    message.guild = guild;
    message.channel = user;

    await setup.execute(message, req.body.ip, client, true)

    res.redirect(`/dash/${req.params.id}/setup`)
});

module.exports = router;