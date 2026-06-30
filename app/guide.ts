export type Check = { label: string; critical?: boolean };
export type Checklist = { title: string; items: Check[] };
export type Section = {
  title: string;
  intent: string;
  moves: string[];
  avoid?: string[];
};
export type Example = { label: string; value: string; href?: string };
export type Win = { event: string; place: string; href?: string };

export const wins: Win[] = [
  {
    event: "Start Hack · Syngenta",
    place: "Winner",
    href: "https://www.youtube.com/watch?v=msXr6-grelY&t=1s",
  },
  {
    event: "Moin Hack",
    place: "Second Place",
    href: "https://exploration.nbg1.your-objectstorage.com/moin-hack-case-pitch.mp4",
  },
  {
    event: "ETH AI Hack",
    place: "Second Place",
    href: "https://www.youtube.com/watch?v=tGFbolKX4Ts",
  },
  {
    event: "BaselHack",
    place: "2x Winner",
    href: "https://www.figma.com/proto/za3LgRYDmOEYAQJ9YHxMfh/baselhack?node-id=41-596&t=pyU7FBJAH4hn3hz7-1",
  },
  {
    event: "ETH Agentic Systems Hack",
    place: "Winner",
    href: "https://www.figma.com/proto/xnZTRRuIZVeaqSs0kZXMDN/sherlock-eth-agents-hack?node-id=0-1&t=s9uVx2FJaQlgAi8t-1",
  },
  {
    event: "IBM Bobathon",
    place: "Winner",
  },
  {
    event: "Q-Summit Hackathon",
    place: "Winner",
  },
];

export type Phase = {
  n: string;
  title: string;
  sub: string;
  timebox: string;
  thesis: string;
  fieldRule: string;
  sections: Section[];
  mantra: string;
  checklists: Checklist[];
};

export const examples: Example[] = [
  {
    label: "Start Hack Syngenta",
    value: "Winning stage pitch reference",
    href: "https://www.youtube.com/watch?v=msXr6-grelY&t=1s",
  },
  {
    label: "ETH AI Hack",
    value: "CHF 2k pitch reference",
    href: "https://www.youtube.com/watch?v=tGFbolKX4Ts",
  },
  {
    label: "Moin Hack",
    value: "CHF 2.5k case pitch",
    href: "https://exploration.nbg1.your-objectstorage.com/moin-hack-case-pitch.mp4",
  },
  {
    label: "Basel Hack",
    value: "CHF 1.5k Figma pitch",
    href: "https://www.figma.com/proto/za3LgRYDmOEYAQJ9YHxMfh/baselhack?node-id=41-596&t=pyU7FBJAH4hn3hz7-1",
  },
  {
    label: "ETH Agentic Systems Hack",
    value: "#1 pitch deck reference",
    href: "https://www.figma.com/proto/xnZTRRuIZVeaqSs0kZXMDN/sherlock-eth-agents-hack?node-id=0-1&t=s9uVx2FJaQlgAi8t-1",
  },
];

export const guide: Phase[] = [
  {
    n: "01",
    title: "Before",
    sub: "Preparation",
    timebox: "Days to weeks before",
    thesis:
      "This assumes you want to win hackathons. If not, fair enough, this is not for you. Every single step you skip decreases your odds. Almost all of preparation comes down to one thing: eliminate all avoidable disadvantages before the hackathon starts.",
    fieldRule:
      "Preparation is for removing avoidable disadvantages, not for pre-building the solution.",
    sections: [
      {
        title: "Understand the hack environment",
        intent:
          "Before you can make good decisions, understand the physical and operational constraints of the event.",
        moves: [
          "Map the basics: location, duration, food, sleep setup, overnight rules, transport, submission deadlines, and any multi-stage structure.",
          "Identify the parts that will affect energy and focus, because these constraints shape the quality of every later decision.",
        ],
        avoid: [
          "Discovering the sleep, food, location, or deadline constraints only after the event starts.",
        ],
      },
      {
        title: "Get the right team",
        intent:
          "A small team with the right coverage beats a larger team with unclear ownership.",
        moves: [
          "Aim for 2-4 people with the roles covered: at least two people who can build, one person with strong design/product judgment, and one strong pitcher.",
          "Roles can overlap, but do not leave a core role uncovered and do not fill the team with people who only contribute ideas.",
        ],
        avoid: [
          "Adding people who are not aligned with how you work.",
          "Teams with too many 'idea people'.",
        ],
      },
      {
        title: "Align on the goal",
        intent:
          "This system only works if everyone is honestly playing the same game.",
        moves: [
          "Make the goal explicit before the event: everyone must be down to win, not vaguely interested in learning, networking, or having a relaxed weekend.",
          "If people want different outcomes, decide that early instead of discovering it when the hard tradeoffs start.",
        ],
        avoid: [
          "Assuming everyone has the same ambition because they joined the team.",
        ],
      },
      {
        title: "Capacity commitments",
        intent:
          "Uneven commitment creates bad dynamics faster than skill gaps do.",
        moves: [
          "Everyone should commit the same amount of capacity, preferably all in: same seriousness, same availability, same willingness to do the uncomfortable work.",
          "This is not about skills, it is about presence. Avoid a team where some people go all the way while others split focus or show up only when it is convenient.",
        ],
        avoid: [
          "A team where some go all the way and others don't.",
          "Unclear expectations about sleep, effort, ownership, or side activities.",
        ],
      },
      {
        title: "Build domain knowledge, not the product",
        intent:
          "If the challenge direction is already known, learn the domain before the event instead of guessing your way through it.",
        moves: [
          "When the direction of the challenges is known, build domain knowledge or get access to experts who can explain the real constraints, users, and failure modes.",
          "Do not start building. It is often against the rules, and the first conversations at the hackathon can invalidate most pre-built assumptions.",
        ],
        avoid: [
          "Pre-building the final solution against the rules.",
          "Confusing early domain learning with already knowing the right product.",
        ],
      },
      {
        title: "Arrive early and secure a strong workplace",
        intent:
          "A poor workspace taxes every conversation, build session, and rehearsal for the rest of the event.",
        moves: [
          "Arrive early and claim a place that supports focused work: quiet enough, enough space for discussions, enough power, and close enough to the people you need to talk to.",
          "Bring whatever makes the workspace actually usable, such as chargers, adapters, monitors, headphones, and sleep gear if the event runs overnight.",
        ],
        avoid: [
          "Starting the hack from the leftover seats with bad power, noise, or no room to think.",
        ],
      },
    ],
    mantra: "Eliminate all avoidable disadvantages before the hackathon starts.",
    checklists: [
      {
        title: "Team and Commitment",
        items: [
          { label: "Team size is 2-4 people", critical: true },
          { label: "Roles covered: build, design/product, and pitch", critical: true },
          { label: "Goal aligned: everyone is down to win", critical: true },
          { label: "Capacity commitment matched across the team", critical: true },
          { label: "No unresolved expectations about sleep, effort, ownership, or side activities" },
        ],
      },
      {
        title: "Environment and Domain",
        items: [
          { label: "Sleep, food, location, deadlines, and format understood", critical: true },
          { label: "Known challenge direction turned into domain research or expert access" },
          { label: "No pre-building against the rules" },
          { label: "Arrive-early plan set for securing a strong workplace", critical: true },
          { label: "Workspace and sleep gear packed if needed" },
        ],
      },
    ],
  },
  {
    n: "02",
    title: "Start",
    sub: "First Read",
    timebox: "First 1-2 hours",
    thesis:
      "The first hours are for understanding how winning works here. Judges do not strictly follow criteria, they decide based on intuition and preference, so decode the room before you build.",
    fieldRule:
      "One person owns the jury read and narrative so the team can move with one interpretation of the room.",
    sections: [
      {
        title: "Understand how winning works",
        intent:
          "Understand the hackathon format before you build: who grades, what the stated criteria are, whether there are multiple stages, and whether you compete across all challenges or only inside one track.",
        moves: [
          "Map the format: single stage or multiple stages, challenge-specific or overall winner, submission mechanics, pitch format, and who decides at each step.",
          "Identify who judges and their background: founders, VCs, operators, etc.",
          "Read their preferences and biases, not just the written criteria.",
          "Winning is an emotional buy first, then justified with logic. Judges want a team to win, then find arguments why they should win.",
          "Maximize emotional buy-in: become the team they like and love. Be kind, be genuinely interested in the problem, the case, and them. Be someone they want to see win and support.",
          "Provide the logical justification: be the best team.",
        ],
        avoid: [
          "Assuming judges will understand the case better than you do.",
          "Optimizing for a criterion nobody emotionally cares about.",
        ],
      },
      {
        title: "Challenge & idea strategy",
        intent:
          "The jury usually already has a preference for what kind of case they want to see win, shaped by their expertise and identity: technical depth, business value, impact, novelty, or something else. The written criteria often do not fully match what they emotionally value.",
        moves: [
          "First understand who the jury is and which criteria they will actually grade emotionally, then pick the challenge that lets you satisfy those criteria best.",
          "Choose your challenge based on jury preferences and team strengths, not just which one seems cool to build or easy to execute.",
          "Avoid technically impressive but irrelevant solutions.",
          "Avoid challenges too narrow, where all solutions look the same and you can't be extraordinary.",
          "Avoid challenges too wide, where ideation becomes a random winning factor.",
          "Ideate based on what the jury wants to see and real-world impact. Prefer solutions that could realistically work over 'bullshit apps' nobody would use.",
        ],
        avoid: [
          "Over-optimizing on the written criteria while missing what the jury actually values.",
          "Building a data science pipeline when the jury prefers B2C apps.",
          "'Bullshit apps' nobody would use.",
        ],
      },
      {
        title: "Case deep understanding & discovery",
        intent:
          "Interview case providers, jury if possible, actual customers, and outside experts. Treat them like customers: they often do not fully understand the case themselves, or cannot clearly say what they want until you ask the right questions.",
        moves: [
          "Interview case providers, the jury if possible, and actual customers. Treat them like customers, not as people who automatically know the right solution.",
          "Ask the discovery questions: who are the stakeholders? What are the biggest current problems? What solutions were tried before, and what worked or failed?",
          "Find out who inside the company enables progress, and who blocks it.",
          "Talk to experts from LinkedIn or your network, and capture proof that you did it: photos of calls, notes, quotes, and names where appropriate.",
          "Make sure the whole team understands this phase: the case providers should do most of the talking. You are there to ask questions and avoid building in the wrong direction.",
        ],
        avoid: [
          "Pitching ideas or directions during discovery. As soon as you pitch, the conversation changes, and they often will not stop you even if you are going wrong.",
          "Letting teammates explain the case back to the providers instead of listening.",
          "Asking leading questions that validate your first idea.",
          "Treating mentor opinions as customer evidence.",
        ],
      },
      {
        title: "Positioning",
        intent:
          "Build a business case, not just software, focused on real impact and organizational relevance.",
        moves: [
          "Build a business case, not just software.",
          "Focus on real impact and organizational relevance.",
          "Write the one-sentence problem in the customer's language, name the persona, and their current workflow.",
          "Define why now: new technology, changed regulation, sponsor urgency, or newly visible pain.",
        ],
        avoid: [
          "Pitching a generic app category instead of a specific wedge.",
          "Confusing novelty with value.",
        ],
      },
    ],
    mantra: "Winning is an emotional buy first, then justified with logic.",
    checklists: [
      {
        title: "Read the Room",
        items: [
          { label: "Format mapped: stages, tracks, criteria, submission, and who decides", critical: true },
          { label: "Judges, sponsors, and likely preferences mapped", critical: true },
          { label: "One person owns jury appeal and narrative", critical: true },
          { label: "Written criteria separated from what the jury emotionally values", critical: true },
        ],
      },
      {
        title: "Choose and Validate",
        items: [
          { label: "Challenge chosen by jury fit and team strengths, not excitement or ease", critical: true },
          { label: "Case providers interviewed deeply", critical: true },
          { label: "Real users, analogous customers, or outside experts contacted" },
          { label: "Discovery proof captured: notes, quotes, photos, or names" },
          { label: "Team listened during discovery instead of pitching ideas" },
          { label: "Problem, persona, value, and why-now written" },
        ],
      },
    ],
  },
  {
    n: "03",
    title: "During",
    sub: "Execution",
    timebox: "Build phase",
    thesis:
      "Work backwards from the pitch. Only build what will be shown in the pitch. If it's not in the demo, it has zero value.",
    fieldRule:
      "Every task must improve the demo, the pitch, or the team's ability to deliver both.",
    sections: [
      {
        title: "Engineering setup & discipline",
        intent:
          "Set up the repository properly so there's a stable build at all times, and define rules so no one blocks silently.",
        moves: [
          "Set up the repository properly: a stable build at all times, Husky pre-commit hooks, and code that builds before commit.",
          "Lock the tech stack early.",
          "Define rules: notify immediately when stuck, no silent blocking.",
          "Assign clear ownership per task.",
        ],
        avoid: [
          "Silent blocking, one of the most expensive hackathon failures.",
          "Over engineering.",
        ],
      },
      {
        title: "Build strategy (pitch-driven)",
        intent:
          "Work backwards from the pitch. Only build what will be shown in the pitch, because if it's not in the demo it has zero value.",
        moves: [
          "Work backwards from the pitch, and define early: problem, persona, business value, and product narrative.",
          "Only build what will be shown in the pitch: if it's not in the demo, it has zero value.",
          "Focus on a clear user journey so the audience understands from start to finish how value is created, from problem to outcome.",
        ],
        avoid: [
          "Building features that are not demoed.",
          "Tweaking UX flows that are never shown.",
        ],
      },
      {
        title: "Product & idea validation",
        intent:
          "Conduct early user and customer interviews. This shows real market research, a very strong signal for the jury.",
        moves: [
          "Conduct early user/customer interviews: go on Apollo, find target customers, call them, take photos of calls and notes.",
          "Extract real workflows, real pain points, and language for the pitch.",
          "Integrate it into both the product and the pitch.",
          "Use it as a differentiator: it shows real market research, a very strong signal for the jury.",
        ],
        avoid: [
          "Treating a few friendly teammates as validation.",
          "Keeping research separate from product and pitch decisions.",
        ],
      },
      {
        title: "Execution flow, team & pitch management",
        intent:
          "Parallelize product and pitch development, and keep the team effective. Empower the team continuously so they deliver maximum value.",
        moves: [
          "Parallelize product development and pitch development, and continuously align what is built vs. what is pitched.",
          "Ensure enough food, enough water, and proper rest. Empower the team continuously so they can deliver maximum value.",
          "Develop the pitch from an early stage, not as a last-minute task, and continuously refine the storyline and messaging. Assume the jury understands the case worse than you do, take them on a journey.",
          "Audience-test the pitch with competitors on another case or someone outside the team. Ask basic questions afterward: who is the customer, what is the problem, and how do we solve it? If they don't get it, iterate. You get one real shot at the pitch, and if you do fewer than 15 full run-throughs, you probably overvalue the coding part of hackathons.",
          "Protect the pitcher: they must sleep the most and be fully sharp. A tired pitcher equals wasted team effort.",
        ],
        avoid: [
          "Late night sessions and dehydration.",
          "Building things that won't be shown in the pitch, every feature built and not shown is a waste of time and frustrates the team.",
        ],
      },
    ],
    mantra: "If it's not in the demo, it has zero value.",
    checklists: [
      {
        title: "Engineering Discipline",
        items: [
          { label: "Main build is stable and deployable", critical: true },
          { label: "Tech stack locked early" },
          { label: "Every task has a clear owner" },
          { label: "Blocked teammates escalate immediately", critical: true },
          { label: "Demo data is protected from random testing" },
        ],
      },
      {
        title: "Pitch-Driven Build",
        items: [
          { label: "Exact demo route written", critical: true },
          { label: "Only stage-visible work is being built", critical: true },
          { label: "User journey shows problem to outcome clearly", critical: true },
          { label: "Pitch deck is being developed in parallel" },
          { label: "Pitch audience-tested and rehearsed at least 15 full run-throughs", critical: true },
          { label: "Research proof is feeding product and pitch" },
        ],
      },
      {
        title: "Team Health",
        items: [
          { label: "Food, water, and rest are handled" },
          { label: "Pitcher protected and rested", critical: true },
          { label: "Team sync cadence is short and decision-oriented" },
        ],
      },
    ],
  },
  {
    n: "04",
    title: "Final Hours",
    sub: "Stabilization",
    timebox: "Last hours before submission",
    thesis:
      "Freeze scope early and consolidate into one working version. The goal is a working version hours before the deadline.",
    fieldRule:
      "The final hours are for reducing risk, not proving ambition.",
    sections: [
      {
        title: "Scope control & stabilization",
        intent:
          "Freeze scope early and consolidate into one working version. The goal is a working version hours before the deadline.",
        moves: [
          "Freeze scope early: no new features.",
          "Goal: a working version hours before the deadline.",
          "Consolidate into one working version and prevent broken merges.",
          "The leader enforces the final cutoff.",
        ],
        avoid: [
          "Adding 'just one small feature' without counting testing and integration cost.",
          "Broken merges in the final hours.",
        ],
      },
      {
        title: "Demo reliability",
        intent:
          "Ensure the demo is deterministic. If it's not reliable, do not do a live demo.",
        moves: [
          "Ensure the demo is deterministic.",
          "If it's a live demo, implement a reset script and test repeatedly: run, reset, run again.",
          "If multiple people participate in a roleplay or demo flow, make every person practice their exact actions. People get nervous during pitches and misclick or damage demo state. If someone cannot run their part reliably, assign it to someone else.",
          "If it's not reliable, do not do a live demo.",
        ],
        avoid: [
          "Relying on memory to repair demo state.",
          "Letting unpracticed participants touch the live demo state.",
          "Doing the first full demo run in front of judges.",
        ],
      },
      {
        title: "Pre-pitch checklist",
        intent:
          "Define a checklist and execute it right before the pitch. The last mistakes are usually physical and procedural.",
        moves: [
          "App works.",
          "Data is correct.",
          "Demo state is clean.",
          "Physical check of how you will present, and execute the checklist right before the pitch.",
        ],
      },
      {
        title: "Time buffer",
        intent:
          "Plan a buffer before the deadline and expect teammates to overrun.",
        moves: [
          "Protect a 10-15 minute final buffer before the deadline, because teammates will overrun.",
          "When the buffer starts, force stop and pull the stable version even if people want to keep working.",
        ],
        avoid: [
          "Submitting at the last second because the app worked locally.",
          "Letting the pitch deck and product drift apart in the final hour.",
        ],
      },
    ],
    mantra: "A working version hours before the deadline, not a clever one that breaks.",
    checklists: [
      {
        title: "Stabilize",
        items: [
          { label: "Scope frozen: no new features", critical: true },
          { label: "One consolidated working version exists", critical: true },
          { label: "Risky unfinished work removed from the pitch path" },
          { label: "App, data, and demo state verified right before the pitch", critical: true },
          { label: "Physical presentation setup checked" },
          { label: "Submission package verified before the deadline" },
        ],
      },
      {
        title: "Demo Safety",
        items: [
          { label: "Reset path tested repeatedly", critical: true },
          { label: "Backup demo path prepared", critical: true },
          { label: "All demo operators and roleplay participants rehearsed their exact actions", critical: true },
          { label: "Browser, account, data, display, and audio checked" },
          { label: "10-15 minute final buffer protected" },
        ],
      },
    ],
  },
  {
    n: "05",
    title: "Pitch",
    sub: "The Stage",
    timebox: "Final presentation",
    thesis:
      "Fully align with jury expectations, criteria is secondary to preference. Optimize for emotional buy-in, then logical justification.",
    fieldRule:
      "Design the pitch so a tired judge can repeat the problem, user, solution, and value after one listen.",
    sections: [
      {
        title: "Structure discipline",
        intent:
          "Each slide carries one key message, and each message must be written, visualized, and spoken.",
        moves: [
          "Fully align with jury expectations. Criteria is secondary to preference: optimize for emotional buy-in first, then provide the logical justification.",
          "Give each slide one key message.",
          "Make each message written, visualized, and spoken.",
          "Otherwise they won't get it, because they're thinking about the team before, that they need to pee, how they get home, what one criteria actually means, and which team you actually are.",
          "Train the pitch at least 5 times for smooth delivery and consistent timing.",
        ],
        avoid: [
          "Dense slides that require reading while the speaker talks.",
          "A beautiful deck with no argumentative spine.",
        ],
      },
      {
        title: "Demo storytelling",
        intent:
          "Use persona-based storytelling and roleplay. Prefer a live demo if it's stable and fully tested.",
        moves: [
          "Use persona-based storytelling, with costumes for roleplay.",
          "Example: 'This is James, he's a carpenter…', show his workflow, then show how he uses your product.",
          "Prefer a live demo if stable, and make sure it's fully tested.",
          "Avoid generic product walkthroughs.",
        ],
        avoid: [
          "Generic product walkthroughs.",
          "A live demo that hasn't been fully tested.",
        ],
      },
      {
        title: "Differentiation & business case",
        intent:
          "Add fancy elements others won't have, and clearly define the business case so everything makes sense logically.",
        moves: [
          "Add elements others won't have: real customer interviews, photos of calls and notes, real validation and user testing.",
          "Clearly define the business case: value proposition, target user, go-to-market, and pricing.",
          "Ensure everything makes sense logically.",
        ],
      },
      {
        title: "Timing, rehearsal & team involvement",
        intent:
          "Train the pitch at least 5 times, and ask organizers what happens if you exceed time.",
        moves: [
          "Train the pitch at least 5 times for smooth delivery and consistent timing.",
          "Ask organizers what happens if you exceed time. If flexible, slightly exceed by design (others will, and get the advantage if you don't). If strict, train to the exact cutoff.",
          "Include multiple team members if possible, but do not sacrifice quality.",
          "Use roleplay for weaker speakers.",
        ],
        avoid: [
          "Making the best builder explain everything by default.",
          "Changing the pitch structure after the final rehearsal.",
        ],
      },
    ],
    mantra: "Each message: written, visualized, and spoken, or they won't get it.",
    checklists: [
      {
        title: "Pitch Content",
        items: [
          { label: "One key message per slide", critical: true },
          { label: "Each key message is written, visualized, and spoken", critical: true },
          { label: "Persona story arc is clear" },
          { label: "Business case covers user, buyer, value, GTM, and pricing" },
          { label: "Real proof assets included" },
        ],
      },
      {
        title: "Delivery",
        items: [
          { label: "Pitch rehearsed at least five times", critical: true },
          { label: "Timing rules confirmed with organizers" },
          { label: "Speaker handoffs and roleplay rehearsed" },
          { label: "Q&A answers prepared" },
        ],
      },
      {
        title: "Demo",
        items: [
          { label: "Live demo used only if stable", critical: true },
          { label: "Reset tested immediately before stage" },
          { label: "Audio, screen, clicker, and browser state checked" },
        ],
      },
    ],
  },
  {
    n: "06",
    title: "After",
    sub: "Leverage",
    timebox: "Same day to next week",
    thesis:
      "Win or lose, reflect on what worked and what didn't, share publicly regardless of outcome, and use the exposure to build your network and create opportunities.",
    fieldRule:
      "Capture assets and follow up while the room still remembers you.",
    sections: [
      {
        title: "Outcome handling",
        intent:
          "Acknowledge the result either way. Some you win, some you don't.",
        moves: [
          "If you win, acknowledge the success and enjoy the moment.",
          "If you don't, accept the outcome.",
          "Be happy with your result, some you win and some you don't.",
          "Try again.",
        ],
      },
      {
        title: "Reflection",
        intent:
          "No matter the outcome, identify what worked and what didn't.",
        moves: [
          "No matter the outcome, identify what worked.",
          "Identify what didn't.",
          "Write specific lessons for next time rather than vague takeaways.",
        ],
        avoid: [
          "Attributing the result only to politics or luck.",
          "Forgetting the small operational failures because the outcome felt good.",
        ],
      },
      {
        title: "Distribution & visibility",
        intent:
          "Share publicly: LinkedIn posts and a project showcase. Do this regardless of outcome.",
        moves: [
          "Share publicly: LinkedIn posts and a project showcase.",
          "Do this regardless of outcome.",
          "Tag organizers, sponsors, teammates, and supporters where appropriate.",
        ],
      },
      {
        title: "Leverage",
        intent:
          "Use the exposure to build your network, create opportunities, and continue the project if relevant.",
        moves: [
          "Use the exposure to build your network.",
          "Create opportunities.",
          "Continue the project if relevant.",
        ],
      },
    ],
    mantra: "Share publicly regardless of outcome; the exposure is always yours.",
    checklists: [
      {
        title: "Capture and Reflect",
        items: [
          { label: "Final deck, demo, repo, and proof assets saved" },
          { label: "Postmortem completed within 48 hours", critical: true },
          { label: "Specific next-time rules written" },
        ],
      },
      {
        title: "Share and Follow Up",
        items: [
          { label: "LinkedIn or public post shipped", critical: true },
          { label: "Project showcased publicly" },
          { label: "Organizers, sponsors, mentors, and users followed up" },
          { label: "Decision made: continue project or archive it cleanly" },
        ],
      },
    ],
  },
];
