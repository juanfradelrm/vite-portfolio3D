import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function loadBottle({ room, onLoad }) {
  const loader = new GLTFLoader();

  loader.load("/models/wardrobeDecoration/bottle.glb", gltf => {
    const bottle = gltf.scene;

    // Transform
    bottle.scale.setScalar(0.05);
    bottle.position.x = -0.25;
    bottle.position.z = -room.depth / 2 + 0.25;
    bottle.position.y = -0.30;

    // Shadows
    bottle.traverse(child => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
    });

    onLoad(bottle);
  });
}
