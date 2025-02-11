const slider = document.querySelector('.smooth-slider-container');

let isDragging = false;
let startX;
let scrollLeft;

// Ortak fonksiyonlar
const startDrag = (e) => {
    isDragging = true;
    slider.classList.add('dragging');
    startX = (e.pageX || e.touches[0].pageX) - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
};

const endDrag = () => {
    isDragging = false;
    slider.classList.remove('dragging');
};

const duringDrag = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = (e.pageX || e.touches[0].pageX) - slider.offsetLeft;
    const walk = (x - startX) * 3; // Hız çarpanı
    slider.scrollLeft = scrollLeft - walk;
};

// Mouse olayları
slider.addEventListener('mousedown', startDrag);
slider.addEventListener('mouseup', endDrag);
slider.addEventListener('mouseleave', endDrag);
slider.addEventListener('mousemove', duringDrag);

// Touch olayları
slider.addEventListener('touchstart', startDrag, { passive: true });
slider.addEventListener('touchend', endDrag, { passive: true });
slider.addEventListener('touchcancel', endDrag, { passive: true });
slider.addEventListener('touchmove', duringDrag, { passive: false });