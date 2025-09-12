document.addEventListener('DOMContentLoaded', function() {
    // Código para la funcionalidad del sitio web global

    // Ejemplo: Añadir una clase a la barra de navegación al hacer scroll para un efecto de "encabezado pegajoso"
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }

    // Puedes añadir más lógica aquí, como:
    // - Animaciones al hacer scroll.
    // - Lógica para un modal global.
    // - Funcionalidad para un botón de "volver arriba".

    (function () {
  const SRC = '/assets/data/portfolio/projects.json';

  // Obtiene una imagen desde el objeto del proyecto, sea string o { webp, jpg, src, alt }
  function pickImage(item) {
    if (!item) return { src: '', alt: 'Proyecto' };
    if (item.imagen_min) {
      return { src: item.imagen_min, alt: item.imagen_alt || item.titulo || item.title || item.name || 'Proyecto' };
    }
    if (typeof item.image === 'string') {
      return { src: item.image, alt: item.image_alt || item.title || item.name || 'Proyecto' };
    }
    if (item.image && typeof item.image === 'object') {
      return {
        src: item.image.webp || item.image.jpg || item.image.src || '',
        alt: item.image.alt || item.image_alt || item.title || item.name || 'Proyecto'
      };
    }
    if (Array.isArray(item.images) && item.images.length) {
      const first = item.images[0];
      if (typeof first === 'string') return { src: first, alt: item.title || item.name || 'Proyecto' };
      if (typeof first === 'object') {
        return { src: first.webp || first.jpg || first.src || '', alt: first.alt || 'Proyecto' };
      }
    }
    return { src: '', alt: item.title || item.name || item.titulo || 'Proyecto' };
  }

  function cardHTML(item) {
    const title   = item.title || item.name || item.titulo || item.nombre || '';
    const excerpt = item.excerpt || item.description || item.summary || item.descripcion || '';
    const urlSlug = item.slug || item.id || '';
    const url     = item.url || item.link || (urlSlug ? `portfolio/${urlSlug}.html` : '#');
    const img     = pickImage(item);
    const categories = (item.categoria || item.categories || [])
      .map(cat => `<span class="badge bg-primary mb-2">${cat}</span>`)
      .join('');

    return `
      <article class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden project-card">
        ${img.src ? `<img src="${img.src}" class="card-img-top" alt="${img.alt}" loading="lazy">` : ``}
        <div class="card-body p-4 text-center">
          ${categories}
          ${title ? `<h3 class="card-title fw-bold fs-5">${title}</h3>` : ``}
          ${excerpt ? `<p class="card-text text-muted">${excerpt}</p>` : ``}
          ${url ? `<a href="${url}" class="btn btn-outline-primary btn-sm">Ver proyecto</a>` : ``}
        </div>
      </article>
    `;
  }

  async function loadProjects(selector, { src = SRC, limit = null } = {}) {
    const grid = document.querySelector(selector);
    if (!grid) return;

    try {
      const res = await fetch(src, { cache: 'no-store' });
      const data = await res.json();
      const items = Array.isArray(data) ? data : (data.projects || data.proyectos || data.items || []);
      if (!Array.isArray(items)) return;

      (limit ? items.slice(0, limit) : items).forEach(item => {
        const col = document.createElement('div');
        const categories = item.categoria || item.categories || [];
        col.className = 'col project-item ' + categories.join(' ');
        col.innerHTML = cardHTML(item);
        grid.appendChild(col);
      });
    } catch (err) {
      console.error('Error cargando projects.json:', err);
    }
  }

  window.loadProjects = loadProjects;
})();

});

