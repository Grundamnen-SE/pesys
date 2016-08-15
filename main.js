/*
  Filstruktur:

  pesys/
    pesys/
      main.js # <-- Denna fil
    editor/
    simple/
    api/
*/


var editor = require("../editor/app.js");
var api = require("../editor/app.js");

// Vet ej om vi behöver allt detta:
var express = require('express');
var session = require("express-session");
var logger = require('morgan');
var helmet = require("helmet");
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

api.app.listen((process.env.PORT || 3000), function(){
  console.log("Api on port 3000");
});


editor.app.listen((process.env.PORT || 3001), function(){
  console.log("Editor on port 3001");
});

if (process.env.NODE_ENV != "production") {

  var app = express();
  app.use(express.static("../simple/public/"));

  app.listen((process.env.PORT || 3002), function(){
    console.log("Simple on port 3002 (Dev)");
  });

}
