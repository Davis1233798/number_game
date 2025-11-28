import * as THREE from 'three';

export class Obstacle {
    constructor(scene, x, z) {
        this.scene = scene;
        this.passed = false;

        // Visuals
        this.geometry = new THREE.ConeGeometry(0.5, 1, 16);
        this.material = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0x550000,
            roughness: 0.4
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(x, 1, z);
        this.scene.add(this.mesh);
    }

    checkCollision(player) {
        if (this.passed) return false;

        const dz = this.mesh.position.z - player.mesh.position.z;
        const dx = Math.abs(this.mesh.position.x - player.mesh.position.x);

        // Simple collision check
        if (dz > -1 && dz < 1 && dx < 1.5) {
            this.applyEffect(player);
            this.passed = true;
            this.mesh.visible = false;
            return true;
        }
        return false;
    }

    applyEffect(player) {
        player.count = Math.floor(player.count / 2); // Halve the count on hit
        if (player.count < 1) player.count = 0;
    }
}
