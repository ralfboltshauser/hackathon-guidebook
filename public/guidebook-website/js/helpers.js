/* Shared drawing primitives, weights, nav and pill.
   Everything is exposed on the global GB namespace so the per-page
   files and app.js can share it without a module bundler. */
window.GB = window.GB || {};
(function(GB){
  "use strict";
  var Wt={thin:100,light:300,reg:400,med:500,bold:700};
  function el(tag,cls,style,html){var e=document.createElement(tag);if(cls)e.className=cls;if(style)e.setAttribute("style",style);if(html!=null)e.innerHTML=html;return e;}
  function add(p,tag,cls,style,html){var e=el(tag,cls,style,html);p.appendChild(e);return e;}

  // text
  function t(p,x,y,w,size,weight,color,text,o){
    o=o||{};var s="left:"+x+"px;top:"+y+"px;width:"+w+"px;font-size:"+size+"px;font-weight:"+weight+";color:"+(color||"#000");
    if(o.it)s+=";font-style:italic";
    if(o.al)s+=";text-align:"+o.al;
    if(o.lh!=null)s+=";line-height:"+o.lh;
    var e=add(p,"div","ab"+(o.cls?" "+o.cls:""),s,text);
    if(o.go){e.classList.add("go");e.setAttribute("data-go",o.go);}
    return e;
  }
  // rect
  function r(p,x,y,w,h,o){
    o=o||{};var s="left:"+x+"px;top:"+y+"px;width:"+w+"px;height:"+h+"px";
    if(o.fill)s+=";background:"+o.fill;
    if(o.stroke)s+=";border:"+(o.sw||1)+"px solid "+o.stroke;
    if(o.cr!=null)s+=";border-radius:"+o.cr+"px";
    if(o.extra)s+=";"+o.extra;
    var e=add(p,"div","ln"+(o.cls?" "+o.cls:""),s);
    if(o.go){e.classList.add("go");e.setAttribute("data-go",o.go);}
    return e;
  }
  function hl(p,x,y,w,c){return add(p,"div","ln","left:"+x+"px;top:"+y+"px;width:"+w+"px;height:1px;background:"+(c||"var(--line)"));}
  function vl(p,x,y,h,c){return add(p,"div","ln","left:"+x+"px;top:"+y+"px;width:1px;height:"+h+"px;background:"+(c||"var(--line)"));}
  function diag(p,x,y,w,h,c,sw){var d=add(p,"div","ln","left:"+x+"px;top:"+y+"px;width:"+(w||1)+"px;height:"+(h||1)+"px");d.innerHTML='<svg width="'+(w||1)+'" height="'+(h||1)+'" style="overflow:visible;display:block"><line x1="0" y1="0" x2="'+(w||0)+'" y2="'+(h||0)+'" stroke="'+c+'" stroke-width="'+(sw||1)+'"/></svg>';return d;}
  function vpath(p,x,y,w,h,d,c,sw){var e=add(p,"div","ln","left:"+x+"px;top:"+y+"px;width:"+w+"px;height:"+h+"px");e.innerHTML='<svg width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" style="overflow:visible;display:block"><path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="'+(sw||1)+'" stroke-linecap="round"/></svg>';return e;}
  // hexagon (flat-top)
  function hex(p,x,y,w,h,fill){return add(p,"div","ln","left:"+x+"px;top:"+y+"px;width:"+w+"px;height:"+h+"px;background:"+fill+";clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)");}
  // arrow glyph (line + chevron) pointing right
  function arw(p,x,y,w,c){var d=add(p,"div","ln","left:"+x+"px;top:"+(y-4)+"px;width:"+(w+2)+"px;height:10px");d.innerHTML='<svg width="'+(w+2)+'" height="10" style="overflow:visible;display:block"><line x1="0" y1="5" x2="'+w+'" y2="5" stroke="'+c+'" stroke-width="1.5"/><polyline points="'+(w-6)+',1 '+w+',5 '+(w-6)+',9" fill="none" stroke="'+c+'" stroke-width="1.5"/></svg>';return d;}

  /* shared nav (exact) */
  function nav(b,dark){
    var stroke=dark?"#fff":"#000",ink=dark?"#fff":"#000",fill=dark?"#000":"#fff";
    r(b,0,0,1024,53,{fill:fill,stroke:stroke,sw:1});
    t(b,23,17,300,13,Wt.reg,ink,"Our very cool logo + name",{go:"home"});
    t(b,720,21,68,13,Wt.reg,ink,"Hack",{go:"hack"});
    t(b,787,21,44,13,Wt.reg,ink,"Skills",{go:"skills"});
    t(b,851,21,83,13,Wt.reg,ink,"Deep Dives",{go:"deep-dives"});
    t(b,954,21,55,13,Wt.reg,ink,"About",{go:"about"});
  }

  /* pill (used by phases) */
  function pill(b,x,y,w,label,dot){
    var p=r(b,x,y,w,25,{fill:"#fff",stroke:"#000",sw:.5,cr:30,extra:"display:flex;align-items:center;gap:7px;padding-left:11px"});
    add(p,"div","","position:static;width:9px;height:9px;border-radius:50%;background:"+dot);
    add(p,"div","","position:static;font-size:13px;color:#000",label);
  }

  GB.Wt=Wt;
  GB.el=el; GB.add=add; GB.t=t; GB.r=r;
  GB.hl=hl; GB.vl=vl; GB.diag=diag; GB.vpath=vpath; GB.hex=hex; GB.arw=arw;
  GB.nav=nav; GB.pill=pill;
  GB.pages=GB.pages||{};
})(window.GB);
