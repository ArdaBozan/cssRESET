const smoothSlider = document.querySelector('.smooth-slider-container');

let isDragging = false;
let startX, scrollLeft;

smoothSlider.addEventListener('mousedown', (e) => {
  isDragging = true;
  smoothSlider.classList.add('grabbing');
  startX = e.pageX - smoothSlider.offsetLeft;
  scrollLeft = smoothSlider.scrollLeft;
});

smoothSlider.addEventListener('mouseleave', () => {
  isDragging = false;
  smoothSlider.classList.remove('grabbing');
});

smoothSlider.addEventListener('mouseup', () => {
  isDragging = false;
  smoothSlider.classList.remove('grabbing');
});

smoothSlider.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - smoothSlider.offsetLeft;
  const walk = (x - startX) * 2;
  smoothSlider.scrollLeft = scrollLeft - walk;
});

smoothSlider.addEventListener('touchstart', (e) => {
  isDragging = true;
  startX = e.touches[0].pageX - smoothSlider.offsetLeft;
  scrollLeft = smoothSlider.scrollLeft;
});

smoothSlider.addEventListener('touchend', () => {
  isDragging = false;
});

smoothSlider.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const x = e.touches[0].pageX - smoothSlider.offsetLeft;
  const walk = (x - startX) * 2;
  smoothSlider.scrollLeft = scrollLeft - walk;
});