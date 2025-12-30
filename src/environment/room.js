import * as THREE from "three";


export function createRoom(scene, textureLoader) {
  const roomWidth = 5;
  const roomHeight = 4;
  const roomDepth = 4;

  // WALL MATERIAL
  function createWallMaterial(loader) {
    const wallColor = loader.load("/textures/wall/color.jpg");
    wallColor.colorSpace = THREE.SRGBColorSpace;
    const wallRoughness = loader.load("/textures/wall/roughness.jpg");
    const wallNormal = loader.load("/textures/wall/normal.jpg");

    // Consistency for repeat and wrapping
    wallColor.wrapS = wallColor.wrapT = THREE.RepeatWrapping;
    wallRoughness.wrapS = wallRoughness.wrapT = THREE.RepeatWrapping;
    wallNormal.wrapS = wallNormal.wrapT = THREE.RepeatWrapping;
    wallColor.repeat.set(2, 1);
    wallRoughness.repeat.set(2, 1);
    wallNormal.repeat.set(2, 1);

    return new THREE.MeshStandardMaterial({
      map: wallColor,
      roughnessMap: wallRoughness,
      normalMap: wallNormal,
      color: 0xf2f2f2,
      roughness: 0.9,
      side: THREE.DoubleSide
    });
  }

  const wallMaterial = createWallMaterial(textureLoader);

  // WALLS
  const walls = [
    { geo: [roomWidth, roomHeight], pos: [0, 0, -roomDepth / 2], rot: [0, 0, 0] },
    { geo: [roomWidth, roomHeight], pos: [0, 0, roomDepth / 2], rot: [0, Math.PI, 0] },
    { geo: [roomDepth, roomHeight], pos: [-roomWidth / 2, 0, 0], rot: [0, Math.PI / 2, 0] },
    { geo: [roomDepth, roomHeight], pos: [roomWidth / 2, 0, 0], rot: [0, -Math.PI / 2, 0] }
  ];

  walls.forEach(w => {
    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(...w.geo),
      wallMaterial
    );
    wall.position.set(...w.pos);
    wall.rotation.set(...w.rot);
    wall.receiveShadow = true;
    scene.add(wall);
  });

  // CEILING (use wall material)
  const ceilingMaterial = wallMaterial.clone();

  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(roomWidth, roomDepth),
    ceilingMaterial
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = roomHeight / 2;
  ceiling.receiveShadow = true;
  scene.add(ceiling);

  // FLOOR
  const floorColor = textureLoader.load("/textures/floor/color.jpg");
  floorColor.colorSpace = THREE.SRGBColorSpace;
  const floorNormal = textureLoader.load("/textures/floor/normal.jpg");
  const floorRoughness = textureLoader.load("/textures/floor/roughness.jpg");

  const floorMaterial = new THREE.MeshStandardMaterial({
    map: floorColor,
    normalMap: floorNormal,
    roughnessMap: floorRoughness,
    roughness: 0.9
  });

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(roomWidth, roomDepth),
    floorMaterial
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -roomHeight / 2 + 0.01;
  floor.receiveShadow = true;
  scene.add(floor);
  return {
    width: roomWidth,
    height: roomHeight,
    depth: roomDepth
  };
}
