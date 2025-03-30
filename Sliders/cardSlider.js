const containers = document.querySelectorAll('.pureflowcss-card-slider-container-parent');

containers.forEach((container) => {
    let isDragging = false;
    let startX;
    let scrollLeft;
    let moved = false; // Kullanıcının sürükleme yapıp yapmadığını kontrol eden değişken

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        moved = false; // Başlangıçta hareket edilmediğini varsayıyoruz
        container.classList.add('dragging');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
        isDragging = false;
        container.classList.remove('dragging');
    });

    container.addEventListener('mouseup', () => {
        isDragging = false;
        container.classList.remove('dragging');
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        if (Math.abs(walk) > 5) moved = true; // Eğer yeterli mesafe hareket edildiyse, tıklama engellenecek
        container.scrollLeft = scrollLeft - walk;
    });

    // .pureflowcss-card-slider-card içindeki img etiketlerine müdahale et
    container.querySelectorAll('.pureflowcss-card-slider-card').forEach((img) => {
        // İlk başta inline onclick özelliğinden yönlendirme URL'sini çekiyoruz
        let targetUrl = "";
        const onclickAttr = img.getAttribute('onclick');
        if (onclickAttr) {
            // window.location.href = '...'; yapısını düzenli ifade ile ayrıştırıyoruz
            const match = onclickAttr.match(/window\.location\.href\s*=\s*['"]([^'"]+)['"]/);
            if (match && match[1]) {
                targetUrl = match[1];
            }
        }
        
        // Orijinal onclick özelliğini kaldırıyoruz
        img.removeAttribute('onclick');

        // Yeni click olayını ekliyoruz
        img.addEventListener('click', (e) => {
            if (moved) {
                // Eğer sürükleme yapıldıysa, tıklamayı iptal ediyoruz
                e.preventDefault();
            } else {
                // Eğer URL varsa yönlendirme yapıyoruz
                if (targetUrl) {
                    window.location.href = targetUrl;
                }
            }
        });
    });

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
