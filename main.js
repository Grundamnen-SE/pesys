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

if (process.env.NODE_ENV != "production") {
  // Gör så alla ligger på samma port:

  var simple = express();
  simple.use(express.static("../simple/public/"));

  var app = express();
  app.use(editor.app);
  app.use(api.app);
  app.use(simple);

  app.listen((3000), function() {
    console.log("Simple, api and editor on port 3000 (Dev)");
  });

} else {
  // Gör så de ligger på varsin port. Simple-delen hanterar nginx själv:

  api.app.listen((3000), function() {
    console.log("Api on port 3000");
  });

  editor.app.listen((3001), function() {
    console.log("Editor on port 3001");
  });

}