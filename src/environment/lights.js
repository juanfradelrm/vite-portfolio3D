import * as THREE from "three";


export function createLights(scene) {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // Ceiling lamp - Main light source
  const lampLight = new THREE.PointLight(0xfff2cc, 1.8, 10);
  lampLight.position.set(0, 1.9, 0);
  lampLight.castShadow = true;
  lampLight.shadow.mapSize.set(1024, 1024);
  lampLight.shadow.camera.near = 0.1;
  lampLight.shadow.camera.far = 10;
  lampLight.shadow.bias = -0.0002;
  lampLight.shadow.normalBias = 0.05;
  lampLight.decay = 2;
  scene.add(lampLight);
}
