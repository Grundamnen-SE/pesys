/*
 * Grundämnen.se NodeJS Website Engine
 * Created by Joar C & Gustav E
 *
 */
// Required libraries
// Express related
var express = require('express');
var session = require("express-session");
var compression = require('compression');
var logger = require('morgan');
var forcedomain = require("forcedomain");
var helmet = require("helmet");

// MongoDB
var MongoStore = require('connect-mongo')(session);
var mongopath = "mongodb://localhost:27017/pesys";
var Mongo = require('mongodb').Db;
var MongoServer = require('mongodb').Server;

// Own
var replaceAll = require('./functions.js').replaceAll;
var isInArray = require('./functions.js').isInArray;
var rengine = require('./rengine.js').rengine;

// Misc
var fs = require('fs');

// Init Express
var app = express();
app.use(logger("dev"));
app.use(compression());
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  defaultSrc: ["'self'"],
  scriptSrc: ['*.google-analytics.com'],
  styleSrc: ["'unsafe-inline'"],
  imgSrc: ['*.google-analytics.com'],
  connectSrc: ["'none'"],
  fontSrc: [],
  objectSrc: [],
  mediaSrc: [],
  frameSrc: []
}));
app.use(forcedomain({
  hostname: "grundämnen.se",
  protocol: "https"
}));
app.use(session({
  secret: "MSeTEw6mReerergJjBu1",
  name: "sessID",
  resave: true,
  saveUninitialized: true,
  unset: "destroy",
  store: new MongoStore({ url: mongopath }),
  cookie: {httpOnly: true}
}));

// Open DB Connection
var db = new Mongo("pesys", new MongoServer("localhost", 27017, {auto_reconnect: true}), {w: 1});
db.open(function(e, d){
  if (e) {
    console.log(e);
  } else {
    console.log("MongoDB: Connected to database pesys");
  }
});

// Express render engine
app.engine('html', rengine);

// Set Express variables
app.set('views', './views');
app.set('view engine', 'html');
app.enable('trust proxy');
app.disable('x-powered-by');
app.use(express.static("static"));

app.get('/', function(req, res){
  res.render('index');
});

app.get('/:elm', function(req, res, next){
  // get element and send render page
  console.log("RENDER Request", req.headers);
  if (req.params.elm == "om") res.render("om");
  else if (req.params.elm == "info") res.render("info");
  else if (isInArray(req.params.elm, elements)) next();
}, function(req, res){
  // check if element is not incomplete
  if (false) res.render('show_element', {element: req.params.elm});
  else res.render('show_element_incomplete');
});

app.get('/:elm/json', function(req, res){
  // get element info and send it
  console.log("JSON Request", req.headers);
  res.send({"error": "incomplete function"});
});

app.listen(3000, function(){
  console.log("Express on port 3000");
});
