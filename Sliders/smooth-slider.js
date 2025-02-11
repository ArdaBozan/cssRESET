// Sayfadaki tüm slider container öğelerini seçiyoruz
const sliders = document.querySelectorAll('.smooth-slider-container');

sliders.forEach((slider) => {
  let isDragging = false;
  let startX, scrollLeft;

  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    slider.classList.add('dragging');
    // Sürükleme sırasında ani pozisyon güncellemesi için snap ve smooth özelliklerini kapatıyoruz
    slider.style.scrollSnapType = 'none';
    slider.style.scrollBehavior = 'auto';
    
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener('mouseleave', () => {
    isDragging = false;
    slider.classList.remove('dragging');
    // Fare slider alanından çıktığında eski ayarları geri yüklüyoruz
    slider.style.scrollSnapType = 'x mandatory';
    slider.style.scrollBehavior = 'smooth';
  });

  slider.addEventListener('mouseup', () => {
    isDragging = false;
    slider.classList.remove('dragging');
    // Fare bırakıldığında eski snap ve smooth davranışını yeniden aktarıyoruz
    slider.style.scrollSnapType = 'x mandatory';
    slider.style.scrollBehavior = 'smooth';
  });

  slider.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; // Kaydırma hassasiyetini ayarlayabilirsiniz
    slider.scrollLeft = scrollLeft - walk;
  });
});
