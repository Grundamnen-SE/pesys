var fs = require('fs');
var replaceAll = require('./functions.js').replaceAll;

exports.rengine = function (fp, options, callback) {
  fs.readFile(fp, function (err, content) {
    if (err) return callback(new Error(err));

    var rendered = content.toString();
//  Example variable:
//  rendered = replaceAll(rendered, "%var%", "data to replace with, variable or string");
    rendered = replaceAll(rendered, "%text%", "text");

    if (options.element != null) {
      content = replaceAll(content, "%element%", options.params.elm);
    }

    return callback(null, rendered);
  });
};
