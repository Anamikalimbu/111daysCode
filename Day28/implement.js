// Firebase & Config Imports
import { db, doc, setDoc, updateDoc, increment, collection, addDoc, serverTimestamp } from './firebase-config.js';

// Theme Toggle Logic
const themeToggles = document.querySelectorAll('.theme-toggle-btn'); // Select ALL buttons
const body = document.body;

// Check for saved user preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    themeToggles.forEach(btn => {
        const icon = btn.querySelector('i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    });
}

// Add event listener to ALL buttons
themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');

        // Update ALL icons
        themeToggles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            if (isLight) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });

        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
});



// 3D Tilt Effect
const cards = document.querySelectorAll('.tilt-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// Scroll Reveal Animation 
const revealElements = document.querySelectorAll('.reveal');

// Don't hide them instantly - let them be visible so Google can see them.
// We only hide them once the IntersectionObserver is ready and if we choose to.
// Actually, it's safer for SEO to ONLY hide them if they are NOT in the viewport initially.
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            entry.target.classList.remove('reveal-hidden');
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// Active Navigation on Scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Interactive Circuit Background
const canvas = document.getElementById('canvas1');
const ctx = canvas ? canvas.getContext('2d') : null;

if (canvas && ctx) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

let particlesArray;

// Handle mouse interaction
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 80) * (canvas.width / 80)
}

window.addEventListener('mousemove',
    function (event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

// Create Particle
class Particle {
    constructor(x, y, networkColor) {
        this.x = x;
        this.y = y;
        this.directionX = (Math.random() * 2) - 1;
        this.directionY = (Math.random() * 2) - 1;
        this.size = (Math.random() * 3) + 1;
        this.color = networkColor;
    }

    // Method to draw individual particle
    draw() {
        if (!ctx) return;
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.restore();
    }

    // Check particle position, check mouse position, move the particle, draw the particle
    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Check collision detection - mouse position / particle position
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 2;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 2;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 2;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 2;
            }
        }
        // Move particle
        this.x += this.directionX * 0.5; // slow speed
        this.y += this.directionY * 0.5;

        this.draw();
    }
}

// Create particle array
function init() {
    particlesArray = [];
    // Reduce particle density for smaller screens to prevent lag
    let divisor = 9000;
    if (window.innerWidth < 768) {
        divisor = 30000; // Even fewer particles on mobile for speed
    }
    let numberOfParticles = (canvas.height * canvas.width) / divisor;
    let networkColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 2) - 1;
        let directionY = (Math.random() * 2) - 1;
        let color = networkColor; // Use theme color

        particlesArray.push(new Particle(x, y, color));
    }
}

// Optimization: Pause animation when not in view
let isCanvasVisible = true;
const canvasObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        isCanvasVisible = entry.isIntersecting;
        if (isCanvasVisible) {
            // Restart animation loop when visible
            animate();
        }
    });
}, { threshold: 0.1 });

const heroSection = document.getElementById('home');
if (heroSection) canvasObserver.observe(heroSection);

// Animation Loop
let animationFrameId;
function animate() {
    if (!ctx || !isCanvasVisible) {
        cancelAnimationFrame(animationFrameId);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }

    // Mobile Performance Check: Lines are expensive (O(n^2))
    // Only connect particles on desktop
    if (window.innerWidth >= 768) {
        connect();
    }

    animationFrameId = requestAnimationFrame(animate);
}

// Check if particles are close enough to draw line
const CONNECTION_DISTANCE = 150; // Max pixels for connection
const CONNECTION_SQ = CONNECTION_DISTANCE * CONNECTION_DISTANCE;

function connect() {
    if (!ctx) return;
    let opacityValue = 1;
    let networkColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
    const rgb = hexToRgb(networkColor) || { r: 0, g: 243, b: 255 };

    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distanceSq = dx * dx + dy * dy;

            if (distanceSq < CONNECTION_SQ) {
                opacityValue = 1 - (distanceSq / CONNECTION_SQ);
                ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacityValue * 0.8})`; // Re-increased for visibility
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Helper to convert hex to rgb
function hexToRgb(hex) {
    if (!hex) return null;
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Resize event
window.addEventListener('resize',
    function () {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height / 80) * (canvas.height / 80));
        init();
    }
);

// Mouse out event
window.addEventListener('mouseout',
    function () {
        mouse.x = undefined;
        mouse.y = undefined;
    }
);

// Optimization: Delay heavy script initialization to help with mobile PageSpeed
window.addEventListener('load', () => {
    // Dynamic delay: 2.5s for mobile (to hit 90+), 500ms for desktop (to keep it instant)
    const deviceType = getDeviceType();
    const delay = deviceType === 'mobile' ? 2500 : 500;

    setTimeout(() => {
        if (canvas && ctx) {
            init();
            animate();
        }
        trackVisit();
        initSystemMonitoring();
        console.log(`Lazy scripts initialized for ${deviceType} after ${delay}ms`);
    }, delay);
});

// Visitor Counter Logic (Cloud + Local)
async function trackVisit() {
    const today = new Date().toISOString().split('T')[0];
    const visitCount = localStorage.getItem('page_visits') || 0;
    let displayedCount = parseInt(visitCount) + 1;

    // Update Local
    localStorage.setItem('page_visits', displayedCount);
    const counterElement = document.getElementById('visit-count');
    if (counterElement) {
        counterElement.innerText = displayedCount;
    }

    // Update Firebase
    try {
        const pagePath = window.location.pathname.replace(/\/$/, "") || "home";
        const deviceType = getDeviceType();

        const dailyRef = doc(db, "analytics", today);
        const globalRef = doc(db, "analytics", "global");

        await Promise.all([
            setDoc(dailyRef, { count: increment(1) }, { merge: true }),
            setDoc(globalRef, { total_visits: increment(1) }, { merge: true }),
            setDoc(doc(db, "analytics", "devices"), { [deviceType]: increment(1) }, { merge: true }),
            setDoc(doc(db, "analytics", "pages"), { [pagePath.replace(/\./g, '_')]: increment(1) }, { merge: true })
        ]);
    } catch (e) {
        console.error("Error tracking visit:", e);
    }
}

// Device detection helper
function getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet";
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "mobile";
    return "desktop";
}

// System Health Monitoring
function initSystemMonitoring() {
    window.addEventListener('error', async (event) => {
        try {
            const errorLogRef = collection(db, "system_events");
            await addDoc(errorLogRef, {
                type: 'error',
                message: event.message,
                source: event.filename,
                line: event.lineno,
                timestamp: serverTimestamp(),
                url: window.location.href,
                ua: navigator.userAgent
            });
        } catch (e) {
            console.warn("Could not log error to Firebase:", e);
        }
    });
}

// Back to Top Button Logic
const backToTopButton = document.getElementById("back-to-top");
if (backToTopButton) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    });

    backToTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// Contact Form Logic
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Rate Limiting Check
        const RATE_LIMIT_KEY = 'contact_form_timestamps';
        const MAX_MESSAGES = 3;
        const TIME_WINDOW = 60000; // 1 minute in milliseconds

        let timestamps = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');
        const now = Date.now();

        // Filter out timestamps older than the window
        timestamps = timestamps.filter(ts => now - ts < TIME_WINDOW);

        if (timestamps.length >= MAX_MESSAGES) {
            console.warn("Contact form rate limit exceeded locally.");
            alert("You are sending messages too fast! Please wait a minute before trying again.");
            return;
        }

        // Add current timestamp and save
        timestamps.push(now);
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(timestamps));

        // 2. UI Feedback - Start Loading
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        const date = new Date().toLocaleString();

        try {
            // 3. Database Operation
            const messagesCol = collection(db, 'messages');
            await addDoc(messagesCol, {
                name: name,
                email: email,
                message: message,
                date: date,
                timestamp: serverTimestamp()
            });

            // 4. Email Operation
            const PUBLIC_KEY = "LFPFxLemx1fOeOGCg";

            // Ensure initialized with Version 4+ syntax
            if (typeof emailjs !== 'undefined') {
                emailjs.init({
                    publicKey: PUBLIC_KEY,
                });
            }

            await emailjs.send('service_a9ppxid', 'template_into7hk', {
                from_name: name,
                from_email: email,
                message: message
            });

            // Success!!
            alert('Message Sent Successfully!');
            contactForm.reset();

        } catch (error) {
            console.error("Error adding document or sending email: ", error);
            if (error.message && error.message.includes("permission-denied")) {
                alert("Error: Database Permission Denied.\n\nDid you create the Firestore Database in the Console?\nDid you set the rules to 'Test Mode'?");
            } else if (error.message && error.message.includes("API has not been used")) {
                alert("Error: Firestore API Disabled.\n\nPlease enable it in the Google Cloud Console.");
            } else {
                alert('Error sending message: ' + (error.text || error.message || error));
            }
        } finally {
            // Restore UI
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
} else {
    console.error("Contact form NOT found in DOM");
}

// Mobile Menu Toggle Logic
const hamburger = document.querySelector('.hamburger');
const navLinksContainer = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');

        // Optional: Change icon to X
        const icon = hamburger.querySelector('i');
        if (navLinksContainer.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            hamburger.querySelector('i').classList.remove('fa-times');
            hamburger.querySelector('i').classList.add('fa-bars');
        });
    });
}