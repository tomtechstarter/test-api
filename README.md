# API Auf EC2 Starten

1. EC2 Instanz starten. Mit folgenden Einstellungen
   --> Öffentliches Subnetz (Damit über das Internet verfügbar)
   --> Sicherheitsgruppe so anpassen, dass API über den Port erreichbar ist (aktuell Port 5000)
   --> Öffentliche IP zuweisen
2. Über SSH auf EC2 Instanz verbinden 
3. Node und Hilfspakete installieren:
    --> 3.0 `sudo apt update`
    --> 3.1 `sudo apt install curl`
    --> 3.2 Node version Manager installieren: `curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash `
    --> Bash neu laden: `source ~/.profile`
    --> Node über nvm installieren: `nvm install node`
    --> Testen über `node --version`

4. Dateien aus dem Repo herunterladen: `git clone https://github.com/tomtechstarter/test-api.git`
5. In das Verzeichnis navigieren (`cd test-api`)
6. Über `npm install` alle Pakete, welche für das Projekt benötigt werden mit npm installieren. 
Hinweis: Die Pakete werden in der package.json mit der Versionsnummer hinterlegt.
7. API starten über `npm run dev` (Befehl aus dem Verzeichnis aufrufen)
8. Postman öffnen
9. Neue Anfrage erstellen (HTTP GET Request)
10. In die Url Leiste folgendes eingeben: `http://<Öffentliche-IP-Ec2-Instanz>:5000/test`
11. Falls noch nicht vorhanden erstelle eine DynamoDB Tabelle `test` mit dem Primärschlüssel `id`
(Falls noch nicht vorhanden)
12. Aufgabe: finde heraus, wie ich über IAM die Berechtigung auf Cloudwatch und Dynammodb hinzufügen kannst
13. Beobachte die Logs in Cloudwatch, nachdem die Berechtigung erfolgreich hinzugefügt wurde
