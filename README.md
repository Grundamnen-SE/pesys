# pesys [![Build Status](https://travis-ci.org/Grundamnen-SE/pesys.svg?branch=new-nodejs)](https://travis-ci.org/Grundamnen-SE/pesys)
Detta är versionshanteringen för Grundämnen.se. Pesys är kodnamnet för Grundämnen.

## "Brancher":

* Master: Primära utvecklingsgrenen.
* Public: Den publika sidan, den som man kommer till om man går in på https://grundämnen.se/
* new-nodejs: Omskrivningen av grundämnen.se, även känd som 2.0.

## Hjälp till
Du kan bidra till projektet, med texter exempelvis. Om du kan git, är det bara att skicka en pull-request till master. Kan du inte git, kan du mejla oss dina ändringar. Mejlen hittar du på grundämnen.se/om.

## Data Layout
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
  "lastlogintime": "2016-01-01 11:22",
  "lastloginip": "1.2.3.4",
  "": ""
}
```
