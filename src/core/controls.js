import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


export function createControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minPolarAngle = Math.PI / 3;
  controls.maxPolarAngle = Math.PI / 1.9;
  controls.minDistance = 1;
  controls.maxDistance = 2;

  return controls;
}
