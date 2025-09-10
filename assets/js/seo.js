document.addEventListener('DOMContentLoaded', function() {
    const pageId = document.body.dataset.pageId;

    Promise.all([
        fetch('assets/seo/site.json').then(res => res.json()),
        fetch(`assets/seo/${pageId}.json`).then(res => res.json()).catch(() => ({}))
    ])
    .then(([siteData, pageData]) => {
        // Combinar datos globales y de la página
        const seoData = { ...siteData, ...pageData };

        // 1. Título de la página
        document.title = seoData.title || siteData.siteName;

        // 2. Metatags de descripción y palabras clave
        document.querySelector('meta[name="description"]').setAttribute('content', seoData.description);
        document.querySelector('meta[name="keywords"]').setAttribute('content', seoData.keywords);
        document.querySelector('meta[name="author"]').setAttribute('content', seoData.author);

        // 3. Metatags de Open Graph (para redes sociales)
        document.querySelector('meta[property="og:title"]').setAttribute('content', seoData.og_title || seoData.title);
        document.querySelector('meta[property="og:description"]').setAttribute('content', seoData.og_description || seoData.description);
        document.querySelector('meta[property="og:url"]').setAttribute('content', window.location.href);
        if (seoData.og_image) {
            document.querySelector('meta[property="og:image"]').setAttribute('content', seoData.og_image);
        }

        // 4. Metatags de Twitter Card (para Twitter/X)
        if (seoData.twitter_card) {
            document.querySelector('meta[name="twitter:card"]').setAttribute('content', seoData.twitter_card);
            document.querySelector('meta[name="twitter:site"]').setAttribute('content', seoData.twitter_site || seoData.social.twitter);
            document.querySelector('meta[name="twitter:creator"]').setAttribute('content', seoData.twitter_creator || seoData.social.twitter);
            document.querySelector('meta[name="twitter:title"]').setAttribute('content', seoData.og_title || seoData.title);
            document.querySelector('meta[name="twitter:description"]').setAttribute('content', seoData.og_description || seoData.description);
            if (seoData.og_image) {
                document.querySelector('meta[name="twitter:image"]').setAttribute('content', seoData.og_image);
            }
        }
    })
    .catch(error => console.error('Error al cargar metadatos SEO:', error));
});