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
  "number": 1,
  "playbtn": true,
  "published": true,
  "approved": true,
  "approvedby": "user->id",
  "approvedtime": "time",
  "author": "user->id",
  "created": "time",
  "lasteditedby": "user->id",
  "lasteditedtime": "time",
  "versions": [{
    "element": "H",
    "number": 1,
    "playbtn": true
    ...
  }, {
    "element": "H",
    "number": 2,
    "playbtn": false
    ...
  }],
  "allauthors": ["user->id", "user->id", "..."]
}
```
