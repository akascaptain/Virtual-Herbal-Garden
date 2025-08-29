# Week V – Virtual Herbal Garden Project Logbook  
**Timeline:** 15/04/2025 – 27/04/2025  

## Overview  
The fifth week of the Virtual Herbal Garden project focused on two critical aspects:  
1. **Frontend and Interface Design (V.1)** – Establishing a professional, interactive, and user-friendly interface.  
2. **Module Development – Plant Explorer, Search & Filter (V.2)** – Creating the core modules that enable users to explore plants, search efficiently, and filter based on medicinal properties, AYUSH category, or user preference.

---

## V.1 Frontend and Interface Design  
**Duration:** 15/04/2025 – 20/04/2025  

### Objectives  
- Design a responsive, visually appealing interface for the Virtual Herbal Garden.  
- Ensure accessibility across devices (desktop, tablet, and mobile).  
- Establish a clear layout for the main webpage with multiple sections and tabs.  
- Integrate initial 3D model placeholders for interactive plant viewing.  

### Tasks Performed  
1. **UI/UX Wireframing**  
   - Created detailed wireframes using Figma outlining the main sections:  
     - Home Page (Introduction, Highlights, Call-to-Action)  
     - Plant Explorer (interactive map + grid view)  
     - Search & Filter interface  
     - Virtual Tour section  
     - About & AYUSH Information tab  

2. **Frontend Stack Setup**  
   - Initialized project structure using **React** with a clean folder hierarchy:  
     ```
     src/
     ├── components/
     │   ├── Navbar.jsx
     │   ├── Footer.jsx
     │   ├── PlantCard.jsx
     │   ├── SearchFilter.jsx
     │   └── VirtualTour.jsx
     ├── pages/
     │   ├── Home.jsx
     │   ├── PlantExplorer.jsx
     │   └── About.jsx
     ├── assets/
     │   ├── images/
     │   └── styles/
     └── App.jsx
     ```
   - Configured **Tailwind CSS** for styling and responsiveness.  
   - Added routing with `react-router-dom` for multi-tab navigation.  

3. **Design Implementation**  
   - Implemented a **professional hero section** with gradient backgrounds and smooth scroll effects.  
   - Developed a reusable **PlantCard component** with image, plant name, and category tags.  
   - Integrated a responsive **Navbar and Footer** with quick links to plant explorer and virtual tour.  

4. **3D Integration Placeholder**  
   - Created a dedicated section for **GLB 3D models** of plants using `react-three-fiber`.  
   - Added placeholder models to test rotation, zoom, and click interactions.  

5. **Accessibility and Aesthetics**  
   - Used contrasting colors for readability.  
   - Implemented ARIA labels for interactive elements.  
   - Performed initial **cross-browser testing** (Chrome, Firefox, Edge).  

### Deliverables  
- Fully functional **frontend skeleton** with navigation and major sections ready.  
- PlantCard and VirtualTour placeholders created.  
- Responsive design validated on desktop and mobile.

### Challenges & Resolutions  
- **Challenge:** Initial lag in rendering 3D models.  
  **Resolution:** Deferred model loading with lazy imports.  

- **Challenge:** Navigation misalignment on smaller devices.  
  **Resolution:** Implemented Tailwind responsive classes and a mobile hamburger menu.

---

## V.2 Module Development – Plant Explorer, Search & Filter  
**Duration:** 22/04/2025 – 27/04/2025  

### Objectives  
- Implement the **Plant Explorer module** for browsing all available medicinal plants.  
- Add **search and filter capabilities** based on plant names, medicinal uses, and AYUSH categories.  
- Optimize data retrieval and rendering performance for larger datasets.  

### Tasks Performed  
1. **Plant Explorer Development**  
   - Developed **grid and list view** modes for exploring plants.  
   - Added **infinite scroll and pagination support** to handle large datasets.  
   - Linked each plant card to a **detailed plant profile page** with medicinal information, images, and related AYUSH systems.  

2. **Search Functionality**  
   - Integrated a **dynamic search bar** with real-time filtering.  
   - Implemented search indexing using `Fuse.js` for fuzzy matching of plant names and keywords.  
   - Supported multi-keyword search (e.g., *"Neem immunity"*).  

3. **Filter Module**  
   - Added filters for:  
     - Medicinal Use (e.g., Immunity, Digestion, Skin Care)  
     - Plant Category (Ayurveda, Homeopathy, Unani, Siddha, Yoga & Naturopathy)  
     - Region (if available in database)  
   - Filters update results dynamically without page reload using React state management.  

4. **Data Integration**  
   - Connected the module with the **backend plant database** (MySQL).  
   - Created an API endpoint `/api/plants` in Flask to fetch plant data dynamically.  

5. **User Interaction Enhancements**  
   - Added **hover effects** on plant cards with quick-view modal.  
   - Implemented **bookmarking feature** for registered users (stored in local state for now).  

### Deliverables  
- Fully working **Plant Explorer page** with interactive search and filter system.  
- API integration with real-time updates.  
- User-friendly exploration experience with quick plant previews.  

### Challenges & Resolutions  
- **Challenge:** Delay in search results with large datasets.  
  **Resolution:** Used client-side caching and search throttling techniques.  

- **Challenge:** Filter combinations leading to empty results.  
  **Resolution:** Added a **“No Results Found”** fallback with suggestions.  

---

## Outcomes of Week V  
- The project moved from **basic structure to an interactive platform**.  
- Major user-facing modules (Frontend + Plant Explorer) were completed.  
- Backend connectivity started to take shape with API endpoints.  

---

## Next Steps (Planned for Week VI)  
- **Backend API Refinement** for 3D model integration and multimedia content.  
- **User Authentication & Personalization** (login, favorites, progress tracking).  
- Start development of the **Virtual Tour module** with linked GLB models.  
