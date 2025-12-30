// =====================================================
// IMPORTS
// =====================================================
import * as THREE from "three";
import { createScene } from "./core/scene";
import { createControls } from "./core/controls";
import { createLights } from "./environment/lights";
import { createRoom } from "./environment/room";
import { setupInteraction } from "./interaction/interaction";
import { createFocusManager } from "./interaction/focus";
import { setupLightingControls } from "./interaction/lightingControls";
import { setupResize } from "./utils/resize";
import { loadSetup } from "./objects/setup";
import { loadDoor } from "./objects/door";
import { loadWardrobe } from "./objects/wardrobe";
import { loadWindow } from "./objects/window";
import { loadFlower } from "./objects/wardrobeDecoration/flower";
import { loadBottle } from "./objects/wardrobeDecoration/bottle";
import { loadKettlebell } from "./objects/wardrobeDecoration/kettlebell";
import { loadPenguin } from "./objects/wardrobeDecoration/penguin";
import { loadRadio } from "./objects/wardrobeDecoration/radio";
import { loadPolaroid } from "./objects/wardrobeDecoration/polaroid";
import { loadGitHubIcon } from "./objects/socialIcons/github";
import { loadInstagramIcon } from "./objects/socialIcons/instagram";
import { loadLinkedinIcon } from "./objects/socialIcons/linkedin";
import './windows-desktop/windows-desktop.css';


// =====================================================
// BASIC SETUP
// =====================================================
const canvas = document.getElementById("scene");
const { scene, camera, renderer } = createScene(canvas);
const controls = createControls(camera, renderer);

createLights(scene);

// =====================================================
// LIGHTING CONTROLS
// =====================================================
const lightingControls = setupLightingControls(scene);

const textureLoader = new THREE.TextureLoader();
const room = createRoom(scene, textureLoader);

// =====================================================
// STATE
// =====================================================
const interactiveObjects = [];

// =====================================================
// FOCUS MANAGER
// =====================================================
const uiFocus = document.getElementById("ui-focus");
const focusLabel = document.getElementById("focus-label");
const btnPrev = document.getElementById("focus-prev");
const btnNext = document.getElementById("focus-next");

const focusManager = createFocusManager(camera, controls, uiFocus, focusLabel);

// =====================================================
// LOADING SYSTEM
// =====================================================
const spinner = document.getElementById("loading-spinner");
let loadedCount = 0;
const totalToLoad = 13;

function hideSpinner() {
  spinner.setAttribute("hidden", "");
}

function checkAllLoaded() {
  loadedCount++;
  if (loadedCount >= totalToLoad) {
    hideSpinner();
    focusManager.setInitialState(camera.position.clone(), controls.target.clone());
  }
}

// =====================================================
// LOAD MAIN OBJECTS
// =====================================================
loadSetup({
  room,
  onLoad: ({ setup, registry }) => {
    scene.add(setup);
    interactiveObjects.push(...registry.leftMonitor, ...registry.rightMonitor);
    checkAllLoaded();
  }
});

loadDoor({
  room,
  onLoad: ({ door}) => {
    scene.add(door);
    checkAllLoaded();
  }
});

loadWindow({
  room,
  onLoad: ({ window, light, glass }) => {
    scene.add(window);
    scene.add(glass);
    scene.add(light);
    scene.add(light.target);
    lightingControls.addSunLight(light);
    checkAllLoaded();
  }
});

loadWardrobe({
  room,
  onLoad: wardrobe => {
    scene.add(wardrobe);
    wardrobe.userData.onClick = () => focusManager.enterFocus(wardrobe);
    wardrobe.traverse(c => c.isMesh && interactiveObjects.push(c));
    checkAllLoaded();
  }
});

// =====================================================
// LOAD DECORATIONS
// =====================================================
function loadDeco(loader, name) {
  loader({
    room,
    onLoad: obj => {
      scene.add(obj);
      focusManager.addDecoration(obj, name);
      obj.traverse(c => c.isMesh && interactiveObjects.push(c));
      checkAllLoaded();
    }
  });
}

loadDeco(loadFlower, "Flower");
loadDeco(loadBottle, "Bottle");
loadDeco(loadKettlebell, "Kettlebell");
loadDeco(loadPenguin, "Penguin");
loadDeco(loadRadio, "Radio");
loadDeco(loadPolaroid, "Polaroid");

// =====================================================
// LOAD SOCIAL ICONS
// =====================================================
loadGitHubIcon({
  room,
  onLoad: githubIcon => {
     scene.add(githubIcon);
     githubIcon.userData.onClick = () => window.open('https://github.com/juanfradelrm', '_blank');
     githubIcon.traverse(c => c.isMesh && interactiveObjects.push(c));
     checkAllLoaded();
  }
});

loadInstagramIcon({
  room,
  onLoad: instagramIcon => {
     scene.add(instagramIcon);
     instagramIcon.userData.onClick = () => window.open('https://www.instagram.com/j.rosaarioo/', '_blank');
     instagramIcon.traverse(c => c.isMesh && interactiveObjects.push(c));
     checkAllLoaded();
  }
});

loadLinkedinIcon({
  room,
  onLoad: linkedinIcon => {
     scene.add(linkedinIcon);
     linkedinIcon.userData.onClick = () => window.open('https://www.linkedin.com/in/juanfradelrm/', '_blank');
     linkedinIcon.traverse(c => c.isMesh && interactiveObjects.push(c));
     checkAllLoaded();
  }
});

// =====================================================
// INTERACTION SYSTEM
// =====================================================
const updateInteraction = setupInteraction(camera, interactiveObjects);

// =====================================================
// WINDOWS DESKTOP UI
// =====================================================
let windowsDesktop = null;
let desktopLoaded = false;
let desktopActive = false;
let cameraRestore = null;

async function ensureWindowsDesktopLoaded() {
  if (desktopLoaded) return;
  const res = await fetch('/windows-desktop/windows-desktop.html');
  const html = await res.text();
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  try {
    const linksScript = temp.querySelector('#video-links');
    if (linksScript) {
      const parsed = JSON.parse(linksScript.textContent || linksScript.innerText || 'null');
      if (Array.isArray(parsed)) {
        window.VIDEO_GALLERY_LINKS = parsed;
      }
    }
  } catch (err) {
    console.warn('No se pudo parsear #video-links JSON:', err);
  }
  
  windowsDesktop = temp.firstElementChild;
  document.body.appendChild(windowsDesktop);
  
  initializeVideoGallery();
  desktopLoaded = true;
}

function showWindowsDesktop() {
  if (!windowsDesktop) return;
  windowsDesktop.classList.add('active');
  desktopActive = true;
  canvas.style.display = 'none';
}

function hideWindowsDesktop() {
  if (!windowsDesktop) return;
  windowsDesktop.classList.remove('active');
  desktopActive = false;
  canvas.style.display = '';
}

async function exitWindowsDesktop() {
  if (!desktopActive) return;
  hideWindowsDesktop();
  
  if (focusManager && typeof focusManager.exitFocus === 'function') {
    if (!focusManager.isFocusMode()) {
      focusManager.enterFocus({});
    }
    focusManager.exitFocus();
  }
}

// =====================================================
// VIDEO GALLERY
// =====================================================
function initializeVideoGallery() {
  try {
    const galleryIcon = windowsDesktop.querySelector('[data-app="gallery"]');
    const videoViewer = windowsDesktop.querySelector('#video-viewer');
    const iframe = videoViewer?.querySelector('#video-iframe');
    const caption = videoViewer?.querySelector('#video-caption');
    const btnPrevVideo = videoViewer?.querySelector('.video-prev');
    const btnNextVideo = videoViewer?.querySelector('.video-next');
    const btnCloseVideo = videoViewer?.querySelector('.video-close');

    const defaultVideos = [
      { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: null },
      { url: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ', title: null },
      { url: 'https://www.youtube.com/watch?v=L_jWHffIx5E', title: null }
    ];
    const videoLinks = (window.VIDEO_GALLERY_LINKS && Array.isArray(window.VIDEO_GALLERY_LINKS)) ? window.VIDEO_GALLERY_LINKS : defaultVideos;
    const videos = videoLinks.map(v => (typeof v === 'string') ? { url: v, title: null } : v);
    let currentVideoIndex = 0;

    function toEmbedUrl(url) {
      try {
        const u = new URL(url);
        if (u.hostname.includes('youtu.be')) return 'https://www.youtube.com/embed/' + u.pathname.slice(1);
        if (u.hostname.includes('youtube.com')) return 'https://www.youtube.com/embed/' + u.searchParams.get('v');
      } catch (e) {
        return url;
      }
      return url;
    }

    function openVideoViewer(index = 0) {
      if (!videoViewer || !iframe) return;
      currentVideoIndex = Math.max(0, Math.min(index, videos.length - 1));
      const embed = toEmbedUrl(videos[currentVideoIndex].url);
      iframe.src = embed + '?autoplay=1&rel=0';
      if (caption) {
        const title = videos[currentVideoIndex].title;
        caption.textContent = title ? `${title} · ${currentVideoIndex + 1} / ${videos.length}` : `${currentVideoIndex + 1} / ${videos.length}`;
      }
      videoViewer.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeVideoViewer() {
      if (!videoViewer || !iframe) return;
      iframe.src = '';
      videoViewer.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }

    function showPrev() { openVideoViewer((currentVideoIndex - 1 + videos.length) % videos.length); }
    function showNext() { openVideoViewer((currentVideoIndex + 1) % videos.length); }

    if (galleryIcon) galleryIcon.addEventListener('click', () => openVideoViewer(0));
    btnPrevVideo?.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    btnNextVideo?.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    btnCloseVideo?.addEventListener('click', (e) => { e.stopPropagation(); closeVideoViewer(); });
    videoViewer?.addEventListener('click', (e) => {
      if (e.target?.matches('[data-close]') || e.target === videoViewer) closeVideoViewer();
    });
    window.addEventListener('keydown', (e) => {
      if (videoViewer && !videoViewer.hasAttribute('hidden')) {
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'Escape') closeVideoViewer();
      }
    });
  } catch (err) {
    console.warn('Error inicializando la galería de vídeo', err);
  }
}

// =====================================================
// MONITOR CLICK ANIMATION
// =====================================================
window.addEventListener('monitorClicked', async (e) => {
  await ensureWindowsDesktopLoaded();
  
  cameraRestore = {
    pos: camera.position.clone(),
    target: controls.target.clone(),
    controlsEnabled: controls.enabled
  };
  controls.enabled = false;

  const obj = e.detail.object;
  const box = new THREE.Box3().setFromObject(obj);
  const center = new THREE.Vector3();
  box.getCenter(center);
  const dir = new THREE.Vector3().subVectors(camera.position, center).normalize();
  const zoomPos = center.clone().add(dir.multiplyScalar(1.1));
  zoomPos.y = center.y + 0.25;

  let monitorTextureUrl = null;
  if (obj.material && obj.material.map && obj.material.map.image && obj.material.map.image.src) {
    monitorTextureUrl = obj.material.map.image.currentSrc || obj.material.map.image.src;
  }

  let t = 0;
  const startPos = camera.position.clone();
  const startTarget = controls.target.clone();
  const endPos = zoomPos;
  const endTarget = center;
  
  function animateZoom() {
    t += 0.04;
    camera.position.lerpVectors(startPos, endPos, t);
    controls.target.lerpVectors(startTarget, endTarget, t);
    if (t < 1) {
      requestAnimationFrame(animateZoom);
    } else {
      camera.position.copy(endPos);
      controls.target.copy(endTarget);
      if (monitorTextureUrl && windowsDesktop) {
        windowsDesktop.style.background = `url('${monitorTextureUrl}') center/cover no-repeat`;
      }
      showWindowsDesktop();
    }
  }
  animateZoom();
});

// =====================================================
// EVENT LISTENERS
// =====================================================
btnPrev?.addEventListener("click", () => focusManager.prevDecoration());
btnNext?.addEventListener("click", () => focusManager.nextDecoration());

window.addEventListener("keydown", e => {
  if (!desktopActive && e.key === "Escape") focusManager.exitFocus();
});

window.addEventListener('keydown', (e) => {
  if (desktopActive && e.key === 'Escape') {
    exitWindowsDesktop();
  }
});

document.addEventListener('click', (e) => {
  if (!desktopActive) return;
  const btn = e.target.closest('.shutdown-btn');
  if (btn) {
    exitWindowsDesktop();
  }
});

// =====================================================
// RESIZE HANDLER
// =====================================================
setupResize(camera, renderer);

// =====================================================
// MAIN LOOP
// =====================================================
function animate() {
  requestAnimationFrame(animate);
  focusManager.update();
  controls.update();
  updateInteraction();
  renderer.render(scene, camera);
}

animate();