# Charlie Lahorra: portfolio (React + Vite)

## Run it
    npm install
    npm run dev        # http://localhost:5173
    npm run build      # outputs dist/

## Deploy to GitHub Pages (charliemontalahorra.github.io)
1. Copy everything in this folder into your existing repo folder (keep the `.git` folder). Delete the old `index.html`, `style.css`, `script.js`, root `images/` and `profile.jpg`; they now live in `public/`.
2. On GitHub: repo Settings > Pages > Build and deployment > Source: **GitHub Actions**.
3. `git add . && git commit -m "React portfolio" && git push`. The workflow in `.github/workflows/deploy.yml` builds and publishes on every push to `main`.

## Edit content
- `src/data.js`: profile, skills, projects, sites, jobs, education. Both the page and the chat read from here.
- `src/engine.js`: the chat's keyword routing. To add an answer, call `add(id, [[keyword, weight], ...], () => [blocks], moreFn, followFn)`.
- Block types the chat can render: `text` (supports **bold**), `list`, `stats`, `go` (buttons), `projects`, `sites`, `timeline`, `skills`, `contact`.
- Chat shortcuts: `/help`, `/resume`, `/clear`, `/dark`, `/light`, Ctrl/Cmd K to focus, Up arrow to recall.
- Add GitHub/LinkedIn: fill `PROFILE.links` in `src/data.js`.
