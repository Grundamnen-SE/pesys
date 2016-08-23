/*
 * Grundämnen.se API modul
 * Skapad av Joar Classon och Gustav Ekner
 *
 */

module.exports = {};

/* Vi måste gå igenom dessa och kolla om vi verkligen behöver alla: */
// Required libraries
// Express related
var express = require('express');
var session = require("express-session");
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
var replaceAll = require('./modules/utils/functions.js').replaceAll;
var isInArray = require('./modules/utils/functions.js').isInArray;
var site_data = require("./data/data.json");
var pwman = require('./modules/utils/password.js');
var table =  require("./modules/table-utils.js");

// Misc
var fs = require('fs');
var util = require('util');
var path = require('path');

// Express data
var sessionconfig = require("data/session.config.json");
sessionconfig.expires = new Date(Date.now()+60*60*1000*3);
sessionconfig.store = new MongoStore({ url: mongopath });

// Init Express
var app = express();
app.use(logger("dev"));
app.use(helmet());
app.use(helmet.contentSecurityPolicy(require('data/helmet.csp.json')));
app.use(session(sessionconfig));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Some express variables that are important
app.enable('trust proxy');
app.disable('x-powered-by');

// dev urls: // Jag har flyttat denna till api.js //Gustav
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

app.post('/login', function(req, res){
  var username = req.body.username;
  var password = req.body.password;

  // TODO: Kan vi flytta ut denna del ur den här koden och flyttar den till API? Det bör inte vara så svårt?
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
        db.collection("elements").findOneAndUpdate({id:data.id}, {$set:{text: data.text, elementdata: data.elementdata}}, {returnOriginal:0}, function(err, data){
          //console.log(data);
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

//module.exports.app = app;
