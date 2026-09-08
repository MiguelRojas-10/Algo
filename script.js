// 1. Efecto de Máquina de Escribir
const message = "Te amo mucho mi amorcito, el dia que menos te lo esperes te voy a preñar MUAK";
const typewriterElement = document.getElementById('typewriter-text');
const btn = document.getElementById('action-btn');
let letterIndex = 0;

btn.addEventListener('click', () => {
    if(letterIndex === 0) {
        typewriterElement.innerHTML = '';
        typeWriter();
        btn.style.display = 'none'; // Ocultamos el botón para que quede solo la tarjeta
    }
});

function typeWriter() {
    if (letterIndex < message.length) {
        typewriterElement.innerHTML += message.charAt(letterIndex);
        letterIndex++;
        setTimeout(typeWriter, 40); // Velocidad de tipeo
    }
}

// 2. Abusando del JS: Fondo interactivo de Constelación/Partículas
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const mouse = { x: null, y: null, radius: 120 };

// Detectar el mouse
window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x; 
        this.y = y;
        this.directionX = directionX; 
        this.directionY = directionY;
        this.size = size; 
        this.color = color;
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    
    update() {
        // Rebote en los bordes
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
        
        // Interacción para que las partículas "huyan" del mouse
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 3;
            if (mouse.x > this.x && this.x > this.size * 10) this.x -= 3;
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 3;
            if (mouse.y > this.y && this.y > this.size * 10) this.y -= 3;
        }
        
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 1.5) - 0.75;
        let directionY = (Math.random() * 1.5) - 0.75;
        let color = '#ff7eb3'; // Tono rosa/magenta
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Conectar las partículas con líneas
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                           ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                           
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = 'rgba(255, 126, 179,' + opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Responsividad del canvas
window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

// Limpiar el efecto del ratón al salir de la pantalla
window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

init();
animate();