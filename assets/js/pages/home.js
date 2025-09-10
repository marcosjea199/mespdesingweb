document.addEventListener('DOMContentLoaded', function() {

    // --- Carga dinámica de Proyectos en la página de inicio ---
    const projectListContainer = document.getElementById('home-projects-list');

    fetch('assets/data/portfolio/projects.json')
        .then(response => response.json())
        .then(data => {
            // Mostrar solo los 3 primeros proyectos para la página de inicio
            const projectsToShow = data.proyectos.slice(0, 3); 
            projectsToShow.forEach(project => {
                const projectCardHTML = `
                    <div class="col-lg-4 mb-4">
                        <a href="portfolio/${project.id}.html" class="text-decoration-none">
                            <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden home-project-card">
                                <img src="${project.imagen_min}" class="card-img-top" alt="Captura de pantalla del ${project.titulo}">
                                <div class="card-body text-center">
                                    <h3 class="card-title fw-bold fs-5">${project.titulo}</h3>
                                    <p class="card-text text-muted">${project.descripcion}</p>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
                projectListContainer.insertAdjacentHTML('beforeend', projectCardHTML);
            });
        })
        .catch(error => console.error('Error al cargar proyectos:', error));


    // --- Carga dinámica de Colaboradores ---
    const collaboratorsList = document.getElementById('collaborators-list');

    fetch('assets/data/colaboradores/colaboradores.json')
        .then(response => response.json())
        .then(data => {
            data.colaboradores.forEach(collaborator => {
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
                collaboratorsList.insertAdjacentHTML('beforeend', collaboratorCardHTML);
            });
        })
        .catch(error => console.error('Error al cargar colaboradores:', error));

});