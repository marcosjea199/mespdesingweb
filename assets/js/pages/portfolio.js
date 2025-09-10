document.addEventListener('DOMContentLoaded', function() {
    const projectListContainer = document.getElementById('project-list');
    const filterButtons = document.querySelectorAll('.portfolio-gallery .btn[data-filter]');

    // Función para renderizar los proyectos en el HTML
    function renderProjects(projects) {
        projectListContainer.innerHTML = ''; // Limpiar el contenedor
        projects.forEach(project => {
            const categories = project.categoria.map(cat => `<span class="badge bg-primary mb-2">${cat}</span>`).join('');
            const projectCardHTML = `
                <div class="col project-item ${project.categoria.join(' ')}">
                    <a href="portfolio/${project.id}.html" class="text-decoration-none">
                        <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden project-card">
                            <img src="${project.imagen_min}" class="card-img-top" alt="Captura de pantalla del ${project.titulo}">
                            <div class="card-body p-4">
                                ${categories}
                                <h3 class="card-title fw-bold">${project.titulo}</h3>
                                <p class="card-text text-muted">${project.descripcion}</p>
                            </div>
                        </div>
                    </a>
                </div>
            `;
            projectListContainer.insertAdjacentHTML('beforeend', projectCardHTML);
        });
    }

    // Cargar los datos desde el archivo JSON
    fetch('assets/data/portfolio/projects.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo projects.json');
            }
            return response.json();
        })
        .then(data => {
            const allProjects = data.proyectos;
            renderProjects(allProjects); // Renderizar todos los proyectos inicialmente

            // Añadir funcionalidad de filtrado
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');

                    const filterValue = this.getAttribute('data-filter');
                    
                    if (filterValue === 'all') {
                        renderProjects(allProjects);
                    } else {
                        const filteredProjects = allProjects.filter(project => project.categoria.includes(filterValue));
                        renderProjects(filteredProjects);
                    }
                });
            });
        })
        .catch(error => console.error('Error al cargar los proyectos:', error));
});