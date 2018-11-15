const express = require('express');
const path = require('path');
const routes = require('./routes/index');
const locale_routes = require('./routes/locale_account');
const bodyParser = require('body-parser');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);
app.use('/locale_accounts', locale_routes);
app.use(express.static('public'));

module.exports = app;