// --- Sbrilluccichii bianchi sulla pagina (Y2K style) ---
(function () {
    const SPARKLE_CHARS = ['✦', '✧', '★', '☆', '✵', '❋', '✿', '✽', '·', '⋆'];
    const COLORS = ['#ffffff', '#ffffffcc', '#fff0f5', '#ffe0ef', '#f8f0ff'];
    let active = [];

    function spawn() {
        // Posizione casuale sulla finestra visibile
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        if (active.length > 60) {
            let old = active.shift();
            if (old.el.parentNode) old.el.remove();
        }

        const el = document.createElement('span');
        el.className = 'sparkle';
        el.textContent = SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)];
        el.style.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        el.style.fontSize = (8 + Math.random() * 16) + 'px';
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        document.body.appendChild(el);

        const vx = (Math.random() - 0.5) * 1.2;
        const vy = -0.5 - Math.random() * 1.0; // salgono leggermente
        active.push({ el, x, y, vx, vy, life: 1.0 });
    }

    // Genera nuovi sbrilluccichii a intervalli casuali
    function scheduleNext() {
        const delay = 80 + Math.random() * 120; // ogni ~80-200ms
        setTimeout(() => {
            spawn();
            scheduleNext();
        }, delay);
    }
    scheduleNext();

    // Animazione: fade + movimento
    function tick() {
        for (let i = active.length - 1; i >= 0; i--) {
            const s = active[i];
            s.x += s.vx;
            s.y += s.vy;
            s.life -= 0.018;
            if (s.life <= 0) {
                s.el.remove();
                active.splice(i, 1);
            } else {
                s.el.style.left = s.x + 'px';
                s.el.style.top = s.y + 'px';
                s.el.style.opacity = s.life;
                s.el.style.transform = `scale(${s.life}) rotate(${(1 - s.life) * 180}deg)`;
            }
        }
        requestAnimationFrame(tick);
    }
    tick();
})();
