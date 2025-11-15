// Simple Dreamscape entry
function enterDreamscape() {
    console.log('🎯 Entering Dreamscape...');
    
    // Hide traditional view
    document.getElementById('traditionalView').style.display = 'none';
    
    // Create dreamscape container if it doesn't exist
    let dreamscapeView = document.getElementById('dreamscapeView');
    if (!dreamscapeView) {
        dreamscapeView = document.createElement('div');
        dreamscapeView.id = 'dreamscapeView';
        dreamscapeView.innerHTML = `
            <div id="dreamscapeContainer"></div>
            <button onclick="exitDreamscape()" style="
                position: absolute; 
                top: 20px; 
                right: 20px; 
                padding: 10px 20px;
                background: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            ">Exit Dream</button>
        `;
        document.body.appendChild(dreamscapeView);
    }
    dreamscapeView.style.display = 'block';
    
    // Start simple dream engine
    dreamEngine = new DreamEngine();
}

function exitDreamscape() {
    document.getElementById('dreamscapeView').style.display = 'none';
    document.getElementById('traditionalView').style.display = 'block';
    dreamEngine = null;
}