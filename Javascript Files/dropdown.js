document.addEventListener("DOMContentLoaded", function () {
    // Dropdown içindeki aktif arama inputuna event listener ekle
    document.querySelectorAll("#active-search-input").forEach(input => {
        input.addEventListener("input", function () {
            const searchTerm = this.value.trim().toLowerCase();
            const dropdownItems = this.closest(".dropdown-items");
            const spans = dropdownItems.querySelectorAll("span");
            
            spans.forEach(span => {
                const text = span.textContent.trim().toLowerCase();
                if (searchTerm === "" || text.includes(searchTerm)) {
                    span.style.display = "flex";
                } else {
                    span.style.display = "none";
                }
            });
        });
    });

    // Mevcut dropdown açılma/kapanma işlemleri
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

            // Seçilen dropdown'u aç/kapat
            dropdownItems.classList.toggle("show-dropdown-list");
            document.querySelectorAll("#dropdownSvg")[index].classList.toggle("active-dropdownSvg");

            // min-width uygulamasını burada çağır
            applyMinWidth(dropdownItems);
        });
    });

    // Sayfanın herhangi bir yerine tıklanıldığında dropdown'ları kapat
    document.addEventListener("click", function(event) {
        document.querySelectorAll(".dropdown-items").forEach((dropdownItems, index) => {
            const dropdownSvg = document.querySelectorAll("#dropdownSvg")[index];
            if (!dropdownItems.contains(event.target) && !document.querySelectorAll(".show-dropdown-items")[index].contains(event.target)) {
                dropdownItems.classList.remove("show-dropdown-list");
                dropdownSvg.classList.remove("active-dropdownSvg");
            }
        });
    });

    // Dropdown içindeki span öğelerine tıklanıldığında seçilen değeri yazdırma
    document.querySelectorAll(".dropdown-items").forEach((dropdownItems, index) => {
        dropdownItems.querySelectorAll("span").forEach(span => {
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
});
