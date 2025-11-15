// Custom Shaders for Dream Effects (placeholder for future enhancements)
class DreamShaders {
    // We'll add custom shaders here for advanced effects
    // like morphing terrain, liquid surfaces, etc.
}

// Dreamscape Control Functions
function enterDreamscape() {
    document.getElementById('traditionalView').style.display = 'none';
    document.getElementById('dreamscapeView').style.display = 'block';
    
    // Initialize dream engine
    dreamEngine = new DreamEngine();
    dreamEngine.startDream();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (dreamEngine) dreamEngine.resize();
    });
}

function exitDreamscape() {
    document.getElementById('traditionalView').style.display = 'block';
    document.getElementById('dreamscapeView').style.display = 'none';
    
    // Clean up Three.js resources
    if (dreamEngine) {
        // Proper cleanup would go here
        dreamEngine = null;
    }
}