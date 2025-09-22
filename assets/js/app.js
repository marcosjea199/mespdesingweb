(function () {
  // ==============================
  // Config
  // ==============================
  const CONFIG = {
    PROJECTS_SRC_FALLBACK: '/assets/data/portfolio/projects.json',
    COLLAB_SRC_FALLBACK:   '/assets/data/collaborators.json'
  };

  // ==============================
  // Helpers
  // ==============================
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const slugify = (s='') => String(s).toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');

  // PROYECTOS: normaliza lista desde distintas formas
  function normalizeProjects(data) {
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

  function resolveProjectImage(item) {
    if (!item) return { src:'', alt:'Proyecto' };
    if (typeof item.image === 'string') {
      return { src: item.image, alt: item.image_alt || item.title || item.name || 'Proyecto' };
    }
    if (item.image && typeof item.image === 'object') {
      return { src: item.image.webp || item.image.jpg || item.image.png || item.image.src || '',
               alt: item.image.alt || item.image_alt || item.title || item.name || 'Proyecto' };
    }
    if (Array.isArray(item.images) && item.images.length) {
      const first = item.images[0];
      if (typeof first === 'string') return { src: first, alt: item.title || item.name || 'Proyecto' };
      if (typeof first === 'object') return { src: first.webp || first.jpg || first.png || first.src || '', alt: first.alt || 'Proyecto' };
    }
    return { src:'', alt:item.title || item.name || 'Proyecto' };
  }

  function projectCategories(item) {
    if (Array.isArray(item.categories)) return item.categories.map(slugify);
    if (typeof item.category === 'string') return [slugify(item.category)];
    return [];
  }

  // COLABORADORES: normaliza lista y avatar (personas/colegas)
  function normalizeCollaborators(data) {
    if (Array.isArray(data)) return data;
    const paths = [
      ['collaborators'], ['colaboradores'], ['people'], ['items'],
      ['data','collaborators'], ['data','colaboradores'], ['data','people'], ['data','items']
    ];
    for (const path of paths) {
      let cur = data;
      for (const k of path) cur = (cur || {})[k];
      if (Array.isArray(cur)) return cur;
    }
    return [];
  }

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
      item.name || item.nombre || item.title || 'Colaborador';
    return { src, alt };
  }

  // Utils
  const chunk = (arr, size) => {
    const out = [];
    for (let i=0; i<arr.length; i+=size) out.push(arr.slice(i, i+size));
    return out;
  };
  const debounce = (fn, ms) => { let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), ms); }; };

  // ==============================
  // Navbar sticky on scroll
  // ==============================
  function initNavbarScroll() {
    const navbar = $('.navbar');
    if (!navbar) return;
    const onScroll = () => {
      if (window.scrollY > 50) navbar.classList.add('navbar-scrolled');
      else navbar.classList.remove('navbar-scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
  }

  // ==============================
  // Proyectos (Home + Portfolio)
  // ==============================
  function projectCardHTML(item) {
    const title   = item.title || item.name || 'Proyecto';
    const excerpt = item.excerpt || item.description || item.summary || '';
    const url     = item.url || item.link || (item.slug ? `/proyectos/${item.slug}.html` : '#');
    const img     = resolveProjectImage(item);
    return `
      <article class="card h-100 shadow-sm">
        ${img.src ? `<img src="${img.src}" class="card-img-top" alt="${img.alt}" loading="lazy">` : ``}
        <div class="card-body d-flex flex-column">
          <h3 class="h5 card-title mb-2">${title}</h3>
          ${excerpt ? `<p class="card-text text-muted mb-3">${excerpt}</p>` : ``}
          <div class="mt-auto">
            ${url && url !== '#' ? `<a href="${url}" class="btn btn-outline-primary btn-sm">Ver proyecto</a>` : ``}
          </div>
        </div>
      </article>
    `;
  }

  async function loadProjects(containerSelector, { src, limit=null } = {}) {
    const grid = document.querySelector(containerSelector);
    if (!grid) return;
    grid.innerHTML = `<div class="col"><div class="text-center text-muted">Cargando proyectos…</div></div>`;
    try {
      const url = src || grid.dataset.src || CONFIG.PROJECTS_SRC_FALLBACK;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const items = normalizeProjects(data);
      if (!items.length) {
        grid.innerHTML = `<div class="col"><div class="alert alert-warning mb-0">No hay proyectos disponibles.</div></div>`;
        return;
      }
      grid.innerHTML = '';
      (limit ? items.slice(0, limit) : items).forEach(item => {
        const col = document.createElement('div');
        col.className = 'col';
        col.setAttribute('data-cats', projectCategories(item).join(' '));
        col.innerHTML = projectCardHTML(item);
        grid.appendChild(col);
      });
    } catch (e) {
      console.error('Error cargando projects.json:', e);
      grid.innerHTML = `<div class="col"><div class="alert alert-danger mb-0">Error al cargar los proyectos.</div></div>`;
    }
  }

  // Exponer para compatibilidad con código existente
  window.loadProjects = loadProjects;

  function bindPortfolioFilters(grid) {
    const group = $('#filter-buttons');
    if (!group) return;
    const apply = (filter) => {
      const want = slugify(filter || 'all');
      $$('.col', grid).forEach(col => {
        if (want === 'all') { col.classList.remove('d-none'); return; }
        const cats = (col.getAttribute('data-cats') || '').split(/\s+/);
        if (cats.includes(want)) col.classList.remove('d-none');
        else col.classList.add('d-none');
      });
    };
    group.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      $$('#filter-buttons button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      apply(btn.dataset.filter);
    });
    // Inicial por ?cat=
    const cat = new URLSearchParams(location.search).get('cat');
    if (cat) {
      const btn = $(`#filter-buttons [data-filter="${slugify(cat)}"]`);
      btn ? btn.click() : apply(cat);
    }
  }

  function initHomeProjects() {
    const el = $('#home-projects-list');
    if (!el) return;
    const limit = parseInt(el.dataset.limit || '4', 10); // Home: 4 por defecto (2x2)
    loadProjects('#home-projects-list', { limit });
  }

  function initPortfolioProjects() {
    const grid = $('#project-list[data-projects]');
    if (!grid) return;
    const src = grid.dataset.src || CONFIG.PROJECTS_SRC_FALLBACK;
    loadProjects('#project-list', { src }).then?.(() => bindPortfolioFilters(grid));
    // En caso de que la Promise no exista (no native), ligar filtros tras un pequeño defer
    setTimeout(() => bindPortfolioFilters(grid), 0);
  }

  // ==============================
  // Colaboradores (Carrusel responsive con avatar)
  // ==============================
  const BREAKPOINTS = [
    ['xs',   0],
    ['sm', 576],
    ['md', 768],
    ['lg', 992],
    ['xl',1200],
    ['xxl',1400],
  ];

  function getPerSlide(inner) {
    const d = inner.dataset;
    let per = parseInt(d.perSlide || d.per || '3', 10);
    const w = window.innerWidth;
    for (const [key, min] of BREAKPOINTS) {
      if (w >= min) {
        const attr = 'per' + key.charAt(0).toUpperCase() + key.slice(1); // perXs, perSm...
        if (d[attr]) per = parseInt(d[attr], 10);
      } else break;
    }
    return Math.max(1, per || 3);
  }

  function createCollaboratorSlide(chunkItems, isActive, perSlide) {
    const slide = document.createElement('div');
    slide.className = 'carousel-item' + (isActive ? ' active' : '');
    slide.innerHTML = `
      <div class="row row-cols-${perSlide} g-4 justify-content-center align-items-center text-center">
        ${chunkItems.map(person => {
          const name = person.name || person.nombre || person.title || 'Colaborador';
          const role = person.role || person.puesto || person.position || '';
          const url  = person.url || person.link || (person.social && person.social.linkedin) || '';
          const { src, alt } = resolveAvatarFields(person);
          const avatar = src
            ? `<img src="${src}" alt="${alt}" class="img-fluid rounded-circle mb-2" width="72" height="72" loading="lazy">`
            : `<div class="rounded-circle bg-light d-inline-block mb-2" style="width:72px;height:72px;"></div>`;
          const content = `
            ${avatar}
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

  function buildCollaborators(inner, indicators, items, perSlide) {
    const groups = chunk(items, Math.max(1, perSlide));
    inner.innerHTML = '';
    groups.forEach((g, i) => inner.appendChild(createCollaboratorSlide(g, i===0, perSlide)));
    if (indicators) {
      indicators.innerHTML = '';
      groups.forEach((_, i) => {
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

  async function initCollaboratorsCarousel() {
    const inner = $('#collaborators-slides');
    if (!inner) return; // no en esta página
    const indicators = $('#collaborators-indicators');

    inner.innerHTML = `
      <div class="carousel-item active">
        <div class="row"><div class="col text-center text-muted py-3">Cargando colaboradores…</div></div>
      </div>`;

    try {
      const src = inner.dataset.src || CONFIG.COLLAB_SRC_FALLBACK;
      const res = await fetch(src, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const items = normalizeCollaborators(data);
      if (!items.length) {
        inner.innerHTML = `<div class="carousel-item active"><div class="row"><div class="col"><div class="alert alert-warning mb-0">No hay colaboradores disponibles.</div></div></div></div>`;
        if (indicators) indicators.innerHTML = '';
        return;
      }
      let currentPer = getPerSlide(inner);
      buildCollaborators(inner, indicators, items, currentPer);

      window.addEventListener('resize', debounce(() => {
        const next = getPerSlide(inner);
        if (next !== currentPer) {
          currentPer = next;
          buildCollaborators(inner, indicators, items, currentPer);
        }
      }, 150));
    } catch (e) {
      console.error('Error cargando colaboradores:', e);
      inner.innerHTML = `<div class="carousel-item active"><div class="row"><div class="col"><div class="alert alert-danger mb-0">No se pudieron cargar los colaboradores.</div></div></div></div>`;
      if (indicators) indicators.innerHTML = '';
    }
  }

  // ==============================
  // Init (DOM Ready)
  // ==============================
  document.addEventListener('DOMContentLoaded', function () {
    initNavbarScroll();
    initHomeProjects();
    initPortfolioProjects();
    initCollaboratorsCarousel();
  });
})();

