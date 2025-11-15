// Dream Pages System - Content Page Orbs as Navigation
class DreamPages {
    constructor() {
        this.container = new THREE.Group();
        this.pages = [];
        this.hoveredPage = null;
        
        // Define your content pages here
        this.contentPages = [
            {
                id: "quantum-physics",
                title: "Quantum Physics Explained",
                description: "Understanding the fundamentals of quantum mechanics",
                url: "pages/quantum-physics.html",
                color: 0x4ecdc4,
                position: { x: -4, z: -3 }
            },
            {
                id: "ai-ethics",
                title: "AI Ethics & Future",
                description: "The moral implications of artificial intelligence",
                url: "pages/ai-ethics.html", 
                color: 0xff6b6b,
                position: { x: 3, z: -2 }
            },
            {
                id: "consciousness",
                title: "The Nature of Consciousness",
                description: "Exploring what it means to be conscious",
                url: "pages/consciousness.html",
                color: 0x8b5fbf,
                position: { x: -2, z: 4 }
            },
            {
                id: "digital-art",
                title: "Digital Art Revolution", 
                description: "How technology is transforming artistic expression",
                url: "pages/digital-art.html",
                color: 0xffd166,
                position: { x: 4, z: 3 }
            },
            {
                id: "space-exploration",
                title: "Future of Space Exploration",
                description: "Humanity's journey to the stars",
                url: "pages/space-exploration.html",
                color: 0x6c63ff,
                position: { x: 0, z: -5 }
            },
            {
                id: "ancient-civilizations", 
                title: "Lost Ancient Civilizations",
                description: "Mysteries of prehistoric human societies",
                url: "pages/ancient-civilizations.html",
                color: 0x2a9d8f,
                position: { x: -3, z: 2 }
            }
        ];
        
        this.createPageOrbs();
    }

    createPageOrbs() {
        this.contentPages.forEach((page, index) => {
            this.createPageOrb(page, index);
        });
        this.updateDreamStats();
    }

    createPageOrb(pageData, id) {
        // Create orb geometry
        const geometry = new THREE.SphereGeometry(0.6, 16, 16);
        
        const material = new THREE.MeshStandardMaterial({
            color: pageData.color,
            emissive: pageData.color,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.9
        });

        const orb = new THREE.Mesh(geometry, material);
        orb.position.set(
            pageData.position.x || 0, 
            2, 
            pageData.position.z || 0
        );
        
        orb.userData = { 
            id: pageData.id,
            title: pageData.title,
            description: pageData.description,
            url: pageData.url,
            color: pageData.color,
            isPage: true
        };

        // Add glow effect
        const glowGeometry = new THREE.SphereGeometry(0.8, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: pageData.color,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        orb.add(glow);

        this.container.add(orb);
        this.pages.push(orb);

        // Add floating animation
        orb.userData.floatOffset = Math.random() * Math.PI * 2;
        orb.userData.floatSpeed = 0.5 + Math.random() * 0.5;
    }

    update(elapsed, delta) {
        // Animate page orbs
        this.pages.forEach((page, index) => {
            // Floating motion
            page.position.y = 2 + Math.sin(elapsed * page.userData.floatSpeed + page.userData.floatOffset) * 0.5;
            
            // Gentle rotation
            page.rotation.y += delta * 0.5;
            
            // Pulsing glow
            const glow = page.children[0];
            glow.material.opacity = 0.2 + Math.sin(elapsed * 2 + index) * 0.1;
        });

        // Handle hover and click interactions
        this.handleInteractions();
    }

    handleInteractions() {
        if (!dreamEngine) return;

        const intersects = dreamEngine.raycaster.intersectObjects(this.pages);
        
        if (intersects.length > 0) {
            const page = intersects[0].object;
            
            if (this.hoveredPage !== page) {
                // New hover
                this.onPageHover(page);
                this.hoveredPage = page;
            }
            
            // Handle click
            if (dreamEngine.mouseDown) {
                this.onPageClick(page);
                dreamEngine.mouseDown = false;
            }
        } else if (this.hoveredPage) {
            // Hover ended
            this.onPageHoverEnd(this.hoveredPage);
            this.hoveredPage = null;
        }
    }

    onPageHover(page) {
        // Scale up and brighten
        page.scale.set(1.3, 1.3, 1.3);
        page.material.emissiveIntensity = 0.8;
        
        // Update UI with page info
        this.updateSelectionUI(page.userData);
    }

    onPageHoverEnd(page) {
        // Return to normal
        page.scale.set(1, 1, 1);
        page.material.emissiveIntensity = 0.3;
        
        // Reset UI
        this.updateSelectionUI(null);
    }

    onPageClick(page) {
        console.log('🌐 Navigating to:', page.userData.title);
        console.log('📄 URL:', page.userData.url);
        
        // Add click effect
        page.scale.set(1.1, 1.1, 1.1);
        setTimeout(() => {
            page.scale.set(1.3, 1.3, 1.3);
        }, 100);
        
        // In a real implementation, you would navigate to the page:
        // window.location.href = page.userData.url;
        
        // For now, let's show an alert
        alert(`🎯 Ready to navigate to: ${page.userData.title}\n\nURL: ${page.userData.url}\n\n(In a real implementation, this would take you to the content page)`);
    }

    updateSelectionUI(pageData) {
        const selectionElement = document.getElementById('currentSelection');
        if (selectionElement) {
            if (pageData) {
                selectionElement.innerHTML = `
                    <strong>${pageData.title}</strong><br>
                    <small>${pageData.description}</small><br>
                    <em>Click to visit page</em>
                `;
                selectionElement.style.opacity = '1';
            } else {
                selectionElement.innerHTML = 'Hover over orbs to see page titles';
                selectionElement.style.opacity = '0.7';
            }
        }
    }

    updateDreamStats() {
        const countElement = document.getElementById('dreamPagesCount');
        if (countElement) {
            countElement.textContent = this.pages.length;
        }
    }
}