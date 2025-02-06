// Tüm .pureflowcss-card-slider-container-parent öğelerini seç
const containers = document.querySelectorAll('.pureflowcss-card-slider-container-parent');

// Her bir container için olayları tanımla
containers.forEach((container) => {
    let isDragging = false;
    let startX;
    let scrollLeft;

    // Mousedown olayı
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        container.classList.add('dragging');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    // Mouseleave olayı
    container.addEventListener('mouseleave', () => {
        isDragging = false;
        container.classList.remove('dragging');
    });

    // Mouseup olayı
    container.addEventListener('mouseup', () => {
        isDragging = false;
        container.classList.remove('dragging');
    });

    // Mousemove olayı
    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
    });

    // Sağ/sol ok butonları için ID ile değil, container içinde seçim yap
    const moveLeft = container.parentElement.querySelector('#moveLeft');
    const moveRight = container.parentElement.querySelector('#moveRight');

    if (moveLeft) {
        moveLeft.addEventListener('click', () => {
            container.scrollBy({
                left: -180,
                behavior: 'smooth'
            });
        });
    }

    if (moveRight) {
        moveRight.addEventListener('click', () => {
            container.scrollBy({
                left: 180,
                behavior: 'smooth'
            });
        });
    }
});
