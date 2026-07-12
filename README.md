# Sales Dashboard — Ready to Deploy

This is a complete, working React + Vite project. It builds successfully out of the box.

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Deploy to Vercel (recommended)

1. Push this folder to a GitHub repo
2. Go to https://vercel.com → **Add New Project** → select your repo
3. Vercel auto-detects Vite — just click **Deploy**
4. You'll get a live link like `your-project.vercel.app`

## Deploy to Netlify

1. Push to GitHub
2. https://netlify.com → **Add new site** → **Import an existing project**
3. Build command: `npm run build`, Publish directory: `dist`
4. Deploy

## Project structure

```
sales-dashboard-app/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx      (entry point)
    └── App.jsx       (the dashboard itself)
```

## Updating with your own data

Edit the `DATA` constant near the top of `src/App.jsx` with your own numbers (from `analyze.py` in the main project folder), then commit + push — Vercel/Netlify will auto-redeploy.
