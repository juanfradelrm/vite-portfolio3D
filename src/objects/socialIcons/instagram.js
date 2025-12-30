
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


export function loadInstagramIcon({ room, onLoad }) {
    const loader = new GLTFLoader();
    loader.load("/models/socialIcons/instagram.glb", gltf => {
        const instagramIcon = gltf.scene;
        instagramIcon.scale.setScalar(1.25);
        instagramIcon.rotation.set(-Math.PI / 2, Math.PI, 0);
        instagramIcon.position.set(0, 0.45, room.depth / 2);
        onLoad(instagramIcon);
    });
}
