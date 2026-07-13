/* ===================== ABOUT ===================== */
(function(GB){
  "use strict";
  var Wt=GB.Wt,t=GB.t,r=GB.r,hl=GB.hl,vl=GB.vl,nav=GB.nav;

  GB.pages.about=function(b){
    nav(b);
    t(b,23,71,104,12,Wt.reg,"var(--accent2)","005");
    t(b,784,65,530,48,Wt.reg,"#000","Our Story");
    hl(b,-3,131,1023);
    r(b,0,164,729,295,{fill:"var(--ph)"}); t(b,291,293,200,36,Wt.reg,"#000","Picture 1");
    t(b,734,412,271,20,Wt.reg,"#000","Picture\ndescription");
    t(b,291,589,430,36,Wt.reg,"#000","Story goodboys");
    vl(b,729,131,677);
    r(b,292,808,729,295,{fill:"var(--ph)"}); t(b,559,912,200,36,Wt.reg,"#000","Picture 2");
    t(b,180,1055,180,20,Wt.reg,"#000","Picture\ndescription");
    t(b,328,1242,430,36,Wt.reg,"#000","Story St Gallen");
    vl(b,291,808,677);
    r(b,0,1479,729,295,{fill:"var(--ph)"}); t(b,253,1607,200,36,Wt.reg,"#000","Picture 3");
    t(b,291,1956,500,36,Wt.reg,"#000","Story Q Hack + Release");
    vl(b,729,1485,738);
  };
})(window.GB);
