
# Node JS instalieren

Runterladen und installieren unter [nodejs.org](http://nodejs.org/)


## Node.js Plugin für Phpstorm ##

Anleitung: http://blog.jetbrains.com/webide/2012/03/attaching-the-sources-of-node-js-core-modules/



# Komponenten #

## Cluster Interface ##
__@TODO__

Nimmt Daten vom Cluster entgegen und speichert diese Zwischen.

# Backend #

Benutzerverwaltung

## Backend starten ##

    cd backend
    cp config.js.dist config.js


MySQL Server Einstellungen in `config.js` anpassen.

Dann Server starten

    node app.js

Browser öffnen mit http://localhost:3000

## Dokus ##

* http://expressjs.com/
* https://github.com/dresende/node-orm2


# Android Interface #
__@TODO__

Liefert vorher von Cluster Interface angenommene Daten an Android Clients aus.