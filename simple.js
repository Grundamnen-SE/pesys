var express = require("express");
var fs = require('fs');
var favicon = require('serve-favicon');

var app = express();

app.enable("trust proxy");

app.engine('html', function (filePath, options, callback) { // define the template engine
  fs.readFile(filePath, function (err, content) {
    if (err) return callback(new Error(err));
    return callback(null, content.toString());
  });
});
app.set('views', './simple');
app.set('view engine', 'html');
app.use("/css", express.static(__dirname + "/simple/css"));
app.use("/img", express.static(__dirname + "/simple/img"));
app.use("/js",  express.static(__dirname + "/simple/js"));
app.use(favicon(__dirname + "/simple/favicon.ico"));

app.use("/", function(req, res){
  res.render("index");
});
app.use("/:page", function(req, res){
  res.render(req.params.page);
});

app.listen((process.env.PORT || 3001), function(){
  console.log("Express on port 3001");
});
