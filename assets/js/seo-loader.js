(function(){
  function upsertMeta(name, content){
    var m = document.querySelector('meta[name="'+name+'"]');
    if(!m){ m = document.createElement('meta'); m.setAttribute('name', name); document.head.appendChild(m); }
    m.setAttribute('content', content||'');
  }
  function upsertLink(rel, href){
    var l = document.querySelector('link[rel="'+rel+'"]');
    if(!l){ l = document.createElement('link'); l.setAttribute('rel', rel); document.head.appendChild(l); }
    l.setAttribute('href', href||'#');
  }
  function injectJSONLD(id, obj){
    var el = document.getElementById(id);
    if(!el){ el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(obj);
  }
  function applySEO(){
    var site = window.SEO_SITE || {};
    var page = window.SEO_PAGE || {};
    if(page.title) document.title = page.title;
    if(page.description) upsertMeta('description', page.description);
    if(page.canonical) upsertLink('canonical', page.canonical);
    if(site.localBusiness){ injectJSONLD('ld-localbusiness', site.localBusiness); }
    if(Array.isArray(page.breadcrumbs)){
      var data = {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement": []};
      page.breadcrumbs.forEach(function(pair, idx){
        data.itemListElement.push({"@type":"ListItem","position": idx+1,"name": pair[0], "item": pair[1]});
      });
      injectJSONLD('ld-breadcrumbs', data);
    }
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', applySEO); } else { applySEO(); }
})();
// Social & FAQ schema
(function(){
  function upsertMetaProp(property, content){
    var m = document.querySelector('meta[property="'+property+'"]');
    if(!m){ m = document.createElement('meta'); m.setAttribute('property', property); document.head.appendChild(m); }
    m.setAttribute('content', content||'');
  }
  function upsert(name, content){
    var m = document.querySelector('meta[name="'+name+'"]');
    if(!m){ m = document.createElement('meta'); m.setAttribute('name', name); document.head.appendChild(m); }
    m.setAttribute('content', content||'');
  }
  function applySocial(p){
    var title = p.ogTitle || p.title || document.title;
    var desc  = p.ogDescription || p.description || '';
    var url   = p.canonical || location.href;
    var img   = p.ogImage || (window.SEO_SITE && window.SEO_SITE.ogImage) || '';
    upsertMetaProp('og:type', 'website');
    upsertMetaProp('og:title', title);
    upsertMetaProp('og:description', desc);
    upsertMetaProp('og:url', url);
    if(img) upsertMetaProp('og:image', img);
    upsert('twitter:card','summary_large_image');
    upsert('twitter:title', title);
    upsert('twitter:description', desc);
    if(img) upsert('twitter:image', img);
  }
  function faqJSONLD(){
    var FAQ = window.DATA_FAQ;
    if(!Array.isArray(FAQ) || !FAQ.length) return null;
    return {
      "@context":"https://schema.org",
      "@type":"FAQPage",
      "mainEntity": FAQ.map(function(item){
        return {"@type":"Question","name": item.q, "acceptedAnswer":{"@type":"Answer","text": item.a}};
      })
    };
  }
  function applyLater(){
    var page = window.SEO_PAGE || {};
    applySocial(page);
    var faq = faqJSONLD(); if(faq){ var s=document.createElement('script'); s.type='application/ld+json'; s.id='ld-faq'; s.textContent=JSON.stringify(faq); document.head.appendChild(s); }
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', applyLater); } else { applyLater(); }
})();
