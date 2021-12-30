
// API to facilitate communications between bot and dashboard
const fastify = require('fastify')

const port = process.env.APIPORT || 3100
const app = fastify()

app.register(require('fastify-cors'));

// Info routes - used to get data from the bot
app.get('/', (req, res) => {
    return res.send({msg: "No place like 127.0.0.1 . . ."})
})

app.get('/commands', (req, res) => {
    return res.send([ ...global.client.commands.values()])
})

app.get('/guild/:id', (req, res) => {
    return res.send(global.client.guilds.cache.get(req.params.id))
})

app.listen(port, '127.0.0.1', () => {
    console.log(`Backend API is up and running on port ${port}`)
})