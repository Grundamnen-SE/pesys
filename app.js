/*
 * Grundämnen.se NodeJS Website Engine
 * Created by Joar C & Gustav E
 *
 */
// Required libraries
// Express related
var express = require('express');
var compression = require('compression');
var logger = require('morgan');
var forcedomain = require("forcedomain");
var helmet = require("helmet");

// Own
var replaceAll = require('./functions.js').replaceAll;

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

// Express render engine
app.engine('html', function (fp, options, callback) {
  // Options is what is defined in after file name in: res.render(filename, {array: "of data to be passed to engine"});
  fs.readFile(fp, function (err, content) {
    if (err) return callback(new Error(err));

    var rendered = content.toString();
// Example variable:
//  rendered = replaceAll(rendered, "%var%", "data to replace with, variable or string");
    rendered = replaceAll(rendered, "%text%", "text");

    if (options.element != null) {
      content = replaceAll(content, "%element%", options.params.elm);
    }

    return callback(null, rendered);
  });
});

// Set Express variables
app.set('views', './views');
app.set('view engine', 'html');
app.set('trust proxy', true);
app.set('x-powered-by', false);
app.use(express.static("static"));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/:elm', function(req, res) {
  // req.params.elm = /vadsomstårhär
  res.render('show_element', {element: req.params.elm});
});

app.listen(3000, function(){
  console.log("Express on port 3000");
});
