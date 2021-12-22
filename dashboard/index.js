const express = require("express");
const compression = require("compression");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require('mongoose');
const passport = require("passport");
const path = require("path");
const redis = require("redis");
const axios = require('axios');
require('dotenv').config({ path: '../.env' })

const port = process.env.PORT || 3000;
const app = express();

const redisclient = redis.createClient();
global.redisclient = redisclient;

require('./modules/passport.js');

mongoose.connect(process.env.DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('\x1b[2m%s\x1b[0m', '   ⤷ Connected to database!'))
  .catch((err) => console.error(err));

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

axios.get('http://localhost:3100/commands').then(res => {
  console.log(res.data)
  global.commands = res.data.commands;
});

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