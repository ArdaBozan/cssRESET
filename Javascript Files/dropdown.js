document.addEventListener("DOMContentLoaded", function () {
    // Orijinal data-type'ları sakla ve ilk ayarlamayı yap
    document.querySelectorAll(".pureflowcss-dropdown-items").forEach(dropdown => {
        dropdown.setAttribute('data-original-type', dropdown.getAttribute('data-type'));

        // Sayfa yüklendiğinde direkt olarak kontrol et
        const tempCheck = () => {
            // Dropdown'ın gerçek pozisyonunu ölçebilmek için geçici olarak görünür yap
            const originalStyles = {
                visibility: dropdown.style.visibility,
                opacity: dropdown.style.opacity,
                position: dropdown.style.position,
                maxHeight: dropdown.style.maxHeight,
                pointerEvents: dropdown.style.pointerEvents
            };
            
            // Geçici stil ataması (cssText string olarak verilmelidir)
            dropdown.style.cssText = "visibility: visible !important; opacity: 1 !important; position: absolute !important; max-height: none !important; pointer-events: none !important;";
            
            // Reflow tetikle
            void dropdown.offsetHeight;
            
            // Sütun ayarlamasını yap
            adjustColumnsBasedOnScreen(dropdown);
            
            // Stilleri eski haline getir
            Object.assign(dropdown.style, originalStyles);
        };
        
        // İlk kontroller için requestAnimationFrame kullan
        window.requestAnimationFrame(tempCheck);
    });

    // Arama işlevselliği
    document.querySelectorAll("#pureflowcss-active-search-input").forEach(input => {
        input.addEventListener("input", function () {
            const searchTerm = this.value.trim().toLowerCase();
            const dropdownItems = this.closest(".pureflowcss-dropdown-items");
            const spans = dropdownItems.querySelectorAll("span");
            let matchFound = false;

            spans.forEach(span => {
                const text = span.textContent.trim().toLowerCase();
                if (searchTerm === "" || text.includes(searchTerm)) {
                    span.style.display = "flex";
                    matchFound = true;
                } else {
                    span.style.display = "none";
                }
            });

            let noMatchMessage = dropdownItems.querySelector(".no-match");
            if (!matchFound) {
                if (!noMatchMessage) {
                    noMatchMessage = document.createElement("p");
                    noMatchMessage.textContent = "No match found";
                    noMatchMessage.classList.add("no-match");
                    dropdownItems.appendChild(noMatchMessage);
                }
            } else if (noMatchMessage) {
                noMatchMessage.remove();
            }
        });
    });

    // Dropdown açma/kapama işlevselliği
    document.querySelectorAll(".show-dropdown-items").forEach((button, index) => {
        button.addEventListener("click", function (event) {
            event.stopPropagation();
            const dropdownItems = document.querySelectorAll(".pureflowcss-dropdown-items")[index];

            // Diğer dropdown'ları kapat
            document.querySelectorAll(".pureflowcss-dropdown-items").forEach((otherDropdownItems, otherIndex) => {
                if (otherIndex !== index) {
                    otherDropdownItems.classList.remove("show-dropdown-list");
                    document.querySelectorAll("#dropdownSvg")[otherIndex].classList.remove("active-dropdownSvg");
                }
            });

            // Mevcut dropdown'u aç/kapat
            dropdownItems.classList.toggle("show-dropdown-list");
            document.querySelectorAll("#dropdownSvg")[index].classList.toggle("active-dropdownSvg");

            // Orijinal data-type'ı yükle ve sütun sayısını ayarla
            dropdownItems.setAttribute('data-type', dropdownItems.getAttribute('data-original-type'));
            adjustColumnsBasedOnScreen(dropdownItems);
        });
    });

    // Dışarı tıklandığında dropdown'u kapat
    document.addEventListener("click", function (event) {
        document.querySelectorAll(".pureflowcss-dropdown-items").forEach((dropdownItems, index) => {
            const dropdownSvg = document.querySelectorAll("#dropdownSvg")[index];
            if (
                !dropdownItems.contains(event.target) &&
                !document.querySelectorAll(".show-dropdown-items")[index].contains(event.target)
            ) {
                dropdownItems.classList.remove("show-dropdown-list");
                dropdownSvg.classList.remove("active-dropdownSvg");
            }
        });
    });

    // Dropdown öğelerine tıklandığında seçimi uygula
    document.querySelectorAll(".pureflowcss-dropdown-items").forEach((dropdownItems, index) => {
        dropdownItems.querySelectorAll("span").forEach(span => {
            span.addEventListener("click", function () {
                // Tüm span'ları tekrar görünür yap
                dropdownItems.querySelectorAll("span").forEach(s => s.style.display = "flex");
                // Seçilen değeri göster
                document.querySelectorAll(".show-dropdown-items")[index].querySelector("p").textContent = this.textContent;
                // Seçilen span'ı gizle
                this.style.display = "none";
                dropdownItems.classList.remove("show-dropdown-list");
                document.querySelectorAll("#dropdownSvg")[index].classList.remove("active-dropdownSvg");
            });
        });
    });

    // Pencere boyutu veya cihaz yönü değiştiğinde açık dropdown'ları güncelle
    function updateDropdowns() {
        document.querySelectorAll('.pureflowcss-dropdown-items.show-dropdown-list').forEach(dropdown => {
            dropdown.setAttribute('data-type', dropdown.getAttribute('data-original-type'));
            adjustColumnsBasedOnScreen(dropdown);
        });
    }
    window.addEventListener('resize', updateDropdowns);
    window.addEventListener('orientationchange', updateDropdowns);
});

// Sütun sayısını ekran pozisyonuna göre ayarla
function adjustColumnsBasedOnScreen(dropdownItems) {
    const currentType = dropdownItems.getAttribute('data-type');
    const types = ['longer-dropdown-list', 'long-dropdown-list', 'med-dropdown-list'];
    let currentIndex = types.indexOf(currentType);

    if (currentIndex === -1) return; // Daha fazla azaltma yapma

    const rect = dropdownItems.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
        const nextIndex = currentIndex + 1;
        if (nextIndex < types.length) {
            dropdownItems.setAttribute('data-type', types[nextIndex]);
        } else {
            dropdownItems.removeAttribute('data-type');
        }
        adjustColumnsBasedOnScreen(dropdownItems); // Recursive kontrol
    }
}
