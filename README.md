# deandraycoates.com

Personal portfolio for Deandray Coates. A single static page, no framework and no build step.

- `index.html`: all content (hero, certifications, PKI lab, experience, projects, skills, education, contact)
- `style.css`: styles. Colors, fonts, spacing, and radius are CSS custom properties at the top of the file. Dark theme is `:root`, light theme is `:root[data-theme="light"]`.
- `script.js`: theme toggle, mobile menu, active-section highlighting, scroll reveal, terminal line, PKI diagram toggle
- `about.html`, `projects.html`, `skills.html`: redirects from the old multi-page URLs
- `og-image.png`: link preview image (1200x630)

Deploys through GitHub Pages from the `main` branch. DNS is on Cloudflare (`CNAME`).

To preview locally: `python3 -m http.server` and open http://localhost:8000.
