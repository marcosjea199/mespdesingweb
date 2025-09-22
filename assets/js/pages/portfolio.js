document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('#filter-buttons .btn[data-filter]');

    if (window.loadProjects) {
        loadProjects('#project-list').then(() => {
            const allProjects = document.querySelectorAll('#project-list .project-item');

            function applyFilter(filter) {
                allProjects.forEach(item => {
                    if (filter === 'all' || item.classList.contains(filter)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }

            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    applyFilter(this.getAttribute('data-filter'));
                });
            });

            applyFilter('all');
        });
    }
});



// assets/js/pages/portfolio.js
(function () {
  // --- Utils ---
  function slugify(s='') {
    return String(s).toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  }

  function normalizeList(data) {
    if (Array.isArray(data)) return data;
    const paths = [
      ['projects'], ['items'], ['portfolio'],
      ['data','projects'], ['data','items']
    ];
    for (const path of paths) {
      let cur = data;
      for (const k of path) cur = (cur || {})[k];
      if (Array.isArray(cur)) return cur;
    }
    return [];
  }

  function resolveImage(img) {
    if (!img) return '';
    if (typeof img === 'string') return img;
    if (typeof img === 'object') return img.webp || img.jpg || img.png || img.src || '';
    return '';
  }

  function toCategories(item) {
    if (Array.isArray(item.categories)) return item.categories.map(slugify);
    if (typeof item.category === 'string') return [slugify(item.category)];
    return [];
  }

  // --- Render ---
  function renderCard(item) {
    const title   = item.title || item.name || 'Proyecto';
    const excerpt = item.excerpt || item.description || '';
    const url     = item.url || item.link || '#';
    const img     = resolveImage(item.image);
    const alt     = (item.image && item.image.alt) || title;
    const cats    = toCategories(item);      // ej: ['web','ecommerce']
    const catStr  = cats.join(' ');

    const col = document.createElement('div');
    col.className = 'col';
    col.setAttribute('data-cats', catStr);

    col.innerHTML = `
      <article class="card h-100 shadow-sm">
        ${img ? `<img src="${img}" class="card-img-top" alt="${alt}" loading="lazy">` : ''}
        <div class="card-body d-flex flex-column">
          <h3 class="h5 card-title mb-2">${title}</h3>
          ${excerpt ? `<p class="card-text text-muted mb-3">${excerpt}</p>` : ''}
          <div class="d-flex justify-content-center justify-content-md-start mt-auto mx-auto mx-md-0">
            ${url && url !== '#' ? `<a href="${url}" class="btn btn-outline-primary btn-sm">Ver proyecto</a>` : ''}
          </div>
        </div>
      </article>
    `;
    return col;
  }

  function applyFilter(grid, filter) {
    const want = slugify(filter || 'all');
    grid.querySelectorAll('.col').forEach(col => {
      if (want === 'all') {
        col.classList.remove('d-none');
        return;
      }
      const cats = (col.getAttribute('data-cats') || '').split(/\s+/);
      if (cats.includes(want)) col.classList.remove('d-none');
      else col.classList.add('d-none');
    });
  }

  function bindFilters(grid) {
    const group = document.getElementById('filter-buttons');
    if (!group) return;
    group.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      group.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(grid, btn.dataset.filter);
    });
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', async function () {
    const grid = document.querySelector('#project-list[data-projects]');
    if (!grid) return;

    // Mensaje breve mientras carga
    grid.innerHTML = `<div class="col"><div class="text-center text-muted">Cargando proyectos…</div></div>`;

    try {
      const src = grid.dataset.src || '/assets/data/projects.json';
      const res = await fetch(src, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const items = normalizeList(data);

      if (!items.length) {
        grid.innerHTML = `<div class="col"><div class="alert alert-warning mb-0">No hay proyectos disponibles.</div></div>`;
        return;
      }

      grid.innerHTML = '';
      items.forEach(item => grid.appendChild(renderCard(item)));

      // Filtros
      bindFilters(grid);

      // Filtro inicial por URL ?cat=ecommerce (opcional)
      const cat = new URLSearchParams(location.search).get('cat');
      if (cat) {
        const btn = document.querySelector(`#filter-buttons [data-filter="${slugify(cat)}"]`);
        if (btn) { btn.click(); } else { applyFilter(grid, cat); }
      }
    } catch (err) {
      console.error('Error cargando proyectos:', err);
      grid.innerHTML = `<div class="col"><div class="alert alert-danger mb-0">Error al cargar los proyectos.</div></div>`;
    }
  });
})();
