/*
 * Grundämnen.se API modul
 * Skapad av Joar Classon och Gustav Ekner
 *
 */
// API Modul, flytta saker från editor/app.js#api-delen hit och gör lite andra bra grejer så api:n funkar bättre.

// Express related
var express = require('express');
var session = require("express-session");
var logger = require('morgan');
var helmet = require("helmet");
var bodyParser = require('body-parser');

// Mongo
var MongoStore = require('connect-mongo')(session);
var Mongo = require('mongodb').Db;
var MongoServer = require('mongodb').Server;

// Own Utils
var replaceAll = require('../global/modules/utils/functions.js').replaceAll;
var isInArray = require('../global/modules/utils/functions.js').isInArray;
var globvars = require('../global/vars.json');

// DB
var db_info = globvars.mongodb.development;
if (process.env.NODE_ENV === "production") db_info = globvars.mongodb.production;
var mongopath = "mongodb://"+db_info['hostname']+":"+db_info['port']+"/"+db_info['db'];
var db = new Mongo(db_info['db'], new MongoServer(db_info['hostname'], db_info['port'], {auto_reconnect: true}), {w: 1});
db.open(function(e, d){
  if (e) {
    console.log(e);
  } else {
    console.log("MongoDB: Connected to database "+mongopath);
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

// vars
var elements = globvars.elements;

// Init Express
var app = express();
if (process.env.NODE_ENV !== "production") {
  app.use(logger("dev"));
}
app.use(helmet());
app.use(session({
  "secret": "MSeTEw6mReerergJjBu1",
  "name": "sessID",
  "resave": true,
  "saveUninitialized": true,
  "unset": "destroy",
  "cookie": {
    "httpOnly": true
  },
  expires: new Date(Date.now()+60*60*1000*3),
  store: new MongoStore({ url: mongopath })
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.enable('trust proxy');
app.disable('x-powered-by');

var router = express.Router();

router.get(['/', '/user/', '/user', '/element/', '/element'], function(req, res){
  res.send({"error": "invalid_request"})
});

// Get element data (and user data that is included)
router.get('/element/:elm', function(req, res){
  if (isInArray(req.params.elm, elements)) {
    db.collection('elements').findOne({element: req.params.elm}, {}, function(err, data){
      if (err) console.log(err);
      if (data == null) {
        res.send({"error": "element_data_not_found", "code": 56});
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

// Update element, requires WRITE and text and elementdata
router.post('/element/:elm', function(req, res){
  if (isInArray(req.params.elm, elements)) {
    if (req.session.user != null) {
      if (isInArray("WRITE", req.session.user.permissions)) {
        var data = req.body;
        var id = data["_id"];
        delete data["_id"];
        if (!isInArray("SUPERADMIN", req.session.user.permissions)) {
          delete data["title"];
        }
        db.collection("elements").findOneAndUpdate({id:data.id}, {$set:{text: data.text, elementdata: data.elementdata}}, {returnOriginal:0}, function(err, data){
          if (err) {
            console.log(err);
            res.send({"error": "something went wrong when saving"});
          } else {
            if (data.ok) {
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
  } else {
    res.send({"error": "element_does_not_exist"});
  }
});

// Return list of everyone that helped fill information on grundämnen
router.get('/contributors', function(req, res){
  res.send({"error": "incomplete_function"});
});

// Get user by id
router.get('/user/:id', function(req, res){
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

router.get('*', function(req, res){
  res.send({"error": null});
});

app.use('/api', router);

module.exports.router = router;
module.exports.app = app;

app.listen(3000, function(){
  console.log("API on 3000");
})
