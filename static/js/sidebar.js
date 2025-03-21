document.addEventListener('DOMContentLoaded', function() {
    const menuTrigger = document.querySelector('.menu-trigger');
    const menuTriggerClose = document.querySelector('.menu-trigger-close');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.menu-overlay');

    function toggleMenu() {
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
    }

    menuTrigger?.addEventListener('click', toggleMenu);
    menuTriggerClose?.addEventListener('click', toggleMenu);
    overlay?.addEventListener('click', toggleMenu);
});