const wrapper = document.querySelector('.carousel-wrapper');
const slides = Array.from(document.querySelectorAll('.carousel-wrapper .slide'));
const nextBtn = document.querySelector('#nextBtn');
const prevBtn = document.querySelector('#prevBtn');
const dots = Array.from(document.querySelectorAll('.dots .dot'));

let counter = 0;
const totalSlides = slides.length;
let autoplayInterval = null;
const AUTOPLAY_DELAY = 3000;

function updateCarousel() {
    wrapper.style.transform = `translateX(-${counter * 100}%)`;

    // accessibility: mark slides hidden/visible
    slides.forEach((s, i) => {
        s.setAttribute('aria-hidden', i === counter ? 'false' : 'true');
    });

    // Update Active Dot and aria-current
    dots.forEach((d, i) => {
        d.classList.toggle('active', i === counter);
        if (i === counter) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
    });
}

function nextSlide() {
    counter = (counter + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    counter = (counter - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        counter = index;
        updateCarousel();
        resetAutoplay();
    });
});

// Initialize
updateCarousel();

// Autoplay with pause on hover
function startAutoplay() {
    if (autoplayInterval) return;
    autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
}

function stopAutoplay() {
    if (!autoplayInterval) return;
    clearInterval(autoplayInterval);
    autoplayInterval = null;
}

function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
}

const container = document.querySelector('.carousel-container');
if (container) {
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { nextSlide(); resetAutoplay(); }
    if (e.key === 'ArrowLeft') { prevSlide(); resetAutoplay(); }
});

// Start autoplay
startAutoplay();