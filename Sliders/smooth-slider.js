const slider = document.querySelector('.smooth-slider-container');

let isDragging = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
  isDragging = true;
  slider.classList.add('active');
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', () => {
  isDragging = false;
  slider.classList.remove('active');
});

slider.addEventListener('mouseup', () => {
  isDragging = false;
  slider.classList.remove('active');
});

slider.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 2;
  slider.scrollLeft = scrollLeft - walk;
});

// Touch olayları
slider.addEventListener('touchstart', (e) => {
  isDragging = true;
  startX = e.touches[0].pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
}, { passive: true });

slider.addEventListener('touchend', () => {
  isDragging = false;
}, { passive: true });

slider.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.touches[0].pageX - slider.offsetLeft;
  const walk = (x - startX) * 2;
  slider.scrollLeft = scrollLeft - walk;
}, { passive: false });
