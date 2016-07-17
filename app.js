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
    db.collection("elements").find({playbtn: true}, {element:1, number:1, playbtn:1, _id:0}).toArray(function(err, data){
      if (err) console.log(err);
      playbtn = JSON.stringify(data);
      console.log(data, "playbtn data");
    });
    setInterval(function(){
      db.collection("elements").find({playbtn: true}, {element:1, number:1, playbtn:1, _id:0}, function(err, data){
        if (err) console.log(err);
        playbtn = data;
        console.log(data, "playbtn data");
      });
    }, 1000*60*60);
  }
});

// Variables
var elements = ["H", "Dy", "Uuo", "B", "C", "N", "O", "F", "Li", "Be", "He"];
var playbtn;

// Express render engine
app.engine('html', function (fp, options, callback) {
  fs.readFile(fp, function (err, content) {
    if (err) return callback(new Error(err));

    var rendered = content.toString();
//  Example variable:
//  rendered = replaceAll(rendered, "%var%", "data to replace with, variable or string");
    rendered = replaceAll(rendered, "%text%", "text");
    rendered = replaceAll(rendered, "%playbtn%", playbtn);

    if (options.element != null) {
      rendered = replaceAll(rendered, "%element%", options.params.elm);
    }

    var scripts = [];

    if (options.logged_in) {
      if (isInArray("LOGIN", options.permissions)){
        scripts.push("/js/login.js");
      }
      if (isInArray("WRITE", options.permissions)){

      }
      if (isInArray("READ", options.permissions)){

      }
      if (isInArray("VERIFY", options.permissions)){

      }
      if (isInArray("USER", options.permissions)){

      }
      if (isInArray("SUPERADMIN", options.permissions)){

      }
    }

    rendered = replaceAll(rendered, "%scripts%", scripts)

    return callback(null, rendered);
  });
});

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
  console.log("RENDER Request");
  if (req.params.elm == "om") res.render("om");
  else if (req.params.elm == "info") res.render("info");
  else if (isInArray(req.params.elm, elements)) next();
  else res.render("element/show_element_not_found", {element: req.params.elm});
}, function(req, res){
  // Check if element is published
  db.collection("elements").find({element: req.params.elm}, {fields: {published: 1}}, function(err, data){
    if (err) console.log(err);
    if (data.published) res.render('element/show_element', {element: req.params.elm});
    else res.render('element/show_element_incomplete');
  });
});
/*
app.use(function(req, res, next){
  res.status(404).render("404");
  res.status(500).render("500");
  next();
});*/

// TODO
// API aktiga funktioner: få elementdata i JSON (typ direkt från Mongo), vilka som har hjälpt till, och lite annat smått och gott.
// Vi bör lägga till system för att verifiera vem som frågar efter information och kanske lägga till rate-limiting.
// Kolla in https://github.com/Grundamnen-SE/pesys/issues/9
app.get('/api/:elm/json', function(req, res){
  console.log("JSON Request");
  db.collection('elements').findOne({element: req.params.elm}, {}, function(err, data){
    if (err) console.log(err);
    console.log(data);
    res.send(data);
  });
});

app.get('/api/contributors', function(req, res){
  // Denna funktion ska returnera alla som har hjälpt till att skapa innehåll till sidan, i JSON format. Innehåll som ska returneras behöver diskuteras.
  res.send({"error": "incomplete function"});
});

app.listen(3000, function(){
  console.log("Express on port 3000");
});
