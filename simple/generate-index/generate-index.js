/*
* Läs instruktioner i README.txt i mappen som denna fil ligger i!
*/

var fs = require('fs');

var replaceAll = function(target, search, replacement, flags) {
  flags = typeof flags !== "undefined" ? flags : "g"; // Den sista parametern är valfri, ger man inte den sätts den till "g"
  return target.replace(new RegExp(search, flags), replacement);
};

var tab1 = fs.readFileSync("./table.html", "utf8");
var tab2 = tab1;

// Två tabeller kommer skapas. Den andra tabellen ska inte ha något innehåll, så det tas bort:
tab2 = replaceAll(tab2, "(<td.*?>).*(</td>)", "$1$2", "gm");

// Den ska också ha id:t tab2 istället för tab1:
tab2 = replaceAll(tab2, "tab1", "tab2");

var tablePart = tab2 + tab1;

/* Lägg in tabellerna i index.html: */

var warning = "\n\n\n\n\n<!-- DEN HÄR FILEN AUTO-GENERERAS! GÖR INGA ÄNDRINGAR! Se /simple/generate-index/README.txt för enkla instruktioner. -->\n\n\n\n\n";

var fileToWrite = warning + fs.readFileSync("./index.html", "utf8");
fileToWrite = replaceAll(fileToWrite, "%table%", tablePart, ""); // Omit global search
fs.writeFileSync("../public/index.html", fileToWrite);

console.log("Genererade /public/index.html");
