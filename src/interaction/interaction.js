import * as THREE from "three";


export function setupInteraction(camera, interactiveObjects) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let currentHovered = null;
  const originalEmissives = new WeakMap(); // Store original emissive colors

  window.addEventListener("mousemove", e => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  window.addEventListener("click", () => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length === 0) return;

    let object = intersects[0].object;
    while (object && !object.userData?.onClick) object = object.parent;
    if (object && object.userData?.onClick) object.userData.onClick();
  });

  // Hover effect
  return () => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects, true);

    // reset previous hover
    if (currentHovered && currentHovered.material?.emissive) {
      const originalEmissive = originalEmissives.get(currentHovered.material);
      if (originalEmissive) {
        currentHovered.material.emissive.copy(originalEmissive);
      } else {
        currentHovered.material.emissive.set(0x000000);
      }
      currentHovered = null;
      document.body.style.cursor = "";
    }

    if (intersects.length > 0) {
      let hovered = intersects[0].object;
      while (hovered && !hovered.material && hovered.parent) hovered = hovered.parent;
      if (hovered?.material?.emissive) {
        // Store original emissive if not already stored
        if (!originalEmissives.has(hovered.material)) {
          originalEmissives.set(hovered.material, new THREE.Color(hovered.material.emissive));
        }
        hovered.material.emissive.set(0x222222);
        currentHovered = hovered;
      }

      // change cursor if interactable
      let clickable = intersects[0].object;
      while (clickable && !clickable.userData?.onClick) clickable = clickable.parent;
      if (clickable && clickable.userData?.onClick) {
        document.body.style.cursor = "pointer";
      }
    }
  };
}
