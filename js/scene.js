import * as THREE from '../lib/three.module.js';
import { OrbitControls } from '../lib/OrbitControls.js';
import { ParticleSystem } from './effects.js';
import { orbVertexShader, orbFragmentShader } from './shaders/orb.js';

export class Scene {
    constructor() {
        this.scene = new THREE.Scene();
        this.time = 0;
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('orb-canvas'),
            antialias: true,
            alpha: true
        });

        this.init();
        this.setupLights();
        this.createOrb();
        this.setupCamera();
        this.addEventListeners();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x6600ff, 1, 100);
        pointLight.position.set(10, 10, 10);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(0x00ffff, 0.8, 100);
        pointLight2.position.set(-10, -10, -10);
        pointLight2.castShadow = true;
        this.scene.add(pointLight2);
    }

    setupCamera() {
        this.camera.position.z = 10;

        // Add OrbitControls for interactive camera movement
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 0.5;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 20;
    }

    addEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    createOrb() {
        const geometry = new THREE.SphereGeometry(2, 64, 64);
        const uniforms = {
            time: { value: 0 },
            color1: { value: new THREE.Color(0x6600ff) },
            color2: { value: new THREE.Color(0x00ffff) }
        };

        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: orbVertexShader,
            fragmentShader: orbFragmentShader,
            transparent: true,
            side: THREE.DoubleSide
        });

        this.orb = new THREE.Mesh(geometry, material);
        this.orb.castShadow = true;
        this.orb.receiveShadow = true;
        this.scene.add(this.orb);

        // Create particle system
        this.particles = new ParticleSystem(this.scene);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.time += 0.016; // Approximately 60 FPS
        // Update shader uniforms
        this.orb.material.uniforms.time.value = this.time;

        this.orb.rotation.x += 0.005;
        this.orb.rotation.y += 0.005;

        // Animate particles
        if (this.particles) {
            this.particles.animate(this.time);
        }

        // Update controls
        this.controls.update();

        this.renderer.render(this.scene, this.camera);
    }

    start() {
        this.animate();
    }
}
