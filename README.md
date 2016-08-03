# pesys [![Build Status](https://travis-ci.org/Grundamnen-SE/pesys.svg?branch=new-nodejs)](https://travis-ci.org/Grundamnen-SE/pesys)
Detta är versionshanteringen för Grundämnen.se. Pesys är kodnamnet för Grundämnen.

## "Brancher":

* Master: Primära utvecklingsgrenen.
* Public: Den publika sidan, den som man kommer till om man går in på https://grundämnen.se/
* new-nodejs: Omskrivningen av grundämnen.se, även känd som 2.0.

## Funktions layout
Vi har tre moduler som alla behövs för att grundämnen ska fungera. ``api.js`` är den modul som hanterar all kommunikation med databasen, samt klienter (M i MVC). ``app.js`` är den modul som kör "editor" av grundämnen.se, den som gör att du kan ändra grundämnen.se:s information. Sedan finns mappen ``simple/`` som innehåller allt som "vanliga" användare använder, som är ett enkel sida som bara gör så man lätt kan använda grundämnen.se utan en massa extra funktioner för att hantera/ändra i grundämnen.se.
### API
API är den modul som man ska skicka och ta emot data ifrån.

### Editor
Editor är den modul som man använder för att redigera datan på grundämnen.se.

### Simple
Simple är den modul som endast ska vara statiska sidor, som ska göra ajax förfrågningar mot API servern för att få data om ämnen. Kanske bör bli en standalone app med electron?

## Loggning
Vi har en "handler" för att kolla ifall man är i en utvecklings- eller produktions-miljö. Baserat på denna variabel så printar den ut loggning till stdout(console.log) eller med hjälp av winston/bunyan (obestämt just nu).

## System
Vi har ett annat repository för hur vi driver servrarna, vad vi har för servrar och lite annat som kan vara bra att veta. Kolla in det: [Grundamnen-SE/scripts](https://github.com/Grundamnen-SE/scripts)

## Fil Layout
Detta är vår fil-layout, för hur vi har de tre modulerna.
```
pesys/
  static/             ## Statiska filer för "Editor"
  views/
    index.html
  modules/
    util/
      password.js
      functions.js    ## Bör splittas i två
      logging.js      ## Handler för hur loggning ska hanteras samt loggar det som ska loggas
    table-utils.js
    index.js          ## För att ladda alla moduler
  middleware/         ## Express "middleware" för editor
  simple/             ## Enkla delen
    css/
    js/
    img/
    index.html
    favicon.ico
  data/               ## För att spara på utvecklings data samt andra json strukturerad data.
    dev/
      H_dev.json
      USERS_dev.json
    prod/
    data.json
  app.js              ## Editor delen
  api.js              ## API delen
  simple.js           ## Enkla delen (temporär webserver för utveckling)
  package.json
  .travis.yml
  .gitignore
```

## Data Layout
### User object
```json
{
  "username": "joarc",
  "id": 1,
  "password": "encrypted password",
  "name": "Joar Classon",
  "permissions":[
    "SUPERADMIN",
    "USER",
    "VERIFY",
    "READ",
    "WRITE",
    "LOGIN"
  ],
  "lastlogintime": "time",
  "lastloginip": "ipv4",
  "teacher": 1
}
```
Kolla data/dev/USERS_dev.json för hur datan ska se ut.
### Element object
```json
{
  "element": "H",
  "name": "Väte",
  "number": 1,
  "text": "Lorem Ipsum novum mekaniks",
  "playbtn": true,
  "published": true,
  "approved": true,
  "approvedby": 1,
  "approvedtime": "2016-07-21 14:21",
  "author": 1,
  "created": "2014-01-01 12:00",
  "lasteditedby": 1,
  "lasteditedtime": "2016-07-21 14:20",
  "versions": [],
  "elementdata": {
    "period": "1",
    "group": "1",
    "atomnumber": "1",
    "atomweight": "1",
    "protons": "1",
    "electrons": "1",
    "neutron": "0",
    "electronshells": "1",
    "meltingpoint": "-159",
    "boilingpoint": "-253"
  },
  "alleditors": [1]
}
```
Kolla data/dev/H_dev.json för hur datan ska se ut.
