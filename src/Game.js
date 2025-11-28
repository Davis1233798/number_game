import { SceneSetup } from './SceneSetup.js';
import { Player } from './Player.js';
import { LevelManager } from './LevelManager.js';
import * as THREE from 'three';

export class Game {
    constructor() {
        this.sceneSetup = new SceneSetup('app');
        this.clock = new THREE.Clock();
        this.player = new Player(this.sceneSetup.scene);
        this.levelManager = new LevelManager(this.sceneSetup.scene, this.player);

        this.isRunning = false;
        this.setupUI();
    }

    setupUI() {
        this.startScreen = document.getElementById('start-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');

        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startGame();
            });
        }

        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
    }

    startGame() {
        this.isRunning = true;
        this.startScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
        this.clock.start();
    }

    restartGame() {
        // Reload page for simplicity in this prototype
        window.location.reload();
    }

    start() {
        this.animate();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const dt = this.clock.getDelta();

        if (this.isRunning) {
            this.player.update(dt);
            this.levelManager.update();

            // Check Game Over
            if (this.player.count <= 0) {
                this.gameOver();
            }
        } else {
            // Idle animation or camera rotation could go here
        }

        // Camera follow (always follow player even if not running, or just stay put)
        this.sceneSetup.camera.position.z = this.player.mesh.position.z + 10;
        this.sceneSetup.camera.position.x = this.player.mesh.position.x * 0.3;
        this.sceneSetup.camera.lookAt(this.player.mesh.position);

        this.sceneSetup.render();
    }

    gameOver() {
        this.isRunning = false;
        this.gameOverScreen.classList.remove('hidden');
    }
}
