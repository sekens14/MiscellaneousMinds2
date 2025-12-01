// game-engine.js - Minimal working version
class DreamRunnerGame {
    constructor() {
        console.log('🎮 Game starting...');
        this.init();
    }

    init() {
        // Create basic Three.js scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x001122);
        
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
        
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        const container = document.getElementById('gameContainer');
        container.appendChild(this.renderer.domElement);
        
        // Add a simple test cube
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
        
        // Add some stars
        this.createStars();
        
        console.log('✅ Game ready!');
        this.animate();
    }

    createStars() {
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1
        });

        const starVertices = [];
        for (let i = 0; i < 1000; i++) {
            starVertices.push(
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100
            );
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotate cube
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        
        // Rotate stars slowly
        this.stars.rotation.y += 0.001;
        
        this.renderer.render(this.scene, this.camera);
    }
}