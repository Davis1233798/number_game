import * as THREE from 'three';

export class SceneSetup {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x202025); // Dark premium background
        this.scene.fog = new THREE.FogExp2(0x202025, 0.02); // Soft fog

        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
        this.container.appendChild(this.renderer.domElement);

        this.setupLights();
        this.setupGround();

        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    setupLights() {
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
        hemiLight.position.set(0, 20, 0);
        this.scene.add(hemiLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 20, 10);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.camera.top = 20;
        dirLight.shadow.camera.bottom = -20;
        dirLight.shadow.camera.left = -20;
        dirLight.shadow.camera.right = 20;
        this.scene.add(dirLight);
    }

    setupGround() {
        // Bridge
        const geometry = new THREE.BoxGeometry(14, 1, 1000);
        const material = new THREE.MeshStandardMaterial({ color: 0x555555 });
        this.ground = new THREE.Mesh(geometry, material);
        this.ground.position.y = -0.5; // Top surface at y=0
        this.ground.position.z = -450; // Extend forward
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);
    }

    onWindowResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}
