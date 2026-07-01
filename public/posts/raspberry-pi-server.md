# I Built a Web Server on my Raspberry Pi 5

_Published June 30th, 2026_

---

I've always wanted to self-host something. The thought of owning the machine my site runs on was really exciting. So I decided to order a Raspberry Pi 5 and learn how.

I now have a little production server at my home in Richmond, BC, serving this website.

Here's how it works.

---

## The Stack

The server is written in **Go** which I split into two services:

- `pi-webserver`: a static file server that serves this site and logs every request to a SQLite database
- `pi-metrics`: a small API that reads that database and exposes traffic stats like the ones you can see on the home page

Both services share a single `portfolio.db` SQLite file in WAL mode so they can read and write concurrently without stepping on each other.

Go was the right call here. Single binary, tiny memory footprint, and it compiles to `linux/arm64` out of the box which is exactly what the Pi 5 runs. Go is also what we use at work and I wanted to upskill in my free time.

---

## The Metrics Service

This part was a lot of fun.

The metrics service is currently set up to expose two endpoints:

- `/api/stats` -> all-time totals: total requests, total visits, uptime percentage
- `/api/requests/weekly` -> a 7-day breakdown by date, which feeds the traffic chart on the home page

The uptime percentage comes from a background health check that pings the webserver every minute and records the result in a `health_checks` table.

---

## Getting It Live

Getting the Pi onto the public internet without a static IP was the first real challenge. I'm using **Cloudflare** for DNS and **ddclient** running on the Pi to keep the DNS record updated whenever my home IP changes which works silently in the background.

For HTTPS, **Caddy** handles everything. It sits in front of both Go services, terminates TLS with a Let's Encrypt cert, and routes traffic. The `/api/*` endpoint goes to the metrics service on port `8081`, and everything else goes to the webserver on port `8080`.

Both services run as **systemd** units on the Pi, so they survive reboots and restart automatically if they crash.

---

## Deployments

This was the part was pretty cool since CI/CD is such a common practice, it was fun to set this up myself. When I push to GitHub it triggers a CI/CD pipeline that:

1. Cross-compiles the Go binaries for `linux/arm64` on a GitHub Actions runner
2. SSHs into the Pi over a private **Tailscale** tunnel
3. Drops the new binaries in place and restarts the systemd services

The whole deploy takes under a minute.

---

## What's Next

There's a lot I want to add. More detailed metrics, a proper blog section (you're reading it), maybe some more pages. But the foundation feels solid, and having it running from my home is a big win for me.

---

## Source Code

- [tyrellcurryio](https://github.com/tyrellcurry/tyrellcurryio) (Vite + TypeScript frontend)
- [pi-portfolio-server](https://github.com/tyrellcurry/pi-portfolio-server) (Go web server and metrics service)
