document.addEventListener('DOMContentLoaded', () => {
    const langBtns = document.querySelectorAll('.lang-switcher button');
    let userLang = localStorage.getItem('lang') || 'es'; // 'es' como idioma por defecto

    // Función para aplicar las traducciones
    const setLanguage = (lang) => {
        fetch(`assets/data/locales/${lang}.json`)
            .then(response => response.json())
            .then(translations => {
                document.querySelectorAll('[data-i18n]').forEach(element => {
                    const key = element.getAttribute('data-i18n');
                    if (translations[key]) {
                        element.textContent = translations[key];
                    }
                });
                localStorage.setItem('lang', lang);
            })
            .catch(error => console.error('Error loading language file:', error));
    };

    // Escuchar los clics en los botones de idioma
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
        });
    });

    // Cargar el idioma al inicio de la página
    setLanguage(userLang);
});