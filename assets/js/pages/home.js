document.addEventListener('DOMContentLoaded', function() {

    // --- Carga dinámica de Proyectos en la página de inicio ---
    if (window.loadProjects) {
        loadProjects('#home-projects-list', { limit: 3 });
    }

    // --- Carga dinámica de Colaboradores ---
    const collaboratorsList = document.getElementById('collaborators-list');
    const itemsPerSlide = 3;

    fetch('assets/data/colaboradores/colaboradores.json')
        .then(response => response.json())
        .then(data => {
            const collaborators = data.colaboradores;
            let slideIndex = 0;

            while (slideIndex < collaborators.length) {
                const isFirstSlide = slideIndex === 0;
                const carouselItem = document.createElement('div');
                carouselItem.className = `carousel-item ${isFirstSlide ? 'active' : ''}`;

                const row = document.createElement('div');
                row.className = 'row g-4';

                for (let i = 0; i < itemsPerSlide; i++) {
                    const collaborator = collaborators[slideIndex + i];
                    if (collaborator) {
                        const socialLinks = Object.keys(collaborator.social).map(platform => `
                            <a href="${collaborator.social[platform]}" class="text-decoration-none text-dark me-2">
                                <i class="bi bi-${platform}"></i>
                            </a>
                        `).join('');

                        const collaboratorCardHTML = `
                            <div class="col-md-4 text-center">
                                <div class="p-4 rounded-4 shadow-sm border h-100 collaborator-card">
                                    <img src="${collaborator.imagen}" alt="Foto de ${collaborator.nombre}" class="img-fluid rounded-circle mb-3" style="width: 120px; height: 120px; object-fit: cover;">
                                    <h3 class="fw-bold fs-5">${collaborator.nombre}</h3>
                                    <p class="text-muted">${collaborator.puesto}</p>
                                    ${socialLinks}
                                </div>
                            </div>
                        `;
                        row.innerHTML += collaboratorCardHTML;
                    }
                }

                carouselItem.appendChild(row);
                collaboratorsList.appendChild(carouselItem);
                slideIndex += itemsPerSlide;
            }
        })
        .catch(error => console.error('Error al cargar colaboradores:', error));
});
