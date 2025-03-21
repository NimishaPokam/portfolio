document.addEventListener('DOMContentLoaded', function() {
    // Menu functionality
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

    // Dark mode functionality
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const html = document.documentElement;

    function toggleDarkMode() {
        html.classList.toggle('dark');
        localStorage.setItem('darkMode', html.classList.contains('dark'));
    }

    darkModeToggle?.addEventListener('click', toggleDarkMode);

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true' || 
        (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
    }
});