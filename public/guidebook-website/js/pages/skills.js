/* ===================== SKILLS ===================== */
(function(GB){
  "use strict";
  var Wt=GB.Wt,t=GB.t,r=GB.r,vpath=GB.vpath,nav=GB.nav;

  GB.pages.skills=function(b){
    nav(b);
    r(b,0,53,1021,493,{fill:"var(--accent)"});
    r(b,0,618,1021,540,{fill:"var(--accent)"});
    vpath(b,579,173,317,342,"M 256.196 139.171 C 213.746 72.980 -39.938 -141.719 5.403 146.293 M 275.706 205.351 C 206.132 148.252 134.136 154.072 81.212 196.242","#ffffff",1);
    vpath(b,146,104,438,433,"M 115.815 0 C -28.188 251.143 -16.091 290.355 35.525 319.952 C 87.142 349.549 230.364 249.541 312.600 123.208","#ffffff",1);
    t(b,15,71,104,12,Wt.reg,"#fff","005");
    t(b,394,121,300,48,Wt.light,"#fff","Skills:",{lh:1});
    t(b,497,180,300,48,Wt.light,"#fff","knowledge",{lh:1});
    t(b,324,236,300,48,Wt.light,"#fff","imported",{lh:1});
    t(b,497,296,300,48,Wt.light,"#fff","into",{lh:1});
    t(b,406,342,300,48,Wt.light,"#fff","your",{lh:1});
    t(b,497,402,300,48,Wt.light,"#fff","agent",{lh:1});
    var tags=[[23,165,"Brainstorming"],[215,165,"Code Review"],[396,249,"Product management"],[666,169,"Mental health"],[848,169,"Politics"],[953,169,"Idk"]];
    tags.forEach(function(g){ t(b,g[0],566,g[1],24,Wt.reg,"#000",g[2]); });
    t(b,23,653,300,40,Wt.reg,"#fff","Catalogue");
    r(b,23,730,66,28,{fill:"#fff",cr:20});
    r(b,111,730,146,28,{fill:"#fff",cr:20});
    r(b,278,730,215,28,{fill:"#fff",cr:20});
    r(b,509,730,85,28,{fill:"#fff",cr:20});
    r(b,610,730,85,28,{fill:"#fff",cr:20});
    r(b,771,730,215,28,{fill:"#fff",cr:20}); t(b,790,735,80,15,Wt.reg,"#000","Suche");
    t(b,22,785,415,24,Wt.reg,"#fff","Strategy & Ideation",{it:true});
    t(b,22,820,471,13,Wt.reg,"#fff","Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam");
    [23,264,521,768].forEach(function(x){ r(b,x,881,201,263,{fill:"var(--ph)"}); });
  };
})(window.GB);
