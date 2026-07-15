/* ===================== DEEP DIVES ===================== */
(function(GB){
  "use strict";
  var Wt=GB.Wt,add=GB.add,t=GB.t,r=GB.r,hl=GB.hl,vl=GB.vl,nav=GB.nav;

  GB.pages["deep-dives"]=function(b){
    nav(b);
    // grid lines
    vl(b,23,85,1025); hl(b,23,109,932); hl(b,23,359,932); vl(b,502,91,328); vl(b,502,490,332); hl(b,23,823,932); hl(b,502,647,464); vl(b,880,91,328);
    t(b,38,89,104,12,Wt.reg,"var(--accent2)","003");
    t(b,39,281,530,64,Wt.reg,"var(--accent)","Deep Dives",{lh:1});
    t(b,39,368,470,24,Wt.reg,"#000","proven workflows from industry experts");
    // filter pills
    r(b,39,436,66,28,{fill:"#fff",stroke:"#000",sw:1,cr:20});
    r(b,127,436,146,28,{fill:"#fff",stroke:"#000",sw:1,cr:20}); t(b,159,441,120,15,Wt.med,"#000","Kategorie 1");
    r(b,294,436,215,28,{fill:"#fff",stroke:"#000",sw:1,cr:20}); t(b,365,441,120,15,Wt.med,"#000","Kategorie 2");
    r(b,525,436,85,28,{fill:"#fff",stroke:"#000",sw:1,cr:20}); t(b,537,443,80,11,Wt.med,"#000","Kategorie 3");
    r(b,626,436,85,28,{fill:"#fff",stroke:"#000",sw:1,cr:20});
    r(b,787,436,215,28,{fill:"#fff",stroke:"#000",sw:1,cr:20}); t(b,799,441,80,15,Wt.med,"#000","Suche");
    // card thumbnails (image placeholders) + card texts
    r(b,46,518,344,194,{fill:"var(--ph)"});
    t(b,643,539,359,24,Wt.reg,"#000","All about Github");
    t(b,607,577,359,15,Wt.thin,"#000","Lukas Strickler - professioneller Yapper");
    t(b,587,695,359,24,Wt.reg,"#000","All about husky precommit");
    t(b,587,745,359,15,Wt.thin,"#000","Ralf Boltshauser - versteht mehr als Bahnhof");
    r(b,46,728,84,21,{fill:"var(--ph)"});
    t(b,46,753,359,24,Wt.reg,"#000","How to create videos with AI");
    t(b,46,790,359,15,Wt.thin,"#000","Felix Grote - spherecast (YC S24)");
    // become contributor buttons
    [39,226,413,600,787].forEach(function(x){ var e=r(b,x,842,155,42,{fill:"var(--accent)",cr:10,extra:"display:flex;align-items:center;justify-content:center"}); add(e,"div","","position:static;color:#fff;font-size:13px","Become a contributor"); });
    // hover-card demo (below the frame)
    t(b,55,1031,309,32,Wt.reg,"#000","Hover Card Design");
    var hc=r(b,55,1088,167,178,{fill:"#fff",stroke:"var(--line)",sw:1,cr:10});
    t(hc,12,10,150,14,Wt.light,"var(--accent)","How to build the right team");
    hl(hc,0,50,167);
    t(hc,12,56,150,11,Wt.reg,"#000","A deep dive by: \nxy Professor at the University of Mannheim",{lh:1.25});
    r(hc,12,102,147,70,{fill:"var(--ph)"});
    t(hc,55,118,90,10,Wt.reg,"#000","Visualisierung des Textanfangs");
    hc.style.transition="transform .25s cubic-bezier(.2,.7,.2,1),box-shadow .25s";
    hc.addEventListener("mouseenter",function(){hc.style.transform="translateY(-6px)";hc.style.boxShadow="0 20px 50px rgba(10,10,20,.12)";});
    hc.addEventListener("mouseleave",function(){hc.style.transform="";hc.style.boxShadow="";});
  };
})(window.GB);
