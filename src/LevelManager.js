import { Gate } from './Gate.js';
import { Obstacle } from './Obstacle.js';

export class LevelManager {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.gates = [];
        this.obstacles = [];
        this.spawnZ = -20;
        this.spawnInterval = 30;

        // Initial spawn
        for (let i = 0; i < 5; i++) {
            this.spawnLevelChunk();
        }
    }

    spawnLevelChunk() {
        // Spawn Gates
        this.spawnGateRow();

        // Spawn Obstacles between gates
        if (Math.random() > 0.3) {
            const x = (Math.random() - 0.5) * 10;
            const obstacle = new Obstacle(this.scene, x, this.spawnZ + 15); // Halfway between gates
            this.obstacles.push(obstacle);
        }

        this.spawnZ -= this.spawnInterval;
    }

    spawnGateRow() {
        // Spawn two gates, one left one right
        const ops = ['add', 'subtract', 'multiply', 'divide'];

        // Left Gate
        const op1 = ops[Math.floor(Math.random() * ops.length)];
        const val1 = Math.floor(Math.random() * 10) + 1;
        const gate1 = new Gate(this.scene, -4, this.spawnZ, op1, val1);
        this.gates.push(gate1);

        // Right Gate
        const op2 = ops[Math.floor(Math.random() * ops.length)];
        const val2 = Math.floor(Math.random() * 10) + 1;
        const gate2 = new Gate(this.scene, 4, this.spawnZ, op2, val2);
        this.gates.push(gate2);
    }

    update() {
        // Check Gate collisions
        for (const gate of this.gates) {
            gate.checkCollision(this.player);
        }

        // Check Obstacle collisions
        for (const obstacle of this.obstacles) {
            obstacle.checkCollision(this.player);
        }

        // Spawn new chunks
        if (this.player.mesh.position.z < this.spawnZ + 150) {
            this.spawnLevelChunk();
        }

        // Cleanup
        this.cleanup(this.gates);
        this.cleanup(this.obstacles);
    }

    cleanup(list) {
        for (let i = list.length - 1; i >= 0; i--) {
            if (list[i].mesh.position.z > this.player.mesh.position.z + 10) {
                this.scene.remove(list[i].mesh);
                list.splice(i, 1);
            }
        }
    }
}
