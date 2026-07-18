/* ============================================================
   Ghostbreachh — script.js
   No frameworks. Everything is throttled so scroll/animation
   never janks. The particle canvas from the old site was
   removed: the CSS grid + grain + glow carry the vibe at 0 CPU.
   ============================================================ */

/* ---------- Mobile nav toggle ---------- */
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
    });
});

/* ---------- Scroll reveal (one observer, reused) ---------- */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            revealObserver.unobserve(entry.target); // animate once
        }
    });
}, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ---------- Animated counters ---------- */
const counters = document.querySelectorAll("[data-counter]");
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.counter;
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 60));
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = current + "+";
        }, 25);
        counterObserver.unobserve(el);
    });
}, { threshold: 0.4 });

counters.forEach(c => counterObserver.observe(c));

/* ---------- 3D tilt on cards (fine pointers only) ---------- */
if (window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".tilt-card").forEach(card => {
        const glare = card.querySelector(".card-glare");
        card.addEventListener("mousemove", (e) => {
            const r = card.getBoundingClientRect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;
            const rx = -(y - r.height / 2) / 12;
            const ry =  (x - r.width  / 2) / 12;
            card.style.transform =
                `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`;
            if (glare) {
                glare.style.background =
                    `radial-gradient(circle at ${x/r.width*100}% ${y/r.height*100}%, rgba(255,255,255,.22), transparent 55%)`;
            }
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1200px) rotateX(0) rotateY(0) scale(1)";
        });
    });
}

/* ---------- Navbar shrink on scroll (rAF-throttled) ---------- */
/* TEACHING: scroll fires dozens of times/sec. Running code on every
   event is wasteful. We set a flag and do the work once per animation
   frame instead — this is the standard "throttle with rAF" pattern. */
const navbar = document.querySelector(".navbar");
let ticking = false;
function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
    ticking = false;
}
window.addEventListener("scroll", () => {
    if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
    }
}, { passive: true });

/* ---------- Button ripple ---------- */
document.querySelectorAll(".btn-primary, .btn-secondary").forEach(button => {
    button.addEventListener("click", function (e) {
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement("span");
        ripple.style.cssText =
            `position:absolute;width:${size}px;height:${size}px;border-radius:50%;` +
            `left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;` +
            `background:rgba(255,255,255,.35);transform:scale(0);transition:transform .5s;pointer-events:none;`;
        this.style.position = "relative"; this.style.overflow = "hidden";
        this.appendChild(ripple);
        requestAnimationFrame(() => ripple.style.transform = "scale(2.5)");
        setTimeout(() => ripple.remove(), 550);
    });
});

/* ---------- Contact form -> real mailto ---------- */
const form   = document.getElementById("contactForm");
const status = document.getElementById("formStatus");
const TO     = "ghostbreachh@gmail.com";

function showError(field, msg) {
    const err = field.parentElement.querySelector(".error");
    if (err) err.textContent = msg;
}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;
    status.textContent = "";
    document.querySelectorAll(".error").forEach(e => e.textContent = "");

    const name    = document.getElementById("name");
    const email   = document.getElementById("email");
    const service = document.getElementById("service");
    const message = document.getElementById("message");

    if (name.value.trim().length < 2)   { showError(name, "Please enter your full name."); valid = false; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) {
        showError(email, "Enter a valid email address."); valid = false;
    }
    if (service.value === "")           { showError(service, "Please select a service."); valid = false; }
    if (message.value.trim().length < 20) { showError(message, "Please provide more project details."); valid = false; }

    if (!valid) return;

    // Build a prefilled email and open the visitor's mail client.
    const subject = encodeURIComponent(`[Ghostbreachh] ${service.value} — ${name.value.trim()}`);
    const body = encodeURIComponent(
        `Name: ${name.value.trim()}\n` +
        `Email: ${email.value.trim()}\n` +
        `Company: ${document.getElementById("company").value.trim() || "—"}\n` +
        `Service: ${service.value}\n\n` +
        `${message.value.trim()}`
    );
    const mailto = `mailto:${TO}?subject=${subject}&body=${body}`;

    const btn = form.querySelector("button");
    btn.disabled = true; btn.textContent = "Opening mail…";
    // Open the mail client; falls back gracefully if none is configured.
    window.location.href = mailto;
    setTimeout(() => {
        btn.disabled = false; btn.textContent = "Send Inquiry";
        status.textContent = "Your mail app should have opened with a prefilled message. If not, email us directly at ghostbreachh@gmail.com";
        form.reset();
    }, 1200);
});
