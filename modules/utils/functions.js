exports.replaceAll = function(target, search, replacement, flags) {
  flags = typeof flags !== "undefined" ? flags : "g"; // Den sista parametern är valfri, ger man inte den sätts den till "g"
  return target.replace(new RegExp(search, flags), replacement);
};

exports.isInArray = function(value, array) {
  return array.indexOf(value) > -1;
};
