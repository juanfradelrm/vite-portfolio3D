import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function loadPolaroid({ room, onLoad }) {
  const gltfLoader = new GLTFLoader();

  gltfLoader.load("/models/wardrobeDecoration/polaroid.glb", gltf => {
    const polaroid = gltf.scene;

    // Transform
    polaroid.scale.setScalar(1);
    polaroid.position.x = -0.3;
    polaroid.position.z = -room.depth / 2 + 0.35;
    polaroid.position.y = -room.height / 2 + 1.25;

    // Shadows
    polaroid.traverse(child => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
    });

    onLoad(polaroid);
  });
}
