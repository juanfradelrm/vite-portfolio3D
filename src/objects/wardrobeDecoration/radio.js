import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function loadRadio({ room, onLoad }) {
  const gltfLoader = new GLTFLoader();

  gltfLoader.load("/models/wardrobeDecoration/radio.glb", gltf => {
    const radio = gltf.scene;

    // Transform
    radio.scale.setScalar(0.10);
    radio.position.x = -0.3;
    radio.position.z = -room.depth / 2 + 0.35;
    radio.position.y = -room.height / 2 + 0.75;

    // Shadows
    radio.traverse(child => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
    });

    onLoad(radio);
  });
}
