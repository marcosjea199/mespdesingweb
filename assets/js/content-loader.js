(function(){
  function getPortfolio(){return (window.DATA_PORTFOLIO||[]);}
  function parseDate(d){var t=Date.parse(d);return isNaN(t)?0:t;}
  function compareDesc(a,b){return parseDate(b&&b.date)-parseDate(a&&a.date);}

  window.renderPortfolioHome=function(limit){
    var grid=document.getElementById('home-portfolio-grid'); var PF=getPortfolio().slice();
    if(!grid||!PF.length) return; PF.sort(compareDesc); var items=PF.slice(0,limit||3);
    grid.innerHTML=items.map(function(p){
      return '<div class="col-12 col-md-4">        <a class="card-img-only" href="portfolio.html#'+(p.id||'')+'" aria-label="'+(p.title||'Proyecto')+'">          <img src="'+(p.img||'assets/images/placeholder.svg')+'" alt="'+(p.title||'Proyecto')+'">        </a>      </div>';
    }).join('');
  };

  window.renderServiciosIconosHome = function() {
    var wrap = document.getElementById('home-servicios-features');
    if (!wrap) return;
    var FX = (window.FEATURES_SERVICIOS_HOME || []);
    wrap.innerHTML = FX.map(function(f){
      return '<div class="col-md-4"><div class="feature-card card-soft h-100 p-4">' +
               '<div class="feature-icon mb-3" aria-hidden="true"><i class="bi ' + (f.icon || '') + '"></i></div>' +
               '<h3 class="h6 mb-2">' + (f.title || '') + '</h3>' +
               '<p class="small muted mb-0">' + (f.desc || '') + '</p>' +
             '</div></div>';
    }).join('');
  };

  document.addEventListener('DOMContentLoaded',function(){
    try{renderPortfolioHome(3);}catch(e){};
    try{renderServiciosIconosHome();}catch(e){};
    try{toggleCarouselControls('colaboradoresCarousel');}catch(e){};
  });
})();
