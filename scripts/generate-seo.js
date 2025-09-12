#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const domain = (process.env.SITE_DOMAIN || 'https://mespdesingweb.com').replace(/\/$/, '');

const robotsContent = `User-agent: *
Allow: /
Sitemap: ${domain}/sitemap.xml
`;

fs.writeFileSync(path.join(__dirname, '..', 'robots.txt'), robotsContent);

const pages = [
  { path: '/index.html', changefreq: 'daily', priority: '1.0' },
  { path: '/servicios.html', changefreq: 'weekly', priority: '0.8' },
  { path: '/portfolio.html', changefreq: 'monthly', priority: '0.8' },
  { path: '/sobre-mi.html', changefreq: 'monthly', priority: '0.7' },
  { path: '/contacto.html', changefreq: 'yearly', priority: '0.6' },
  { path: '/legal/politica-privacidad.html', changefreq: 'yearly', priority: '0.3' },
  { path: '/legal/terminos-condiciones.html', changefreq: 'yearly', priority: '0.3' },
  { path: '/legal/cookies.html', changefreq: 'yearly', priority: '0.3' },
];

const today = new Date().toISOString().split('T')[0];

const sitemapUrls = pages.map(p => `  <url>
    <loc>${domain}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n');

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`;

fs.writeFileSync(path.join(__dirname, '..', 'sitemap.xml'), sitemapContent);

console.log(`Generated robots.txt and sitemap.xml for ${domain}`);

