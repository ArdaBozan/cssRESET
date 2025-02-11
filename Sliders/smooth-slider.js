document.querySelectorAll('.smooth-slider-container').forEach((slider) => {
    let isDragging = false;
    let startX, scrollLeft;
    let velocity = 0;
    let lastX, lastTime;
    let momentumID;
  
    const startDragging = (pageX) => {
      isDragging = true;
      slider.classList.add('grabbing');
      startX = pageX;
      scrollLeft = slider.scrollLeft;
      velocity = 0;
      lastX = pageX;
      lastTime = Date.now();
      cancelMomentumScroll();
    };
  
    const stopDragging = () => {
      isDragging = false;
      slider.classList.remove('grabbing');
      beginMomentumScroll();
    };
  
    const onDrag = (pageX) => {
      if (!isDragging) return;
      const deltaX = pageX - startX;
      slider.scrollLeft = scrollLeft - deltaX;
  
      // Hızı hesapla
      const now = Date.now();
      const deltaTime = now - lastTime;
      velocity = (pageX - lastX) / deltaTime;
      lastX = pageX;
      lastTime = now;
    };
  
    const beginMomentumScroll = () => {
      cancelMomentumScroll();
      momentumID = requestAnimationFrame(momentumScroll);
    };
  
    const cancelMomentumScroll = () => {
      cancelAnimationFrame(momentumID);
    };
  
    const momentumScroll = () => {
      if (Math.abs(velocity) < 0.01) return;
      slider.scrollLeft -= velocity * 50; // Kaydırma miktarını hızla çarpıyoruz
      velocity *= 0.95; // Sürtünme etkisi
      momentumID = requestAnimationFrame(momentumScroll);
    };
  
    // Mouse Olayları
    slider.addEventListener('mousedown', (e) => startDragging(e.pageX));
    slider.addEventListener('mouseup', stopDragging);
    slider.addEventListener('mouseleave', stopDragging);
    slider.addEventListener('mousemove', (e) => onDrag(e.pageX));
  
    // Dokunmatik Olaylar
    slider.addEventListener('touchstart', (e) => startDragging(e.touches[0].pageX));
    slider.addEventListener('touchend', stopDragging);
    slider.addEventListener('touchmove', (e) => onDrag(e.touches[0].pageX));
  });
  