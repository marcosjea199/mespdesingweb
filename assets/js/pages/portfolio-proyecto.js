document.addEventListener('DOMContentLoaded', function() {
    // Obtener el ID de la página del atributo data-page-id en el body
    const pageId = document.body.dataset.pageId;
    const mainContent = document.getElementById('project-main-content');

    if (!pageId || !mainContent) {
        console.error("No se pudo encontrar el ID de la página o el contenedor principal.");
        return;
    }

    // Cargar los datos del proyecto desde el archivo JSON
    fetch(`../../assets/data/portfolio/${pageId}-data.json`)
        .then(response => {
            if (!response.ok) {
                // Si el archivo no existe, redirigir a la página 404
                window.location.href = '../../404.html';
                throw new Error('Proyecto no encontrado');
            }
            return response.json();
        })
        .then(project => {
            // Renderizar la sección de héroe
            const heroSection = `
                <section class="project-hero py-5">
                    <div class="container text-center">
                        <span class="badge bg-primary mb-3">${project.categoria.join(' / ')}</span>
                        <h1 class="display-4 fw-bold mb-2">${project.titulo}</h1>
                        <p class="lead text-muted">${project.subtitulo}</p>
                        <div class="project-meta mt-4">
                            <span class="me-3 text-muted"><strong>Cliente:</strong> ${project.cliente}</span>
                            <span class="me-3 text-muted"><strong>Fecha:</strong> ${project.fecha}</span>
                            <a href="${project.url_proyecto}" class="btn btn-outline-primary btn-sm mt-3 mt-md-0" target="_blank">
                                Ver Proyecto
                            </a>
                        </div>
                    </div>
                </section>
                <img src="${project.secciones[0].imagen_url}" class="img-fluid hero-image" alt="Imagen principal del proyecto">
            `;
            
            // Renderizar las secciones de contenido dinámico
            let contentSections = '';
            for (let i = 0; i < project.secciones.length; i++) {
                const section = project.secciones[i];
                contentSections += `
                    <section class="project-section py-5">
                        <div class="container">
                            <div class="row align-items-center">
                                <div class="col-lg-6 ${i % 2 !== 0 ? 'order-lg-2' : ''} mb-4 mb-lg-0">
                                    <h2 class="fw-bold mb-3">${section.titulo_seccion}</h2>
                                    <p class="lead">${section.descripcion}</p>
                                </div>
                                <div class="col-lg-6 ${i % 2 !== 0 ? 'order-lg-1' : ''}">
                                    <img src="${section.imagen_url}" class="img-fluid rounded shadow-sm" alt="Detalle del proyecto">
                                </div>
                            </div>
                        </div>
                    </section>
                `;
            }

            // Insertar el contenido en el DOM
            mainContent.innerHTML = heroSection + contentSections;
        })
        .catch(error => console.error("Error al cargar los datos del proyecto:", error));
});