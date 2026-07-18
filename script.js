// Mobile Navigation

const hamburger =
document.getElementById("hamburger");

const navLinks =
document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

// Close menu on click

document.querySelectorAll(".nav-links a")
.forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });
});

// Cyber Glow Mouse Effect

const glow =
document.querySelector(".hero-glow");

document.addEventListener(
    "mousemove",
    (e)=>{

        const x =
        e.clientX;

        const y =
        e.clientY;

        glow.style.left =
        `${x - 250}px`;

        glow.style.top =
        `${y - 250}px`;

    }
);

/* =====================================
   SCROLL REVEAL
===================================== */

const revealItems =

document.querySelectorAll(".reveal");

const observer =

new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("active");

}
else{

entry.target.classList.remove("active");

}

});

},

{

threshold:.15,

rootMargin:"0px 0px -10% 0px"

}

);

revealItems.forEach(item=>{

observer.observe(item);

});
const counters=document.querySelectorAll("[data-counter]");

const counterObserver=new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(!entry.isIntersecting)return;

const el=entry.target;

const target=+el.dataset.counter;

let current=0;

const speed=25;

const timer=setInterval(()=>{

current+=Math.ceil(target/60);

if(current>=target){

current=target;

clearInterval(timer);

}

el.textContent=current+"+";

},speed);

counterObserver.unobserve(el);

});

});

counters.forEach(counter=>{

counterObserver.observe(counter);

});
/* ==========================
   TYPING EFFECT
========================== */

const texts = [

    "Affordable Cybersecurity for Startups",

    "Web Application Security Researcher",

    "Ethical Hacker & Security Enthusiast",

    "Future Cybersecurity Startup Founder",

    "WordPress Security Specialist"

];

let textIndex = 0;
let charIndex = 0;

const typedText =
document.getElementById(
    "typed-text"
);

function typeText() {

    if (
        charIndex <
        texts[textIndex].length
    ) {

        typedText.textContent +=
            texts[textIndex].charAt(
                charIndex
            );

        charIndex++;

        setTimeout(
            typeText,
            80
        );

    } else {

        setTimeout(
            eraseText,
            1800
        );
    }
}

function eraseText() {

    if (charIndex > 0) {

        typedText.textContent =
        texts[textIndex].substring(
            0,
            charIndex - 1
        );

        charIndex--;

        setTimeout(
            eraseText,
            40
        );

    } else {

        textIndex++;

        if (
            textIndex >=
            texts.length
        ) {
            textIndex = 0;
        }

        setTimeout(
            typeText,
            300
        );
    }
}

document.addEventListener(
    "DOMContentLoaded",
    typeText
);
/* ==========================
   PARTICLE BACKGROUND
========================== */

const canvas =
document.getElementById(
    "particles"
);

const ctx =
canvas.getContext("2d");

canvas.width =
window.innerWidth;

canvas.height =
window.innerHeight;

const particles = [];

class Particle {

    constructor() {

        this.x =
        Math.random() *
        canvas.width;

        this.y =
        Math.random() *
        canvas.height;

        this.size =
        Math.random() * 3 + 1;

        this.speedX =
        (Math.random() - 0.5) *
        0.4;

        this.speedY =
        (Math.random() - 0.5) *
        0.4;
    }

    update() {

        this.x += this.speedX;

        this.y += this.speedY;

        if (
            this.x > canvas.width
        ) this.x = 0;

        if (
            this.x < 0
        ) this.x = canvas.width;

        if (
            this.y > canvas.height
        ) this.y = 0;

        if (
            this.y < 0
        ) this.y = canvas.height;
    }

    draw() {

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
        "rgba(0,212,255,0.8)";

        ctx.fill();
    }
}

const particleCount =
window.innerWidth < 768
? 50
: 120;

for(
    let i = 0;
    i < particleCount;
    i++
) {

    particles.push(
        new Particle()
    );
}

function animateParticles() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    particles.forEach(
        particle => {

        particle.update();

        particle.draw();

    });

    requestAnimationFrame(
        animateParticles
    );
}

animateParticles();

window.addEventListener(
    "resize",
    () => {

    canvas.width =
    window.innerWidth;

    canvas.height =
    window.innerHeight;

});
/* ===================================
   3D TILT
=================================== */

const cards =
document.querySelectorAll(".tilt-card");

cards.forEach(card=>{

card.addEventListener("mousemove",e=>{

const rect =
card.getBoundingClientRect();

const x =
e.clientX-rect.left;

const y =
e.clientY-rect.top;

const centerX =
rect.width/2;

const centerY =
rect.height/2;

const rotateX =
-(y-centerY)/12;

const rotateY =
(x-centerX)/12;

card.style.transform=`

perspective(1200px)

rotateX(${rotateX}deg)

rotateY(${rotateY}deg)

scale3d(1.03,1.03,1.03)

`;

const glare=
card.querySelector(".card-glare");

const xPercent=
(x/rect.width)*100;

const yPercent=
(y/rect.height)*100;

glare.style.background=`

radial-gradient(

circle at

${xPercent}% ${yPercent}%,

rgba(255,255,255,.22),

transparent 55%

)

`;

});

card.addEventListener("mouseleave",()=>{

card.style.transform=`

perspective(1200px)

rotateX(0)

rotateY(0)

scale(1)

`;

});

});

/* ===================================
   TOUCH DEVICES
=================================== */

if(

window.matchMedia("(pointer:coarse)").matches

){

cards.forEach(card=>{

card.style.transform="none";

});

}

const form=document.getElementById("contactForm");

const status=document.getElementById("formStatus");

form.addEventListener("submit",function(e){

e.preventDefault();

let valid=true;

status.textContent="";

document.querySelectorAll(".error")
.forEach(error=>error.textContent="");

const name=document.getElementById("name");

const email=document.getElementById("email");

const service=document.getElementById("service");

const message=document.getElementById("message");

if(name.value.trim().length<2){

showError(name,"Please enter your full name.");

valid=false;

}

const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!emailPattern.test(email.value.trim())){

showError(email,"Enter a valid email address.");

valid=false;

}

if(service.value===""){

showError(service,"Please select a service.");

valid=false;

}

if(message.value.trim().length<20){

showError(message,"Please provide more project details.");

valid=false;

}

if(!valid){

return;

}

const button=form.querySelector("button");

button.disabled=true;

button.textContent="Sending...";

setTimeout(()=>{

button.disabled=false;

button.textContent="Send Inquiry";

status.textContent=
"Thank you! Your inquiry has been recorded. Connect EmailJS or your backend to deliver messages.";

form.reset();

},1200);

});

function showError(field,message){

field.parentElement
.querySelector(".error")
.textContent=message;

}
/* =====================================
   INTERSECTION OBSERVER
===================================== */

const animatedElements =

document.querySelectorAll(

'.animate-fade, .animate-fade-up, .animate-slide-up, .animate-scale'

);

const animationObserver =

new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("active");

animationObserver.unobserve(entry.target);

}

});

},

{

threshold:.15

}

);

animatedElements.forEach(el=>{

animationObserver.observe(el);

});

/* =====================================
   PARALLAX HERO
===================================== */

const hero =

document.querySelector(".hero");

window.addEventListener(

"scroll",

()=>{

const y=

window.scrollY;

hero.style.backgroundPositionY=

`${y*.2}px`;

}

);

/* =====================================
   NAVBAR SHRINK
===================================== */

const navbar=

document.querySelector(".navbar");

window.addEventListener(

"scroll",

()=>{

navbar.classList.toggle(

"scrolled",

window.scrollY>40

);

});

/* =====================================
   BUTTON RIPPLE
===================================== */

document.querySelectorAll(

".btn-primary,.btn-secondary"

).forEach(button=>{

button.addEventListener(

"click",

function(e){

const ripple=

document.createElement("span");

const rect=

this.getBoundingClientRect();

const size=

Math.max(rect.width,rect.height);

ripple.style.width=

`${size}px`;

ripple.style.height=

`${size}px`;

ripple.style.left=

`${e.clientX-rect.left-size/2}px`;

ripple.style.top=

`${e.clientY-rect.top-size/2}px`;

ripple.className="ripple";

this.appendChild(ripple);

setTimeout(()=>{

ripple.remove();

},600);

});

});