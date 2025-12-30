import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


export function loadWindow({ room, onLoad }) {
  const loader = new GLTFLoader();

  loader.load("/models/window.glb", gltf => {
    const windowGroup = gltf.scene;

    // Mesh setup
    windowGroup.traverse(child => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
    });

    // Transform
    windowGroup.scale.setScalar(0.5);
    windowGroup.rotation.y = Math.PI / 2;

    // Position (right wall, slightly above eye level)
    const box = new THREE.Box3().setFromObject(windowGroup);
    const windowHeight = box.max.y - box.min.y;

    windowGroup.position.y =
      -room.height / 2 + windowHeight / 2 + room.height * 0.25;

    windowGroup.position.x = room.width / 2 - 0.01;

    // === SUN LIGHT ===
    const sunLight = new THREE.DirectionalLight(0xfff1d6, 0.6);
    sunLight.castShadow = true;

    sunLight.position.set(
      windowGroup.position.x + 3,
      windowGroup.position.y + 2,
      windowGroup.position.z
    );

    sunLight.target.position.copy(windowGroup.position);

    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 15;
    sunLight.shadow.camera.left = -2;
    sunLight.shadow.camera.right = 2;
    sunLight.shadow.camera.top = 2;
    sunLight.shadow.camera.bottom = -2;
    sunLight.shadow.bias = -0.001;
    sunLight.shadow.normalBias = 0.05;

    // === WINDOW GLASS (fake) ===
    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 1.5),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15,
        roughness: 0.1
      })
    );

    glass.position.copy(windowGroup.position);
    glass.position.x += 0.01;
    glass.rotation.copy(windowGroup.rotation);

    onLoad({
      window: windowGroup,
      light: sunLight,
      glass
    });
  });
}
