// Sağa kenar çarpışma kontrolünü sağlayan fonksiyon
function checkDropdownCollision(dropdownItems) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const isIntersectingRightEdge = entry.boundingClientRect.right > window.innerWidth;
            
            if (isIntersectingRightEdge) {
                if (dropdownItems.getAttribute("data-type") === "longer-dropdown-list") {
                    dropdownItems.setAttribute("data-type", "long-dropdown-list");
                } else if (dropdownItems.getAttribute("data-type") === "long-dropdown-list") {
                    dropdownItems.setAttribute("data-type", "med-dropdown-list");
                } else if (dropdownItems.getAttribute("data-type") === "med-dropdown-list") {
                    dropdownItems.removeAttribute("data-type");
                }
            }
        });
    }, { threshold: 1.0 });
    
    observer.observe(dropdownItems);
}

// En uzun karakter uzunluğunu bul, 1 ekle ve ch sınıfını ekle
function applyMinWidth(dropdownItems) {
    const spans = dropdownItems.querySelectorAll("span");
    let maxTextLength = 0;

    // En uzun karakter uzunluğunu bul
    spans.forEach(span => {
        maxTextLength = Math.max(maxTextLength, span.textContent.length);
    });

    // Mevcut "ch" sınıfını kaldır
    dropdownItems.classList.forEach(className => {
        if (className.startsWith("ch")) {
            dropdownItems.classList.remove(className);
        }
    });

    // En uzun karakter uzunluğuna +1 ekle
    const minWidthValue = maxTextLength + 2;

    // Yeni ch sınıfını ekle
    dropdownItems.classList.add(`ch${minWidthValue}`);

    // min-width değerini span öğelerine uygula
    spans.forEach(span => {
        span.style.minWidth = `${minWidthValue}ch`;
    });

    // Dropdown sağ kenar çarpışma kontrolünü burada çağır
    checkDropdownCollision(dropdownItems);
}

// Dropdown butonlarına tıklanıldığında sınıf ekleme ve kaldırma
document.querySelectorAll(".show-dropdown-items").forEach((button, index) => {
    button.addEventListener("click", function(event) {
        event.stopPropagation();
        const dropdownItems = document.querySelectorAll(".dropdown-items")[index];

        // Diğer dropdownları kapat
        document.querySelectorAll(".dropdown-items").forEach((otherDropdownItems, otherIndex) => {
            if (otherIndex !== index) {
                otherDropdownItems.classList.remove("show-dropdown-list");
                document.querySelectorAll("#dropdownSvg")[otherIndex].classList.remove("active-dropdownSvg");
            }
        });

        // Seçilen dropdown'u aç veya kapa
        dropdownItems.classList.toggle("show-dropdown-list");
        document.querySelectorAll("#dropdownSvg")[index].classList.toggle("active-dropdownSvg");

        // min-width uygulamasını burada çağır
        applyMinWidth(dropdownItems);
    });
});

// Sayfanın herhangi bir yerine tıklanıldığında sınıfı kaldırma
document.addEventListener("click", function(event) {
    document.querySelectorAll(".dropdown-items").forEach((dropdownItems, index) => {
        const dropdownSvg = document.querySelectorAll("#dropdownSvg")[index];

        if (!dropdownItems.contains(event.target) && 
            !document.querySelectorAll(".show-dropdown-items")[index].contains(event.target)) {
            dropdownItems.classList.remove("show-dropdown-list");
            dropdownSvg.classList.remove("active-dropdownSvg");
        }
    });
});

// Dropdown içindeki span öğelerine tıklanıldığında seçilen değeri yazdırma ve döngü sağlama
document.querySelectorAll(".dropdown-items").forEach((dropdownItems, index) => {
    dropdownItems.querySelectorAll("span").forEach(function(span) {
        span.addEventListener("click", function() {
            dropdownItems.querySelectorAll("span").forEach(s => s.style.display = "flex");

            document.querySelectorAll(".show-dropdown-items")[index].querySelector("p").textContent = this.textContent;

            this.style.display = "none";

            dropdownItems.classList.remove("show-dropdown-list");
            document.querySelectorAll("#dropdownSvg")[index].classList.remove("active-dropdownSvg");
        });
    });
});

// Sayfa yüklendiğinde tüm dropdownlar için min-width uygula
document.querySelectorAll(".dropdown-items").forEach(applyMinWidth);



/*
<div class="dropdown" title="" data-index="1">
    <label name="" id="show-dropdown-items" class="show-dropdown-items cursor" data-index="1" for="dropdown">
        <p name=""></p>
        <svg id="dropdownSvg" class="dropdownSvg transition" width=".9em" height=".9em" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.5 0.5L5.89104 6.62403C6.29633 7.08443 7.01677 7.0748 7.40962 6.60375L12.5 0.5" stroke="black" stroke-opacity="0.5"/>
        </svg>
    </label>
    <div class="dropdown-items " data-index="1">
        <span></span>
    </div>
</div>  
*/