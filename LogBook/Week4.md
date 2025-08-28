# Week IV.1 – Technology Research & Design Planning

**Duration:** 25/03/2025 – 30/03/2025

This week focused on selecting the final technology stack, designing high-level and low-level architecture, specifying component responsibilities, and creating an actionable design plan to implement the *Virtual Herbal Garden* MVP. The emphasis was on choosing technologies that balance **developer productivity**, **performance**, **device compatibility (Web + mobile)**, and **ease of AR/3D integration**.

---

## 1) Objectives of the Week
- Finalize the technology stack for frontend, backend, database, AR/3D pipeline and admin tooling.
- Create detailed architecture diagrams and component responsibilities.
- Decide on formats, hosting and optimization strategies for images and 3D assets (GLB + compression).
- Produce an implementation plan (tasks, milestones), developer environment setup, and CI/CD outline.
- Identify trade-offs and mitigation plans for device compatibility, performance and data accuracy.

---

## 2) Final Technology Stack (Selected and Rationale)

### Frontend (Web)
- **React (Functional components + Hooks)** — modular UI, mature ecosystem, works well with TypeScript if desired.
- **Vite** as the dev/build tool for blazing fast HMR and lightweight production bundles.
  - *Rationale:* very fast dev cycle and better DX compared to older bundlers. (See Vite docs.) citeturn1search0
- **React Router**, **react-i18next** for localization. `react-i18next` gives a robust client-side translation workflow for dynamic content and is well supported. citeturn0search2
- **<model-viewer>** web component for easy GLB rendering and WebAR entry-points (Scene Viewer / QuickLook fallback) on mobile; falls back cleanly to on-page 3D viewer when camera permission is denied. citeturn0search7
- **AR.js (marker-based)** for lightweight in-browser AR when full WebXR access is not available, providing reliable marker recognition across many devices and browsers. Use AR.js for the primary marker experience while `model-viewer`/WebXR is used where supported. citeturn0search3
- **Optional Three.js** for advanced 3D interactions (if we need custom shader or interaction beyond `<model-viewer>`).

### Backend (API)
- **Python / Flask** with application-factory + Blueprints to keep components modular and testable. Use Flask for rapid prototyping and easy integration with Python data tools. (Follow Flask structure best practices.) citeturn1search2
- **Flask-RESTful / Flask-Marshmallow** (or **Pydantic** for schema validation) to validate incoming requests and serialize responses.
- **Flask-Migrate** + **Alembic** for DB migrations and versioning. citeturn1search14

### Data Storage & Search
- **MySQL** for relational storage (plants, ailments, uses, translations). Use InnoDB, normalized schema, JSON columns for flexible fields like `images` and `references`.
- **Initial search:** MySQL `FULLTEXT` (for MVP) with carefully designed indices. Plan to integrate **Elasticsearch / OpenSearch** later if we need more advanced ranking, multi-language analyzers and fuzzy search (scalability path).

### Assets & CDN
- **Static assets (images, GLB models)** hosted on a static server / cloud storage + CDN for production (S3 + CloudFront or similar). For development use `static/` served by Flask and local dev server.
- **GLB / glTF** chosen as canonical 3D format (compact and web standard). Use Draco mesh compression via `gltf-pipeline` to reduce download size and improve mobile performance. citeturn0search11turn0search14

### i18n / Localization
- **react-i18next** on the frontend; content fields stored per-language in the DB; admin UI supports translation editing. For long-term, consider a Translation Management System (TMS) like Lokalise or Phrase for workflow (future phase). citeturn0search2turn0search8

### DevOps & Hosting
- **Staging & Prod:** College VPS or low-cost cloud (DigitalOcean / AWS EC2) for backend; static frontend hosted on CDN (Netlify / Vercel / S3 + CloudFront) for fast asset delivery.
- **CI:** GitHub Actions (lint, unit tests, build artifacts, run migrations in staging).

### Optional (future)
- **Redis** for caching search and frequently requested plant detail payloads.
- **Elasticsearch/OpenSearch** for advanced search ranking, language analyzers and synonym pipelines.

---

## 3) Architecture & Component Design (Detailed)

### High-Level Components
- **Client (React)**: Routes, global state (Context/Redux), Search UI, Explorer, Detail Page, AR Modal, Admin Console.
- **API (Flask)**: Auth (admin), Plants, Ailments, Search, Quiz, i18n strings, Import endpoints.
- **Asset Server / CDN**: Hosts `.jpg/.webp` and `.glb` files; provides signed URLs for protected assets.
- **DB (MySQL)**: Core data, translations, audit logs.
- **Admin**: React app (can be embedded in same repo) with upload/CSV import features.

### Component Responsibilities (Frontend)
- **SearchBar component**: typeahead, debounce (300ms), language aware queries.
- **PlantExplorer**: filtering, server-side pagination, image lazy-load, quick view modal.
- **PlantDetail**: tabs (Overview, Uses, Precautions, AR/3D, References), language toggle update via i18n context.
- **ARModal**: instructions, permission flow, marker selection, fallback to non-AR `<model-viewer>`.
- **AdminPanel**: CSV import wizard (dry-run), image/GLB URL checker, localized field editor, user management (admin only).

### API Design (Responsibilities)
- `/api/search` — keyword + filters + lang
- `/api/plants` — list + filters
- `/api/plants/{id}` — full detail (include translations)
- `/api/ailments` — list & details
- `/api/quiz` — generation endpoint
- `/api/admin/import` — CSV dry run + commit
- `/api/admin/media/check` — validate URL, mime, size

(See Week III API contract for concrete schemas.)

---

## 4) 3D & AR Pipeline — Asset Production & Optimization

### Asset Requirements & Guidelines
- **Format:** glTF 2.0 binary (.glb)
- **Size target:** ideally ≤ 2–4 MB per plant model; budget depends on complexity. Use LODs if necessary.
- **Textures:** WebP where acceptable; limit to 1024x1024 for mobile. Combine into atlases when possible.
- **Polygons:** target ≤ 50k triangles for medium detail; reduce for mobile LODs.
- **Animation:** not required for MVP; static models preferred (smaller size).

### Optimization Tools & Steps
1. Author models in Blender / Maya.
2. Export to glTF/glb (PBR friendly).
3. Run `gltf-pipeline` to apply **Draco compression** and pack textures: `gltf-pipeline -i model.glb -o model_draco.glb -d` (example). This reduces mesh size significantly. citeturn0search11turn0search14
4. Convert textures to WebP and optimize with `sharp` or `imagemin` pipelines.
5. Validate model with `model-viewer` editor and test on physical devices (Android scene viewer, iOS QuickLook). citeturn0search1turn0search4

### Hosting & Delivery
- Host on CDN with long TTLs and cache-busting on update.
- Provide `model_url` and `thumbnail` in plant detail response. Use signed URLs if assets should be access-controlled.

---

## 5) UI/UX Design & Wireframes (Practical Notes)

**Home screen**: prominent search, language toggle, featured plants carousel, AR demo CTA.  
**Plant Explorer**: grid with thumbnail, common name, quick use snippet and AR availability badge.  
**Plant Detail**: left column — images/3D; right column — names, taxonomy, parts used, uses, precautions, references; bottom — related plants & quizzes.  
**AR modal**: short instructions, sample marker, open camera, model anchors to marker, usage overlay panel with "Safety note" visible.  
**Admin**: left nav with Plants / Ailments / Translations / Media / Import; table views with inline edit and validation.

Include consistent UI tokens: 2xl rounded cards, soft shadows, at least p-2 spacing, accesible font sizes (≥16px body).

---

## 6) Security, Privacy & Ethics

- **HTTPS everywhere** (certs via Let's Encrypt or managed hosting provider).
- **Admin authentication**: JWT tokens + refresh tokens or session cookies; strong password policy; 2FA for mentor/admin accounts (optional).
- **Input validation & sanitization**: all API inputs validated via Marshmallow/Pydantic; escape content in frontend.  
- **Rate limiting** on search endpoints to prevent abuse.  
- **Content disclaimers**: All medical content marked "For educational purposes only" with references and mentor review badges.  
- **Minimal PII**: avoid storing user PII for MVP; if needed, store with consent and strict access controls.

---

## 7) Performance & Accessibility Targets

- **Performance goals:** TTI ≤ 3s on 4G for critical pages; lazy load non-critical assets; compress transfer (GZIP/Brotli). Use `preload` for hero images & core model thumbnails.
- **Accessibility (WCAG 2.1 AA):** high contrast, keyboard navigation, proper `aria` labels, language attributes per page, alt text for all images and short morphology text for AR-only content.
- **Mobile performance:** ensure AR fallback does not freeze the main thread; use web workers for heavy processing if necessary.

---

## 8) Developer Environment & Quick Start (Commands)

### Prerequisites
- Python 3.10+
- Node.js 18+ (or LTS)
- MySQL (via XAMPP or local server)
- Git

### Backend (Flask) quick setup (example)
```bash
# create venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# .env contains DB URI, SECRET_KEY, etc.
export FLASK_APP=app
flask db upgrade
flask run
```

**requirements.txt** (example)
```
Flask==2.2.5
Flask-SQLAlchemy==3.0.2
Flask-Migrate==4.0.4
marshmallow==3.19.0
gunicorn==21.2.0
python-dotenv==1.0.0
```
*(Pin versions as appropriate for stability.)*

### Frontend quick setup (Vite + React)
```bash
npm create vite@latest vhg-frontend -- --template react
cd vhg-frontend
npm install
npm run dev
# build
npm run build
```

**Suggested frontend packages:**
```
react, react-dom, react-router-dom, react-i18next, @google/model-viewer, axios
```

---

## 9) CI/CD & Testing Strategy

- **CI (GitHub Actions)** pipeline: lint (ESLint + Flake8), unit tests (Vitest / Jest for frontend, PyTest for backend), build and preview deployment to staging. Trigger migrations and DB seed only in staging branch with manual approval for prod.
- **Testing:** Unit tests for business logic, API contract tests, integration tests around search and import, and E2E with Playwright/Cypress for critical flows (search → detail → AR modal).
- **Code review:** PR based; require 1 approver from team + passing CI to merge.

---

## 10) Risks, Tradeoffs & Mitigations (Detailed)

- **Choice: `<model-viewer>` + AR.js (vs pure WebXR)** — *Tradeoff:* `<model-viewer>` provides broad compatibility and easier setup for mobile AR fallbacks while AR.js supports marker‑based experiences on low‑end devices. *Mitigation:* Implement both: use `model-viewer` for standard 3D/AR flow and enable AR.js marker scene for devices/browsers where model‑viewer/WebXR is unstable. citeturn0search7turn0search3
- **Search: MySQL FULLTEXT vs Elasticsearch** — *Tradeoff:* FULLTEXT is easier for MVP and lower ops load; Elasticsearch gives better ranking & analyzers. *Mitigation:* Start with FULLTEXT, instrument search logs, and move to Elasticsearch when requirements demand (synonyms, language analyzers).
- **Hosting assets on local server vs CDN** — *Tradeoff:* CDN cost vs performance. *Mitigation:* Use CDN for production; local dev uses Flask static server, with a plan to migrate to S3+CDN once we have >50 models.

---

## 11) Deliverables & Acceptance Criteria (This Week)
- Finalized technology stack and architecture diagrams (this document).
- Prototype proof-of-concept pages: Search UI + Plant Detail with `<model-viewer>` rendering of one GLB.
- Asset pipeline documented: `gltf-pipeline` + Draco, texture conversion steps and scripts.
- Dev environment scripts and `requirements.txt` + `package.json` template.
- A clear CI/CD plan and testing checklist for Week V onward.

---

## 12) Next Steps (Week IV.2 & IV.3)
- **Week IV.2 (Data Collection & Categorization):** Build CSV templates, start curated ingestion for top 100 plants, collect high-quality references and 3D asset requests.  
- **Week IV.3 (Backend & Database Setup):** Implement schema, migrations, seed scripts, and initial admin endpoints; wire up staging instance and static server for assets.

---

## 13) References & Supporting Docs (selected)
- Vite — Getting started & features. citeturn1search0  
- model-viewer — easy 3D model rendering + AR fallbacks. citeturn0search7  
- AR.js — marker-based WebAR library and docs. citeturn0search3  
- glTF Pipeline (gltf-pipeline) — optimization & Draco compression. citeturn0search11turn0search14  
- react-i18next / i18next — localization for React. citeturn0search2turn0search8

---

**End of Week IV.1 – Technology Research & Design Planning**
