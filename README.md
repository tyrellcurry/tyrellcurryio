# tyrellcurryio

Frontend for [tyrellcurry.io](https://tyrellcurry.io), built with Vite, TypeScript, and Tailwind CSS.

Fetches live traffic metrics from the [Go backend](https://github.com/tyrellcurry/pi-portfolio-server) and renders them via Chart.js. Deployed to a Raspberry Pi 5 via GitHub Actions on every push to `main`.

## Development

```bash
npm install
npm run dev
```

Requires the [pi-portfolio-server](https://github.com/tyrellcurry/pi-portfolio-server) running locally on port `8081` for API calls, or they will be proxied and fail gracefully.

## Deploy

Pushing to `main` triggers a GitHub Actions workflow that builds the site with Vite and rsyncs `dist/` to the Pi over Tailscale SSH.
