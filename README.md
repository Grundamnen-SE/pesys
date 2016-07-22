# pesys [![Build Status](https://travis-ci.org/Grundamnen-SE/pesys.svg?branch=new-nodejs)](https://travis-ci.org/Grundamnen-SE/pesys)
Detta är versionshanteringen för Grundämnen.se. Pesys är kodnamnet för Grundämnen.

## "Brancher":

* Master: Primära utvecklingsgrenen.
* Public: Den publika sidan, den som man kommer till om man går in på https://grundämnen.se/
* new-nodejs: Omskrivningen av grundämnen.se, även känd som 2.0.

## Hjälp till
Du kan bidra till projektet, med texter exempelvis. Om du kan git, är det bara att skicka en pull-request till master. Kan du inte git, kan du mejla oss dina ändringar. Mejlen hittar du på grundämnen.se/om.

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
  "teacher": "user->id"
}
```
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
