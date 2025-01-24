function validateNumberInput(input) {
    // Girilen değeri filtrele, sadece rakamları kabul et
    input.value = input.value.replace(/[^0-9]/g, '');
    
    // Maksimum 5 karaktere izin ver
    if (input.value.length > 5) {
        input.value = input.value.slice(0, 5);
    }
}