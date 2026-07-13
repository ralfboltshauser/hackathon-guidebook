/* Bootstrap: build every artboard, then wire the hash router + scaler.
   Must load after helpers.js and all js/pages/*.js. */
(function(GB){
  "use strict";
  var pages=GB.pages;

  /* build */
  var boards={};
  document.querySelectorAll(".artboard").forEach(function(b){boards[b.dataset.page]=b;});
  pages.home(boards.home); pages.phases(boards.phases); pages["deep-dives"](boards["deep-dives"]); pages.hack(boards.hack); pages.skills(boards.skills); pages.about(boards.about);

  /* router + scaler */
  var stage=document.getElementById("stage");
  var order=["home","phases","deep-dives","hack","skills","about"];
  function route(){return (location.hash.replace(/^#\//,"")||"home");}
  function activePage(){return boards[route()]?route():"home";}
  function fit(){var b=boards[activePage()];var sc=stage.clientWidth/1024;b.style.transform="translateX(-50%) scale("+sc+")";stage.style.height=((parseInt(b.style.height,10)||1000)*sc)+"px";}
  function show(){var p=activePage();order.forEach(function(k){boards[k].classList.toggle("active",k===p);});window.scrollTo(0,0);fit();if(p==="home")playHero();}
  window.addEventListener("hashchange",show);
  window.addEventListener("resize",fit);
  document.addEventListener("click",function(e){var g=e.target.closest("[data-go]");if(g)location.hash="#/"+g.getAttribute("data-go");});
  function playHero(){boards.home.querySelectorAll(".word").forEach(function(w){w.classList.remove("show");var i=parseInt(w.style.getPropertyValue("--i"))||0;setTimeout(function(){w.classList.add("show");},(i===2)?640:i*150+120);});}
  (function(){if(window.innerWidth<1080){var h=document.getElementById("hint");h.textContent="1:1 artboard — scaled to fit";h.classList.add("show");setTimeout(function(){h.classList.remove("show");},3000);}})();
  show();
})(window.GB);
