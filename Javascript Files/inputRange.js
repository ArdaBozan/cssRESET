const priceRange = document.getElementById('priceRange');
const priceLabel = document.getElementById('priceLabel');

// Function to update the label and its position
function updatePriceLabel() {
    const value = priceRange.value;
    priceLabel.textContent = `${value} $`;

    // Adjust the label position based on the range value
    const rangeWidth = priceRange.offsetWidth;
    const thumbWidth = 1; // Adjust to match your thumb width
    const offset = (value / priceRange.max) * rangeWidth - thumbWidth / 2;
    priceLabel.style.left = `${offset}px`;

    // Update the background color of the range slider
    const percent = (value / priceRange.max) * 100;
    priceRange.style.background = `linear-gradient(to right, var(--input-range-color) ${percent}%, var(--input-range-null-color) ${percent}%)`; // Set colors
}

// Event listener for input change
priceRange.addEventListener('input', updatePriceLabel);

// Call the function once to set the initial position and value
updatePriceLabel();



/*
 <div class="price-range-area grid gap-50">
            <p class="maxPrice-txt fw-semi-bold">Price<span class="fw-normal">()</span></p>
            <div class="grid price-range-container">
                <div class="price-text flex" style="position: relative;">
                    <p id="priceLabel" name="priceP" style="white-space: nowrap; position: absolute; transform: translateX(-50%);"></p>
                </div>
                <input class="cursor" type="range" id="priceRange" min="0" max="12000" value="12000" step="100">
            </div>
        </div>
*/