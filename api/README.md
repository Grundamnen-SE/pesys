# api [![Build Status](https://travis-ci.org/Grundamnen-SE/api.svg?branch=master)](https://travis-ci.org/Grundamnen-SE/api)
API-modulen av grundämnen.se. Denna del driver all information som klienter kan ta emot och skicka.

## Användning
`node api.js` för att starta api-modulen. Kräver ingen annan modul för att fungera.

### mongodb
För att denna modul ska fungera krävs en mongodb-server. Konfiguration om var denna server ska finnas kan du ändra i `data/mongodb.json`. Under utveckling bör de inställningarna fungera, men under produktion bör en annan konfiguration användas för optimalast funktion. Den konfiguration som grundämnen.se använder ligger under `data/mongodb_production.json`.

## Mer Information
Mer information kan du hitta här: [Grundamnen-SE/pesys](https://github.com/Grundamnen-SE/pesys)

## License
Vi använder [AGPL-3.0](https://github.com/Grundamnen-SE/api/blob/master/LICENSE) för all kod och för allt innehåll på sidan använder vi [Creative Commons Erkännande-IckeKommersiell-DelaLika 4.0 Internationell licens](http://creativecommons.org/licenses/by-nc-sa/4.0/).
