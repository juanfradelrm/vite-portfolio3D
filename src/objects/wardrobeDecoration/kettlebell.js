import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function loadKettlebell({ room, onLoad }) {
  const gltfLoader = new GLTFLoader();

  gltfLoader.load("/models/wardrobeDecoration/kettlebell.glb", gltf => {
    const kettlebell = gltf.scene;

    // Transform
    kettlebell.scale.setScalar(0.05);
    kettlebell.position.x = -0.85;
    kettlebell.position.z = -room.depth / 2 + 0.4;
    kettlebell.position.y = -room.height / 2 + 0.05;

    // Shadows
    kettlebell.traverse(child => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
    });

    onLoad(kettlebell);
  });
}
