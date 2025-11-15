// Dream Particle System - Interactive Magical Particles
class DreamParticleSystem {
    constructor() {
        this.points = null;
        this.particles = [];
        this.particleMeshes = []; // Store individual particle meshes for interaction
        
        this.createInteractiveParticles();
    }

    createInteractiveParticles() {
        const particleCount = 20; // Reduced count for better interaction
        this.particleMeshes = [];

        // Define content for each particle
        const particleContent = [
            {
                title: "Quantum Entanglement",
                content: "The phenomenon where particles remain connected...",
                color: 0x4ecdc4
            },
            {
                title: "Neural Networks", 
                content: "How artificial intelligence mimics the human brain...",
                color: 0xff6b6b
            },
            {
                title: "String Theory",
                content: "The theoretical framework where particles are one-dimensional strings...",
                color: 0x8b5fbf
            },
            // Add more content as needed
        ];

        for (let i = 0; i < particleCount; i++) {
            const content = particleContent[i % particleContent.length];
            this.createInteractiveParticle(i, content);
        }
    }

    createInteractiveParticle(index, content) {
        // Create LARGER particles for better visibility
        const geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0); // Increased from 0.3 to 1.0
        const material = new THREE.MeshBasicMaterial({
            color: content.color,
            transparent: true,
            opacity: 1.0 // Increased opacity
        });

        const particle = new THREE.Mesh(geometry, material);
        
        // Position CLOSER to center
        const radius = 8 + Math.random() * 5; // Reduced radius from 15 to 8
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
        particle.position.y = radius * Math.sin(phi) * Math.sin(theta);
        particle.position.z = radius * Math.cos(phi);
        
        // Store particle data for interaction
        particle.userData = {
            id: index,
            title: content.title,
            content: content.content,
            color: content.color,
            isInteractiveParticle: true,
            originalX: particle.position.x,
            originalY: particle.position.y,
            originalZ: particle.position.z,
            speed: 2 + Math.random() * 3, // Faster movement
            offset: Math.random() * Math.PI * 2
        };

        this.particleMeshes.push(particle);
        
        // Add to scene through dream engine
        if (dreamEngine && dreamEngine.scene) {
            dreamEngine.scene.add(particle);
        }
    }

    update(elapsed, delta) {
        // Update particle positions with fast, erratic movement
        this.particleMeshes.forEach((particle, index) => {
            const data = particle.userData;
            const time = elapsed * data.speed + data.offset;
            
            // Fast, erratic movement patterns
            particle.position.x = data.originalX + Math.sin(time * 2) * 3;
            particle.position.y = data.originalY + Math.cos(time * 1.7) * 2;
            particle.position.z = data.originalZ + Math.sin(time * 1.3) * 2.5;
            
            // Rotation for visual interest
            particle.rotation.x += delta * 3;
            particle.rotation.y += delta * 2;
            particle.rotation.z += delta * 1.5;
            
            // Pulsing opacity
            particle.material.opacity = 0.6 + Math.sin(time * 4) * 0.3;
        });
    }

    // Handle particle clicks
    handleParticleClick(particle) {
        console.log('🎯 Particle clicked:', particle.userData.title);
        
        // Visual feedback
        particle.scale.set(1.5, 1.5, 1.5);
        particle.material.color.set(0xffffff); // Flash white
        
        setTimeout(() => {
            particle.scale.set(1, 1, 1);
            particle.material.color.set(particle.userData.color);
        }, 200);
        
        // Show content (you can replace this with a proper modal)
        this.showParticleContent(particle.userData);
    }

    showParticleContent(content) {
        // Create a simple modal to display content
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 2rem;
            border-radius: 15px;
            border: 2px solid ${'#' + content.color.toString(16)};
            max-width: 500px;
            z-index: 10000;
            backdrop-filter: blur(10px);
        `;
        
        modal.innerHTML = `
            <h3 style="color: ${'#' + content.color.toString(16)}; margin-bottom: 1rem;">
                ${content.title}
            </h3>
            <p style="margin-bottom: 1.5rem; line-height: 1.6;">
                ${content.content}
            </p>
            <button onclick="this.parentElement.remove()" 
                    style="background: ${'#' + content.color.toString(16)}; 
                           color: white; 
                           border: none; 
                           padding: 10px 20px; 
                           border-radius: 5px; 
                           cursor: pointer;">
                Close
            </button>
        `;
        
        document.body.appendChild(modal);
    }

    // Get all interactive particles for raycasting
    getInteractiveParticles() {
        return this.particleMeshes;
    }
}
// END OF FILE - NO EXTRA CODE AFTER THIS