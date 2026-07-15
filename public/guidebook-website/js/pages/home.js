/* ===================== HOME ===================== */
(function(GB){
  "use strict";
  var Wt=GB.Wt,el=GB.el,add=GB.add,t=GB.t,r=GB.r,hl=GB.hl,vl=GB.vl,hex=GB.hex,arw=GB.arw,nav=GB.nav;

  function loremLong(){return "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et";}
  function loremLong2(){return "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et";}

  GB.pages.home=function(b){
    nav(b);
    t(b,21,218,104,12,Wt.reg,"var(--accent2)","001");
    t(b,853,192,131,47,Wt.reg,"#000","Name",{lh:1});
    // hero grid lines
    vl(b,248,77,503); vl(b,512,187,559); hl(b,14,279,779); hl(b,159,475,846);
    t(b,18,314,80,12,Wt.reg,"#000","available now");
    t(b,291,358,210,47,Wt.reg,"#000","Structure",{cls:"word",lh:1}); b.lastChild.style.setProperty("--i","0");
    t(b,404,404,101,47,Wt.reg,"#000","your",{cls:"word",lh:1}); b.lastChild.style.setProperty("--i","1");
    t(b,523,478,205,47,Wt.reg,"#000",'<span style="color:var(--accent)">thinking</span>.',{cls:"word",lh:1}); b.lastChild.style.setProperty("--i","2");
    t(b,862,561,113,12,Wt.reg,"#000","read the playbook");

    // two hero cards
    r(b,22,888,388,340,{fill:"rgba(162,205,255,.42)",cr:10});
    t(b,43,907,351,47,Wt.reg,"#000","Making winning as easy as possible",{lh:1.05});
    t(b,47,1157,351,20,Wt.reg,"#000","Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam");
    r(b,436,888,569,428,{fill:"#fff",stroke:"#000",sw:1,cr:10});
    r(b,467,946,137,72,{fill:"var(--accent)",cr:20,extra:"display:flex;align-items:center;justify-content:center"}).appendChild(el("div","","position:static;color:#fff;font-size:24px","Problem"));

    // Read the Playbook button (accent)
    var rb=r(b,24,1242,386,74,{fill:"var(--accent)",cr:10,go:"phases",extra:"display:flex;align-items:center;padding:0 24px"});
    add(rb,"div","","position:static;color:#fff;font-size:20px","Read the Playbook");
    arw(rb,344,37,29,"#fff"); rb.lastChild.style.position="absolute"; rb.lastChild.style.left="344px"; rb.lastChild.style.top="33px";

    // product row
    var pim=[[20,1342],[190,1342],[352,1341],[514,1340],[676,1339],[838,1338]];
    var ppr=[[78,1355],[248,1356],[415,1352],[582,1354],[749,1351],[916,1352]];
    for(var i=0;i<6;i++){ r(b,pim[i][0],pim[i][1],46,46,{fill:"var(--ph)"}); t(b,ppr[i][0],ppr[i][1],73,13,Wt.bold,"#000","2.500 CHF"); }

    // Problem
    r(b,38,1612,72,24,{fill:"var(--accent)",cr:10,extra:"display:flex;align-items:center;justify-content:center"}).appendChild(el("div","","position:static;color:#fff;font-size:12px","Problem"));
    t(b,217,1746,624,24,Wt.reg,"#000","The output standard of hackathons is low. There is a huge knowledge arbitrage in experience and knowing what it takes.");
    hl(b,103,1837,830); vl(b,202,1710,178);

    // Solution
    r(b,40,2161,72,26,{fill:"var(--accent)",cr:10,extra:"display:flex;align-items:center;justify-content:center"}).appendChild(el("div","","position:static;color:#fff;font-size:12px","Solution"));
    var hxs=[[216,2202],[100,2206],[275,2300],[160,2303],[106,2397],[216,2397]];
    hxs.forEach(function(p){ hex(b,p[0],p[1],119,113,"rgba(162,205,255,.42)"); });
    t(b,402,2229,365,24,Wt.reg,"#000",'Our playbook guides \nyou step by step to the <span style="color:var(--accent)">win</span>.');
    t(b,455,2325,405,24,Wt.reg,"#000",'Deep Dives from industry <span style="color:var(--accent)">experts</span> let you explore proven processes.');
    t(b,402,2428,365,24,Wt.reg,"#000",'Skills import all the <span style="color:var(--accent)">knowledge</span> into your agent.');
    hl(b,725,2254,260); vl(b,985,2186,336); hl(b,850,2352,135); hl(b,757,2453,228);

    // feature card (ruled grid + text)
    vl(b,36,2634,552); hl(b,-3,2754,1025); hl(b,-1,3186,1025); hl(b,-2,3311,1025);
    t(b,63,2764,792,24,Wt.reg,"#7f7d7d",'<span style="color:var(--accent)">Hackathons are just problems. </span>\nYou solve them with focus and system. Find out why you fail and \nread the playbook.');

    // 20+ Deep Dives
    t(b,70,3640,300,24,Wt.reg,"#7f7d7d",'<span style="color:var(--accent)">20+ Deep Dives</span>\nJust so you don’t make the same mistakes as everyone else. Tested workflows by domain experts. Now in our Deep Dives section.',{lh:1.3});
    var stk=[[665,3543],[613,3596],[561,3649],[509,3702],[457,3755]];
    stk.forEach(function(p){ r(b,p[0],p[1],243,255,{fill:"#fff",stroke:"#000",sw:1,cr:10}); });
    t(b,768,4010,232,24,Wt.thin,"#000","Read the Deep Dives",{go:"deep-dives"}); arw(b,750,4019,12,"#000");

    hl(b,-14,4080,1025);

    // ===== phase cards =====
    // Phase 1
    r(b,47,4140,451,384,{fill:"#fff",stroke:"#000",sw:1,cr:10});
    t(b,73,4167,300,24,Wt.reg,"var(--accent)","Phase 1");
    t(b,73,4209,407,15,Wt.reg,"#000",loremLong(),{lh:1.35});
    r(b,73,4311,127,25,{fill:"var(--ph)",cr:10}); r(b,73,4362,127,25,{fill:"var(--ph)",cr:10}); r(b,73,4413,127,25,{fill:"var(--ph)",cr:10});
    var ap=r(b,73,4469,401,38,{fill:"var(--accent)",cr:10,go:"skills",extra:"display:flex;align-items:center;padding:0 16px"});
    add(ap,"div","","position:static;color:#fff;font-size:15px","Access Phase 1 Skills"); arw(ap,340,19,43,"#fff"); ap.lastChild.style.left="340px"; ap.lastChild.style.top="15px";
    // Phase 2,3
    r(b,522,4140,463,186,{fill:"#fff",stroke:"#000",sw:1,cr:10});
    t(b,535,4234,200,24,Wt.reg,"var(--accent)","Phase 2");
    t(b,535,4275,421,15,Wt.reg,"#000","Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut");
    r(b,522,4338,463,186,{fill:"#fff",stroke:"#000",sw:1,cr:10});
    t(b,535,4420,200,24,Wt.reg,"var(--accent)","Phase 3");
    t(b,535,4461,421,15,Wt.reg,"#000","Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut");
    // Phase 4 (white card + blue subbutton)
    r(b,47,4541,938,186,{fill:"#fff",stroke:"#000",sw:1,cr:10});
    t(b,73,4572,300,24,Wt.reg,"var(--accent)","Phase 4");
    t(b,73,4627,407,15,Wt.reg,"#000",loremLong(),{lh:1.35});
    var p4=r(b,678,4572,270,123,{fill:"var(--accent)",cr:10,go:"phases",extra:"padding:33px 14px 0"});
    add(p4,"div","","position:static;color:#fff;font-size:24px;line-height:1.15","Read \nthe playbook"); arw(p4,197,62,43,"#fff"); p4.lastChild.style.left="197px"; p4.lastChild.style.top="58px";
    // Phase 5,6
    r(b,47,4755,451,261,{fill:"#fff",stroke:"#000",sw:1,cr:10});
    t(b,73,4799,200,24,Wt.reg,"var(--accent)","Phase 5");
    t(b,73,4853,185,15,Wt.reg,"#000",loremLong(),{lh:1.35}); t(b,280,4853,185,15,Wt.reg,"#000",loremLong2(),{lh:1.35});
    r(b,522,4754,451,261,{fill:"#fff",stroke:"#000",sw:1,cr:10});
    t(b,549,4799,200,24,Wt.reg,"var(--accent)","Phase 6");
    t(b,549,4853,185,15,Wt.reg,"#000",loremLong(),{lh:1.35}); t(b,756,4853,185,15,Wt.reg,"#000",loremLong2(),{lh:1.35});

    hl(b,-1,5068,1025);

    // stats
    r(b,42,5250,116,39,{fill:"var(--accent)",cr:10,extra:"display:flex;align-items:center;justify-content:center"}).appendChild(el("div","","position:static;color:#fff;font-size:20px","Why us?"));
    r(b,58,5350,223,227,{fill:"#fff",stroke:"#000",sw:1,cr:10}); t(b,75,5389,179,64,Wt.reg,"var(--accent)","10k+",{lh:1}); t(b,75,5503,179,15,Wt.reg,"#000","euros won in Hackathon prize money");
    r(b,406,5350,223,227,{fill:"#fff",stroke:"#000",sw:1,cr:10}); t(b,432,5389,179,64,Wt.reg,"var(--accent)","xy",{lh:1}); t(b,428,5503,179,15,Wt.reg,"#000","Partners from institutions across Europe");
    r(b,760,5349,223,227,{fill:"#fff",stroke:"#000",sw:1,cr:10}); t(b,786,5401,179,64,Wt.reg,"var(--accent)","7x",{lh:1}); t(b,786,5502,179,15,Wt.reg,"#000","times pordium placement");

    // CTA
    hl(b,1,5834,1025); hl(b,0,6097,1025);
    t(b,47,5881,585,36,Wt.reg,"#000",'Start <span style="color:var(--accent)">learning</span> \nand win your next hackathon.',{lh:1.05});
    var pbk=r(b,47,6015,140,46,{fill:"#fff",stroke:"#000",sw:1,cr:10,go:"phases",extra:"display:flex;align-items:center;padding:0 16px"});
    add(pbk,"div","","position:static;font-size:20px;font-weight:300","Playbook"); arw(pbk,105,23,16,"#000"); pbk.lastChild.style.left="105px"; pbk.lastChild.style.top="19px";
    var ddb=r(b,202,6015,158,46,{fill:"#fff",stroke:"#000",sw:1,cr:10,go:"deep-dives",extra:"display:flex;align-items:center;padding:0 16px"});
    add(ddb,"div","","position:static;font-size:20px;font-weight:300","Deep Dives"); arw(ddb,120,23,16,"#000"); ddb.lastChild.style.left="120px"; ddb.lastChild.style.top="19px";
    t(b,421,6214,96,24,Wt.reg,"#000","FOOTER");
  };
})(window.GB);
