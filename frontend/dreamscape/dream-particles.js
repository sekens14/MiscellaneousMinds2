class DreamscapeManager {
    constructor() {
        this.floatingSquares = [];
        this.magicCircles = [];
        this.init();
    }

    init() {
        this.createFloatingSquares(20);
        this.createMagicCircle(8);
        this.animate();
    }

    createFloatingSquares(count) {
        for (let i = 0; i < count; i++) {
            const square = {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 20 + 5,
                speedX: (Math.random() - 0.5) * 2,
                speedY: (Math.random() - 0.5) * 2,
                color: this.getRandomPastelColor(),
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 2
            };
            this.floatingSquares.push(square);
        }
    }

    createMagicCircle(ballCount) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const radius = 150;

        for (let i = 0; i < ballCount; i++) {
            const angle = (i / ballCount) * Math.PI * 2;
            const ball = {
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                size: 30,
                color: this.getRandomMagicColor(),
                originalX: centerX + Math.cos(angle) * radius,
                originalY: centerY + Math.sin(angle) * radius,
                angle: angle,
                pulse: 0,
                link: `dream-page-${i + 1}.html` // Replace with your actual page links
            };
            this.magicCircles.push(ball);
        }
    }

    getRandomPastelColor() {
        const hues = [120, 180, 240, 300, 60]; // Green, cyan, blue, magenta, yellow
        const hue = hues[Math.floor(Math.random() * hues.length)];
        return `hsl(${hue}, 70%, 80%)`;
    }

    getRandomMagicColor() {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animate() {
        this.updateFloatingSquares();
        this.updateMagicCircle();
        this.render();
        requestAnimationFrame(() => this.animate());
    }

    updateFloatingSquares() {
        this.floatingSquares.forEach(square => {
            square.x += square.speedX;
            square.y += square.speedY;
            square.rotation += square.rotationSpeed;

            // Bounce off walls
            if (square.x < 0 || square.x > window.innerWidth) square.speedX *= -1;
            if (square.y < 0 || square.y > window.innerHeight) square.speedY *= -1;

            // Keep within bounds
            square.x = Math.max(0, Math.min(window.innerWidth, square.x));
            square.y = Math.max(0, Math.min(window.innerHeight, square.y));
        });
    }

    updateMagicCircle() {
        this.magicCircles.forEach(ball => {
            // Gentle pulsing animation
            ball.pulse = (ball.pulse + 0.05) % (Math.PI * 2);
            const pulseOffset = Math.sin(ball.pulse) * 5;
            
            ball.x = ball.originalX + pulseOffset * Math.cos(ball.angle);
            ball.y = ball.originalY + pulseOffset * Math.sin(ball.angle);
        });
    }

    render() {
        // You'll need to implement this based on your rendering system
        // This could use Canvas, SVG, or DOM elements
        console.log('Rendering dreamscape...');
        // Implementation depends on your current setup
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DreamscapeManager();
});