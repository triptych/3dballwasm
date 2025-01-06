import * as THREE from '../lib/three.module.js';

export class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.particleCount = 1000;
        this.init();
    }

    init() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);

        for (let i = 0; i < this.particleCount; i++) {
            // Create particles in a spherical distribution around the orb
            const radius = 4 + Math.random() * 2; // Between 4 and 6 units from center
            const theta = Math.random() * Math.PI * 2; // Random angle around Y axis
            const phi = Math.acos((Math.random() * 2) - 1); // Random angle from Y axis

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);

            // Create a gradient from purple to cyan
            const mixRatio = Math.random();
            colors[i * 3] = mixRatio * 0.4; // R: purple to cyan
            colors[i * 3 + 1] = mixRatio * 1.0; // G: increase for cyan
            colors[i * 3 + 2] = 1.0; // B: keep high for magical effect
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }

    animate(time) {
        const positions = this.particleSystem.geometry.attributes.position.array;

        for (let i = 0; i < this.particleCount; i++) {
            // Create a swirling motion
            const x = positions[i * 3];
            const y = positions[i * 3 + 1];
            const z = positions[i * 3 + 2];

            // Calculate distance from center
            const distance = Math.sqrt(x * x + y * y + z * z);

            // Create rotation speed based on distance
            const rotationSpeed = (6 - distance) * 0.002;

            // Apply rotation around Y axis
            const angle = rotationSpeed * time;
            const newX = x * Math.cos(angle) - z * Math.sin(angle);
            const newZ = x * Math.sin(angle) + z * Math.cos(angle);

            positions[i * 3] = newX;
            positions[i * 3 + 2] = newZ;

            // Add subtle vertical oscillation
            positions[i * 3 + 1] = y + Math.sin(time * 0.001 + distance) * 0.02;
        }

        this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }
}
