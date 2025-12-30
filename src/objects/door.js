import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


export function loadDoor({ room, onLoad }) {
  const loader = new GLTFLoader();

  loader.load("/models/door.glb", gltf => {
    const door = gltf.scene;

    // Enable shadows for all meshes
    door.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Scale and orient
    door.scale.setScalar(3.5);
    door.rotation.y = -Math.PI / 2;

    // Compute bounding box and place on floor
    const box = new THREE.Box3().setFromObject(door);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const floorY = -room.height / 2;
    door.position.y = floorY - box.min.y;

    // Align to left wall plane
    const leftWallX = -room.width / 2;
    door.position.x = leftWallX - center.x;

    onLoad({ door });
  });
}
