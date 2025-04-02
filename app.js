// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting for the scene
const light = new THREE.AmbientLight(0x404040, 5); // Ambient light
scene.add(light);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

// GLTFLoader to load 3D models
const loader = new THREE.GLTFLoader();

// Plant objects and information
const plants = [
    {
        name: "Ashwagandha",
        description: "Ashwagandha is an adaptogen used in Ayurveda to reduce stress and enhance vitality.",
        modelUrl: "c:\Users\Admin\Downloads\vr3\Virtual-herbal-garden-main 3D Models\ashwagandha.glb", // Replace with the path to your .glb file
        model: null,
        position: new THREE.Vector3(-3, 0, -5)
    },
    {
        name: "Tulsi",
        description: "Tulsi is known as the 'Queen of Herbs' and is revered for its healing properties in Ayurveda.",
        modelUrl: "models/tulsi.glb", // Replace with the path to your .glb file
        model: null,
        position: new THREE.Vector3(3, 0, -5)
    }
];

// Load GLB models
plants.forEach((plant, index) => {
    loader.load(
        plant.modelUrl,
        (gltf) => {
            plant.model = gltf.scene;
            plant.model.position.set(plant.position.x, plant.position.y, plant.position.z);
            plant.model.scale.set(0.5, 0.5, 0.5); // Adjust scale if needed
            scene.add(plant.model);
        },
        undefined, // onProgress callback (not needed here)
        (error) => {
            console.error("Error loading GLB model", error);
        }
    );
});

// Event listener for mouse clicks
let selectedPlant = null;

function onMouseClick(event) {
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    // Normalize mouse coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with plant models
    const intersects = raycaster.intersectObjects(plants.map(p => p.model).filter(model => model !== null));

    if (intersects.length > 0) {
        selectedPlant = intersects[0].object;
        displayPlantInfo();
    } else {
        document.getElementById("info").style.display = "none";
    }
}

function displayPlantInfo() {
    const infoDiv = document.getElementById("info");

    // Find the selected plant by its model
    const plant = plants.find(p => p.model === selectedPlant);
    
    if (plant) {
        document.getElementById("plant-name").textContent = "Name: " + plant.name;
        document.getElementById("plant-description").textContent = "Description: " + plant.description;
        infoDiv.style.display = "block";
    }
}

// Event listener for mouse clicks
window.addEventListener("click", onMouseClick);

// Set camera position
camera.position.z = 10;

// Animation loop to keep the scene rendering
function animate() {
    requestAnimationFrame(animate);

    // Rotate the plants to make them interactive
    plants.forEach(plant => {
        if (plant.model) {
            plant.model.rotation.x += 0.01;
            plant.model.rotation.y += 0.01;
        }
    });

    renderer.render(scene, camera);
}

animate();
