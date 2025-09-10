document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem('theme');
    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Función para aplicar la clase 'dark-mode'
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            toggleBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';
        } else {
            document.body.classList.remove('dark-mode');
            toggleBtn.innerHTML = '<i class="bi bi-moon-fill"></i>';
        }
    };

    // Establecer el tema al cargar la página
    if (storedTheme) {
        applyTheme(storedTheme);
    } else if (userPrefersDark.matches) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }

    // Escuchar el evento de clic en el botón
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            let currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }
});