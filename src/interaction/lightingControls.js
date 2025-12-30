import * as THREE from "three";


export function setupLightingControls(scene) {
  // Get references to lights
  const lights = {
    ambient: scene.children.find((child) => child instanceof THREE.AmbientLight),
    lamp: scene.children.find((child) => child instanceof THREE.PointLight),
    sun: null,
  };

  if (!lights.ambient || !lights.lamp) {
    console.warn("Lighting controls: Could not find all lights in scene");
    return;
  }

  // Store original values for reset
  const originalValues = {
    ambientIntensity: lights.ambient.intensity,
    lampIntensity: lights.lamp.intensity,
    lampColor: lights.lamp.color.getHex(),
    sunIntensity: 0.6,
    sunColor: 0xfff1d6,
  };

  // DOM elements
  const ambientSlider = document.getElementById("ambient-slider");
  const lampSlider = document.getElementById("lamp-slider");
  const lampColorPicker = document.getElementById("lamp-color");
  const ambientValue = document.getElementById("ambient-value");
  const lampValue = document.getElementById("lamp-value");
  const resetBtn = document.getElementById("lighting-reset");
  const menuToggle = document.getElementById("lighting-toggle");
  const menuHeader = document.querySelector(".lighting-menu-header");
  const menuContent = document.getElementById("lighting-content");

  // Create sun light controls
  let sunSlider, sunValue, sunColorPicker;

  function createSunControl(sunLight) {
    // Check if controls already exist
    if (document.getElementById("sun-slider")) {
      return;
    }

    lights.sun = sunLight;
    originalValues.sunIntensity = sunLight.intensity;
    originalValues.sunColor = sunLight.color.getHex();

    const controlDiv = document.createElement("div");
    controlDiv.className = "lighting-control";
    controlDiv.innerHTML = `
      <label for="sun-slider">Luz Solar</label>
      <input type="range" id="sun-slider" min="0" max="100" value="${originalValues.sunIntensity * 100}" class="slider">
      <span id="sun-value">${originalValues.sunIntensity.toFixed(2)}</span>
    `;
    
    const colorDiv = document.createElement("div");
    colorDiv.className = "lighting-control";
    colorDiv.innerHTML = `
      <label for="sun-color">Color Solar</label>
      <input type="color" id="sun-color" value="#${originalValues.sunColor.toString(16).padStart(6, "0")}" class="color-picker">
    `;

    menuContent.insertBefore(controlDiv, resetBtn);
    menuContent.insertBefore(colorDiv, resetBtn);

    sunSlider = document.getElementById("sun-slider");
    sunValue = document.getElementById("sun-value");
    sunColorPicker = document.getElementById("sun-color");

    sunSlider.addEventListener("input", (e) => {
      const value = parseFloat(e.target.value) / 100;
      lights.sun.intensity = value;
      sunValue.textContent = value.toFixed(2);
    });

    sunColorPicker.addEventListener("input", (e) => {
      lights.sun.color.setStyle(e.target.value);
    });

    sunSlider.addEventListener("mousedown", (e) => e.stopPropagation());
    sunColorPicker.addEventListener("click", (e) => e.stopPropagation());
  }

  // Set initial values
  ambientSlider.value = originalValues.ambientIntensity * 100;
  lampSlider.value = originalValues.lampIntensity * 100;
  ambientValue.textContent = originalValues.ambientIntensity.toFixed(2);
  lampValue.textContent = originalValues.lampIntensity.toFixed(2);
  lampColorPicker.value = "#" + originalValues.lampColor.toString(16).padStart(6, "0");

  // Ambient light slider
  ambientSlider.addEventListener("input", (e) => {
    const value = parseFloat(e.target.value) / 100;
    lights.ambient.intensity = value;
    ambientValue.textContent = value.toFixed(2);
  });

  // Lamp intensity slider
  lampSlider.addEventListener("input", (e) => {
    const value = parseFloat(e.target.value) / 100;
    lights.lamp.intensity = value;
    lampValue.textContent = value.toFixed(2);
  });

  // Lamp color picker
  lampColorPicker.addEventListener("input", (e) => {
    lights.lamp.color.setStyle(e.target.value);
  });

  // Reset button
  resetBtn.addEventListener("click", () => {
    lights.ambient.intensity = originalValues.ambientIntensity;
    lights.lamp.intensity = originalValues.lampIntensity;
    lights.lamp.color.setHex(originalValues.lampColor);
    
    if (lights.sun) {
      lights.sun.intensity = originalValues.sunIntensity;
      lights.sun.color.setHex(originalValues.sunColor);
    }

    ambientSlider.value = originalValues.ambientIntensity * 100;
    lampSlider.value = originalValues.lampIntensity * 100;
    ambientValue.textContent = originalValues.ambientIntensity.toFixed(2);
    lampValue.textContent = originalValues.lampIntensity.toFixed(2);
    lampColorPicker.value = "#" + originalValues.lampColor.toString(16).padStart(6, "0");
    
    if (lights.sun && sunSlider && sunValue && sunColorPicker) {
      sunSlider.value = originalValues.sunIntensity * 100;
      sunValue.textContent = originalValues.sunIntensity.toFixed(2);
      sunColorPicker.value = "#" + originalValues.sunColor.toString(16).padStart(6, "0");
    }
  });

  // Menu toggle
  menuHeader.addEventListener("click", () => {
    menuContent.classList.toggle("closed");
    menuToggle.classList.toggle("open");
  });

  // Pointer events for sliders and inputs
  ambientSlider.addEventListener("mousedown", (e) => e.stopPropagation());
  lampSlider.addEventListener("mousedown", (e) => e.stopPropagation());
  lampColorPicker.addEventListener("click", (e) => e.stopPropagation());
  resetBtn.addEventListener("click", (e) => e.stopPropagation());

  // Return function to add sun light controls later
  return {
    addSunLight: createSunControl
  };
}
