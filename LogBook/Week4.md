
# Week IV – Technology Research, Data Collection & Backend Setup

**Project:** Virtual Herbal Garden  
**Weeks Covered:** IV.1 – IV.3  
**Dates:** 25/03/2025 – 13/04/2025

---

## Table of Contents

1. [Overview](#overview)  
2. [IV.1 — Technology Research and Design Planning (25/03/2025 – 30/03/2025)](#iv1---technology-research-and-design-planning-25032025--30032025)  
   - Objective
   - Activities & Findings
   - Technology Decisions
   - Architecture & Design (DIagrams & Description)
   - Wireframes & UI Considerations
   - Deliverables & Checklist
3. [IV.2 — Data Collection and Categorization (01/04/2025 – 06/04/2025)](#iv2---data-collection-and-categorization-01042025--06042025)  
   - Objective
   - Data Sources & Licensing
   - Data Model & Schema
   - ETL / Data Cleaning Pipeline
   - Categorization Taxonomy & Tagging Strategy
   - Sample CSV / JSON and Data Validation Rules
   - Deliverables & Checklist
4. [IV.3 — Backend and Database Setup (08/04/2025 – 13/04/2025)](#iv3---backend-and-database-setup-08042025--13042025)  
   - Objective
   - Environment Setup (local & staging)
   - Database Schema (DDL)
   - ORM Models (Flask SQLAlchemy)
   - REST API Design (endpoints, examples)
   - Authentication & Admin Panel
   - Performance, Indexing & Search Strategy
   - Backup, Migration & Deployment Notes
   - Deliverables & Checklist
5. [Repository & Folder Structure](#repository--folder-structure)  
6. [Next Steps & Recommendations](#next-steps--recommendations)  
7. [Appendix: Code Snippets & Scripts](#appendix-code-snippets--scripts)

---

## Overview

These three weeks (IV.1 – IV.3) cover the research and design choices required to implement a scalable Virtual Herbal Garden, the process for collecting and categorizing reliable medicinal plant data, and the concrete steps to set up a secure and maintainable backend with a relational database. The deliverable from this phase is a working backend prototype with a seeded database and well-documented APIs to be consumed by the React frontend and AR modules.

---

# IV.1 - Technology Research and Design Planning (25/03/2025 – 30/03/2025)

### Objective
To research, compare and finalize the technologies, design patterns, and integration approach for the front-end, back-end, 3D/AR components, and data pipeline — and to produce a clear architecture and UI wireframe plan for development (MVP + roadmap for advanced features).

### Activities & Findings

1. **Comparative analysis (front-end)**  
   - React.js selected for component-based UI, ecosystem (react-three-fiber, react-router), and large community support. Tailwind CSS chosen for rapid styling.  
   - Alternatives considered: Vue.js (good), Angular (more opinionated). React chosen for developer familiarity and ease of integrating WebGL.

2. **Comparative analysis (3D & AR)**  
   - WebGL/Three.js + react-three-fiber for rendering GLB/GLTF models in web UI.  
   - AR.js / WebXR for WebAR support (works in-browser, minimal app install). ARCore/ARKit considered for richer mobile AR but increases app complexity. Chose progressive approach: WebAR for MVP and native AR (React Native + Viro/Unity) for later versions.

3. **Back-end choices**  
   - Flask (Python) selected for quick API prototyping and integration with Python data-processing tools (NLTK, spaCy). Flask-SQLAlchemy for ORM. Gunicorn + Nginx for production deployment.  
   - Alternatives: Django (heavier), Node.js (JS full stack). Flask chosen for simplicity and team's Python familiarity.

4. **Database & Search**  
   - MySQL as the primary relational DB (structured plant records). For advanced search and full-text requirements, plan to integrate an ElasticSearch cluster or use MySQL FULLTEXT initially. Redis planned for caching frequently accessed plant records and search results.

5. **3D model pipeline**  
   - Asset requirements: `.glb` files (binary glTF) for each plant model; multiple LOD (level-of-detail) versions recommended. Use Blender for model cleanup and gltf-pipeline / `gltfpack` for optimization. Keep texture sizes limited and use compressed textures where possible.

6. **NLP & Symptom Mapping**  
   - Use spaCy for keyword extraction and lightweight mapping from symptom text -> candidate plants. For multilingual processing (Hindi/Marathi), use `indic-nlp` or simple rule-based keyword lists initially, and plan to integrate larger multilingual models later.

7. **Security & DevOps**  
   - JWT-based authentication for admin endpoints. HTTPS everywhere (Certbot + Nginx). Dockerize services for consistent deployments. CI/CD via GitHub Actions for tests, linting and deploy to staging server.

### Technology Decisions (Summary)

- Frontend: **React.js**, **react-three-fiber**, **Tailwind CSS**, **AR.js/WebXR**  
- Backend: **Flask**, **Flask-RESTful/Flask-Blueprints**, **Flask-SQLAlchemy**  
- Database: **MySQL** (Primary), **ElasticSearch** (optional future), **Redis** (cache)  
- 3D Models: **glTF / .glb**, tools: **Blender**, **gltf-pipeline**, **gltfpack**  
- NLP: **spaCy**, **NLTK**, simple lookup dictionaries for Marathi/Hindi  
- Deployment: **Docker**, **Gunicorn**, **Nginx**, **GitHub Actions**

### Architecture & Design

**High-level architecture components**:

- React Frontend (static assets served via CDN)
- Flask API Layer (REST endpoints, authentication)
- MySQL Database (plant records, users, translations)
- Asset Storage (S3-compatible or server / CDN for GLB, images)
- Redis Cache
- Optional: ElasticSearch for advanced search

Diagram (textual):

```
[User Browser/Device] <--HTTPS--> [Nginx / CDN] --> [React Frontend]
                                           |
                                           +--> [Flask API (Gunicorn)] --> [MySQL]
                                           |                                                                               |                                     -> [Redis Cache]
                                           |
                                           +--> [Asset Storage (GLB / Images / Audio)]
                                           |
                                           +--> [3rd party APIs (Google Maps, YouTube)]
```

### Wireframes & UI Considerations
- Homepage: Search bar (name / ailment), categories, featured tour cards.
- Plant detail page: 3D viewer (react-three-fiber), plant facts, images, audio, related plants, "view in AR" button.
- Admin panel: CRUD for plants, upload GLB, translations editor, verification logs.

### Deliverables & Checklist (IV.1)
- Chosen technology stack documented.
- High-level architecture diagram and component responsibilities.
- 3D asset pipeline plan and tooling list.
- Wireframe sketches for homepage and plant detail page.
- CI/CD and deployment plan (initial draft).

---

# IV.2 - Data Collection and Categorization (01/04/2025 – 06/04/2025)

### Objective
To collect authoritative medicinal plant data, design a normalized data model, create a robust ETL pipeline to clean and normalize the data, and categorize plants with a structured taxonomy suitable for search, filter, and multilingual content delivery.

### Activities & Findings

1. **Data Sources & Licensing**  
   - Primary sources: Ministry of AYUSH databases, National Medicinal Plants Board (NMPB), WHO Traditional Medicine resources.  
   - Secondary sources: Research papers, government PDFs, botanical garden datasets, reputable ethnobotany journals.  
   - Licensing: Prefer public-domain or government datasets; if using third-party research data, record the source and ensure appropriate citation and permission where needed.

2. **Data Fields & Canonical Schema**

**Canonical Plant Record (recommended fields)**:
- `plant_id` (UUID / INT PK)
- `scientific_name` (VARCHAR)
- `common_names` (JSON ARRAY) — supports multiple languages
- `family` (VARCHAR)
- `ayush_category` (ENUM: Ayurveda, Unani, Siddha, Homeopathy, Others)
- `parts_used` (JSON ARRAY)
- `medicinal_uses` (JSON ARRAY) — short descriptions
- `ailments` (JSON ARRAY) — normalized ailments (tags)
- `active_compounds` (TEXT)
- `habitat` (TEXT)
- `region_of_origin` (JSON ARRAY)
- `cultivation` (TEXT)
- `conservation_status` (VARCHAR)
- `images` (JSON ARRAY of URLs)
- `3d_model` (URL / path to .glb)
- `audio_desc` (URL)
- `video_links` (JSON ARRAY)
- `references` (JSON ARRAY of source URLs or citations)
- `last_verified` (DATE)
- `verified_by` (VARCHAR)
- `created_at`, `updated_at` (TIMESTAMP)

3. **Data Collection Process**

- **Step 1: Source Identification** — list and prioritize sources, get exportable formats (CSV, XLSX, JSON).
- **Step 2: Extraction** — manual scraping from PDFs or bulk CSV download if available. Use `tabula-py` for PDF tables, `requests` + `BeautifulSoup` for HTML scraping where allowed.
- **Step 3: Normalization** — convert variations of names to canonical forms, normalize units, map synonyms (e.g., "Tulsi" -> "Ocimum sanctum").
- **Step 4: Verification** — cross-check each plant’s medicinal claims against at least two authoritative sources before adding.
- **Step 5: Localization** — capture translations of common names and descriptions into Hindi/Marathi.

4. **ETL / Data Cleaning Pipeline**

- Tools: Python (pandas), OpenRefine for semi-manual cleaning, spaCy for NER/keyword extraction.
- Suggested pipeline (high-level):

```
raw_data_sources/ (csv, xlsx, pdf)
  --> extract.py (tabula, requests)
  --> transform.py (pandas cleaning + normalization)
  --> validate.py (cross-check references, duplicate detection)
  --> load.py (bulk insert into MySQL via SQLAlchemy)
```

- Key cleaning steps:
  - Trim trailing whitespace, unify case, remove duplicates.
  - Standardize botanical names using an accepted taxonomy (e.g., The Plant List or APG classification reference).
  - Consolidate synonyms and populate `common_names` array.
  - Tokenize `medicinal_uses` and `ailments` into normalized tags for search.

5. **Categorization Taxonomy & Tagging Strategy**

- Two orthogonal taxonomies:
  - **By AYUSH system**: Ayurveda, Unani, Siddha, Homeopathy, Others.
  - **By Use/Ailment**: Immunity, Digestive, Skin, Respiratory, Anti-inflammatory, Antimicrobial, Antidiabetic, etc.
- Tagging guidelines:
  - Each plant should have 3–8 tags max (most relevant treatments).
  - Tags must be lowercased and canonical (use a central tag table).
  - Keep a mapping dictionary `ailment_synonyms.json` to map user search terms to canonical tags (e.g., "fever", "pyrexia" -> "fever").

6. **Sample CSV / JSON Format**

**CSV header (example)**:

```csv
plant_id,scientific_name,common_names,family,ayush_category,parts_used,medicinal_uses,ailments,active_compounds,habitat,region_of_origin,cultivation,conservation_status,images,3d_model,audio_desc,video_links,references,last_verified
```

**Example JSON record**:

```json
{
  "plant_id": 101,
  "scientific_name": "Ocimum sanctum",
  "common_names": {"en": ["Holy Basil", "Tulsi"], "hi": ["तुलसी"], "mr": ["तुळस"]},
  "family": "Lamiaceae",
  "ayush_category": "Ayurveda",
  "parts_used": ["Leaves", "Stem"],
  "medicinal_uses": ["Immunity booster", "Respiratory relief", "Antimicrobial"],
  "ailments": ["immunity", "respiratory", "infection"],
  "3d_model": "assets/models/tulsi.glb",
  "images": ["assets/images/tulsi_1.jpg", "assets/images/tulsi_2.jpg"],
  "references": ["https://nmpb.nic.in", "https://who.int"]
}
```

7. **Data Validation Rules**

- `scientific_name` must be verified against a botanical source.
- `3d_model` field must point to an existing `.glb` file < 10MB for MVP (preferably < 5MB with LOD).
- `images` must have alt-text and resolution constraints (max 2048 px on the longer side).
- `references` must include at least one authoritative source URL per claim.

### Deliverables & Checklist (IV.2)
- Master CSV/JSON dataset for initial 150+ plants.
- Tagging dictionary (ailment ➜ canonical tag mapping).
- ETL scripts (extract.py, transform.py, validate.py, load.py).
- Data verification log and source citations.
- Localization file for English/Hindi/Marathi (i18n JSON).

---

# IV.3 - Backend and Database Setup (08/04/2025 – 13/04/2025)

### Objective
To set up the backend development environment, initialize the MySQL database schema, implement core API endpoints (CRUD for plants, search, translations, AR model retrieval), and ensure admin authentication and basic security measures are in place.

### Activities & Findings

1. **Environment Setup (Local)**
- Install XAMPP (MySQL) or use Docker Compose with a MySQL container. Example `docker-compose.yml` for local dev:

```yaml
version: '3.8'
services:
  db:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: herbal_garden
      MYSQL_USER: hg_user
      MYSQL_PASSWORD: hg_pass
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
volumes:
  db_data:
```

- Python environment setup (recommended):
  - `python -m venv venv`
  - `source venv/bin/activate` (or `venv\Scripts\activate` on Windows)
  - `pip install -r requirements.txt` (see appendix for sample requirements)

- Create `.env` file (do not commit) with contents:

```
FLASK_APP=app.py
FLASK_ENV=development
DATABASE_URL=mysql+pymysql://hg_user:hg_pass@localhost:3306/herbal_garden
SECRET_KEY=your_secret_key_here
JWT_SECRET_KEY=super_secure_jwt_key
```
> **Security note:** Never commit `.env` — use environment variables in production and secrets manager for sensitive data.

2. **Database Schema (DDL - core tables)**

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','editor','viewer') DEFAULT 'viewer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE plants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  scientific_name VARCHAR(255) NOT NULL,
  family VARCHAR(150),
  ayush_category VARCHAR(50),
  parts_used JSON,
  medicinal_uses JSON,
  ailments JSON,
  active_compounds TEXT,
  habitat TEXT,
  region_of_origin JSON,
  cultivation TEXT,
  conservation_status VARCHAR(100),
  images JSON,
  model_3d VARCHAR(512),
  audio_desc VARCHAR(512),
  video_links JSON,
  references JSON,
  last_verified DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY ux_scientific_name (scientific_name)
);

CREATE TABLE tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tag VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50)
);

CREATE TABLE plant_tags (
  plant_id INT,
  tag_id INT,
  PRIMARY KEY (plant_id, tag_id),
  FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

3. **ORM Models (Flask-SQLAlchemy) — sample**

```python
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('admin','editor','viewer'), default='viewer')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Plant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    scientific_name = db.Column(db.String(255), unique=True, nullable=False)
    family = db.Column(db.String(150))
    ayush_category = db.Column(db.String(50))
    parts_used = db.Column(db.JSON)
    medicinal_uses = db.Column(db.JSON)
    ailments = db.Column(db.JSON)
    model_3d = db.Column(db.String(512))
    images = db.Column(db.JSON)
    references = db.Column(db.JSON)
    last_verified = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

4. **REST API Design (examples)**

**Authentication:**
- `POST /api/auth/login` — returns JWT token for admin/editor
- `POST /api/auth/register` — registration (admin only or invite-based)

**Plant CRUD:**
- `GET /api/plants` — paginated list (query: page, per_page, q, tag)
- `GET /api/plants/<id>` — plant detail (includes 3D model URL)
- `POST /api/plants` — create plant (admin/editor) — accept JSON + multipart for files
- `PUT /api/plants/<id>` — update plant
- `DELETE /api/plants/<id>` — delete plant (admin only)

**Search & Filter:**
- `GET /api/search?q=<term>&filter=ailment:immunity` — search endpoint
- `POST /api/search/symptom` — body: { "text": "I have a sore throat and cough" } returns list of candidate plants (NLP based)

**AR & Assets:**
- `GET /api/assets/models/<model_name>.glb` — static link (prefer CDN in production)
- `GET /api/plants/<id>/ar` — returns platform-specific AR metadata (e.g., anchor info for WebAR)

**Translations & i18n:**
- `GET /api/plants/<id>?lang=hi` — returns plant info in requested language if available

5. **Authentication & Admin Panel**

- Implement JWT authentication using `Flask-JWT-Extended` for token management. Protect admin endpoints with `@jwt_required()` and role checks.  
- Admin panel can be a separate React app (route: `/admin`) or integrated in the main app under `/admin`. Provide CSV import feature and model upload UI.

6. **Performance, Indexing & Search Strategy**

- Add indexes on frequently searched columns: `scientific_name`, `ayush_category`, and a fulltext index on `medicinal_uses`/`ailments`.
- Use MySQL FULLTEXT for initial MVP; later migrate to ElasticSearch for better relevance and multilingual analyzers.
- Cache hot content (popular plant pages) in Redis with TTL (e.g., 1 hour).

7. **Backup, Migration & Deployment Notes**

- Use `alembic` for database migrations. Track schema changes in VCS.
- Daily DB backups (dump) to cloud storage (S3) or server filesystem with retention policy.
- Containerize backend with Docker. Example `Dockerfile` snippet:

```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8000", "--workers", "3"]
```

### Deliverables & Checklist (IV.3)
- Running Flask backend connected to local MySQL DB.
- CRUD endpoints implemented and documented (Swagger/OpenAPI suggested).
- Initial seed dataset (150+ plants) loaded.
- Admin panel with CSV import and model upload (basic).
- Security: JWT auth and role checks in place.
- DB migration setup (Alembic) and backup plan defined.

---

## Repository & Folder Structure (Suggested)

```
/virtual-herbal-garden
├─ /backend
│  ├─ /app
│  │  ├─ __init__.py
│  │  ├─ models.py
│  │  ├─ routes/
│  │  ├─ services/
│  │  ├─ utils/
│  │  └─ config.py
│  ├─ Dockerfile
│  ├─ requirements.txt
│  └─ alembic/
├─ /frontend
│  ├─ /src
│  │  ├─ components/
│  │  ├─ pages/
│  │  ├─ hooks/
│  │  └─ assets/
│  ├─ package.json
│  └─ tailwind.config.js
├─ /assets
│  ├─ /models (glb)
│  ├─ /images
│  └─ /audio
├─ /data
│  ├─ plants_master.csv
│  ├─ tags.json
│  └─ translations/
└─ docker-compose.yml
```

---

## Next Steps & Recommendations

- Finish seed dataset and run integration tests for search endpoints.  
- Add automated ETL job (cron / GitHub Actions) to validate new data submissions.  
- Implement ElasticSearch in a staging environment to compare search relevance.  
- Begin frontend integration: Plant detail page with react-three-fiber; test 3D model loading and performance.  
- Create a small user testing group (students, AYUSH practitioners) for usability feedback on AR and multilingual descriptions.

---

## Appendix: Code Snippets & Scripts

**Sample `requirements.txt` (partial)**

```
Flask==2.2.3
Flask-SQLAlchemy==3.0.3
pymysql==1.0.2
Flask-JWT-Extended==4.4.4
gunicorn==20.1.0
pandas==2.1.0
spacy==3.6.0
python-dotenv==1.0.0
alembic==1.11.1
redis==4.5.4
```

**Sample Flask route (plant detail)**

```python
from flask import Blueprint, jsonify, request, current_app
from models import Plant
from app import db

bp = Blueprint('plants', __name__, url_prefix='/api/plants')

@bp.route('/<int:plant_id>', methods=['GET'])
def get_plant(plant_id):
    plant = Plant.query.get_or_404(plant_id)
    return jsonify({
        "id": plant.id,
        "scientific_name": plant.scientific_name,
        "family": plant.family,
        "medicinal_uses": plant.medicinal_uses,
        "ailments": plant.ailments,
        "model_3d": plant.model_3d,
        "images": plant.images
    })
```

**Sample ETL transform snippet (Python/pandas)**

```python
import pandas as pd
from slugify import slugify

df = pd.read_csv('data/raw/plants_raw.csv')

# normalize names
df['scientific_name'] = df['scientific_name'].str.strip().str.title()

# convert comma-separated fields into lists
for col in ['common_names','parts_used','medicinal_uses','ailments','images']:
    df[col] = df[col].fillna('').apply(lambda x: [i.strip() for i in x.split(',') if i.strip()])

df.to_json('data/plants_normalized.json', orient='records', force_ascii=False)
```

---

**File saved as:** `/mnt/data/Virtual_Herbal_Garden_Week4_IV1_IV2_IV3.md`

