// Simple Dream Engine - Phase 1
class DreamEngine {
    constructor() {
        console.log('🚀 DreamEngine created');
        this.init();
    }

    init() {
        console.log('🔧 Initializing basic scene...');
        
        // 1. Create scene with visible background
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x001122); // Dark blue
        
        // 2. Create camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
        
        // 3. Create renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        // 4. Add to page
        const container = document.getElementById('dreamscapeContainer');
        container.appendChild(this.renderer.domElement);
        
        // 5. Add simple rotating cube (impossible to miss)
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
        
        console.log('✅ Basic scene ready - you should see GREEN cube on BLUE background');
        
        // 6. Start animation
        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotate cube
        if (this.cube) {
            this.cube.rotation.x += 0.01;
            this.cube.rotation.y += 0.01;
        }
        
        // Render
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}

let dreamEngine = null;