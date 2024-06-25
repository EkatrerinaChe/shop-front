document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.getElementById('burger-menu');
    const sidebar = document.getElementById('sidebar');

    burgerMenu.addEventListener('click', function() {
        sidebar.classList.toggle('show-menu');
    });
});
