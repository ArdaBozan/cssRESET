document.querySelector('.showAlerts').addEventListener('click', function() {
    const alertContainers = document.querySelectorAll('.alertContainer');

    alertContainers.forEach(alert => {
        alert.classList.add('show-alertContainer');
    });

    setTimeout(() => {
        alertContainers.forEach(alert => {
            alert.classList.remove('show-alertContainer');
        });
    }, 3000); // 2 seconds (Adjust timing here)
});
