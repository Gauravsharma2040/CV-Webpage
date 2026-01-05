const canvas = document.getElementById("particle-bg");
const ctx = canvas.getContext("2d");
const PARTICLE_COUNT = 200;
const particles = [];
let w, h;
let scrollSpeed = 0;
let lastScrollY = window.scrollY;
let targetScrollSpeed = 0;
let scrolldir = 0;
let scrolling = false;
let lastScrollTime = performance.now();
const VELOCITY_KILL_DELAY = 1500;


function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

window.addEventListener("scroll", () => {
    const currentY = window.scrollY;
    scrolldir = Math.sign(currentY - lastScrollY);
    targetScrollSpeed = Math.abs(currentY - lastScrollY);
    lastScrollY = window.scrollY;
    scrolling = true;
    lastScrollTime = performance.now();
});
for (let i = 0; i < PARTICLE_COUNT; i++) {
    const vx = (Math.random() - 0.5) * 0.25;
    const vy = (Math.random() - 0.5) * 0.25;

    particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx,
        vy,
        baseVx: vx,
        baseVy: vy,
        r: Math.random() * 1.8 + 0.6,
        depth: Math.random() * 0.8 + 0.4
    });
}
let mouse = { x: null, y: null };

window.addEventListener("click", e => {
    for (let i = 0; i < 12; i++) {
        particles.push({
            x: e.clientX,
            y: e.clientY,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            r: Math.random() * 2 + 1,
            life: 60,
            depth: Math.random() * 0.8 + 0.4
        });
    }
});



function draw() {
    ctx.clearRect(0, 0, w, h);
    scrollSpeed += (targetScrollSpeed - scrollSpeed) * 0.08;
    const now = performance.now();
    const idleTime = now - lastScrollTime;
    const killFactor = idleTime > VELOCITY_KILL_DELAY
        ? 0.96   // decay speed when idle
        : 1.0;
    if (scrollSpeed < 0.05) {
        scrolling = false;
    }
    for (let i = particles.length - 1; i >= 0; i--) {
        let dist = Infinity;
        const p = particles[i];
        window.prevScrollY = window.scrollY;

        if (p.life !== undefined) {
            p.life--;
            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }
        }
        const scrollInfluence = 1 + Math.min(scrollSpeed * 0.04, 2.5);
        p.x += p.vx * scrollInfluence * p.depth;
        p.y += p.vy * scrollInfluence * p.depth;
        const flowStrength = Math.min(scrollSpeed * 0.002, 0.08);
        p.vy += -scrolldir * flowStrength * p.depth;
        if (!scrolling && (mouse.x === null || dist > 150)) {
            p.vx += (p.baseVx - p.vx) * 0.02;
            p.vy += (p.baseVy - p.vy) * 0.02;
        }
        p.vx *= killFactor;
        p.vy *= killFactor;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34, 211, 238, 0.8)";
        ctx.shadowBlur = 8 + scrollSpeed * 0.5;
        ctx.shadowColor = "#22d3ee";
        ctx.fill();
    }
    ctx.shadowBlur = 8 + scrollSpeed * 0.5;
    ctx.shadowColor = "#22d3ee";
    requestAnimationFrame(draw);
}
ctx.shadowBlur = 0;
draw();
