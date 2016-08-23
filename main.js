/*
  Filstruktur:

  pesys/
    main.js # <-- Denna fil
    editor/
    simple/
    api/
*/

var editor = require("./editor/app.js");
var api = require("./api/api.js");

if (process.env.NODE_ENV !== "production") {
  // Gör så alla ligger på samma port:

  var express = require('express');
  var app = express();
  app.use(editor.app);
  app.use(api.app); // Denna läggs under /api i api.js, när routern inkluderas
  app.use(express.static("./simple/public/"));

  app.listen((3000), function() {
    console.log("Simple, api and editor on port 3000 (Dev)");
  });

} else {
  // Gör så api samt editor ligger på port 3000/3001

  api.app.listen((3000), function(){
    console.log("API on port 3000");
  });

  editor.app.listen((3001), function() {
    console.log("Editor on port 3001");
  });

}
