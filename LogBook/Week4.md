# Week IV – Technology Research, Data Collection, and Backend Setup

## Duration
- **IV.1 Technology Research and Design Planning:** 25/03/2025 – 30/03/2025  
- **IV.2 Data Collection and Categorization:** 01/04/2025 – 06/04/2025  
- **IV.3 Backend and Database Setup:** 08/04/2025 – 13/04/2025  

---

## IV.1 Technology Research and Design Planning (25/03/2025 – 30/03/2025)

### Objective
The primary focus of this phase was to research and finalize the technology stack, define the architectural layout, and create a preliminary design for the *Virtual Herbal Garden* system.

### Activities Performed
1. **Technology Stack Analysis**
   - **Frontend:** React.js selected for its modular component-based architecture and compatibility with interactive 3D models (GLB).
   - **Backend:** Flask selected for lightweight and efficient API handling.
   - **Database:** MySQL with XAMPP for local development and easy migration to production.
   - **3D Model Integration:** Evaluated libraries such as Three.js and React-Three-Fiber for rendering `.glb` models of plants.
   - **Hosting & Deployment Plan:** Considered GitHub Pages for frontend deployment and AWS EC2/Render for backend hosting.

2. **Architecture Design**
   - Designed a **3-tier architecture**:
     - **Presentation Layer:** React-based interactive webpage.
     - **Application Layer:** Flask APIs handling plant information retrieval, search, and filtering.
     - **Data Layer:** MySQL database for storing plant data, images, and metadata.
   - Drafted **API Endpoints:**
     - `/api/plants` – Fetch all plants
     - `/api/plants/:id` – Fetch specific plant details
     - `/api/search` – Query plants by name, property, or medicinal use.

3. **UI/UX Wireframing**
   - Created wireframes for:
     - **Homepage:** Showcasing featured plants, search bar, and categories.
     - **Plant Detail Page:** 3D model view, plant description, uses, and medicinal value.
     - **Virtual Tour Section:** Embedded 3D GLB model navigation.
   - Tools used: Figma and Canva.

### Outcomes
- Finalized the **technology stack**.
- Completed **API blueprint**.
- Created **initial wireframes** for core pages.
- Identified dependencies: `react-three-fiber`, `three.js`, `Flask-RESTful`, and `mysql-connector-python`.

---

## IV.2 Data Collection and Categorization (01/04/2025 – 06/04/2025)

### Objective
To gather, structure, and classify data for the medicinal plants to be featured in the Virtual Herbal Garden.

### Activities Performed
1. **Data Collection**
   - Collected a dataset of **50+ medicinal plants** used in AYUSH systems (Ayurveda, Yoga, Unani, Siddha, Homeopathy).
   - Sources:  
     - Ministry of AYUSH official database  
     - Research papers on medicinal plants  
     - Open-source herbal databases

2. **Data Fields Defined**
   - **Plant Name (Scientific + Common)**  
   - **Category (Ayurveda, Unani, Siddha, Homeopathy, Multi-use)**  
   - **Medicinal Uses**  
   - **Active Constituents**  
   - **3D Model Path (.glb)**  
   - **Images (.jpg/.png)**  
   - **Geographical Distribution**  
   - **Cultivation/Propagation Information**

3. **Data Categorization**
   - Segregated plants based on their **primary medicinal property**:
     - Anti-inflammatory
     - Digestive aid
     - Antimicrobial
     - Respiratory health
     - Skin care
   - Created a mapping of **categories to tags** for easy filtering.

4. **Data Cleaning & Standardization**
   - Removed duplicates and ensured consistent naming conventions.
   - Converted data into **CSV format** for initial import.
   - Defined **unique IDs** for each plant record.

### Outcomes
- A structured dataset prepared for database insertion.
- Clear plant categorization schema designed.
- Exported cleaned dataset as:  
  - `plants_master.csv`  
  - `plants_categories.json`

---

## IV.3 Backend and Database Setup (08/04/2025 – 13/04/2025)

### Objective
To set up the backend environment, initialize the database schema, and establish the connection between Flask APIs and the MySQL database.

### Activities Performed
1. **Backend Environment Setup**
   - Created a new Python virtual environment:  
     ```bash
     python -m venv venv
     source venv/bin/activate  # (Linux/Mac)
     venv\Scripts\activate     # (Windows)
     ```
   - Installed required libraries:  
     ```bash
     pip install flask flask-restful mysql-connector-python flask-cors
     ```

2. **Database Setup**
   - Installed and configured XAMPP with MySQL.
   - Created database: `virtual_herbal_garden`
   - Database schema:
     ```sql
     CREATE TABLE plants (
         id INT PRIMARY KEY AUTO_INCREMENT,
         scientific_name VARCHAR(255) NOT NULL,
         common_name VARCHAR(255),
         category VARCHAR(100),
         medicinal_uses TEXT,
         active_constituents TEXT,
         image_url VARCHAR(255),
         model_path VARCHAR(255),
         distribution TEXT,
         cultivation TEXT
     );
     ```

3. **Initial Data Import**
   - Imported `plants_master.csv` into the database using:
     ```sql
     LOAD DATA INFILE 'plants_master.csv'
     INTO TABLE plants
     FIELDS TERMINATED BY ','
     ENCLOSED BY '"'
     LINES TERMINATED BY '\n'
     IGNORE 1 ROWS;
     ```

4. **Flask API Development**
   - Created `app.py` with REST API routes:
     ```python
     from flask import Flask, jsonify, request
     import mysql.connector

     app = Flask(__name__)

     def get_db_connection():
         return mysql.connector.connect(
             host="localhost",
             user="root",
             password="",
             database="virtual_herbal_garden"
         )

     @app.route('/api/plants', methods=['GET'])
     def get_plants():
         conn = get_db_connection()
         cursor = conn.cursor(dictionary=True)
         cursor.execute("SELECT * FROM plants")
         result = cursor.fetchall()
         cursor.close()
         conn.close()
         return jsonify(result)

     if __name__ == '__main__':
         app.run(debug=True)
     ```

5. **Testing & Validation**
   - Verified database connection.
   - Tested `/api/plants` endpoint in Postman.
   - Confirmed successful retrieval of plant records.

### Outcomes
- Backend environment set up and tested.
- Database schema designed and populated.
- Core API endpoint working with sample data.
- Ready for integration with React frontend in the upcoming phase.

---

## Challenges Faced
- Some 3D models were incompatible (.obj instead of .glb) → converted using Blender.
- Data inconsistency in plant names (multiple synonyms) → normalized using scientific names.
- Configuring CORS policies between Flask and React → resolved using `flask-cors`.

---

## Next Steps
- Integrate the backend with the React frontend.
- Implement advanced search and filtering using tags.
- Begin 3D visualization embedding in the virtual garden.

---
