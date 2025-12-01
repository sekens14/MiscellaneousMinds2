// Dream Post System - Thought Orbs & Interactions
class DreamPostSystem {
    constructor() {
        this.container = new THREE.Group();
        this.posts = [];
        this.hoveredPost = null;
    }

    createSamplePosts() {
        // Create sample thought orbs
        const samplePosts = [
            { title: "Welcome to Dreamscape", category: "welcome", x: -3, z: -2 },
            { title: "Amazing Music Track", category: "music", x: 4, z: -1 },
            { title: "Beautiful Artwork", category: "art", x: -2, z: 3 },
            { title: "Interesting Thoughts", category: "ideas", x: 3, z: 2 },
            { title: "Community Update", category: "social", x: 0, z: -4 }
        ];

        samplePosts.forEach((post, index) => {
            this.createThoughtOrb(post, index);
        });

        this.updateDreamStats();
    }

    createThoughtOrb(postData, id) {
        // Create orb geometry
        const geometry = new THREE.SphereGeometry(0.5, 16, 16);
        
        // Category-based colors
        const colors = {
            music: 0xff6b6b,
            art: 0x4ecdc4,
            ideas: 0xffd166,
            social: 0x6c63ff,
            welcome: 0x8b5fbf
        };
        
        const material = new THREE.MeshStandardMaterial({
            color: colors[postData.category] || 0x888888,
            emissive: colors[postData.category] || 0x888888,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.9
        });

        const orb = new THREE.Mesh(geometry, material);
        orb.position.set(postData.x || 0, 2, postData.z || 0);
        orb.userData = { 
            id: id,
            title: postData.title,
            category: postData.category,
            isPost: true
        };

        // Add glow effect
        const glowGeometry = new THREE.SphereGeometry(0.7, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: colors[postData.category] || 0x888888,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        orb.add(glow);

        this.container.add(orb);
        this.posts.push(orb);

        // Add floating animation
        orb.userData.floatOffset = Math.random() * Math.PI * 2;
        orb.userData.floatSpeed = 0.5 + Math.random() * 0.5;
    }

    update(elapsed, delta) {
        // Animate posts
        this.posts.forEach((post, index) => {
            // Floating motion
            post.position.y = 2 + Math.sin(elapsed * post.userData.floatSpeed + post.userData.floatOffset) * 0.5;
            
            // Gentle rotation
            post.rotation.y += delta * 0.5;
            
            // Pulsing glow
            const glow = post.children[0];
            glow.material.opacity = 0.2 + Math.sin(elapsed * 2 + index) * 0.1;
        });

        // Handle hover effects
        this.handleHover();
    }

    handleHover() {
        if (!dreamEngine) return;

        const intersects = dreamEngine.raycaster.intersectObjects(this.posts);
        
        if (intersects.length > 0) {
            const post = intersects[0].object;
            
            if (this.hoveredPost !== post) {
                // New hover
                this.onPostHover(post);
                this.hoveredPost = post;
            }
        } else if (this.hoveredPost) {
            // Hover ended
            this.onPostHoverEnd(this.hoveredPost);
            this.hoveredPost = null;
        }
    }

    onPostHover(post) {
        // Scale up and brighten
        post.scale.set(1.2, 1.2, 1.2);
        post.material.emissiveIntensity = 0.8;
        
        // Show post title (you could implement a proper UI here)
        console.log('💭 Hovering:', post.userData.title);
    }

    onPostHoverEnd(post) {
        // Return to normal
        post.scale.set(1, 1, 1);
        post.material.emissiveIntensity = 0.3;
    }

    updateDreamStats() {
        const countElement = document.getElementById('dreamPostsCount');
        if (countElement) {
            countElement.textContent = this.posts.length;
        }
    }
}