// Enhanced Dream Engine v2 - With Camera Controls & Visual Effects
class DreamEngine {
    constructor() {
        console.log('🚀 DreamEngine v2 initialized');
        this.floatingSquares = [];
        this.magicBalls = [];
        this.stars = [];
        this.particles = [];
        this.nebulaClouds = [];
        
        // Camera controls
        this.cameraControls = {
            moveForward: false,
            moveBackward: false,
            moveLeft: false,
            moveRight: false,
            moveUp: false,
            moveDown: false,
            rotateLeft: false,
            rotateRight: false
        };
        
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.mouseSensitivity = 0.002;
        this.moveSpeed = 0.15;
        
        // Mouse look
        this.pitch = 0;
        this.yaw = 0;
        this.isPointerLocked = false;
        
        this.init();
    }

    init() {
        console.log('🔧 Initializing enhanced dreamscape v2...');
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x001122, 0.015); // Add atmospheric fog
        this.scene.background = new THREE.Color(0x000818);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 20);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        const container = document.getElementById('dreamscapeContainer');
        container.appendChild(this.renderer.domElement);
        
        // Add all elements
        this.addLighting();
        this.createStarfield();
        this.createNebulaClouds();
        this.createFloatingSquares(20);
        this.createMagicCircle(8);
        this.createAmbientParticles(100);
        this.addCameraControls();
        this.addInteractivity();
        this.createHoverUI();
        
        console.log('✅ Enhanced dreamscape v2 ready!');
        
        this.animate();
        window.addEventListener('resize', () => this.onWindowResize());
    }

    addLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x4466ff, 0.4);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        
        // Point lights for atmosphere
        const pointLight1 = new THREE.PointLight(0x4ECDC4, 1, 50);
        pointLight1.position.set(10, 10, 10);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0xFF6B6B, 1, 50);
        pointLight2.position.set(-10, -10, -10);
        this.scene.add(pointLight2);
    }

    createNebulaClouds() {
        console.log('☁️ Creating nebula clouds...');
        
        const cloudCount = 5;
        for (let i = 0; i < cloudCount; i++) {
            const geometry = new THREE.SphereGeometry(8, 32, 32);
            const material = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? 0x4ECDC4 : 0xFF6B6B,
                transparent: true,
                opacity: 0.05,
                side: THREE.DoubleSide
            });
            
            const cloud = new THREE.Mesh(geometry, material);
            
            // Random position
            cloud.position.set(
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 60
            );
            
            cloud.userData = {
                rotationSpeed: Math.random() * 0.001 + 0.0005,
                pulseSpeed: Math.random() * 0.01 + 0.005,
                pulsePhase: Math.random() * Math.PI * 2
            };
            
            this.scene.add(cloud);
            this.nebulaClouds.push(cloud);
        }
    }

    createAmbientParticles(count) {
        console.log('✨ Creating ambient particles...');
        
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        
        const particleColors = [
            new THREE.Color(0x4ECDC4),
            new THREE.Color(0xFF6B6B),
            new THREE.Color(0xFFD700),
            new THREE.Color(0x96CEB4)
        ];
        
        for (let i = 0; i < count; i++) {
            positions.push(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50
            );
            
            const color = particleColors[Math.floor(Math.random() * particleColors.length)];
            colors.push(color.r, color.g, color.b);
            
            this.particles.push({
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02
                )
            });
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.3,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }

    createStarfield() {
        console.log('⭐ Creating starfield...');
        
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.15,
            transparent: true,
            opacity: 0.9
        });

        const starVertices = [];
        const starCount = 3000;
        
        for (let i = 0; i < starCount; i++) {
            const radius = 50 + Math.random() * 150;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            starVertices.push(x, y, z);
            
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
        this.starfield = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.starfield);
    }

    createFloatingSquares(count) {
        const colors = [0x4ECDC4, 0xFF6B6B, 0x45B7D1, 0x96CEB4, 0xFFEAA7];
        
        for (let i = 0; i < count; i++) {
            const size = Math.random() * 0.8 + 0.3;
            const geometry = new THREE.BoxGeometry(size, size, size);
            const material = new THREE.MeshPhongMaterial({ 
                color: colors[Math.floor(Math.random() * colors.length)],
                transparent: true,
                opacity: 0.7,
                emissive: colors[Math.floor(Math.random() * colors.length)],
                emissiveIntensity: 0.2
            });
            
            const square = new THREE.Mesh(geometry, material);
            
            const radius = 10 + Math.random() * 8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            square.position.x = radius * Math.sin(phi) * Math.cos(theta);
            square.position.y = radius * Math.sin(phi) * Math.sin(theta);
            square.position.z = radius * Math.cos(phi);
            
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
        const radius = 6;
        const ballSize = 0.9;
        
        const contentPreviews = [
            { title: "Dreams & Ideas", description: "Explore creative thoughts" },
            { title: "Tech Projects", description: "Development showcase" },
            { title: "Art Gallery", description: "Visual creations" },
            { title: "Music & Sound", description: "Audio experiments" },
            { title: "Stories", description: "Written narratives" },
            { title: "Learning Hub", description: "Knowledge base" },
            { title: "Community", description: "Connect & share" },
            { title: "About", description: "Learn more" }
        ];
        
        for (let i = 0; i < count; i++) {
            const geometry = new THREE.SphereGeometry(ballSize, 32, 32);
            const material = new THREE.MeshPhongMaterial({ 
                color: this.getMagicBallColor(i),
                shininess: 100,
                transparent: true,
                opacity: 0.9,
                emissive: this.getMagicBallColor(i),
                emissiveIntensity: 0.3
            });
            
            const ball = new THREE.Mesh(geometry, material);
            
            const angle = (i / count) * Math.PI * 2;
            ball.position.x = Math.cos(angle) * radius;
            ball.position.y = Math.sin(angle) * radius;
            ball.position.z = 0;
            
            ball.userData = {
                originalPosition: ball.position.clone(),
                angle: angle,
                pulseSpeed: Math.random() * 0.03 + 0.02,
                pulsePhase: Math.random() * Math.PI * 2,
                isMagicBall: true,
                pageLink: `dream-content-${i + 1}.html`,
                hovered: false,
                preview: contentPreviews[i]
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

    createHoverUI() {
        const uiDiv = document.createElement('div');
        uiDiv.id = 'hoverPreview';
        uiDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 30px;
            border-radius: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(10px);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
            text-align: center;
            max-width: 300px;
            z-index: 100;
        `;
        uiDiv.innerHTML = `
            <h3 style="margin: 0 0 10px 0; font-size: 1.5rem;"></h3>
            <p style="margin: 0; opacity: 0.8;"></p>
            <small style="display: block; margin-top: 15px; opacity: 0.6;">Click to explore</small>
        `;
        document.body.appendChild(uiDiv);
        this.hoverUI = uiDiv;
    }

    addCameraControls() {
        console.log('🎮 Adding camera controls...');
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'KeyW': this.cameraControls.moveForward = true; break;
                case 'KeyS': this.cameraControls.moveBackward = true; break;
                case 'KeyA': this.cameraControls.moveLeft = true; break;
                case 'KeyD': this.cameraControls.moveRight = true; break;
                case 'Space': this.cameraControls.moveUp = true; break;
                case 'ShiftLeft': this.cameraControls.moveDown = true; break;
                case 'ArrowLeft': this.cameraControls.rotateLeft = true; break;
                case 'ArrowRight': this.cameraControls.rotateRight = true; break;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            switch(e.code) {
                case 'KeyW': this.cameraControls.moveForward = false; break;
                case 'KeyS': this.cameraControls.moveBackward = false; break;
                case 'KeyA': this.cameraControls.moveLeft = false; break;
                case 'KeyD': this.cameraControls.moveRight = false; break;
                case 'Space': this.cameraControls.moveUp = false; break;
                case 'ShiftLeft': this.cameraControls.moveDown = false; break;
                case 'ArrowLeft': this.cameraControls.rotateLeft = false; break;
                case 'ArrowRight': this.cameraControls.rotateRight = false; break;
            }
        });
        
        // Mouse controls
        document.addEventListener('mousemove', (e) => {
            if (this.isPointerLocked) {
                this.yaw -= e.movementX * this.mouseSensitivity;
                this.pitch -= e.movementY * this.mouseSensitivity;
                this.pitch = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.pitch));
            }
        });
        
        // Pointer lock
        this.renderer.domElement.addEventListener('click', () => {
            this.renderer.domElement.requestPointerLock();
        });
        
        document.addEventListener('pointerlockchange', () => {
            this.isPointerLocked = document.pointerLockElement === this.renderer.domElement;
        });
        
        // Instructions UI
        this.createInstructions();
    }

    createInstructions() {
        const instructions = document.createElement('div');
        instructions.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 15px 25px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            z-index: 100;
            font-size: 0.9rem;
            text-align: center;
        `;
        instructions.innerHTML = `
            <strong>🎮 Controls:</strong> 
            WASD - Move | Space/Shift - Up/Down | Mouse - Look Around | Click Orbs to Explore
        `;
        document.body.appendChild(instructions);
    }

    updateCamera() {
        // Update camera rotation
        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.y = this.yaw;
        this.camera.rotation.x = this.pitch;
        
        // Arrow key rotation
        if (this.cameraControls.rotateLeft) this.yaw += 0.02;
        if (this.cameraControls.rotateRight) this.yaw -= 0.02;
        
        // Calculate movement direction
        this.direction.set(0, 0, 0);
        
        if (this.cameraControls.moveForward) this.direction.z -= 1;
        if (this.cameraControls.moveBackward) this.direction.z += 1;
        if (this.cameraControls.moveLeft) this.direction.x -= 1;
        if (this.cameraControls.moveRight) this.direction.x += 1;
        if (this.cameraControls.moveUp) this.direction.y += 1;
        if (this.cameraControls.moveDown) this.direction.y -= 1;
        
        this.direction.normalize();
        
        // Apply movement
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(this.camera.quaternion);
        forward.y = 0;
        forward.normalize();
        
        const right = new THREE.Vector3(1, 0, 0);
        right.applyQuaternion(this.camera.quaternion);
        right.y = 0;
        right.normalize();
        
        this.velocity.set(0, 0, 0);
        this.velocity.addScaledVector(forward, -this.direction.z);
        this.velocity.addScaledVector(right, this.direction.x);
        this.velocity.y = this.direction.y;
        this.velocity.multiplyScalar(this.moveSpeed);
        
        this.camera.position.add(this.velocity);
    }

    addInteractivity() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        window.addEventListener('mousemove', (event) => {
            if (this.isPointerLocked) return;
            
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.magicBalls);
            
            this.magicBalls.forEach(ball => {
                ball.userData.hovered = false;
                ball.material.emissiveIntensity = 0.3;
            });
            
            if (intersects.length > 0) {
                const ball = intersects[0].object;
                ball.userData.hovered = true;
                ball.material.emissiveIntensity = 0.6;
                
                // Show preview
                this.hoverUI.querySelector('h3').textContent = ball.userData.preview.title;
                this.hoverUI.querySelector('p').textContent = ball.userData.preview.description;
                this.hoverUI.style.opacity = '1';
                
                document.body.style.cursor = 'pointer';
            } else {
                this.hoverUI.style.opacity = '0';
                document.body.style.cursor = 'default';
            }
        });
        
        window.addEventListener('click', (event) => {
            if (this.isPointerLocked) return;
            
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.magicBalls);
            
            if (intersects.length > 0) {
                const ball = intersects[0].object;
                console.log(`🎯 Clicked: ${ball.userData.preview.title}`);
                window.location.href = ball.userData.pageLink;
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        this.updateCamera();
        this.animateStarfield(time);
        this.animateNebula(time);
        this.animateParticles();
        this.animateFloatingSquares(time);
        this.animateMagicBalls(time);
        
        this.renderer.render(this.scene, this.camera);
    }

    animateStarfield(time) {
        if (!this.starfield) return;
        
        const positions = this.starfield.geometry.attributes.position.array;
        
        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];
            const i3 = i * 3;
            
            positions[i3] = star.originalX + Math.sin(time * star.speed + star.phase) * 2;
            positions[i3 + 1] = star.originalY + Math.cos(time * star.speed * 0.7 + star.phase) * 2;
            positions[i3 + 2] = star.originalZ + Math.sin(time * star.twinkleSpeed) * 0.5;
        }
        
        this.starfield.geometry.attributes.position.needsUpdate = true;
        this.starfield.rotation.y += 0.0001;
    }

    animateNebula(time) {
        this.nebulaClouds.forEach(cloud => {
            cloud.rotation.x += cloud.userData.rotationSpeed;
            cloud.rotation.y += cloud.userData.rotationSpeed * 0.7;
            
            const pulse = Math.sin(time * cloud.userData.pulseSpeed + cloud.userData.pulsePhase) * 0.02 + 0.05;
            cloud.material.opacity = pulse;
        });
    }

    animateParticles() {
        if (!this.particleSystem) return;
        
        const positions = this.particleSystem.geometry.attributes.position.array;
        
        for (let i = 0; i < this.particles.length; i++) {
            const i3 = i * 3;
            const particle = this.particles[i];
            
            positions[i3] += particle.velocity.x;
            positions[i3 + 1] += particle.velocity.y;
            positions[i3 + 2] += particle.velocity.z;
            
            // Wrap around
            if (Math.abs(positions[i3]) > 25) positions[i3] *= -1;
            if (Math.abs(positions[i3 + 1]) > 25) positions[i3 + 1] *= -1;
            if (Math.abs(positions[i3 + 2]) > 25) positions[i3 + 2] *= -1;
        }
        
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    animateFloatingSquares(time) {
        this.floatingSquares.forEach((square) => {
            const data = square.userData;
            
            square.position.y = data.originalPosition.y + Math.sin(time * data.speed + data.floatOffset) * 0.5;
            
            square.rotation.x += data.rotationSpeed.x;
            square.rotation.y += data.rotationSpeed.y;
            square.rotation.z += data.rotationSpeed.z;
        });
    }

    animateMagicBalls(time) {
        this.magicBalls.forEach(ball => {
            const data = ball.userData;
            
            const pulse = Math.sin(time * data.pulseSpeed + data.pulsePhase) * 0.2 + 1;
            const targetScale = data.hovered ? 1.4 : pulse;
            ball.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
            
            ball.position.x = data.originalPosition.x * Math.cos(time * 0.1) - data.originalPosition.y * Math.sin(time * 0.1);
            ball.position.y = data.originalPosition.x * Math.sin(time * 0.1) + data.originalPosition.y * Math.cos(time * 0.1);
            ball.position.z = Math.sin(time * data.pulseSpeed + data.pulsePhase) * 0.3;
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

let dreamEngine = null;