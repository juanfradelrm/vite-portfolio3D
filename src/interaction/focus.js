import * as THREE from "three";

export function createFocusManager(camera, controls, uiFocus, focusLabel) {
  // STATE
  let focusMode = false;
  let returningFromFocus = false;
  let returnFrames = 0;
  let focusIndex = 0;
  let focusTarget = null;

  const cameraTargetPos = new THREE.Vector3();
  const cameraTargetLook = new THREE.Vector3();

  // Save initial state (will be set after loading)
  let initialCameraPos = null;
  let initialCameraTarget = null;

  // Decorations
  const wardrobeDecos = [];

  // Highlight state
  let prevHighlighted = null;


  //Set initial camera state (call after scene is loaded)
  function setInitialState(pos, target) {
    initialCameraPos = pos;
    initialCameraTarget = target;
  }

  //Add decoration to focus list
  function addDecoration(obj, name) {
    wardrobeDecos.push({ obj, name });
  }

  //Get all decorations
  function getDecorations() {
    return wardrobeDecos;
  }

  //Check if currently in focus mode
  function isFocusMode() {
    return focusMode;
  }

  //Check if returning from focus
  function isReturning() {
    return returningFromFocus;
  }

  //UI visibility toggle
  function showFocusUI(show) {
    if (!uiFocus) return;
    uiFocus.classList.toggle("visible", show);
    uiFocus.style.pointerEvents = show ? "auto" : "none";
  }

  //Set highlight on decoration
  function setHighlight(obj, on) {
    obj?.traverse(c => {
      if (c.isMesh && c.material?.emissive) {
        c.material.emissive.set(on ? 0x335577 : 0x000000);
      }
    });
  }

  //Select a decoration by index
  function selectDecoration(index) {
    const entry = wardrobeDecos[index];
    if (!entry) return;

    focusIndex = index;
    focusTarget = entry.obj;
    focusLabel.textContent = entry.name;

    if (prevHighlighted && prevHighlighted !== entry.obj) {
      setHighlight(prevHighlighted, false);
    }

    setHighlight(entry.obj, true);
    prevHighlighted = entry.obj;
  }


  //Clear all highlights
  function clearHighlights() {
    if (prevHighlighted) setHighlight(prevHighlighted, false);
    prevHighlighted = null;
  }

  //Navigate to previous decoration
  function prevDecoration() {
    if (!focusMode) return;
    focusIndex = (focusIndex - 1 + wardrobeDecos.length) % wardrobeDecos.length;
    selectDecoration(focusIndex);
  }

  //Navigate to next decoration
  function nextDecoration() {
    if (!focusMode) return;
    focusIndex = (focusIndex + 1) % wardrobeDecos.length;
    selectDecoration(focusIndex);
  }

  //Enter focus mode on a wardrobe
  function enterFocus(wardrobe) {
    if (focusMode || returningFromFocus) return;

    focusMode = true;
    controls.enabled = false;
    focusIndex = 0;

    // Protection against invalid wardrobe
    if (wardrobe && typeof wardrobe.updateWorldMatrix === 'function') {
      // Calculate camera target
      const box = new THREE.Box3().setFromObject(wardrobe);
      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      box.getCenter(center);
      box.getSize(size);

      const dir = new THREE.Vector3(0, 0, 0).sub(center);
      dir.y = 0;
      if (dir.length() < 0.001) dir.set(0, 0, 1);
      dir.normalize();

      const distance = Math.max(1.2, size.length() * 0.6);
      const heightOffset = size.y * 0.35;

      cameraTargetPos.copy(center).add(dir.multiplyScalar(distance));
      cameraTargetPos.y = center.y + heightOffset;
      cameraTargetLook.copy(center);
    }

    selectDecoration(focusIndex);
    showFocusUI(true);
  }

  //Exit focus mode
  function exitFocus() {
    if (!focusMode) return;

    focusMode = false;
    returningFromFocus = true;
    returnFrames = 0;

    cameraTargetPos.copy(initialCameraPos);
    cameraTargetLook.copy(initialCameraTarget);

    clearHighlights();
    showFocusUI(false);
  }

  //Update focus animation (call in animation loop)
  function update() {
    if (focusMode || returningFromFocus) {
      camera.position.lerp(cameraTargetPos, 0.12);
      controls.target.lerp(cameraTargetLook, 0.12);
    }

    if (returningFromFocus) {
      returnFrames++;
      const dist = camera.position.distanceTo(cameraTargetPos);

      if (dist < 0.08 || returnFrames > 120) {
        camera.position.copy(cameraTargetPos);
        controls.target.copy(cameraTargetLook);

        returningFromFocus = false;
        controls.enabled = true;
        controls.update();
      }
    }
  }

  //Get camera targets for animations
  function getCameraTargets() {
    return { position: cameraTargetPos, target: cameraTargetLook };
  }

  return {
    setInitialState,
    addDecoration,
    getDecorations,
    isFocusMode,
    isReturning,
    showFocusUI,
    selectDecoration,
    clearHighlights,
    prevDecoration,
    nextDecoration,
    enterFocus,
    exitFocus,
    update,
    getCameraTargets
  };
}
