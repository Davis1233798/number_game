import * as THREE from 'three';

export class Player {
    constructor(scene) {
        this.scene = scene;
        this.speed = 10;
        this.swerveSpeed = 20;
        this.limitX = 8; // Path width limit

        // Game State
        this.count = 1;
        this.countDisplay = document.getElementById('count-display');
        this.isFalling = false;

        // Visual representation (Soldier)
        this.mesh = new THREE.Group();
        this.createSoldierModel();
        this.mesh.position.y = 0; // Ground level
        this.scene.add(this.mesh);

        // Input state
        this.isDragging = false;
        this.previousMouseX = 0;
        this.moveLeft = false;
        this.moveRight = false;

        this.setupInput();
    }

    createSoldierModel() {
        // Simple Soldier Composition
        const material = new THREE.MeshStandardMaterial({
            color: 0x2E8B57, // SeaGreen uniform
            roughness: 0.7,
            metalness: 0.1
        });
        const skinMat = new THREE.MeshStandardMaterial({
            color: 0xFFDAB9, // PeachPuff skin
            roughness: 0.5
        });

        // Body
        const bodyGeo = new THREE.BoxGeometry(0.6, 0.8, 0.4);
        const body = new THREE.Mesh(bodyGeo, material);
        body.position.y = 0.9;
        this.mesh.add(body);

        // Head
        const headGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const head = new THREE.Mesh(headGeo, skinMat);
        head.position.y = 1.6;
        this.mesh.add(head);

        // Legs
        const legGeo = new THREE.BoxGeometry(0.2, 0.8, 0.2);
        const leftLeg = new THREE.Mesh(legGeo, material);
        leftLeg.position.set(-0.2, 0.4, 0);
        this.mesh.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeo, material);
        rightLeg.position.set(0.2, 0.4, 0);
        this.mesh.add(rightLeg);

        // Arms
        const armGeo = new THREE.BoxGeometry(0.2, 0.7, 0.2);
        const leftArm = new THREE.Mesh(armGeo, material);
        leftArm.position.set(-0.5, 1.0, 0);
        this.mesh.add(leftArm);

        const rightArm = new THREE.Mesh(armGeo, material);
        rightArm.position.set(0.5, 1.0, 0);
        this.mesh.add(rightArm);

        // Weapon Holder
        this.weaponGroup = new THREE.Group();
        this.weaponGroup.position.set(0.4, 0.8, 0.3);
        this.mesh.add(this.weaponGroup);

        this.updateWeapon();
    }

    updateWeapon() {
        // Clear previous weapon
        while (this.weaponGroup.children.length > 0) {
            this.weaponGroup.remove(this.weaponGroup.children[0]);
        }

        let weaponGeo, weaponMat;

        if (this.count < 10) {
            // Pistol
            weaponGeo = new THREE.BoxGeometry(0.1, 0.1, 0.3);
            weaponMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        } else if (this.count < 50) {
            // Rifle
            weaponGeo = new THREE.BoxGeometry(0.1, 0.15, 0.8);
            weaponMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
        } else {
            // Minigun / Heavy Weapon
            weaponGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.0, 8);
            weaponGeo.rotateX(Math.PI / 2);
            weaponMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
        }

        const weapon = new THREE.Mesh(weaponGeo, weaponMat);
        this.weaponGroup.add(weapon);
    }

    setupInput() {
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));

        window.addEventListener('touchstart', this.onTouchStart.bind(this));
        window.addEventListener('touchmove', this.onTouchMove.bind(this));
        window.addEventListener('touchend', this.onTouchEnd.bind(this));

        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    onKeyDown(event) {
        if (event.key === 'ArrowLeft' || event.key === 'a') this.moveLeft = true;
        if (event.key === 'ArrowRight' || event.key === 'd') this.moveRight = true;
    }

    onKeyUp(event) {
        if (event.key === 'ArrowLeft' || event.key === 'a') this.moveLeft = false;
        if (event.key === 'ArrowRight' || event.key === 'd') this.moveRight = false;
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

        // Removed clamp to allow falling
    }

    update(dt) {
        // Check for falling
        if (Math.abs(this.mesh.position.x) > 7) { // Bridge width is 14 (-7 to 7)
            this.isFalling = true;
        }

        if (this.isFalling) {
            this.mesh.position.y -= 10 * dt; // Gravity
            this.mesh.rotation.z += 5 * dt; // Spin while falling
            this.mesh.rotation.x += 2 * dt;

            if (this.mesh.position.y < -10) {
                this.count = 0; // Trigger game over
            }
        } else {
            // Move forward only if not falling
            this.mesh.position.z -= this.speed * dt;

            // Keyboard Movement
            const keySpeed = 10;
            if (this.moveLeft) this.mesh.position.x -= keySpeed * dt;
            if (this.moveRight) this.mesh.position.x += keySpeed * dt;

            // Bobbing animation
            this.mesh.position.y = Math.sin(Date.now() * 0.01) * 0.05;
        }

        // Update UI
        if (this.countDisplay) {
            this.countDisplay.innerText = Math.floor(this.count);
        }

        // Update Weapon
        this.checkWeaponUpgrade();
    }

    checkWeaponUpgrade() {
        let level = 0;
        if (this.count >= 50) level = 2;
        else if (this.count >= 10) level = 1;

        if (this.currentWeaponLevel !== level) {
            this.currentWeaponLevel = level;
            this.updateWeapon();
        }
    }
}
