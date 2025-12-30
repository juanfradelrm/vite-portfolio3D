
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


export function loadLinkedinIcon({ room, onLoad }) {
    const loader = new GLTFLoader();
    loader.load("/models/socialIcons/linkedin.glb", gltf => {
        const linkedinIcon = gltf.scene;
        linkedinIcon.scale.setScalar(0.15);
        linkedinIcon.rotation.set(0, Math.PI, 0);
        linkedinIcon.position.set(0.75, 0.45, room.depth / 2);
        onLoad(linkedinIcon);
    });
}