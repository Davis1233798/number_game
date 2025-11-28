import * as THREE from 'three';

export class Gate {
    constructor(scene, x, z, operation, value) {
        this.scene = scene;
        this.operation = operation; // 'add', 'subtract', 'multiply', 'divide'
        this.value = value;
        this.passed = false;

        // Visuals
        const color = (operation === 'add' || operation === 'multiply') ? 0x0088ff : 0xff2222;
        const geometry = new THREE.BoxGeometry(3.5, 4, 0.5);
        const material = new THREE.MeshPhysicalMaterial({
            color: color,
            transparent: true,
            opacity: 0.6,
            metalness: 0.1,
            roughness: 0.1,
            transmission: 0.5, // Glass-like
            thickness: 1
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(x, 2, z);
        this.scene.add(this.mesh);

        // Label (Simple canvas texture for now to avoid font loading complexity)
        this.createLabel();
    }

    createLabel() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'white';
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let symbol = '';
        if (this.operation === 'add') symbol = '+';
        if (this.operation === 'subtract') symbol = '-';
        if (this.operation === 'multiply') symbol = 'x';
        if (this.operation === 'divide') symbol = '/';

        ctx.fillText(`${symbol}${this.value}`, 128, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const labelGeo = new THREE.PlaneGeometry(3, 1.5);
        const labelMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const label = new THREE.Mesh(labelGeo, labelMat);
        label.position.z = 0.26; // Slightly in front of the gate
        this.mesh.add(label);
    }

    checkCollision(player) {
        if (this.passed) return false;

        // Simple AABB collision or distance check
        // Since gates are wide, we check Z distance and X range
        const dz = this.mesh.position.z - player.mesh.position.z;
        const dx = Math.abs(this.mesh.position.x - player.mesh.position.x);

        // Check if player passed through the gate
        if (dz > -0.5 && dz < 0.5 && dx < 2) { // Gate width approx 3.5, so half is 1.75
            this.applyEffect(player);
            this.passed = true;
            this.mesh.visible = false; // Hide gate after pass
            return true;
        }
        return false;
    }

    applyEffect(player) {
        if (this.operation === 'add') player.count += this.value;
        if (this.operation === 'subtract') player.count -= this.value;
        if (this.operation === 'multiply') player.count *= this.value;
        if (this.operation === 'divide') player.count /= this.value;

        if (player.count < 0) player.count = 0;
    }
}
