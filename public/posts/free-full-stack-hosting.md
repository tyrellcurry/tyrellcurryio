# Hosting a Full-Stack App for Free on Vercel and My Raspberry Pi

_Published August 8th, 2026_

---

I built [invoiceApp](https://github.com/tyrellcurry/invoiceApp), a mock invoicing app as a portfolio project. It is built with a React frontend following the Bulletproof React architecture, a Go API, a Postgres DB, and Google sign-in support. I decided to host the backend on my Raspberry Pi and the frontend on Vercel with a free domain name.

The Pi from my [last post](/blog/raspberry-pi-server) already runs this site for free (other than my electricity and wifi bill 🤣).

You can view the live invoice site [here](https://invoice-app-tyrell-curry.vercel.app) ⚡️.

Here's how the whole thing is wired together.

---

## The Split

**Vercel** builds and serves the frontend. The free tier comes with a global CDN, automatic deploys on every push, and a free `.vercel.app` domain, which is hard to beat for static files.

The backend is where paid plans usually come into play because it needs a real **Postgres** database. However, my Pi already had the capacity and a deploy pipeline from the this site, so it was relatively simple for hosting the API and the database there.

---

## The Backend on the Pi

**Caddy** was already handling HTTPS for this site, so exposing the API took one new block in the same Caddyfile, plus one DNS record in Cloudflare pointing the new subdomain at my home IP:

```
invoices-api.tyrellcurry.io {
    reverse_proxy localhost:8082
}
```

Caddy grabs a Let's Encrypt cert for the new subdomain automatically, the same way it does for this site.

**The Go API** is a single binary in `/opt/invoiceapp`, running as a **systemd** unit so it survives reboots and restarts itself if it crashes. It reads its config (database credentials, Google OAuth keys, the allowed CORS origin) from an env file next to it.

**Postgres** runs in a **Docker** container with its port bound to `127.0.0.1` only, so the database is never reachable from outside the Pi. Only the Go API, sitting on the same machine, can talk to it.

---

## The Frontend on Vercel

Vercel connects to the GitHub repo and handles serving the frontend files. Since the repo holds both halves of the app, the project's **Root Directory** is set to `frontend/` so Vercel only builds and deploys that folder.

Two settings that make it work:

1. `VITE_API_URL` is set to the API's URL in Vercel's environment variables. Vite bakes it into the JS bundle at build time, which is how the deployed frontend knows where the backend lives.
2. A `vercel.json` rewrite sends every path to `index.html`, because routing happens client-side in React. Without it, loading `/invoices/abc` directly would 404 at Vercel's edge before the app ever runs:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## How the Two Halves Talk

There is no proxy or middleware between them. The browser loads the app from Vercel, then calls the API on the Pi directly over HTTPS.

**CORS** makes that possible. The frontend and API are on different domains, so the Go API explicitly allows the Vercel origin and nothing else.

**Sessions** are bearer tokens. Continuing as a guest calls `POST /auth/guest`, which creates a session row in Postgres and returns its token. The frontend stores it and sends it in the `Authorization` header on every request, and every invoice query on the Go side is scoped to that session's owner, so each visitor only ever sees their own data.

**Google sign-in** runs entirely through the backend. The frontend just navigates to the API's `/auth/google/login`, and the API handles the whole OAuth handshake with Google: the consent screen, the code exchange, verifying the ID token. When it finishes, it redirects the browser back to the frontend with a session token, this one tied to a user row instead of an ephemeral guest. The frontend never touches Google credentials at all.

---

## Deployments

Both halves ship on a push to `develop`, through two separate pipelines:

- **Frontend**: Vercel's GitHub integration builds and deploys it automatically. No workflow to write or maintain.
- **Backend**: the same pipeline from my [last post](/blog/raspberry-pi-server). GitHub Actions cross-compiles the Go binary for `linux/arm64`, joins my private **Tailscale** network, SSHes into the Pi, swaps the binary, and restarts the systemd service.

Total hosting cost for all of it: zero!

---

## Source Code

- [invoiceApp](https://github.com/tyrellcurry/invoiceApp) (the app, with the Pi deploy tooling in `backend/deploy/`)
- [pi-portfolio-server](https://github.com/tyrellcurry/pi-portfolio-server) (the Go server this site runs on, and the source of the deploy pattern)
