document.addEventListener('DOMContentLoaded', function () {
    const dropdownItems = document.querySelectorAll('.navbar ul li');

    dropdownItems.forEach(item => {
        item.addEventListener('click', function () {
            this.classList.toggle('active');
        });
    });
});
