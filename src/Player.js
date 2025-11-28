import * as THREE from 'three';

export class Player {
    constructor(scene) {
        this.scene = scene;
        this.speed = 10;
        this.swerveSpeed = 20;
        this.limitX = 8; // Path width limit

        // Visual representation (placeholder for crowd)
        this.geometry = new THREE.SphereGeometry(0.5, 32, 32);
        this.material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.y = 0.5;
        this.scene.add(this.mesh);

        // Game State
        this.count = 1;
        this.countDisplay = document.getElementById('count-display');

        // Input state
        this.isDragging = false;
        this.previousMouseX = 0;

        this.setupInput();
    }

    setupInput() {
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));

        window.addEventListener('touchstart', this.onTouchStart.bind(this));
        window.addEventListener('touchmove', this.onTouchMove.bind(this));
        window.addEventListener('touchend', this.onTouchEnd.bind(this));
    }

    onMouseDown(event) {
        this.isDragging = true;
        this.previousMouseX = event.clientX;
    }

    onMouseMove(event) {
        if (!this.isDragging) return;

        const deltaX = event.clientX - this.previousMouseX;
        this.previousMouseX = event.clientX;

        this.handleInput(deltaX);
    }

    onMouseUp() {
        this.isDragging = false;
    }

    onTouchStart(event) {
        this.isDragging = true;
        this.previousMouseX = event.touches[0].clientX;
    }

    onTouchMove(event) {
        if (!this.isDragging) return;

        const deltaX = event.touches[0].clientX - this.previousMouseX;
        this.previousMouseX = event.touches[0].clientX;

        this.handleInput(deltaX);
    }

    onTouchEnd() {
        this.isDragging = false;
    }

    handleInput(deltaX) {
        // Normalize deltaX based on screen width to make it consistent
        const sensitivity = 0.05;
        this.mesh.position.x += deltaX * sensitivity;

        // Clamp position
        this.mesh.position.x = Math.max(-this.limitX, Math.min(this.limitX, this.mesh.position.x));
    }

    update(dt) {
        // Move forward
        this.mesh.position.z -= this.speed * dt;

        // Update UI
        if (this.countDisplay) {
            this.countDisplay.innerText = Math.floor(this.count);
        }
    }
}
