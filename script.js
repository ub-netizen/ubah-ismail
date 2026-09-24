// Animated background
const canvas = document.getElementById("particles-canvas");
const ctx = canvas.getContext("2d");
const particles = [];
const particleCount = 50;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(99, 102, 241, 0.3)";
        ctx.fill();
    }
}

resizeCanvas();

for (let i = 0; i < particleCount; i += 1) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        particles.slice(index + 1).forEach((otherParticle) => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 - distance / 500})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.stroke();
            }
        });
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener("resize", resizeCanvas);

// Section tabs
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

function showTab(targetTab, updateHash = true) {
    const targetContent = document.getElementById(targetTab);

    if (!targetContent) return;

    tabButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.tab === targetTab);
    });

    tabContents.forEach((content) => {
        content.classList.toggle("active", content.id === targetTab);
    });

    if (updateHash) {
        history.replaceState(null, "", `#${targetTab}`);
    }
}

tabButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();

        showTab(button.dataset.tab);

        if (window.innerWidth <= 768) {
            document.querySelector("main").scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

const requestedTab = window.location.hash.replace("#", "");

if (requestedTab) {
    showTab(requestedTab, false);
}

// Scroll progress and back-to-top button
const progressBar = document.getElementById("progressBar");
const scrollTopButton = document.getElementById("scrollTop");

function updateScrollUI() {
    const scrollTop =
        document.body.scrollTop ||
        document.documentElement.scrollTop;

    const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    progressBar.style.width = `${
        scrollHeight ? (scrollTop / scrollHeight) * 100 : 0
    }%`;

    scrollTopButton.classList.toggle("visible", scrollTop > 300);
}

window.addEventListener("scroll", updateScrollUI, {
    passive: true
});

updateScrollUI();

scrollTopButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Reveal content as it enters the viewport
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    }
);

document
    .querySelectorAll(
        ".card, .achievement-item, .activity-item, .skill-badge, .timeline-item, .highlight-card"
    )
    .forEach((element) => {
        element.style.opacity = "0";
        element.style.transform = "translateY(24px)";
        element.style.transition =
            "opacity 0.7s ease, transform 0.7s ease";

        observer.observe(element);
    });
