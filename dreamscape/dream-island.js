// Dream Island - Morphing Floating Landmass
class DreamIsland {
    constructor() {
        this.mesh = null;
        this.geometry = null;
        this.material = null;
        this.clock = new THREE.Clock();
        
        this.createIsland();
    }

    createIsland() {
        // Create island geometry
        this.geometry = new THREE.SphereGeometry(8, 32, 32);
        
        // Modify vertices to create organic island shape
        const positions = this.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            const z = positions[i + 2];
            
            // Create terrain-like variations
            const distance = Math.sqrt(x * x + y * y + z * z);
            const noise = Math.sin(x * 2) * Math.cos(z * 2) * 0.3;
            
            positions[i] = x * (1 + noise);
            positions[i + 1] = y * (1 + noise);
            positions[i + 2] = z * (1 + noise);
        }
        
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.computeVertexNormals();

        // Dream-like material
        this.material = new THREE.MeshStandardMaterial({
            color: 0x4a00ff,
            emissive: 0x220066,
            roughness: 0.7,
            metalness: 0.1,
            wireframe: false
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotation.x = -Math.PI / 2; // Lay flat
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }

    update(elapsed, delta) {
        // Gentle floating animation
        this.mesh.position.y = Math.sin(elapsed * 0.5) * 0.2;
        
        // Slow rotation
        this.mesh.rotation.z += delta * 0.1;
        
        // Morph vertices over time
        const positions = this.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            const z = positions[i + 2];
            
            // Animate with sine waves for organic motion
            const time = elapsed;
            const wave1 = Math.sin(x * 0.5 + time) * 0.1;
            const wave2 = Math.cos(z * 0.5 + time * 1.3) * 0.1;
            
            positions[i] = x + wave1;
            positions[i + 2] = z + wave2;
        }
        
        this.geometry.attributes.position.needsUpdate = true;
    }
}