# Week III – Requirement Analysis

**Duration:** 11/03/2025 – 16/03/2025  

This week established a complete, testable set of **functional** and **non‑functional** requirements for the *Virtual Herbal Garden* platform, grounded in the SIH 2024 Problem Statement (ID: 1555), AYUSH objectives, and our prior discussions (React + Flask stack, GLB 3D models, WebAR via AR.js, multilingual UX in Marathi/Hindi/English, searchable plant knowledge base, quizzes, and admin tooling).

---

## 1) Objectives of the Week
- Translate problem understanding into **clear, verifiable requirements**.
- Define **personas, user journeys, user stories** with acceptance criteria.
- Produce the **system context**, **module boundaries**, **data model (ER)**, and **API contract**.
- Lock down **quality targets** (performance, accessibility, security, i18n) and **constraints** (AR assets size, device compatibility).
- Create an initial **Requirements Traceability Matrix (RTM)** mapping SIH goals → features → tests.

---

## 2) Scope

### In‑Scope (MVP)
- Web application (React) with sections: **Home, Plant Explorer, Plant Detail, AR View, Quiz, About/References**, and **Language switcher** (MR/HI/EN).
- Backend (Flask) + MySQL for plants/ailments/content and quiz items.
- **Search by plant name, parts used, ailment/symptom**, filters (habitat, usage, toxicity flags).
- **Marker‑based WebAR** (AR.js) showing a **GLB** model with a short usage overlay.
- **Multilingual content** (titles, descriptions, UI strings) with runtime toggle.
- **Admin console** (basic): CRUD for plants, ailments, translations, media & 3D model links.
- **Quiz module** (MCQ) with difficulty levels and instant feedback.
- Documentation: **User Guide**, **Admin Guide**, **API Docs (OpenAPI)**.

### Future/Out‑of‑Scope (for now)
- Offline‑first mobile app (React Native), **e‑commerce**, **AI chatbot for health triage**, **image recognition** of plants, and **voice UX**. (Designed for future integration, not required for MVP.)

---

## 3) Personas & Primary User Needs

1. **Student/Enthusiast (Ananya, 19):** Discover plants, learn uses quickly, take quizzes.  
   - Needs: Simple search, readable cards, local language, fast loading, AR wow‑factor.
2. **Research Learner (Rohit, 24):** Structured details with references.  
   - Needs: Scientific names, parts used, phytochemicals, toxicity/contraindications, citations.
3. **Farmer/Herbal Practitioner (Meera, 32):** Practical info by symptom/ailment, regional names.  
   - Needs: Search‑by‑ailment, common names, dos/don’ts, preparation basics, language toggle.
4. **Admin/Curator (Guide/Team):** Maintain data integrity and freshness.  
   - Needs: Clean CRUD, CSV import, image/GLB upload links, validation and preview.

---

## 4) User Stories with Acceptance Criteria (Samples)

**US‑01 Search (keyword):**  
*As a learner, I want to search by a keyword so that I can quickly find relevant plants.*  
- **AC1:** When entering ≥2 characters, system returns suggestions within **300 ms**.  
- **AC2:** Results show **name, thumbnail, short uses**, and available **languages**.  
- **AC3:** Search matches **scientific name, common names, ailments, parts used**.

**US‑02 Symptom/Ailment Search:**  
*As a user, I want to select an ailment to see plants commonly used for it.*  
- **AC1:** Selecting an ailment shows ≥1 associated plants, sorted by **relevance**.  
- **AC2:** Each item lists **part used** and **usage caution** if any.  
- **AC3:** Empty state shows guidance and **related ailments**.

**US‑03 Plant Detail:**  
*As a user, I want a rich plant page with structured info.*  
- **AC1:** Detail page contains **images, 3D model (if available), scientific & common names, taxonomy, parts used, medicinal uses, contraindications, references**.  
- **AC2:** **Language toggle** updates text without page reload.  
- **AC3:** **Open in AR** button appears if model_url exists.

**US‑04 AR View:**  
*As a user, I want to view a plant model in AR to visualize morphology.*  
- **AC1:** Loading the AR scene displays model with ≤ **4 MB** GLB, **<2 s** on 4G.  
- **AC2:** AR marker detection stable at typical indoor lighting; fallback to **3D viewer** if camera not available.  
- **AC3:** On‑screen **usage overlay** and **safety note**.

**US‑05 Quiz:**  
*As a student, I want topic‑wise quizzes with feedback.*  
- **AC1:** Generate 10 MCQs from current category/difficulty.  
- **AC2:** Show correct answer with a short explainer and a **learn more** link.  
- **AC3:** Persist last score locally; exportable as CSV (client‑side).

**US‑06 Admin CRUD:**  
*As an admin, I can create/update plants, ailments, translations and media links.*  
- **AC1:** Validation for **scientific_name uniqueness**, mandatory references for claims.  
- **AC2:** Upload fields accept **image URLs, GLB URLs**, size hints, and rights metadata.  
- **AC3:** Bulk import **CSV** with preview and rollback.

---

## 5) System Context & Architecture (High‑Level)

```
[Browser: React]  <—REST/JSON—>  [Flask API]  <—SQL—> [MySQL]
      |                                   |
   [AR.js] ← GLB via CDN/Static           |—(Storage pointers to images/GLB)
      |
 [Camera/Marker]
```

- **Client:** React + Router; i18n; state (Redux/Context); AR.js scene for marker‑based WebAR; optional `<model-viewer>`/Three.js for non‑AR 3D view.  
- **API:** Flask (Blueprints): `/plants`, `/ailments`, `/search`, `/quiz`, `/i18n`, `/admin`.  
- **DB:** MySQL with FKs, indices, and optional **FULLTEXT** for search.  
- **Assets:** Images & GLB hosted via static server/CDN; DB stores URLs + rights metadata.

---

## 6) Data Model (ER Outline)

**Entities**
- **plants** *(plant_id PK)*: `scientific_name (unique)`, `family`, `synonyms`, `habitat`, `toxicity_flag`, `precautions`, `image_urls (JSON)`, `model_url`, `references (JSON)`, `created_at`, `updated_at`  
- **plant_common_names** *(id PK)*: `plant_id FK`, `lang_code`, `name`
- **plant_parts** *(id PK)*: `plant_id FK`, `part`  *(e.g., leaf, root, bark)*
- **ailments** *(ailment_id PK)*: `slug (unique)`, `title_en`, `title_hi`, `title_mr`, `description`
- **plant_ailments** *(plant_id FK, ailment_id FK, PRIMARY KEY (plant_id, ailment_id))*: `evidence_level`, `notes`
- **uses** *(use_id PK)*: `plant_id FK`, `lang_code`, `use_text`, `preparation`, `dosage_note`
- **i18n_strings** *(key PK)*: `en`, `hi`, `mr`
- **users** *(optional for admin)*
- **quiz_items** *(quiz_id PK)*: `topic`, `difficulty`, `question`, `options (JSON)`, `answer_index`, `explain`, `ref_links (JSON)`

**Indices & Search**
- `FULLTEXT(scientific_name, synonyms)` on **plants**.  
- `FULLTEXT(name)` on **plant_common_names**.  
- `FULLTEXT(use_text, preparation)` on **uses**.  
- Composite index on **plant_ailments(ailment_id, plant_id)**.

---

## 7) API Contract (Initial)

### 7.1 Search
`GET /api/search?q={keyword}&lang=en&limit=20`  
**200**  
```json
{
  "query": "fever",
  "results": [
    {
      "plant_id": 102,
      "scientific_name": "Ocimum sanctum",
      "common_names": ["Tulsi"],
      "snippet": "Traditionally used for fever and cold...",
      "image": "https://cdn/vhg/102.jpg",
      "languages": ["en", "hi", "mr"]
    }
  ]
}
```

### 7.2 Plants
`GET /api/plants?ailment=fever&part=leaf&lang=hi&page=1`  
`GET /api/plants/{id}?lang=mr`  
**200**  
```json
{
  "plant_id": 102,
  "scientific_name": "Ocimum sanctum",
  "family": "Lamiaceae",
  "common_names": [{"lang":"en","name":"Holy Basil"},{"lang":"hi","name":"तुलसी"},{"lang":"mr","name":"तुळस"}],
  "parts_used": ["leaf"],
  "uses": [
    {"lang":"en","use_text":"Infusion for cold and mild fever...","preparation":"Boil 5-7 leaves...","dosage_note":"Consult practitioner."}
  ],
  "toxicity_flag": false,
  "precautions": "Avoid high doses in pregnancy without expert advice.",
  "images": ["https://cdn/vhg/102_1.jpg","https://cdn/vhg/102_2.jpg"],
  "model_url": "https://cdn/vhg/models/102.glb",
  "references": ["NMPB","Peer‑reviewed sources"]
}
```

### 7.3 Ailments
`GET /api/ailments?lang=en` → list with localized titles.  
`GET /api/ailments/{slug}` → details + related plants.

### 7.4 Quiz
`POST /api/quiz/generate`
```json
{"topic":"leaves","difficulty":"easy","lang":"en","count":10}
```
**200**
```json
{"items":[{"question":"Which plant is called Tulsi?","options":["Azadirachta indica","Ocimum sanctum","Tinospora cordifolia","Rauvolfia serpentina"],"answer_index":1,"explain":"Tulsi is Ocimum sanctum."}]}
```

### 7.5 i18n
`GET /api/i18n?lang=mr` → UI strings bundle.

### 7.6 Admin (secured)
- `POST /api/admin/plants` (create/update)  
- `POST /api/admin/import/csv` (dry‑run preview + commit)  
- `POST /api/admin/media/check` (validate URLs, size, mime)

---

## 8) Search & Relevance Logic (Initial)

- **Keyword search** over: scientific/common names, uses, ailments.  
- **Ailment mapping** via `plant_ailments` with optional `evidence_level` weight.  
- **Ranking** factors: field match weight (scientific > common > uses), data completeness (has image/model), evidence_level, click‑through history (future).  
- **Spelling tolerance**: simple trigram or Levenshtein (client‑side hint + backend fallback).

---

## 9) Multilingual & Localization Strategy

- **Languages:** `en`, `hi`, `mr` for MVP.  
- **Storage:** Content fields stored per language in **uses** and **plant_common_names**; global UI strings in **i18n_strings**.  
- **Fallback:** If a translation missing, show English + indicator.  
- **Input normalization:** Unicode NFC; search expands diacritics; common aliases table for transliteration hints.  
- **RTL readiness:** Structure compatible (no RTL for MVP languages).

---

## 10) AR/3D Asset Requirements

- **Format:** GLB (binary glTF).  
- **Size budget:** ≤ **4 MB** per model (target 2–3 MB), triangle budget ≤ **50k**.  
- **Textures:** WebP/PNG ≤ 2K; atlas where possible.  
- **Naming:** `{plant_id}-{scientific_name}.glb`.  
- **Hosting:** `/static/models/` (dev) → CDN (prod).  
- **Fallback:** If camera blocked/unsupported, open **non‑AR 3D viewer**.  
- **Accessibility:** Alt text for images; textual **morphology summary** for users who can’t access AR.

---

## 11) Non‑Functional Requirements (NFRs)

- **Performance:** TTI ≤ **3 s** on 4G (Lighthouse); search API **p95 < 300 ms**; largest image ≤ **300 KB** on listing; GZIP/Brotli; HTTP/2 or HTTP/3.  
- **Compatibility:** Chrome/Edge/Firefox/Safari latest; Android 10+ camera for AR; graceful degradations.  
- **Reliability:** 99% uptime (college infra); DB backups daily; migrations versioned.  
- **Security:** OWASP Top‑10 mitigations; input validation; rate limiting for search; CORS narrow; HTTPS.  
- **Privacy/Ethics:** Medical **disclaimer** (educational only); no PII needed for end users; admin auth required.  
- **Accessibility:** WCAG 2.1 AA targets—contrast, keyboard nav, focus rings, aria labels; font size ≥ 16px; language attributes.  
- **Internationalization:** Complete coverage for UI strings and key content for top 100 plants in all 3 languages.

---

## 12) Data Ingestion & Curation

- **Sources:** AYUSH/NMPB references; vetted open resources.  
- **Pipeline (manual + semi‑automated):** CSV templates → admin CSV import (dry‑run) → validation rules (mandatory refs, unique scientific_name) → commit.  
- **Cleaning:** Standardize taxonomy; normalize units; deduplicate common names; tag **contraindications**.  
- **Provenance:** Each claim must carry **reference id**; UI shows source badges.

**CSV Template (plants.csv)**  
`scientific_name,family,synonyms,habitat,toxicity_flag,precautions,image_urls,model_url,references`

---

## 13) UI Requirements (Web)

- **Home:** Hero, search bar, featured plants, language toggle.  
- **Plant Explorer:** Filters (ailment, part, habitat), infinite scroll/pagination, quick‑view.  
- **Plant Detail:** Tabs (Overview, Uses, Precautions, AR/3D, References).  
- **AR View:** Marker instruction card, camera permission helper.  
- **Quiz:** Topic & difficulty selectors, progress, result summary.  
- **Admin:** Tables with inline edit, CSV import wizard, media checker.

---

## 14) Dev Environment & CI/CD (Initial)

- **Frontend:** React + Vite, TypeScript optional; State via Context/Redux; i18n lib.  
- **Backend:** Flask + Blueprints; SQLAlchemy; Marshmallow/Pydantic‑like validation.  
- **DB:** MySQL (local via XAMPP/MySQL server).  
- **Docs:** OpenAPI via Flasgger/Swagger UI.  
- **Tests:** PyTest (API), Jest/RTL (UI), Cypress/Playwright (E2E optional).  
- **CI (GitHub Actions):** Lint + unit tests on PR; build artifacts; deploy to college server.  
- **Logging/Monitoring:** Gunicorn logs; simple request/latency logs; MySQL slow query log.

---

## 15) Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| AR instability on low‑end devices | Medium | Medium | Provide non‑AR 3D fallback; reduce model sizes |
| Incomplete translations | Medium | High | Fallback to EN + translation backlog; prioritize top 100 plants |
| Data accuracy concerns | High | Medium | Mandatory references; periodic mentor review; citation badges |
| Asset hosting bandwidth | Medium | Medium | Compress images/GLB; enable CDN later |
| Scope creep (AI chatbot, e‑commerce) | Medium | High | Strict MVP; RTM governance |

---

## 16) Requirements Traceability Matrix (Excerpt)

| SIH/AYUSH Goal | Feature | Requirement ID | Verification |
|---|---|---|---|
| Digital conservation of herbal knowledge | Plant Explorer + Detail | FR‑P1..P6 | UI test + API integration tests |
| Accessibility & multilingual | i18n + localized content | NFR‑I18N‑1..6 | Language toggle tests; content coverage report |
| Modern engagement | WebAR + 3D models | FR‑AR‑1..5 | AR smoke tests on Android; model size checks |
| Education outcomes | Quiz module | FR‑QZ‑1..4 | Unit tests for generation + scoring |
| Responsible messaging | Disclaimers & references | NFR‑ETH‑1..3 | Presence in UI; link checks |

---

## 17) Deliverables Produced This Week
- **Requirements Specification v1.0 (this document).**
- **ER model draft** and **API contract draft** (to be committed as OpenAPI JSON/YAML).  
- **CSV templates** for plants/uses/ailments.  
- **RTM v0.1** to guide design, dev, and testing in subsequent weeks.

---

## 18) Exit Criteria (Met)
- All MVP features defined with **testable acceptance criteria**.  
- Data model and API surface sufficient to start **schema creation (Week IV.3)** and **frontend prototyping (Week V.1)**.  
- Risks identified with initial mitigations; traceability established.
