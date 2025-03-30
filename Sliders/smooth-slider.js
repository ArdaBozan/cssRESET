const pureflowcss_Sliders = document.querySelectorAll('.pureflowcss-smooth-slider-container');

pureflowcss_Sliders.forEach((slider) => {
  let isDragging = false;
  let startX, scrollLeft;
  const maxScroll = slider.scrollWidth - slider.clientWidth;

  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    slider.classList.add('dragging');
    slider.style.scrollSnapType = 'none';
    slider.style.scrollBehavior = 'auto';
    
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    let newScroll = scrollLeft - walk;

    // Sonsuz döngü mantığı
    if (newScroll > maxScroll) {
      newScroll = newScroll - maxScroll - slider.clientWidth;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = newScroll + slider.clientWidth;
    } else if (newScroll < 0) {
      newScroll = maxScroll + newScroll;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = newScroll - slider.clientWidth;
    }

    slider.scrollLeft = newScroll;
  });

  const endDrag = () => {
    isDragging = false;
    slider.classList.remove('dragging');
    slider.style.scrollSnapType = 'x mandatory';
    slider.style.scrollBehavior = 'smooth';

    // Son elemana yakınsa başa, başa yakınsak sona atla
    const currentScroll = slider.scrollLeft;
    const itemWidth = slider.clientWidth;
    const targetIndex = Math.round(currentScroll / itemWidth);
    
    if (targetIndex >= slider.childElementCount) {
      slider.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (targetIndex < 0) {
      slider.scrollTo({ left: maxScroll, behavior: 'smooth' });
    }
  };

  slider.addEventListener('mouseup', endDrag);
  slider.addEventListener('mouseleave', endDrag);
});