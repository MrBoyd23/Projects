# Brandon Anthony Boyd — Resume Site

Personal resume and skills showcase site built with React, served via nginx on WHM/cPanel.
Live at **[resume.brandonaboyd.com](https://resume.brandonaboyd.com)**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6 |
| Styling | CSS Modules + Global CSS |
| Backend | Express (contact form + API) |
| Resume Generation | `docx` npm package |
| Deployment | nginx, WHM/cPanel |
| Fonts | Inter, Poppins, Fira Code (Google Fonts) |

---

## Project Structure

```
Resume/
├── public/                  # Static assets (favicon, manifest, generated resume)
├── src/
│   ├── components/          # Page components
│   │   ├── Experience.js    # Homepage — professional timeline
│   │   ├── Skills.js        # Experience page — skills grid & project cards
│   │   ├── Education.js     # Education history
│   │   ├── Certifications.js
│   │   ├── Header.js        # Sticky nav with Download Resume button
│   │   ├── Sidebar.js
│   │   └── skills/          # Individual skill detail pages (30+ pages)
│   ├── css/                 # CSS Modules per component + global styles
│   ├── data/
│   │   └── skillsConfig.js  # Skill page registry
│   └── App.js               # Routes + lazy loading
├── server/
│   └── server.js            # Express backend (contact form POST /api/contact)
├── generate-resume.js       # Generates public/Brandon_Boyd_Resume.docx
├── nginx.conf               # nginx server block config
└── package.json
```

---

## Local Development

### 1. Install dependencies

```bash
npm install
cd server && npm install && cd ..
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in values:

```
REACT_APP_GITHUB_REPO=your-github-username/repo
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=465
SMTP_USER=you@yourdomain.com
SMTP_PASS=yourpassword
CONTACT_RECIPIENT=you@yourdomain.com
SERVER_PORT=5000
REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

### 3. Start the React dev server

```bash
npm start
```

Runs on [http://localhost:3000](http://localhost:3000).
API calls to `/api/*` are proxied to the Express server on port 5000.

### 4. Start the Express backend (contact form)

In a separate terminal:

```bash
npm run server
```

Runs on [http://localhost:5000](http://localhost:5000).

---

## Building for Production

```bash
npm run build
```

The `prebuild` hook automatically runs `generate-resume.js` first, which regenerates
`public/Brandon_Boyd_Resume.docx` with the latest resume content before the React
build runs. The docx file is bundled into `build/` automatically.

### Deploy

```bash
cp -r build/* /var/www/resume/
sudo nginx -t && sudo nginx -s reload
```

---

## Resume Download

The **Download Resume** button in the nav bar downloads `Brandon_Boyd_Resume.docx`
directly from the server as a static asset.

To manually regenerate the resume without a full build:

```bash
node generate-resume.js
```

Output: `public/Brandon_Boyd_Resume.docx`

The document includes:
- Name and title header
- Full professional experience (all 7 roles at GoDaddy, 2008–Present)
- Core competencies with bullet breakdowns for current role

---

## Pages & Routes

| Route | Component | Description |
|---|---|---|
| `/` | `Experience.js` | Homepage — professional timeline |
| `/Experience` | `Skills.js` | Skills grid, project cards, sites built |
| `/Education` | `Education.js` | Education history |
| `/Education` (tab) | `Certifications.js` | Certifications |
| `/skills/:id` | Dynamic skill pages | 30+ individual skill detail pages |

---

## nginx Configuration

The site uses a custom nginx config (`nginx.conf`) on port 3500, with:

- SPA fallback (`try_files $uri /index.html`) for React Router
- `/api/` proxied to Express on port 5000
- `/Brandon_Boyd_Resume.docx` served directly (bypasses SPA fallback)
- Gzip compression enabled
- Aggressive caching for hashed static assets
- HTTP → HTTPS redirect handled via cPanel Force HTTPS toggle

To apply config changes:

```bash
sudo nginx -t          # test config
sudo nginx -s reload   # reload without downtime
```

---

## Key npm Scripts

| Script | Description |
|---|---|
| `npm start` | React dev server (port 3000) |
| `npm run build` | Regenerates resume → builds React app |
| `npm run server` | Start Express backend (port 5000) |
| `npm run server:install` | Install server-only dependencies |
| `node generate-resume.js` | Manually regenerate the .docx resume |

---

## Environment Notes

- Node.js 18+ recommended
- Built and tested on Ubuntu (WSL2)
- Deployed on WHM/cPanel with nginx
