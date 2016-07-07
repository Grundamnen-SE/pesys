var fs = require('fs');

exports.render = function(req, res) {

  var params = req.params;
  var file = '/views/wiki/pages/' + params.file + '.html';

  fs.stat(file, function(err, stat) {
    if(err === null) {

      fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
          return console.error('Error opening file:', err.code);
        } else {
          res.render('/views/wiki/template.ejs', {content: data});
        }
      });

    } else if(err.code == 'ENOENT') {
      // File doesn't exist.
    } else {
      console.error('Error opening file: ', err.code);
    }
  });
}
