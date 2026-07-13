/* ===================== PHASES ===================== */
(function(GB){
  "use strict";
  var Wt=GB.Wt,el=GB.el,add=GB.add,t=GB.t,r=GB.r,hl=GB.hl,vl=GB.vl,vpath=GB.vpath,arw=GB.arw,nav=GB.nav,pill=GB.pill;

  GB.pages.phases=function(b){
    nav(b);
    vl(b,36,53,2622); vl(b,982,53,2622); hl(b,3,84,1021); hl(b,0,1448,1021);
    t(b,52,95,104,12,Wt.reg,"var(--accent2)","002");
    t(b,370,214,319,48,Wt.reg,"#000","The 6 Phases");
    // problem: pill
    r(b,65,328,100,35,{fill:"var(--accent)",cr:10,extra:"display:flex;align-items:center;padding-left:18px"}).appendChild(el("div","","position:static;color:#fff;font-size:15px","Problem:"));
    // phase 1 vectors (exact bezier paths)
    vpath(b,80,367,391,209,"M 0 0 C 90.148 184.838 325.129 34.460 381.75 8.731","#000",1);
    vpath(b,485,454,234,238,"M 0 54.550 C 0 54.550 121.491 -28.257 135.876 10.177 C 150.261 48.613 53.041 196.874 53.041 196.874","#000",1);
    t(b,478,482,163,24,Wt.reg,"#000","Phase 1");
    t(b,313,672,395,32,Wt.reg,"var(--accent)","01 Before the Hackathon");
    t(b,45,728,918,16,Wt.reg,"#000","This assumes you want to win hackathons. If not, fair enough, this is not for you. Every single step you skip decreases your odds. Almost all of preparation comes down to one thing: eliminate all avoidable disadvantages before the hackathon starts.",{lh:1.35});

    var items=[
      {y0:833,x:0,code:"01.01",title:"Understand the hack environment",sub:"Before you can make good decisions, understand the physical and operational constraints of the event.",
        exec:"Map the basics: location, duration, food, sleep setup, overnight rules, transport, submission deadlines, and any multi-stage structure.\n\nIdentify the parts that will affect energy and focus, because these constraints shape the quality of every later decision.",
        avoid:"Discovering the sleep, food, location, or deadline constraints only after the event starts."},
      {y0:1147,x:1,code:"01.02",title:"Get the right team",sub:"A small team with the right coverage beats a larger team with unclear ownership.",
        exec:"Aim for 2-4 people with the roles covered: at least two people who can build, one person with strong design/product judgment, and one strong pitcher.\n\nRoles can overlap, but do not leave a core role uncovered and do not fill the team with people who only contribute ideas.",
        avoid:"Adding people who are not aligned with how you work.\n\nTeams with too many 'idea people'."},
      {y0:1448,x:1,code:"01.03",title:"Align on the goal",sub:"This system only works if everyone is honestly playing the same game.",
        exec:"Make the goal explicit before the event: everyone must be down to win, not vaguely interested in learning, networking, or having a relaxed weekend.\n\nIf people want different outcomes, decide that early instead of discovering it when the hard tradeoffs start.",
        avoid:"Assuming everyone has the same ambition because they joined the team."},
      {y0:1735,x:1,code:"01.04",title:"Capacity commitments",sub:"Uneven commitment creates bad dynamics faster than skill gaps do.",
        exec:"Everyone should commit the same amount of capacity, preferably all in: same seriousness, same availability, same willingness to do the uncomfortable work.\n\nThis is not about skills, it is about presence. Avoid a team where some people go all the way while others split focus or show up only when it is convenient.",
        avoid:"A team where some go all the way and others don't.\n\nUnclear expectations about sleep, effort, ownership, or side activities."},
      {y0:2045,x:1,code:"01.05",title:"Build domain knowledge, not the product",sub:"If the challenge direction is already known, learn the domain before the event instead of guessing your way through it.",
        exec:"When the direction of the challenges is known, build domain knowledge or get access to experts who can explain the real constraints, users, and failure modes.\n\nDo not start building. It is often against the rules, and the first conversations at the hackathon can invalidate most pre-built assumptions.",
        avoid:"Pre-building the final solution against the rules.\n\nConfusing early domain learning with already knowing the right product."},
      {y0:2355,x:1,code:"01.06",title:"Arrive early and secure a strong workplace",sub:"A poor workspace taxes every conversation, build session, and rehearsal for the rest of the event.",
        exec:"Arrive early and claim a place that supports focused work: quiet enough, enough space for discussions, enough power, and close enough to the people you need to talk to.\n\nBring whatever makes the workspace actually usable, such as chargers, adapters, monitors, headphones, and sleep gear if the event runs overnight.",
        avoid:"Starting the hack from the leftover seats with bad power, noise, or no room to think."}
    ];
    items.forEach(function(it){
      var y=it.y0, sx=it.x?122:119, ex=it.x?131:119, px=it.x?131:119, ax=it.x?604:589, apx=it.x?604:592;
      hl(b,-3,y,1021); hl(b,-3,y+41,1021);
      t(b,62,y+11,42,16,Wt.reg,"var(--accent)",it.code);
      t(b,119,y+11,448,16,Wt.reg,"#000",it.title);
      t(b,sx,y+49,526,16,Wt.light,"var(--grey)",it.sub,{lh:1.3});
      pill(b,px,y+99,80,"Execute","var(--green)");
      t(b,ex,y+135,448,16,Wt.light,"#000",it.exec,{lh:1.3});
      pill(b,apx,y+99,76,"Avoid","var(--red)");
      t(b,ax,y+135,372,16,Wt.light,"#000",it.avoid,{lh:1.3});
    });
    hl(b,-9,2675,1021); // closing rule under 01.06

    // core objective
    r(b,62,2703,892,96,{fill:"rgba(234,233,233,.15)",stroke:"#000",sw:1,cr:10});
    t(b,83,2719,159,16,Wt.light,"var(--accent)","Core objective");
    t(b,115,2751,681,20,Wt.light,"#000","“ Eliminate all avoidable disadvantages before the hackathon starts.”",{it:true});
    var oc=r(b,782,2731,152,51,{fill:"var(--accent)",stroke:"#fff",sw:1,cr:10,go:"hack",extra:"display:flex;align-items:center;padding:0 16px"});
    add(oc,"div","","position:static;color:#fff;font-size:15px","Open Checklist"); arw(oc,118,25,12,"#fff"); oc.lastChild.style.left="118px"; oc.lastChild.style.top="21px";

    // phase 2 vectors (exact bezier paths)
    vpath(b,318,2815,122,98,"M 69.809 0 C -41.710 51.024 -12.087 91.663 105.341 51.833","#000",1);
    vpath(b,490,2814,262,262,"M 0 118.124 C 0 118.124 166.323 -14.712 176.635 1.347 C 195.527 30.768 81.591 121.741 20.037 192.169","#000",1);
    t(b,431,2884,163,24,Wt.reg,"#000","Phase 2");
    t(b,329,2987,332,32,Wt.reg,"var(--accent)","02 Start");
    t(b,36,3047,918,16,Wt.reg,"#000","This assumes you want to win hackathons. If not, fair enough, this is not for you. Every single step you skip decreases your odds. Almost all of preparation comes down to one thing: eliminate all avoidable disadvantages before the hackathon starts.",{lh:1.35});

    // footer
    r(b,1,4080,1020,421,{fill:"var(--ph)"});
    t(b,451,4291,96,24,Wt.reg,"#000","FOOTER");
  };
})(window.GB);
