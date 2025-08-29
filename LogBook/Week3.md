
# Week III – Requirement Analysis

## Objective of the Week
The objective of Week III was to perform a detailed **requirement analysis** for the Virtual Herbal Garden project. This phase aimed to clearly identify, document, and analyze all functional and non-functional requirements essential for developing an interactive, immersive, and educational platform showcasing medicinal plants used in AYUSH systems (Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Homeopathy).

This stage was crucial as it acted as the foundation for the system architecture, technology stack selection, user interface planning, and integration of multimedia, AR/VR, and 3D visualization components.

---

## Detailed Activities Performed

### 1. Functional Requirement Identification
The team focused on understanding the **core functionalities** that the Virtual Herbal Garden should provide. The major functional requirements identified were:

- **Interactive 3D Plant Visualization:**  
  - Integration of GLB-format 3D models for medicinal plants.
  - Support for zoom, rotate, and pan interactions.

- **Multimedia Plant Information:**  
  - Textual description of each plant’s medicinal properties, usage, and AYUSH relevance.
  - Integration of audio descriptions for accessibility.
  - Images and videos for a more engaging user experience.

- **Search and Filter Options:**  
  - Search by plant name (common and scientific).  
  - Filter by category (Ayurveda, Homeopathy, etc.), medicinal use, or regional availability.

- **Virtual Tour Feature:**  
  - Guided walkthrough using AR/VR concepts.
  - Option for users to explore the garden freely.

- **Multilingual Support:**  
  - Initial languages: English and Hindi.
  - Future scalability for regional languages.

- **User Interaction and Feedback:**  
  - Allow users to bookmark plants.
  - Comment and share feedback.

---

### 2. Non-Functional Requirement Analysis
Non-functional requirements focused on performance, usability, scalability, and security aspects:

- **Performance:**  
  - Fast loading of 3D models (under 3 seconds per plant).  
  - Backend optimized for high-concurrency user access.

- **Usability:**  
  - Intuitive navigation using React-based web interface.
  - Responsive design compatible with desktop, tablet, and mobile.

- **Scalability:**  
  - Support for future integration of additional plant datasets.  
  - Potential integration with AI-based plant recommendation.

- **Security:**  
  - Secure database (MySQL) with encrypted connections.
  - Role-based access control for administrators and contributors.

---

### 3. Stakeholder Requirement Gathering
The team engaged with the following stakeholders to refine requirements:

- **AYUSH Experts:** Provided input on medicinal plant selection and accurate representation.  
- **Students and Faculty:** Suggested features to improve learning interactivity.  
- **Developers and Designers:** Shared insights on feasibility of 3D model rendering in React.

---

### 4. Technology Requirement Finalization
Based on requirements, the following technologies were proposed:

- **Frontend:** React.js with Tailwind CSS for styling.  
- **Backend:** Flask (Python) integrated with SQLAlchemy ORM.  
- **Database:** MySQL (hosted on XAMPP for local testing).  
- **3D Models:** GLB format integrated using Three.js or React-Three-Fiber.  
- **APIs:** Google Maps API for optional location-based herbal plant info.  
- **NLP Support:** spaCy and NLTK for multilingual data processing (future expansion).

---

## Decisions Taken

- Chosen **GLB format** as the standard for 3D plant models due to its lightweight nature and broad compatibility.
- Finalized **bilingual approach (English & Hindi)** for initial deployment.
- Decided on a **hybrid architecture**: React-based frontend with Flask backend to support modular integration.
- Identified priority features for Minimum Viable Product (MVP): Search, Filter, 3D View, and Plant Info.

---

## Challenges Faced

- **Dataset Limitations:** Limited availability of AYUSH-aligned plant datasets in structured formats.  
- **Rendering Performance:** Early testing showed slight delays in loading high-poly 3D models.  
- **Multilingual Content Management:** Required a scalable approach to manage content in multiple languages.

---

## Outcome of the Week

By the end of Week III, a comprehensive **Software Requirement Specification (SRS)** draft was prepared, containing:

- Detailed functional and non-functional requirements.  
- Identified stakeholders and their roles.  
- Technology stack finalized.  
- Roadmap for feature prioritization (MVP vs. extended features).

This SRS will serve as the foundation for the **design and architecture phase (Week IV)**, ensuring the project proceeds with clarity and well-defined goals.

---

## References
- Ministry of AYUSH Official Plant Database  
- React-Three-Fiber Documentation  
- Flask-SQLAlchemy Integration Guides  
