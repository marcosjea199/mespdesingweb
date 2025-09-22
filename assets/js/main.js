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
});

(function () {
  const SRC = '/assets/data/portfolio/projects.json'; // <-- ajusta la ruta si es necesario

  // Obtiene una imagen desde el objeto del proyecto, sea string o { webp, jpg, src, alt }
  function pickImage(item) {
    if (!item) return { src: '', alt: 'Proyecto' };
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
    return { src: '', alt: item.title || item.name || 'Proyecto' };
  }

  function cardHTML(item) {
    const title   = item.title || item.name || '';
    const excerpt = item.excerpt || item.description || item.summary || '';
    const url     = item.url || item.link || (item.slug ? `/proyectos/${item.slug}.html` : '#');
    const img     = pickImage(item);

    return `
      <article class="card h-100 shadow-sm">
        ${img.src ? `<img src="${img.src}" class="card-img-top" alt="${img.alt}" loading="lazy">` : ``}
        <div class="card-body">
          ${title ? `<h3 class="h5 card-title mb-2">${title}</h3>` : ``}
          ${excerpt ? `<p class="card-text text-muted mb-3">${excerpt}</p>` : ``}
          ${url ? `<a href="${url}" class="btn btn-outline-primary btn-sm mx-auto mx-md-0">Ver proyecto</a>` : ``}
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
      const items = Array.isArray(data) ? data : (data.projects || data.items || []);
      if (!Array.isArray(items)) return;

      (limit ? items.slice(0, limit) : items).forEach(item => {
        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = cardHTML(item);
        grid.appendChild(col);
      });
    } catch (err) {
      console.error('Error cargando projects.json:', err);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Home: primeros 4
    if (document.getElementById('home-projects-list')) {
      loadProjects('#home-projects-list', { limit: 4 });
    }
    // Portfolio: todos
    if (document.getElementById('portfolio-projects-list')) {
      loadProjects('#portfolio-projects-list');
    }
  });
})();


(function () {
  const BREAKPOINTS = [
    ['xs',   0],
    ['sm', 576],
    ['md', 768],
    ['lg', 992],
    ['xl',1200],
    ['xxl',1400],
  ];

  // Lee el per-slide adecuado según ancho y data-attributes
  function getPerSlide(el) {
    const d = el.dataset;
    let per = parseInt(d.perSlide || d.per || '3', 10); // fallback
    const w = window.innerWidth;

    for (const [key, min] of BREAKPOINTS) {
      if (w >= min) {
        const attr = 'per' + key.charAt(0).toUpperCase() + key.slice(1); // perXs, perSm...
        if (d[attr]) per = parseInt(d[attr], 10);
      } else break;
    }
    return Math.max(1, per || 3);
  }

  // Normaliza JSON (array u objetos anidados)
  function normalizeItems(data) {
    if (Array.isArray(data)) return data;
    const paths = [
      ['collaborators'], ['people'], ['items'],
      ['data','collaborators'], ['data','people'], ['data','items']
    ];
    for (const path of paths) {
      let cur = data;
      for (const k of path) cur = (cur || {})[k];
      if (Array.isArray(cur)) return cur;
    }
    return [];
  }

  // Devuelve {src, alt} priorizando avatar
  function resolveAvatarFields(item) {
    const fromObj = (o) => (o && typeof o === 'object')
      ? (o.webp || o.jpg || o.png || o.svg || o.src || '')
      : '';
    const src =
      (typeof item.avatar === 'string' ? item.avatar : fromObj(item.avatar)) ||
      (typeof item.logo   === 'string' ? item.logo   : fromObj(item.logo))   ||
      (typeof item.image  === 'string' ? item.image  : fromObj(item.image))  || '';
    const alt =
      (item.avatar && typeof item.avatar === 'object' && item.avatar.alt) ||
      (item.logo   && typeof item.logo   === 'object' && item.logo.alt)   ||
      item.name || item.title || 'Colaborador';
    return { src, alt };
  }

  // Divide en chunks de tamaño fijo
  function chunk(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  }

  // Crea un slide con N columnas (usa row-cols-N para ajustar exactamente)
  function createSlide(itemsChunk, isActive, perSlide) {
    const slide = document.createElement('div');
    slide.className = 'carousel-item' + (isActive ? ' active' : '');
    slide.innerHTML = `
      <div class="row row-cols-${perSlide} g-4 justify-content-center align-items-center text-center">
        ${itemsChunk.map(person => {
          const name = person.name || person.title || 'Colaborador';
          const role = person.role || person.position || '';
          const url  = person.url || person.link || '';
          const { src, alt } = resolveAvatarFields(person);

          const avatarImg = src
            ? `<img src="${src}" alt="${alt}" class="img-fluid rounded-circle mb-2" width="72" height="72" loading="lazy">`
            : `<div class="rounded-circle bg-light d-inline-block mb-2" style="width:72px;height:72px;"></div>`;

          const content = `
            ${avatarImg}
            <div class="small fw-semibold text-body">${name}</div>
            ${role ? `<div class="text-muted small">${role}</div>` : ``}
          `;

          return `<div class="col">
            ${ url
              ? `<a href="${url}" target="_blank" rel="noopener" class="d-inline-flex flex-column align-items-center text-decoration-none">${content}</a>`
              : `<div class="d-inline-flex flex-column align-items-center">${content}</div>`
            }
          </div>`;
        }).join('')}
      </div>
    `;
    return slide;
  }

  function buildCarousel(inner, indicators, items, perSlide) {
    const chunks = chunk(items, Math.max(1, perSlide));
    inner.innerHTML = '';
    chunks.forEach((c, i) => inner.appendChild(createSlide(c, i === 0, perSlide)));

    if (indicators) {
      indicators.innerHTML = '';
      chunks.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('data-bs-target', '#collaboratorsCarousel');
        btn.setAttribute('data-bs-slide-to', String(i));
        btn.setAttribute('aria-label', `Slide ${i+1}`);
        if (i === 0) {
          btn.className = 'active';
          btn.setAttribute('aria-current', 'true');
        }
        indicators.appendChild(btn);
      });
    }
  }

  // Debounce para no reconstruir en cada píxel de resize
  function debounce(fn, ms) {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  document.addEventListener('DOMContentLoaded', async function () {
    const inner = document.getElementById('collaborators-slides');
    const indicators = document.getElementById('collaborators-indicators');
    if (!inner) return;

    inner.innerHTML = `
      <div class="carousel-item active">
        <div class="row"><div class="col text-center text-muted py-3">Cargando colaboradores…</div></div>
      </div>`;

    try {
      const src = inner.dataset.src || '/assets/data/collaborators.json';
      const res = await fetch(src, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const items = normalizeItems(data);
      if (!items.length) {
        inner.innerHTML = `<div class="carousel-item active"><div class="row"><div class="col"><div class="alert alert-warning mb-0">No hay colaboradores disponibles.</div></div></div></div>`;
        if (indicators) indicators.innerHTML = '';
        return;
      }

      let currentPer = getPerSlide(inner);
      buildCarousel(inner, indicators, items, currentPer);

      // Reconstruye si cambia el breakpoint (y por tanto el per-slide)
      window.addEventListener('resize', debounce(() => {
        const next = getPerSlide(inner);
        if (next !== currentPer) {
          currentPer = next;
          buildCarousel(inner, indicators, items, currentPer);
        }
      }, 150));
    } catch (err) {
      console.error('Error cargando colaboradores:', err);
      inner.innerHTML = `<div class="carousel-item active"><div class="row"><div class="col"><div class="alert alert-danger mb-0">No se pudieron cargar los colaboradores.</div></div></div></div>`;
      if (indicators) indicators.innerHTML = '';
    }
  });
})();