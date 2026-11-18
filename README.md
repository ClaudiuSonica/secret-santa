# Secret Santa

Aplicație React cu interfață în română pentru organizarea unei extrageri Secret Santa. Serverul face potrivirea și trimite fiecărui participant numele persoanei pentru care pregătește un cadou.

## Cerințe

- Node.js 26.13.1 LTS (versiunea este indicată în `.nvmrc`)
- Un cont Brevo cu e-mailurile tranzacționale activate și o adresă de expediere verificată

## Rulare locală

```sh
nvm install
nvm use
npm ci
cp .env.example .env
```

Completează `BREVO_API_KEY` și `SENDER_EMAIL` în `.env`. Adresa expeditorului trebuie să fie verificată în Brevo. Fișierul `.env` este ignorat de Git și este încărcat de `npm run start`.

Dacă Brevo răspunde cu eroarea `unauthorized` pentru un IP nerecunoscut, adaugă IP-ul public de ieșire al calculatorului în **Settings → Security → Authorized IPs** din Brevo. Pentru găzduire, autorizează și IP-urile de ieșire folosite de ForjaHost.

Într-un terminal pornește serverul:

```sh
npm run start
```

Într-un al doilea terminal pornește interfața:

```sh
npm run dev
```

Deschide adresa locală afișată de Vite, de obicei `http://localhost:5173`. Adaugă cel puțin trei participanți și trimite extragerea. Se vor trimite e-mailuri reale prin Brevo către toate adresele din listă, așa că folosește adrese de test pe care le controlezi.

Vite redirecționează cererile API către serverul local de pe portul `3000`. Serverul folosește variabila `PORT` când este definită, iar ruta `/health` oferă un răspuns simplu de verificare.

## Găzduire pe ForjaHost

Conectează repository-ul la ForjaHost și folosește fișierul `Dockerfile` din rădăcina proiectului. Imaginea construiește interfața și apoi servește fișierele statice și endpoint-ul de e-mail dintr-un singur proces Node.js 26. ForjaHost furnizează `PORT` și poate verifica aplicația prin ruta `/health`.

Configurează aceste variabile în proiectul ForjaHost:

| Variabilă | Valoare |
| --- | --- |
| `BREVO_API_KEY` | Cheie privată Brevo cu acces la e-mailurile tranzacționale |
| `SENDER_EMAIL` | Adresa expeditorului verificată în Brevo |
| `PORT` | Lasă valoarea furnizată de ForjaHost |

Nu încărca un fișier `.env` cu secrete în repository și nu pune cheile în variabile `VITE_*`. Înainte de a invita participanți, verifică expeditorul și autentifică domeniul de trimitere în Brevo.

## Trimiterea e-mailurilor

`POST /api/send-matches` primește `{ "participants": [{ "name": "...", "email": "...", "details": "..." }], "requestId": "<uuid>" }`. `details` este opțional și poate avea cel mult 500 de caractere; apare în e-mailul persoanei care a fost potrivită cu acel participant. Serverul cere între 3 și 100 de participanți, adrese de e-mail valide și unice, precum și un identificator UUID pentru cerere. Creează o extragere fără potriviri cu sine, în care fiecare participant primește exact un nume, și trimite mesaje personalizate printr-un singur lot Brevo. Potrivirile nu sunt trimise înapoi către browser.

Aplicația nu are autentificare: oricine poate trimite o extragere dacă poate accesa URL-ul. Dacă aplicația este găzduită pe un URL public, restricționează accesul la nivelul ForjaHost sau al unui proxy privat înainte de a o folosi cu adrese reale. Serverul limitează la 10 extrageri pe oră pentru fiecare proces; limita se resetează la repornirea procesului. Pentru utilizare publică, configurează și o limitare persistentă la nivelul platformei. Dacă o cerere expiră, verifică jurnalul tranzacțional Brevo înainte să încerci din nou.
