/* ===================== HACK (black) ===================== */
(function(GB){
  "use strict";
  var Wt=GB.Wt,el=GB.el,add=GB.add,t=GB.t,r=GB.r,hl=GB.hl,nav=GB.nav;

  GB.pages.hack=function(b){
    nav(b,true);
    t(b,23,71,104,12,Wt.reg,"var(--lblue)","004");
    t(b,20,96,600,48,Wt.reg,"var(--lblue)","Checklist",{lh:1});
    t(b,20,166,544,36,Wt.reg,"var(--hgrey)","Execute. Check. Win.",{lh:1});
    t(b,873,175,142,24,Wt.reg,"var(--lblue)","Read below",{al:"right"});
    hl(b,0,244,1015,"#ffffff");
    t(b,54,272,200,36,Wt.reg,"var(--lblue)","Before",{lh:1});
    var counter=t(b,873,281,145,36,Wt.reg,"#fff","0 / 10",{al:"right",lh:1});
    t(b,54,322,500,20,Wt.reg,"var(--hgrey)","Preparation is for removing avoidable disadvantages, not for pre-building the solution.",{it:true});
    var rows=[{y:383,on:false},{y:446,on:true},{y:509,on:false},{y:571,on:false}];
    var done=0;
    rows.forEach(function(rw){
      var row=r(b,56,rw.y,817,41,{fill:"var(--hrow)",stroke:"var(--grey)",sw:1,cls:"crow"});
      var cb=el("div","","position:absolute;left:7px;top:8px;width:25px;height:25px;background:#fff;display:flex;align-items:center;justify-content:center",'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3"><path d="M4 12l6 6L20 5"/></svg>');
      cb.querySelector("svg").style.opacity="0";
      row.appendChild(cb);
      add(row,"div","","position:absolute;left:53px;top:0;height:41px;display:flex;align-items:center;font-size:15px;color:#fff","Team size is 2-4 people");
      function setState(on){ if(on){row.style.background="var(--grey)";cb.style.background="var(--lblue)";cb.querySelector("svg").style.opacity="1";cb.querySelector("svg").setAttribute("stroke","#000");row.dataset.on="1";} else {row.style.background="var(--hrow)";cb.style.background="#fff";cb.querySelector("svg").style.opacity="0";row.dataset.on="";} }
      setState(rw.on);
      row.addEventListener("click",function(){ var willOn=row.dataset.on!=="1"; setState(willOn); recount(); });
      row.setAttribute("tabindex","0");
      row.addEventListener("keydown",function(e){if(e.key===" "||e.key==="Enter"){e.preventDefault();row.click();}});
    });
    function recount(){ var n=0; b.querySelectorAll(".crow").forEach(function(rr){if(rr.dataset.on==="1")n++;}); counter.textContent=n+" / 10"; }
    // initial display stays "0 / 10" per the design's label
    t(b,54,778,200,36,Wt.reg,"var(--lblue)","Start",{lh:1});
  };
})(window.GB);
