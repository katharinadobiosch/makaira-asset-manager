# BWS Makaira Asset Manager

Makaira-App zum Hochladen und Verwalten von Bildern im Bettwaren-Shop S3-Bucket.

## Funktionen

- Bild mit Titel und Alt-Text hochladen
- generierte S3-URL kopieren
- Assets suchen
- Titel und Alt-Text bearbeiten
- Assets löschen
- Thumbnail-Vorschau

## Lokale Entwicklung

```bash
npm install
npm run dev
```

App lokal öffnen:

```txt
http://localhost:3000?appType=app
```

## Deployment

Die App wird über Netlify deployed.

Der produktive Deploy-Branch ist:

```txt
stable
```

Bei jedem Push auf den Branch `stable` im verbundenen Netlify-Repository wird automatisch ein neues Deployment gestartet.

## Git Remotes

Dieses Projekt verwendet mehrere Git Remotes:

```txt
origin   -> Bettwaren-Shop/bws-makaira-asset-manager
netlify  -> katharinadobiosch/makaira-asset-manager
upstream -> MakairaIO/app-boilerplate-nextjs
```

Push ins BWS-Repository:

```bash
git push origin stable
```

Push ins Netlify/GitHub-Repository:

```bash
git push netlify stable
```

Push in beide Repositories:

```bash
npm run push:both
```


## Benötigte ENV Variablen

```env
MAKAIRA_APP_SECRET=
MAKAIRA_APP_SLUG=

APP_AWS_REGION=
APP_AWS_ACCESS_KEY_ID=
APP_AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=
S3_PREFIX=
S3_ASSET_BASE_URL=
```

Die echten Werte gehören in `.env.local` und dürfen nicht committed werden.

## Hinweise

- Die App läuft im Single-Tenant-Modus über `MAKAIRA_APP_SECRET` und `MAKAIRA_APP_SLUG`.
- Die Assets werden direkt in S3 gespeichert.
- Zu jedem Bild wird zusätzlich eine JSON-Datei mit Titel, Alt-Text, URL und Upload-Datum gespeichert.
- Prisma wird für diese App aktuell nicht benötigt.

---

# Makaira App Boilerplate / Starterkit

Dieses Projekt basiert auf dem Makaira Next.js App Boilerplate.

## Local Development in Makaira Admin UI

1. Run `npm run dev`
2. Start local HTTPS tunnel with ngrok:

```bash
ngrok http 3000
```

3. Register the app in Makaira with the ngrok URL as `externalURL`.
4. Open the app from the Makaira Admin UI dashboard.

## Single Tenant Mode

For this app, use:

```env
MAKAIRA_APP_SECRET=
MAKAIRA_APP_SLUG=
```

Then open locally with:

```txt
http://localhost:3000/asset-manager-dev?appType=app
```

## Makaira Docs

- https://docs.makaira.io/docs/apps
- https://docs.makaira.io/docs/content-widgets