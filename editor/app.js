/*
 * Grundämnen.se redigerings modul
 * Created by Joar C & Gustav E
 *
 */

module.exports = {};

// Required libraries
// Express related
var express = require('express');
var session = require("express-session");
var logger = require('morgan');
var helmet = require("helmet");
var favicon = require('serve-favicon');

// MongoDB
var MongoStore = require('connect-mongo')(session);

// Own
var replaceAll = require('../global/modules/utils/functions.js').replaceAll;
var isInArray = require('../global/modules/utils/functions.js').isInArray;
var site_data = require("./data/data.json");
var pwman = require('./modules/utils/password.js');
var globvars = require('../global/vars.json');

// Misc
var fs = require('fs');
var util = require('util');
var path = require('path');

// Express data
var db_info = {};
if (process.env.NODE_ENV !== "production") {
  db_info = globvars.mongodb.development;
} else {
  db_info = globvars.mongodb.production;
}
var mongopath = "mongodb://"+db_info['hostname']+":"+db_info['port']+"/"+db_info['db'];
var sessionconfig = require("../global/session.config.json");
sessionconfig.expires = new Date(Date.now()+60*60*1000*3);
sessionconfig.store = new MongoStore({ url: mongopath });

// Init Express
var app = express();
app.use(logger("dev"));
app.use(helmet());
app.use(helmet.contentSecurityPolicy(require('./data/helmet.csp.json')));
app.use(session(sessionconfig));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.enable('trust proxy');
app.disable('x-powered-by');

// Variables
var elements = globvars.elements;
var settingsPages = ["profile", "approve", "users", "superadmin"];

// Express render engine
app.engine('html', function (fp, options, callback) {
  fs.readFile(fp, function (err, content) {
    if (err) return callback(new Error(err));

    var rendered = content.toString();
    //rendered = replaceAll(rendered, "%table%", table.getTable());

    for (var key in site_data) {
      if (!site_data.hasOwnProperty(key)) continue;
      rendered = replaceAll(rendered, "%"+key+"%", site_data[key]);
    }

    return callback(null, rendered);
  });
});

// Set Express variables
app.set('views', './views');
app.set('view engine', 'html');
if (process.env.NODE_ENV != "production") {
  app.use("/css", express.static(__dirname + "/static/css"));
  app.use("/img", express.static(__dirname + "/static/img"));
  app.use("/js",  express.static(__dirname + "/static/js"));
  app.use(favicon(__dirname + "/static/favicon.ico"));
}
var router = express.Router();

router.get('/', function(req, res){
  if (req.session.user != null) {
    res.render('index', {user: req.session.user});
  } else {
    res.redirect("/login");
  }
});

router.get('/login', function(req, res){
  if (req.session.user != null && req.session.user.logged_in) {
    res.redirect("/logout");
  } else {
    res.render('login', {"login": true});
  }
});
router.get('/logout', function(req, res){
  req.session.destroy(function(err){if(err)console.log(err)});
  res.redirect('/');
});


router.get('/om', function(req, res){
  res.render('om');
});

// TODO: Ska vi ha någon annan kod för att hantera denna del av sidan?
// Kommenterar bort denna kod för tillfället.
/*
router.get('/info', function(req, res){
  res.render('info');
});
*/

// TODO: Planera om denna del och flytta DB-requests till API
router.get(['/settings','/settings/:page'], function(req, res){
  if (req.session.user != null) {
    if (req.params.page != null && isInArray(req.params.page, settingsPages)) {
      res.render("settings/"+req.params.page, {user: req.session.user});
    } else {
      res.redirect("/settings/profile");
    }
  } else {
    res.redirect("/");
  }
});

router.get('/:elm', function(req, res, next){
  res.render("index");
});

app.use(router);

module.exports.router = router;
module.exports.app = app;
