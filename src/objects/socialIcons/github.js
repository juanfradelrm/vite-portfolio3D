
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


export function loadGitHubIcon({ room, onLoad }) {
    const loader = new GLTFLoader();
    loader.load("/models/socialIcons/github.glb", gltf => {
        const githubIcon = gltf.scene;
        githubIcon.scale.setScalar(0.0035);
        githubIcon.rotation.set(0, 0.8 * Math.PI, 0);
        githubIcon.position.set(-0.75, 0.5, room.depth / 2);
        onLoad(githubIcon);
    });
}


        