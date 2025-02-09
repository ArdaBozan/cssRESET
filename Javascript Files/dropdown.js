document.addEventListener("DOMContentLoaded", function () {
    // Orijinal data-type'ları sakla ve ilk ayarlamayı yap
    document.querySelectorAll(".dropdown-items").forEach(dropdown => {
        dropdown.setAttribute('data-original-type', dropdown.getAttribute('data-type'));

        // Yeni eklenen kısım: Sayfa yüklendiğinde direkt olarak kontrol et
        const tempCheck = () => {
            // Dropdown'ın gerçek pozisyonunu ölçebilmek için geçici olarak görünür yap
            const originalStyles = {
                visibility: dropdown.style.visibility,
                opacity: dropdown.style.opacity,
                position: dropdown.style.position,
                maxHeight: dropdown.style.maxHeight,
                pointerEvents: dropdown.style.pointerEvents
            };
            
            dropdown.style.cssText = `
                visibility: visible !important;
                opacity: 1 !important;
                position: absolute !important;
                max-height: none !important;
                pointer-events: none !important;
            `;
            
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
    document.querySelectorAll("#active-search-input").forEach(input => {
        input.addEventListener("input", function () {
            const searchTerm = this.value.trim().toLowerCase();
            const dropdownItems = this.closest(".dropdown-items");
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
            const dropdownItems = document.querySelectorAll(".dropdown-items")[index];

            // Diğer dropdown'ları kapat
            document.querySelectorAll(".dropdown-items").forEach((otherDropdownItems, otherIndex) => {
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
        document.querySelectorAll(".dropdown-items").forEach((dropdownItems, index) => {
            const dropdownSvg = document.querySelectorAll("#dropdownSvg")[index];
            if (!dropdownItems.contains(event.target) && !document.querySelectorAll(".show-dropdown-items")[index].contains(event.target)) {
                dropdownItems.classList.remove("show-dropdown-list");
                dropdownSvg.classList.remove("active-dropdownSvg");
            }
        });
    });

    // Dropdown öğelerine tıklandığında seçimi uygula
    document.querySelectorAll(".dropdown-items").forEach((dropdownItems, index) => {
        dropdownItems.querySelectorAll("span").forEach(span => {
            span.addEventListener("click", function () {
                dropdownItems.querySelectorAll("span").forEach(s => s.style.display = "flex");
                document.querySelectorAll(".show-dropdown-items")[index].querySelector("p").textContent = this.textContent;
                this.style.display = "none";
                dropdownItems.classList.remove("show-dropdown-list");
                document.querySelectorAll("#dropdownSvg")[index].classList.remove("active-dropdownSvg");
            });
        });
    });

    // Pencere boyutu değiştiğinde açık dropdown'ları güncelle
    window.addEventListener('resize', () => {
        document.querySelectorAll('.dropdown-items.show-dropdown-list').forEach(dropdown => {
            dropdown.setAttribute('data-type', dropdown.getAttribute('data-original-type'));
            adjustColumnsBasedOnScreen(dropdown);
        });
    });
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


/*    HTML CODE

<div class="dropdown" title="" data-index="1">
            <label name="" id="show-dropdown-items" class="show-dropdown-items cursor" data-index="1" for="dropdown">
                <p name="">1 Column Dropdown</p>
                <svg id="dropdownSvg" class="dropdownSvg transition" width=".9em" height=".9em" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.5 0.5L5.89104 6.62403C6.29633 7.08443 7.01677 7.0748 7.40962 6.60375L12.5 0.5" stroke="black" stroke-opacity="0.5"/>
                </svg>
            </label>
            <div class="dropdown-items " data-index="1"> <!-- Increase column number by adding "data-type" -->
                                                         <!-- med-dropdown-list = 2 column
                                                              long-dropdown-list = 3 column
                                                              longer-dropdown-list = 4 column 
                                                              you can add more columns by using css (line 830) -->
                <span>Example 1</span>
                <span>Example 2</span>
                <span>Example 3</span>
                <span>Example 4</span>
            </div>
        </div>

*/