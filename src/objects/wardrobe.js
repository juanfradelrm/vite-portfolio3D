import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


export function loadWardrobe({ room, onLoad }) {
  const gltfLoader = new GLTFLoader();
  const textureLoader = new THREE.TextureLoader();

  // Textures
  const colorMap = textureLoader.load("/textures/wardrobe/color.jpg");
  colorMap.colorSpace = THREE.SRGBColorSpace;
  const normalMap = textureLoader.load("/textures/wardrobe/normal.jpg");
  const roughnessMap = textureLoader.load("/textures/wardrobe/roughness.jpg");

  const material = new THREE.MeshStandardMaterial({
    map: colorMap,
    normalMap,
    roughnessMap,
    roughness: 0.8
  });

  gltfLoader.load("/models/wardrobe.glb", gltf => {
    const wardrobe = gltf.scene;

    // Mesh setup
    wardrobe.traverse(child => {
      if (!child.isMesh) return;
      child.material = material;
      child.castShadow = true;
      child.receiveShadow = true;
    });

    // Transform
    wardrobe.scale.setScalar(0.35);
    wardrobe.rotation.y = 0;

    // Position (floor + back wall)
    const box = new THREE.Box3().setFromObject(wardrobe);
    wardrobe.position.y = -room.height / 2 - box.min.y + 0.05;
    wardrobe.position.z = -room.depth / 2 + box.max.z;

    onLoad(wardrobe);
  });
}
