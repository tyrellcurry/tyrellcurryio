# I Hosted a Full-Stack App for Free on Vercel and My Raspberry Pi

_Published August 8th, 2026_

---

I built [invoiceApp](https://github.com/tyrellcurry/invoiceApp), an invoicing app, as a showcase project: a React frontend, a Go API, Postgres, real Google sign-in. Once it worked locally I wanted it actually live, and I wanted that to cost nothing.

The Pi from my [last post](/blog/raspberry-pi-server) already runs one production site for free. This time I split the app across two places instead of cramming everything onto the Pi: the frontend on Vercel, the backend and database on the Pi.

Here's why, and what actually went wrong getting there.

---

## Why Split It

Vercel's free tier builds and deploys a static frontend on every push, with its own CDN, for nothing. There's no reason to serve static files from my home network when a purpose-built platform will do it for free and faster.

The backend is a different story. It needs a real Postgres database, and a database isn't something you get for free on Vercel without hitting limits fast. The Pi already had spare capacity, and I already had a working deploy pipeline for it from the portfolio site, so the backend went there instead.

The two halves talk over plain HTTPS, CORS on the Go side, nothing fancier than that.

---

## Reusing What Already Worked

I didn't want to invent new infrastructure. The portfolio site's deploy pipeline was already proven: GitHub Actions joins my **Tailscale** network, SSHes into the Pi, and restarts a **systemd** service. I copied that pattern almost exactly for invoiceApp's backend, cross-compile for `linux/arm64`, deploy over Tailscale, restart the service.

**Caddy** was already sitting in front of the Pi handling HTTPS for the portfolio site, so the new API just needed one more block in the same Caddyfile, a new subdomain, and it got a Let's Encrypt cert automatically like everything else there.

Postgres was the one new piece, it runs in a dedicated Docker container on the Pi, bound to localhost only, so it's never reachable from outside the machine.

---

## What Actually Went Wrong

None of this went smoothly the first time. Worth writing down since I'll definitely make these mistakes again otherwise:

**Port collision.** I picked `8081` for the new API without checking what else was already running on the Pi. `pi-metrics`, from the portfolio site, was already there. Caddy just silently proxied to nothing until I noticed.

**A stale Postgres password.** Postgres only applies `POSTGRES_PASSWORD` the very first time it initializes an empty data volume. I generated a real password, dropped it into `.env`, restarted, and got `password authentication failed` because the container had already initialized with an earlier placeholder value and never re-read the new one. The fix was wiping the volume and letting it reinitialize clean, an option only because there was no real data in it yet.

**A domain name collision I didn't expect.** Vercel's `*.vercel.app` subdomains are global, not scoped to your account. I assumed my project's name would give me a clean, predictable URL and wrote it into a config file without checking. It turned out to already belong to someone else's completely unrelated Nuxt project. Lesson: verify by content, not by HTTP status code, a `200` just means *something* answered.

**A blank page on every route but the homepage.** The app uses client-side routing, so a static host needs to fall back to `index.html` for every path, or a direct link to `/invoices/abc` 404s. Vercel needs its Root Directory setting pointed at the actual app folder for its `vercel.json` rewrite rule to even be read in the first place, easy to miss in a repo with more than one project in it.

Every one of these was a five-minute fix once actually found. Finding them was the whole job.

---

## Where It Landed

The frontend deploys automatically on every push, Vercel's own GitHub integration, no workflow to maintain. The backend deploys the same way the portfolio site always has, a GitHub Actions run that never touches my machine directly. Sign-in is real Google OAuth, backed by sessions in Postgres, not a token the frontend just trusts.

Total added hosting cost: zero. The Pi was already paid for and already running, and Vercel's free tier covers everything the frontend needs.

---

## Source Code

- [invoiceApp](https://github.com/tyrellcurry/invoiceApp) (React/Go invoicing app, `backend/deploy/` has the actual Pi deploy tooling)
- [pi-portfolio-server](https://github.com/tyrellcurry/pi-portfolio-server) (the Go server this site runs on, source of the deploy pattern I reused)
