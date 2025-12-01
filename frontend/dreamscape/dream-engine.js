// Enhanced Dream Engine - Phase 2
class DreamEngine {
    constructor() {
        console.log('🚀 DreamEngine created');
        this.floatingSquares = [];
        this.magicBalls = [];
        this.stars = [];
        this.init();
    }

    init() {
        console.log('🔧 Initializing enhanced dreamscape...');
        
        // 1. Create scene with dreamy background
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x001122); // Deep space blue
        
        // 2. Create camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 15;
        
        // 3. Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // 4. Add to page
        const container = document.getElementById('dreamscapeContainer');
        container.appendChild(this.renderer.domElement);
        
        // 5. Add lighting
        this.addLighting();
        
        // 6. Create floating squares
        this.createFloatingSquares(15);
        
        // 7. Create magic circle of balls
        this.createMagicCircle(8);
        
        console.log('✅ Enhanced dreamscape ready!');
        
        // 8. Add click events
        this.addInteractivity();
        
        // 9. Start animation
        this.animate();
        
        // 10. Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        //11. Create starfield background
        this.createStarfield();
    }

    addLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
    }

    createStarfield() {
    console.log('⭐ Creating starfield background...');
    
    // Create star geometry and material
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    // Generate star positions
    const starVertices = [];
    const starCount = 2000;
    
    for (let i = 0; i < starCount; i++) {
        // Create stars in a large sphere around the scene
        const radius = 50 + Math.random() * 100;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        starVertices.push(x, y, z);
        
        // Store individual star data for animation
        this.stars.push({
            originalX: x,
            originalY: y,
            originalZ: z,
            speed: Math.random() * 0.002 + 0.001,
            phase: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.02 + 0.01
        });
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    
    // Create the starfield
    this.starfield = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(this.starfield);
    
    console.log('✅ Starfield created with', starCount, 'stars');
}

    createFloatingSquares(count) {
        const colors = [0x4ECDC4, 0xFF6B6B, 0x45B7D1, 0x96CEB4, 0xFFEAA7];
        
        for (let i = 0; i < count; i++) {
            const size = Math.random() * 0.8 + 0.3;
            const geometry = new THREE.BoxGeometry(size, size, size);
            const material = new THREE.MeshPhongMaterial({ 
                color: colors[Math.floor(Math.random() * colors.length)],
                transparent: true,
                opacity: 0.8
            });
            
            const square = new THREE.Mesh(geometry, material);
            
            // Random position in a sphere around center
            const radius = 8 + Math.random() * 4;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            square.position.x = radius * Math.sin(phi) * Math.cos(theta);
            square.position.y = radius * Math.sin(phi) * Math.sin(theta);
            square.position.z = radius * Math.cos(phi);
            
            // Store animation properties
            square.userData = {
                speed: Math.random() * 0.02 + 0.005,
                rotationSpeed: new THREE.Vector3(
                    Math.random() * 0.02 - 0.01,
                    Math.random() * 0.02 - 0.01,
                    Math.random() * 0.02 - 0.01
                ),
                originalPosition: square.position.clone(),
                floatOffset: Math.random() * Math.PI * 2
            };
            
            this.scene.add(square);
            this.floatingSquares.push(square);
        }
    }

    createMagicCircle(count) {
        const radius = 5;
        const ballSize = 0.8;
        
        for (let i = 0; i < count; i++) {
            const geometry = new THREE.SphereGeometry(ballSize, 32, 32);
            const material = new THREE.MeshPhongMaterial({ 
                color: this.getMagicBallColor(i),
                shininess: 100,
                transparent: true,
                opacity: 0.9
            });
            
            const ball = new THREE.Mesh(geometry, material);
            
            // Position in a circle
            const angle = (i / count) * Math.PI * 2;
            ball.position.x = Math.cos(angle) * radius;
            ball.position.y = Math.sin(angle) * radius;
            ball.position.z = 0;
            
            // Store animation and interaction data
            ball.userData = {
                originalPosition: ball.position.clone(),
                angle: angle,
                pulseSpeed: Math.random() * 0.03 + 0.02,
                pulsePhase: Math.random() * Math.PI * 2,
                isMagicBall: true,
                pageLink: `dream-content-${i + 1}.html`, // Your content pages
                hovered: false
            };
            
            this.scene.add(ball);
            this.magicBalls.push(ball);
        }
    }

    getMagicBallColor(index) {
        const colors = [
            0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0x96CEB4, 
            0xFFEAA7, 0xDDA0DD, 0x98D8C8, 0xF7DC6F
        ];
        return colors[index % colors.length];
    }

    animateStarfield(time) {
    if (!this.starfield) return;
    
    const positions = this.starfield.geometry.attributes.position.array;
    
    for (let i = 0; i < this.stars.length; i++) {
        const star = this.stars[i];
        const i3 = i * 3;
        
        // Gentle floating motion
        positions[i3] = star.originalX + Math.sin(time * star.speed + star.phase) * 2;
        positions[i3 + 1] = star.originalY + Math.cos(time * star.speed * 0.7 + star.phase) * 2;
        
        // Subtle twinkling by modifying Y position slightly
        positions[i3 + 2] = star.originalZ + Math.sin(time * star.twinkleSpeed) * 0.5;
    }
    
    this.starfield.geometry.attributes.position.needsUpdate = true;
    
    // Very slow rotation of entire starfield
    this.starfield.rotation.y += 0.0001;
    this.starfield.rotation.x += 0.00005;
}

animateFloatingSquares(time) {
    this.floatingSquares.forEach((square) => {
        const data = square.userData;
        
        // Gentle floating motion
        square.position.y = data.originalPosition.y + Math.sin(time * data.speed + data.floatOffset) * 0.5;
        
        // Rotation
        square.rotation.x += data.rotationSpeed.x;
        square.rotation.y += data.rotationSpeed.y;
        square.rotation.z += data.rotationSpeed.z;
    });
}

animateMagicBalls(time) {
    this.magicBalls.forEach(ball => {
        const data = ball.userData;
        
        // Pulsing animation
        const pulse = Math.sin(time * data.pulseSpeed + data.pulsePhase) * 0.2 + 1;
        const targetScale = data.hovered ? 1.3 : pulse;
        ball.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        
        // Gentle rotation of the entire circle
        ball.position.x = data.originalPosition.x * Math.cos(time * 0.1) - data.originalPosition.y * Math.sin(time * 0.1);
        ball.position.y = data.originalPosition.x * Math.sin(time * 0.1) + data.originalPosition.y * Math.cos(time * 0.1);
        
        // Add subtle floating to magic balls too
        ball.position.z = Math.sin(time * data.pulseSpeed + data.pulsePhase) * 0.3;
    });
}

    addInteractivity() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        // Mouse move for hover effects
        window.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            raycaster.setFromCamera(mouse, this.camera);
            
            const intersects = raycaster.intersectObjects(this.magicBalls);
            
            // Reset all balls
            this.magicBalls.forEach(ball => {
                ball.userData.hovered = false;
                ball.scale.set(1, 1, 1);
                ball.material.emissive.setHex(0x000000);
            });
            
            // Highlight hovered ball
            if (intersects.length > 0) {
                const ball = intersects[0].object;
                ball.userData.hovered = true;
                ball.scale.set(1.3, 1.3, 1.3);
                ball.material.emissive.setHex(0x333333);
                
                document.body.style.cursor = 'pointer';
            } else {
                document.body.style.cursor = 'default';
            }
        });
        
        // Click to navigate
        window.addEventListener('click', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.magicBalls);
            
            if (intersects.length > 0) {
                const ball = intersects[0].object;
                console.log(`🎯 Magic ball clicked! Would navigate to: ${ball.userData.pageLink}`);
                // Uncomment below when you have your pages ready:
                // window.location.href = ball.userData.pageLink;
            }
        });
    }

animate() {
    requestAnimationFrame(() => this.animate());
    
    const time = Date.now() * 0.001;
    
    // Animate starfield
    this.animateStarfield(time);
    
    // Animate floating squares
    this.animateFloatingSquares(time);
    
    // Animate magic balls
    this.animateMagicBalls(time);
    
    // Render
    this.renderer.render(this.scene, this.camera);
}

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

let dreamEngine = null;