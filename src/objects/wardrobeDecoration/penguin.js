import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function loadPenguin({ room, onLoad }) {
  const gltfLoader = new GLTFLoader();

  gltfLoader.load("/models/wardrobeDecoration/penguin.glb", gltf => {
    const penguin = gltf.scene;

    // Transform
    penguin.scale.setScalar(0.15);
    penguin.position.x = 0.85;
    penguin.position.z = -room.depth / 2 + 0.25;
    penguin.position.y = -room.height / 2 + 1.725;

    // Shadows
    penguin.traverse(child => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
    });

    onLoad(penguin);
  });
}
