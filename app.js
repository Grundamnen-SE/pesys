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
var table =  require("./table-utils.js");

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
app.use(session({
  secret: "MSeTEw6mReerergJjBu1",
  name: "sessID",
  resave: true,
  saveUninitialized: true,
  unset: "destroy",
  store: new MongoStore({ url: mongopath }),
  cookie: {
    httpOnly: true,
    expires: new Date(Date.now()+60*60*1000*3)
  }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Some express variables that are important
app.enable('trust proxy');
app.disable('x-powered-by');

// Open DB Connection
var db = new Mongo("pesys", new MongoServer("localhost", 27017, {auto_reconnect: true}), {w: 1});
db.open(function(e, d){
  if (e) {
    console.log(e);
  } else {
    console.log("MongoDB: Connected to database pesys");
    db.collection("elements").find({playbtn: true}, {element:1, number:1, playbtn:1, _id:0}).toArray(function(err, data){
      if (err) console.log(err);
      playbtn = data;
    });
    setInterval(function(){
      db.collection("elements").find({playbtn: true}, {element:1, number:1, playbtn:1, _id:0}).toArray(function(err, data){
        if (err) console.log(err);
        playbtn = data;
      });
    }, 1000*60);
  }
});

// Variables
var elements = ["H","He","Li","Be","B","C","N","O","F","Ne","Na","Mg","Al","Si",
                "P","S","Cl","Ar","K","Ca","Sc","Ti","V","Cr","Mn","Fe","Co","Ni",
                "Cu","Zn","Ga","Ge","As","Se","Br","Kr","Rb","Sr","Y","Zr","Nb",
                "Mo","Tc","Ru","Rh","Pd","Ag","Cd","In","Sn","Sb","Te","I","Xe",
                "Cs","Ba","Hf","Ta","W","Re","Os","Ir","Pt","Au","Hg","Tl","Pb",
                "Bi","Po","At","Rn","Fr","Ra","Rf","Db","Sg","Bh","Hs","Mt","Ds",
                "Rg","Cn","Uut","Fl","Uup","Lv","Uus","Uuo","La","Ce","Pr","Nd",
                "Pm","Sm","Eu","Gd","Tb","Dy","Ho","Er","Tm","Yb","Lu","Ac","Th",
                "Pa","U","Np","Pu","Am","Cm","Bk","Cf","Es","Fm","Md","No","Lr"];
var settingsPages = ["profile", "approve", "users", "superadmin"];
var playbtn = [];

// Express render engine
app.engine('html', function (fp, options, callback) {
  fs.readFile(fp, function (err, content) {
    if (err) return callback(new Error(err));

    var rendered = content.toString();
    // Example variable:
    // rendered = replaceAll(rendered, "%var%", "data to replace with, variable or string");
    rendered = replaceAll(rendered, "%text%", "text");
    rendered = replaceAll(rendered, "%playbtn%", JSON.stringify(playbtn));

    // Insert the table:
    rendered = replaceAll(rendered, "%table%", table.getTable());

    if (options.element != null) {
      rendered = replaceAll(rendered, "%element%", options.element);
    } else {
      rendered = replaceAll(rendered, "%element%", "")
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
        console.log("logged_in", options.user.permissions);
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
      rendered = replaceAll(rendered, "%permissions%", options.user.permissions.toString());
      rendered = replaceAll(rendered, "%username%", options.user.username);
      rendered = replaceAll(rendered, "%name%", options.user.name);
    }

    return callback(null, rendered);
  });
});

// Set Express variables
app.set('views', './views');
app.set('view engine', 'html');
app.use("/css", express.static(__dirname + "/static/css"));
app.use("/img", express.static(__dirname + "/static/img"));
app.use("/js",  express.static(__dirname + "/static/js"));
app.use(favicon(__dirname + "/static/favicon.ico"));

// START dev urls
if (process.env.NODE_ENV != "production") {
  console.log("Not in production, enabling dev urls");
  app.get("/dev_env", function(req, res){
    db.collection("elements").deleteOne({"element": "H"});
    db.collection("elements").insertOne(require('./H_dev.json'));
    db.collection('users').deleteOne({username: "devstudent"});
    db.collection('users').deleteOne({username: "devadmin"});
    db.collection('users').insertMany(require('./USERS_dev.json'));
    req.session.destroy();
    res.redirect("/");
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
  if (req.session.user != null && req.session.user.logged_in) {
    res.redirect("/logout");
  } else {
    res.render('login', {"login": true});
  }
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
            req.session.user = data;
            delete req.session.user.password;
            req.session.user.logged_in = true;
            console.log(req.session.user);
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
    if (req.params.page != null && isInArray(req.params.page, settingsPages)) {
      res.render("settings/"+req.params.page, {user: req.session.user});
    } else {
      res.redirect("/settings/profile");
    }
  } else {
    res.redirect("/");
  }
});
app.post('/settings/:page', function(req, res){
  if (req.session.user != null) {
    if (isInArray(req.params.page, settingsPages)) {
      if (req.params.page == "profile") {
        if (req.body.type == "profile") {
          if (req.body.data.username != null && req.body.data.name != null) {
            req.body.data.username = req.body.data.username.toLowerCase();
            db.collection("users").findOneAndUpdate({username: req.session.user.username, id: req.session.user.id}, {$set:{username: req.body.data.username, name: req.body.data.name}}, {projection: {_id:0, password:0}, returnOriginal: false}, function(err,data){
              if (err) console.log(err);
              req.session.user = data.value;
              req.session.user.logged_in = true;
              res.send({status: "success"});
            });
          } else {
            res.send({status: "failed", error: "insufficent data"});
          }
        } else if (req.body.type == "passwd") {
          if (req.body.data.password != null) {
            pwman.cryptPassword(req.body.data.password, function(err, pwc){
              db.collection("users").findOneAndUpdate({username: req.session.user.username, id: req.session.user.id}, {$set:{password: pwc}}, {projection: {_id:0, password:0}, returnOriginal: false}, function(err,data){
                if (err) console.log(err);
                req.session.user = data.value;
                req.session.user.logged_in = true;
                res.send({status: "success"});
              });
            });
          } else {
            res.send({status: "error", error: "insufficent data"});
          }
        } else {
          res.send({status: "error", error: "incorrect type"});
        }
      } else if (req.params.page == "approved") {

      } else if (req.params.page == "superadmin") {

      } else if (req.params.page == "users") {

      }
    } else {
      res.send({"error": "invalid_url"});
    }
  } else {
    res.send({"error": "not_loggedin"});
  }
});

app.get('/:elm', function(req, res, next){
  if (isInArray(req.params.elm, elements)) next();
  else res.render("element/show_element_not_found", {element: req.params.elm});
}, function(req, res){
  // Check if element is published
  /*
  db.collection("elements").find({element: req.params.elm}, {fields: {published: 1}}, function(err, data){
    if (err) console.log(err);
    if (data.published) res.render('element/show_element', {element: req.params.elm});
    else res.render('element/show_element_incomplete');
  });*/
  if (req.session.user != null) {
    res.render("index", {element: req.params.elm, user: req.session.user});
  } else {
    res.render("index", {element: req.params.elm});
  }
});

// TODO
// API aktiga funktioner: få elementdata i JSON (typ direkt från Mongo), vilka som har hjälpt till, och lite annat smått och gott.
// Vi bör lägga till system för att verifiera vem som frågar efter information och kanske lägga till rate-limiting.
// Kolla in https://github.com/Grundamnen-SE/pesys/issues/9
app.get('/api/element/:elm', function(req, res){
  if (isInArray(req.params.elm, elements)) {
    db.collection('elements').findOne({element: req.params.elm}, {}, function(err, data){
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
app.post('/api/element/:elm', function(req, res){
  if (isInArray(req.params.elm, elements)) {
    if (req.session.user != null) {
      if (isInArray("WRITE", req.session.user.permissions)) {
        var data = req.body;
        var id = data["_id"];
        delete data["_id"];
        if (!isInArray("SUPERADMIN", req.session.user.permissions)) {
          delete data["title"];
        }
        //console.log(data);
        db.collection("elements").updateOne({id:data.id}, {$set:{text: data.text, elementdata: data.elementdata}}, function(err, data){
          //console.log(data);
          if (err) {
            console.log(err);
            res.send({"error": "something went wrong when saving"});
          } else {
            if (data.result.nModified) {
              res.send({"error": "ok"});
            } else {
              res.send({"error": "no change"});
            }
          }
        });
      } else {
        res.send({"error": "not enough permissions"});
      }
    } else {
      res.send({"error": "not authenticated"});
    }
  }
});

app.get('/api/contributors', function(req, res){
  // TODO: Denna funktion ska returnera alla som har hjälpt till att skapa innehåll till sidan, i JSON format. Innehåll som ska returneras behöver diskuteras.
  res.send({"error": "incomplete function"});
});

app.get(['/api/user/:id', '/api/user'], function(req, res){
  if (req.session.user != null) {
    if (req.params.id != null) {
      var id = req.params.id;
    } else {
      var id = req.session.user.id;
    }
    db.collection("users").findOne({id: id}, {fields:{_id:0, password:0}}, function(err, data){
      if (err) console.log(err);
      res.send(data);
    });
  } else {
    res.send({"error": "you are not authenticated"});
  }
});

app.listen((process.env.PORT || 3000), function(){
  console.log("Express on port 3000");
});
