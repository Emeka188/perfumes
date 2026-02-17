const track = document.querySelector('.carousel-inner');
const slides = Array.from(track.children);
const nextButton = document.querySelector('#nextBtn');
const prevButton = document.querySelector('#prevBtn');
const dots = document.querySelectorAll('.dot');

let currentIndex = 0;

const updateCarousel = (index) => {
    // Move the "train"
    track.style.transform = `translateX(-${index * 100}%)`;
    
    // Update dots
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
    
    currentIndex = index;
};

nextButton.addEventListener('click', () => {
    let nextIndex = (currentIndex + 1) % slides.length; // Loops back to 0
    updateCarousel(nextIndex);
});

prevButton.addEventListener('click', () => {
    let prevIndex = (currentIndex - 1 + slides.length) % slides.length; // Loops to end
    updateCarousel(prevIndex);
});

// Dot Navigation Logic
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => updateCarousel(index));
});

// Auto-play (Optional but recommended)
setInterval(() => {
    nextButton.click();
}, 5000);