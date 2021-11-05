const express = require("express");
const compression = require("compression");
const path = require("path");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const passport = require("passport");

const port = process.env.PORT || 3000;
const app = express();

require('./modules/passport.js');

// Session config
const store = new MongoDBStore({
  uri: process.env.DBURL,
  collection: 'Sessions',
  clear_interval: 3600 // Clear old sessions every hour
});
store.on('error', function(error) {
  console.error(error);
});
app.use(
  session({
    name : 'SessionID',
    secret: process.env.SESSIONSECRET,
    cookie: {
      maxAge: 60000 * 60 * 168 // 7 days
    },
    resave: true,
    saveUninitialized: true,
    store
  })
);

// Get commands
const client = global.client;
const commands = [ ...client.commands.values()]
global.commands = commands;

// Start passport
app.use(passport.initialize());
app.use(passport.session());

// Configure app
app.set('view engine', 'pug')

app.set('views', path.join(__dirname, '../dashboard/views'))
app.set('includes', path.join(__dirname, '../dashboard/views/includes'))

// Compression middleware
app.use(compression())

// BodyParser middleware
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// Set public folder with CSS and clint side JS
app.use(express.static(`${__dirname}/public`));
app.locals.basedir = `${__dirname}/public`;

// Routes
const mainRoutes = require('./routes/main');
const authRoutes = require('./routes/auth');
const APIRoutes = require('./routes/api');
const dashRoutes = require('./routes/dash');

app.use("/", mainRoutes, authRoutes)
app.use("/api", APIRoutes)
app.use("/dash", dashRoutes)
app.get('*', function(req, res){
  res.render('404', {user: req.user, subtitle: '- Page not found'});
});

app.listen(port, () => console.log(` Dashboard is up and running on port ${port}`))