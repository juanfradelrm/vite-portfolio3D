import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function loadFlower({ room, onLoad }) {
  const gltfLoader = new GLTFLoader();

  gltfLoader.load("/models/wardrobeDecoration/flower.glb", gltf => {
    const flower = gltf.scene;

    // Transform
    flower.scale.setScalar(0.075);
    flower.rotation.y = Math.PI / 2;
    flower.position.x = 0.75;
    flower.position.z = -room.depth / 2 + 0.3;
    flower.position.y = -room.height / 2 + 0.2;

    // Shadows
    flower.traverse(child => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
    });

    onLoad(flower);
  });
}
