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
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

// MongoDB
var MongoStore = require('connect-mongo')(session);
var mongopath = "mongodb://localhost:27017/pesys";
var Mongo = require('mongodb').Db;
var MongoServer = require('mongodb').Server;

// Own
var replaceAll = require('./functions.js').replaceAll;
var isInArray = require('./functions.js').isInArray;
var site_data = require("./data.json");
var pwman = require('./password.js');
var util = require('util');
var path = require('path');

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
/*app.use(forcedomain({
  hostname: "grundämnen.se",
  protocol: "https"
}));*/
app.use(session({
  secret: "MSeTEw6mReerergJjBu1",
  name: "sessID",
  resave: true,
  saveUninitialized: true,
  unset: "destroy",
  store: new MongoStore({ url: mongopath }),
  cookie: {httpOnly: true}
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


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
    });
    setInterval(function(){
      db.collection("elements").find({playbtn: true}, {element:1, number:1, playbtn:1, _id:0}, function(err, data){
        if (err) console.log(err);
        playbtn = data;
      });
    }, 1000*60*60);
  }
});

// Variables
var elements = ["H", "Dy", "Uuo", "B", "C", "N", "O", "F", "Li", "Be", "He"];
var playbtn;

// Express render engine
app.engine('html', function (fp, options, callback) {
  //console.log(options, "render options");
  fs.readFile(fp, function (err, content) {
    if (err) return callback(new Error(err));

    var rendered = content.toString();
//  Example variable:
//  rendered = replaceAll(rendered, "%var%", "data to replace with, variable or string");
    rendered = replaceAll(rendered, "%text%", "text");
    rendered = replaceAll(rendered, "%playbtn%", playbtn);

    if (options.element != null) {
      rendered = replaceAll(rendered, "%element%", options.element);
    }

    for (var key in site_data) {
      if (!site_data.hasOwnProperty(key)) continue;
      rendered = replaceAll(rendered, "%"+key+"%", site_data[key]);
    }

    var login_div = "";
    if (!options.login) {
      login_div = '<div class="login-error">Inloggning misslyckades: Felaktigt användarnamn eller lösenord.</div>';
    }
    rendered = replaceAll(rendered, "%login%", login_div);

    var scripts_arr = [];
    if (options.user != null) {
      if (options.user.logged_in) {
        if (isInArray("LOGIN", options.user.permissions)){
          scripts_arr.push("/js/login.js");
        }
        if (isInArray("WRITE", options.user.permissions)){
          scripts_arr.push("/js/edit.js");
        }
        if (isInArray("READ", options.user.permissions)){

        }
        if (isInArray("VERIFY", options.user.permissions)){
          scripts_arr.push("/js/verify.js");
        }
        if (isInArray("USER", options.user.permissions)){
          scripts_arr.push("/js/user.js");
        }
        if (isInArray("SUPERADMIN", options.user.permissions)){
          scripts_arr.push("/js/superadmin.js");
        }
      }
    }
    var scripts = "";
    for (var i = 0; i < scripts_arr.length; i++) {
      scripts += '<script src="'+scripts_arr[i]+'"></script>';
    }
    rendered = replaceAll(rendered, "%scripts%", scripts);

    if (options.user != null && options.user.logged_in) rendered = replaceAll(rendered, "%login_url%", '<a href="/logout" id="about-link">Logout</a>');
    else rendered = replaceAll(rendered, "%login_url%", '<a href="/login" id="about-link">Login</a>');

    if (options.user != null && options.user.logged_in) {
      rendered = replaceAll(rendered, "%permissions%", options.user.permissions.toString())
    }

    return callback(null, rendered);
  });
});

// Set Express variables
app.set('views', './views');
app.set('view engine', 'html');
app.enable('trust proxy');
app.disable('x-powered-by');
app.use("/css", express.static(__dirname + "/static/css"));
app.use("/img", express.static(__dirname + "/static/img"));
app.use(favicon(__dirname + "/static/favicon.ico"));

// START dev urls
if (process.env.NODE_ENV != "production") {
  console.log("Not in production, enabling dev urls");
  app.get('/create_dev_users', function(req, res){
    db.collection('users').deleteOne({username: "devstudent"});
    db.collection('users').deleteOne({username: "devadmin"});
    db.collection('users').insertMany([{
      "username": "devadmin",
      "password": "$2a$10$om1rdJ26d/blfjPcqX9sA.F/tk5WKCcowUiUGzFx9lehQFDWDrjvK",
      "id": 1,
      "name": "Dev Admin",
      "permissions": [
        "SUPERADMIN",
        "USER",
        "VERIFY",
        "READ",
        "WRITE",
        "LOGIN"
      ],
      "lastlogintime": "",
      "lastloginip": "",
      "teacher": 0
    }, {
      "username": "devstudent",
      "password": "$2a$10$om1rdJ26d/blfjPcqX9sA.F/tk5WKCcowUiUGzFx9lehQFDWDrjvK",
      "id": 2,
      "name": "Dev Student",
      "permissions": [
        "READ",
        "WRITE",
        "LOGIN"
      ],
      "lastlogintime": "",
      "lastloginip": "",
      "teacher": 1
    }], function(err, data){
      res.type("text");
      var senddata = {};
      if (err) senddata.error = err;
      if (data) senddata.data = data;
      if (data.ops) senddata.ops = data.ops;
      res.send(util.inspect(senddata));
    });
  });
  app.get('/crpw/:pw', function(req, res){
    if (req.params.pw != null) {
      pwman.cryptPassword(req.params.pw, function(err, pwc){
        res.send({"error": err, "pwc": pwc});
      });
    } else {
      res.send("no pw");
    }
  });
  app.get("/pop_H", function(req, res){
    db.collection("elements").deleteOne({"element": "H"});
    db.collection("elements").insertOne({
      "element": "H",
      "name": "Väte",
      "number": 1,
      "text": "*Lorem* **Ipsum** [novum](http://www.google.com/) mekaniks",
      "playbtn": true,
      "published": true,
      "approved": true,
      "approvedby": 1,
      "approvedtime": "2016-07-21 14:21",
      "author": 1,
      "created": "2014-01-01 12:00",
      "lasteditedby": 1,
      "lasteditedtime": "2016-07-21 14:20",
      "versions": [],
      "elementdata": {
        "period": "1",
        "group": "1",
        "atomnumber": "1",
        "atomweight": "1",
        "protons": "1",
        "electrons": "1",
        "neutron": "0",
        "electronshells": "1",
        "meltingpoint": "-159",
        "boilingpoint": "-253"
      },
      "alleditors": [1, 2]
    });
    res.redirect("/");
  });
}
// END dev urls

app.get('/', function(req, res){
  if (req.session.user != null) {
    res.render('index', {user: req.session.user});
  } else {
    res.render('index');
  }
});

app.get('/login', function(req, res){
  res.render('login', {"login": true});
});
app.get('/logout', function(req, res){
  req.session.destroy(function(err){if(err)console.log(err)});
  res.redirect('/');
});
app.post('/login', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  db.collection('users').findOne({username: username}, {_id:0}, function(err, data){
    if (err) console.log(err);
    if (data == null) {
      res.render('login', {"login": false});
    } else {
      if (username == data.username) {
        pwman.comparePassword(password, data.password, function(err, pwsuc){
          if (err) console.log(err);
          console.log(pwsuc, "pwsuc");
          if (pwsuc) {
            req.session.user = {};
            req.session.user.logged_in = true;
            req.session.user.logged_in_as = username;
            req.session.user.permissions = data.permissions;
            res.redirect("/");
          } else {
            res.render('login', {"login": false});
          }
        });
      } else {
        res.render('login', {"login": false});
      }
    }
  });
});

app.get('/om', function(req, res){
  res.render('om');
});
// Temp disabled info due to i dont know what to do with it :/
/*app.get('/info', function(req, res){
  res.render('info');
});*/
app.get(['/settings','/settings/:page'], function(req, res){
  if (req.session.user != null) {
    res.render("settings", {user: req.session.user});
  } else {
    res.redirect("/");
  }
});

app.get('/:elm', function(req, res, next){
  res.redirect("/");
  return;
  if (isInArray(req.params.elm, elements)) next();
  else res.render("element/show_element_not_found", {element: req.params.elm});
}, function(req, res){
  // Check if element is published
  db.collection("elements").find({element: req.params.elm}, {fields: {published: 1}}, function(err, data){
    if (err) console.log(err);
    if (data.published) res.render('element/show_element', {element: req.params.elm});
    else res.render('element/show_element_incomplete');
  });
});

app.get('/js/:js', function(req, res){
  fileExists = false;
  allowed = false;
  fs.access(__dirname + "/static/js/"+req.params.js, fs.F_OK, function(err){
    if (err) {
      //console.log(__dirname + "/static/js/"+req.params.js, err);
    } else {
      fileExists = true;
    }
    switch (req.params.js) {
      case "login.js":      var req_perm = "LOGIN"; break;
      case "settings":      var req_perm = "LOGIN"; break;
      case "edit.js":       var req_perm = "WRITE"; break;
      case "verify.js":     var req_perm = "VERIFY"; break;
      case "user.js":       var req_perm = "USER"; break;
      case "superadmin.js": var req_perm = "SUPERADMIN"; break;
      default:              var req_perm = ""; break;
    }
    if (req_perm != "") {
      if (req.session.user != null && req.session.user.logged_in) {
        for (var i = 0; i < req.session.user.permissions.length; i++) {
          var perm = req.session.user.permissions[i];
          if (perm == req_perm) { allowed = true; break; }
        }
      }
    } else {
      allowed = true;
    }
    //console.log(fileExists, allowed, req.params.js, "js request");
    if (fileExists && allowed) res.sendFile(__dirname + "/static/js/"+req.params.js);
    else res.sendStatus(404);
  });
});

// TODO
// API aktiga funktioner: få elementdata i JSON (typ direkt från Mongo), vilka som har hjälpt till, och lite annat smått och gott.
// Vi bör lägga till system för att verifiera vem som frågar efter information och kanske lägga till rate-limiting.
// Kolla in https://github.com/Grundamnen-SE/pesys/issues/9
app.get('/api/:elm/json', function(req, res){
  if (isInArray(req.params.elm, elements)) {
    db.collection('elements').findOne({element: req.params.elm}, {fields:{_id:0}}, function(err, data){
      if (err) console.log(err);
      if (data == null) {
        res.send({"error": "element data not found"});
      } else {
        var options = {fields:{password:0, _id: 0}};
        var users = [db.collection('users').findOne({id: data.author}, options), db.collection('users').findOne({id: data.lasteditedby}, options), db.collection('users').findOne({id: data.approvedby}, options)];
        for (var i = 0; i < data.alleditors.length; i++) {
          users.push(db.collection('users').findOne({id: data.alleditors[i]}, options));
        }
        Promise.all(users).then(function(allData){
          var author = allData[0];
          var lasteditedby = allData[1];
          var approvedby = allData[2];
          var alleditors = [];
          for (var i = 3; i < allData.length; i++) {
            alleditors.push(allData[i]);
          }
          data.author = author;
          data.lasteditedby = lasteditedby;
          data.approvedby = approvedby;
          data.alleditors = alleditors;
          if (req.session.user != null && req.session.user.logged_in) {
            res.send({logged_in: true, data: data});
          } else {
            res.send({data: data});
          }
        });
      }
    });
  } else {
    res.send({"error": "the value specified as an element is not an element"});
  }
});

app.get('/api/contributors', function(req, res){
  // Denna funktion ska returnera alla som har hjälpt till att skapa innehåll till sidan, i JSON format. Innehåll som ska returneras behöver diskuteras.
  res.send({"error": "incomplete function"});
});

app.listen(3000, function(){
  console.log("Express on port 3000");
});
