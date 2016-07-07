var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// "Controllers" är de filer som genererar sidor med exempelvis templates, baserat på inkommande parametrar. Alla ska ligga i detta objekt:
var controllers = {
  wikiPage: require('/controllers/wiki-page.js')
};

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/get-wiki-page', function(req, res) {
  controllers.wikiPage.render(req, res);
});

app.listen(8080);
