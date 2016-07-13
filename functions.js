exports.replaceAll = function(target, search, replacement) {
  return target.replace(new RegExp(search, 'g'), replacement);
};

exports.isInArray = function(value, array) {
  return array.indexOf(value) > -1;
};
