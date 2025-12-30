import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


// Map internal GLB names to semantic types
const NAME_MAP = {
  Object_18: "leftMonitor",
  Object_13: "rightMonitor",
  Object_10: "pcTower",
  Object_8: "pcCase",
  Object_22: "keyboard",
  Object_24: "mouse",
  Object_26: "mousepad",
  Object_4: "desk",
  Object_28: "chair",
  Object_29: "chair"
};

export function loadSetup({ room, onLoad }) {
  const loader = new GLTFLoader();

  loader.load("/models/setup.glb", gltf => {
    const setup = gltf.scene;
    const registry = {};

    setup.traverse(child => {
      if (!child.isMesh) return;

      // Convert materials to MeshStandardMaterial for consistent lighting
      if (!(child.material instanceof THREE.MeshStandardMaterial)) {
        const originalMaterial = child.material;
        const newMaterial = new THREE.MeshStandardMaterial({
          color: originalMaterial.color || 0xcccccc,
          metalness: 0.3,
          roughness: 0.7
        });
        // Preserve color space
        if (originalMaterial.map) {
          newMaterial.map = originalMaterial.map;
        }
        child.material = newMaterial;
      }

      // Enable shadows
      child.castShadow = true;
      child.receiveShadow = true;

      // Assign semantic type
      const type = NAME_MAP[child.name] ?? "decor";
      child.userData.type = type;

      // Add interactivity for monitors
      if (type === "leftMonitor" || type === "rightMonitor") {
        child.userData.onClick = () => {
          // Dispatch custom event with monitor type and object reference
          window.dispatchEvent(new CustomEvent("monitorClicked", { detail: { monitor: type, object: child } }));
        };
      }

      if (type !== "decor") {
        if (!registry[type]) registry[type] = [];
        registry[type].push(child);
      }
    });

    // Face room interior
    setup.rotation.y = Math.PI / 2;

    // Compute bounding box
    const box = new THREE.Box3().setFromObject(setup);

    // Place on floor
    const floorY = -room.height / 2;
    setup.position.y = floorY - box.min.y;

    // Place against back wall
    const margin = 0;
    const backWallZ = room.depth / 2;
    setup.position.z = backWallZ - box.max.z - margin;

    onLoad({ setup, registry });
  });
}
