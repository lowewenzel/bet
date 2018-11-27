const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const flash = require('connect-flash');
const routes = require('../index.route');

const config = require('./config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.use(express.static(`${__dirname}/public`));


app.use(cookieParser(config.cookieSecret));
app.use(session({
  cookie: { maxAge: 60000 },
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());

app.use(cors());

app.use(routes);

module.exports = app;
