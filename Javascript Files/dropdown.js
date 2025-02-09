document.addEventListener("DOMContentLoaded", function () {
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

    document.querySelectorAll(".show-dropdown-items").forEach((button, index) => {
        button.addEventListener("click", function(event) {
            event.stopPropagation();
            const dropdownItems = document.querySelectorAll(".dropdown-items")[index];

            document.querySelectorAll(".dropdown-items").forEach((otherDropdownItems, otherIndex) => {
                if (otherIndex !== index) {
                    otherDropdownItems.classList.remove("show-dropdown-list");
                    document.querySelectorAll("#dropdownSvg")[otherIndex].classList.remove("active-dropdownSvg");
                }
            });

            dropdownItems.classList.toggle("show-dropdown-list");
            document.querySelectorAll("#dropdownSvg")[index].classList.toggle("active-dropdownSvg");

            applyMinWidth(dropdownItems);
            setTimeout(() => adjustDropdownType(dropdownItems), 100);
        });
    });

    document.addEventListener("click", function(event) {
        document.querySelectorAll(".dropdown-items").forEach((dropdownItems, index) => {
            const dropdownSvg = document.querySelectorAll("#dropdownSvg")[index];
            if (!dropdownItems.contains(event.target) && !document.querySelectorAll(".show-dropdown-items")[index].contains(event.target)) {
                dropdownItems.classList.remove("show-dropdown-list");
                dropdownSvg.classList.remove("active-dropdownSvg");
            }
        });
    });

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

    document.querySelectorAll(".dropdown-items").forEach(applyMinWidth);

    observeDropdowns(); // Sayfa yüklendiğinde dropdown türünü kontrol et

    // **Sayfa yüklendiğinde ve ekran boyutu değiştiğinde dropdown'ları sıfırla**
    function resetDropdownsOnResize() {
        document.querySelectorAll(".dropdown-items").forEach(dropdown => {
            dropdown.classList.remove("show-dropdown-list"); // Açık olan dropdown'ları kapat
            dropdown.removeAttribute("data-type"); // Data tipini sıfırla
        });

        document.querySelectorAll("#dropdownSvg").forEach(svg => {
            svg.classList.remove("active-dropdownSvg"); // SVG ikonlarını sıfırla
        });

        observeDropdowns(); // Tekrar kontrol et
    }

    window.addEventListener("resize", resetDropdownsOnResize);
    window.addEventListener("DOMContentLoaded", observeDropdowns);
});

function adjustDropdownType(dropdown) {
    const rect = dropdown.getBoundingClientRect();
    const dropdownType = dropdown.getAttribute("data-type");

    if (rect.right > window.innerWidth) {
        if (dropdownType === "longer-dropdown-list") {
            dropdown.setAttribute("data-type", "long-dropdown-list");
        } else if (dropdownType === "long-dropdown-list") {
            dropdown.setAttribute("data-type", "med-dropdown-list");
        } else if (dropdownType === "med-dropdown-list") {
            dropdown.removeAttribute("data-type");
        }
    }
}

function observeDropdowns() {
    document.querySelectorAll(".dropdown .dropdown-items").forEach(dropdown => {
        adjustDropdownType(dropdown);
    });
}

// Sayfa yüklendiğinde, ekran yeniden boyutlandırıldığında ve kaydırıldığında çalıştır
window.addEventListener("resize", observeDropdowns);
window.addEventListener("scroll", observeDropdowns);
document.addEventListener("DOMContentLoaded", observeDropdowns);



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