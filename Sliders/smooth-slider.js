const slider = document.querySelector('.smooth-slider-container');

let isDragging = false;
let startX, scrollLeft;

// Sürükleme başladığında
slider.addEventListener('mousedown', (e) => {
  isDragging = true;
  slider.classList.add('dragging');
  // Sürükleme esnasında snap ve smooth davranışını kapatıyoruz:
  slider.style.scrollSnapType = 'none';
  slider.style.scrollBehavior = 'auto';
  
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});

// Fare slider dışına çıktığında
slider.addEventListener('mouseleave', () => {
  isDragging = false;
  slider.classList.remove('dragging');
  // Bırakıldığında eski ayarları geri yüklüyoruz
  slider.style.scrollSnapType = 'x mandatory';
  // Eğer isterseniz burada scroll-behavior'i smooth yapabilirsiniz:
  slider.style.scrollBehavior = 'smooth';
});

// Fare bırakıldığında
slider.addEventListener('mouseup', () => {
  isDragging = false;
  slider.classList.remove('dragging');
  // Bırakıldığında eski snap ve smooth davranışını geri yüklüyoruz
  slider.style.scrollSnapType = 'x mandatory';
  slider.style.scrollBehavior = 'smooth';
});

// Sürükleme (mousemove) sırasında
slider.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault(); // Tarayıcının varsayılan davranışını engelle
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 2; // Kaydırma hassasiyeti; dilediğiniz gibi ayarlayabilirsiniz
  slider.scrollLeft = scrollLeft - walk;
});
