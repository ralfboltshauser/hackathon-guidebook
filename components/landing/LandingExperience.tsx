"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { HeroShader } from "./HeroShader";
import styles from "./landing.module.css";

export type LandingPhase = {
  n: string;
  title: string;
  sub: string;
  timebox: string;
};

export type LandingWin = {
  event: string;
  place: string;
};

type LandingExperienceProps = {
  phases: LandingPhase[];
  wins: LandingWin[];
};

const entranceEase = [0.19, 1, 0.22, 1] as const;

function useFinePointer() {
  const [hasFinePointer, setHasFinePointer] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(
      "(min-width: 768px) and (hover: hover) and (pointer: fine)",
    );
    const update = () => setHasFinePointer(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return hasFinePointer;
}

function LandingNav() {
  return (
    <header className={styles.navWrap}>
      <nav className={styles.nav} aria-label="Landing page navigation">
        <Link href="/" className={styles.brand} aria-label="Hackathon Guidebook home">
          <span aria-hidden="true">HG</span>
          <span className={styles.brandIndex}>/ 00</span>
        </Link>

        <div className={styles.navLinks}>
          <a href="#why">Why</a>
          <a href="#proof">Proof</a>
          <a href="#method">Method</a>
        </div>

        <Link className={styles.navCta} href="/learn?tab=learn&phase=1">
          Enter guide
          <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.7} />
        </Link>
      </nav>
    </header>
  );
}

function HeroExperience() {
  const heroRef = useRef<HTMLElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const hasFinePointer = useFinePointer();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const pointerNormalizedX = useMotionValue(0.5);
  const pointerNormalizedY = useMotionValue(0.5);
  const radiusTarget = useMotionValue(0);
  const radius = useSpring(radiusTarget, {
    stiffness: 520,
    damping: 44,
    mass: 0.45,
  });
  const cursorX = useSpring(pointerX, {
    stiffness: 540,
    damping: 42,
    mass: 0.35,
  });
  const cursorY = useSpring(pointerY, {
    stiffness: 540,
    damping: 42,
    mass: 0.35,
  });
  const cursorTranslateX = useTransform(cursorX, (value) => value - 28);
  const cursorTranslateY = useTransform(cursorY, (value) => value - 28);
  const cursorScale = useTransform(radius, [0, 170, 280], [0.72, 1, 1.42]);
  const cursorOpacity = useTransform(radius, [0, 28], [0, 1]);
  const cursorTransform = useMotionTemplate`translate3d(${cursorTranslateX}px, ${cursorTranslateY}px, 0) scale(${cursorScale})`;
  const revealClip = useMotionTemplate`circle(${radius}px at ${pointerX}px ${pointerY}px)`;
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroCopyY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const heroCopyOpacity = useTransform(scrollYProgress, [0, 0.68], [1, 0]);
  const artScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const artRotate = useTransform(scrollYProgress, [0, 1], [0, -3]);
  const interactiveMotion = hasFinePointer && !shouldReduceMotion;

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let boundsFrame = 0;

    const updateBounds = () => {
      boundsRef.current = hero.getBoundingClientRect();
    };
    const scheduleBoundsUpdate = () => {
      if (boundsFrame) return;
      boundsFrame = window.requestAnimationFrame(() => {
        boundsFrame = 0;
        updateBounds();
      });
    };
    const observer = new ResizeObserver(updateBounds);

    updateBounds();
    observer.observe(hero);
    window.addEventListener("resize", scheduleBoundsUpdate);
    window.addEventListener("scroll", scheduleBoundsUpdate, { passive: true });
    return () => {
      window.cancelAnimationFrame(boundsFrame);
      observer.disconnect();
      window.removeEventListener("resize", scheduleBoundsUpdate);
      window.removeEventListener("scroll", scheduleBoundsUpdate);
    };
  }, []);

  const updatePointer = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!interactiveMotion) return;
      const bounds = boundsRef.current;
      if (!bounds) return;

      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      pointerX.set(x);
      pointerY.set(y);
      pointerNormalizedX.set(Math.min(Math.max(x / bounds.width, 0), 1));
      pointerNormalizedY.set(Math.min(Math.max(y / bounds.height, 0), 1));

      const target = event.target as Element;
      radiusTarget.set(target.closest('[data-reveal="large"]') ? 280 : 170);
    },
    [
      interactiveMotion,
      pointerNormalizedX,
      pointerNormalizedY,
      pointerX,
      pointerY,
      radiusTarget,
    ],
  );

  const activatePointer = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!interactiveMotion) return;
      boundsRef.current = event.currentTarget.getBoundingClientRect();
      updatePointer(event);
    },
    [interactiveMotion, updatePointer],
  );

  const deactivatePointer = useCallback(() => {
    radiusTarget.set(0);
  }, [radiusTarget]);

  return (
    <section
      ref={heroRef}
      className={styles.hero}
      aria-labelledby="hero-title"
      onPointerEnter={activatePointer}
      onPointerMove={updatePointer}
      onPointerLeave={deactivatePointer}
      data-pointer-active={interactiveMotion ? "true" : "false"}
    >
      <div className={`${styles.heroPlane} ${styles.heroBase}`}>
        <m.div
          className={styles.heroMeta}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: entranceEase }}
        >
          <span>Open field manual / v1.0</span>
          <span>Built by people who stayed for the demo</span>
        </m.div>

        <m.div
          className={styles.heroArt}
          style={shouldReduceMotion ? undefined : { scale: artScale, rotate: artRotate }}
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.05, delay: 0.12, ease: entranceEase }}
          aria-hidden="true"
        >
          <Image
            src="/landing/pressure-object.webp"
            alt=""
            fill
            loading="eager"
            sizes="(max-width: 767px) 100vw, 72vw"
            className={styles.heroArtFallback}
          />
          <HeroShader
            pointerX={pointerNormalizedX}
            pointerY={pointerNormalizedY}
            scrollProgress={scrollYProgress}
            disabled={!hasFinePointer || Boolean(shouldReduceMotion)}
            className={styles.heroCanvas}
          />
        </m.div>

        <m.div
          className={styles.heroHeadlineWrap}
          style={shouldReduceMotion ? undefined : { y: heroCopyY, opacity: heroCopyOpacity }}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.18, ease: entranceEase }}
        >
          <p className={styles.heroKicker}>The hackathon is not a coding contest.</p>
          <h1 id="hero-title" className={styles.heroHeadline}>
            <span>Code is the</span>
            <span className={styles.heroHeadlineIndent}>easy part.</span>
          </h1>
        </m.div>

        <m.div
          className={styles.heroBottom}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, delay: 0.42, ease: entranceEase }}
        >
          <p className={styles.heroDescription}>
            A field-tested guidebook and live checklist for teams serious about
            winning hackathons.
          </p>
          <Link
            href="/learn?tab=learn&phase=1"
            className={styles.heroCta}
            data-reveal="large"
          >
            <span>Open the playbook</span>
            <ArrowUpRight aria-hidden="true" size={19} strokeWidth={1.6} />
          </Link>
        </m.div>
      </div>

      <m.div
        className={`${styles.heroPlane} ${styles.heroReveal}`}
        style={interactiveMotion ? { clipPath: revealClip } : undefined}
        aria-hidden="true"
      >
        <div className={styles.heroMeta}>
          <span>Strategy / discovery / demo / pitch</span>
          <span>Six phases. Sixty-four checks.</span>
        </div>

        <div className={`${styles.heroArt} ${styles.heroArtReveal}`}>
          <Image
            src="/landing/pressure-object.webp"
            alt=""
            fill
            loading="eager"
            sizes="(max-width: 767px) 100vw, 72vw"
            className={styles.heroArtFallback}
          />
        </div>

        <div className={styles.heroHeadlineWrap}>
          <p className={styles.heroKicker}>The part nobody teaches you.</p>
          <div className={styles.heroHeadline}>
            <span>Winning is</span>
            <span className={styles.heroHeadlineIndent}>a system.</span>
          </div>
        </div>

        <div className={styles.heroBottom}>
          <p className={styles.heroDescription}>
            Read the room. Find the wedge. Ship the demo. Rehearse the story.
          </p>
          <div className={styles.heroCta}>
            <span>Use the whole system</span>
            <ArrowUpRight aria-hidden="true" size={19} strokeWidth={1.6} />
          </div>
        </div>
      </m.div>

      {interactiveMotion && (
        <m.div
          aria-hidden="true"
          className={styles.cursorRing}
          style={{ opacity: cursorOpacity, transform: cursorTransform }}
        >
          <span>See it</span>
        </m.div>
      )}

      <a className={styles.scrollCue} href="#why" aria-label="Scroll to why this exists">
        <span>Scroll to pressure test</span>
        <ArrowDown aria-hidden="true" size={14} strokeWidth={1.6} />
      </a>
    </section>
  );
}

function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const revealClip = useTransform(
    scrollYProgress,
    [0.08, 0.68],
    ["inset(100% 0 0 0)", "inset(0% 0 0 0)"],
  );
  const baseY = useTransform(scrollYProgress, [0, 1], [0, -44]);
  const finalY = useTransform(scrollYProgress, [0.08, 0.68], [44, 0]);
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="why"
      ref={sectionRef}
      className={styles.manifestoTrack}
      data-reduced={shouldReduceMotion ? "true" : "false"}
      aria-labelledby="manifesto-title"
    >
      <p className={styles.srOnly}>
        The actual game: build what wins—conviction, evidence, one deterministic
        demo, and a story the jury can repeat.
      </p>
      <div className={styles.manifestoSticky}>
        <div className={`${styles.manifestoPlane} ${styles.manifestoBase}`}>
          <div className={styles.manifestoLabel}>
            <span>01 / The false signal</span>
            <span>What most teams optimize</span>
          </div>
          <div className={styles.manifestoTitleFrame}>
            <m.h2
              id="manifesto-title"
              className={styles.manifestoTitle}
              style={shouldReduceMotion ? undefined : { y: baseY }}
            >
              <span>Build</span>
              <span>more code.</span>
            </m.h2>
          </div>
          <p className={styles.manifestoNote}>
            More features feel like progress. They are often just more ways for
            the demo to fail.
          </p>
        </div>

        <m.div
          className={`${styles.manifestoPlane} ${styles.manifestoAnswer}`}
          style={shouldReduceMotion ? { clipPath: "inset(0)" } : { clipPath: revealClip }}
          aria-hidden="true"
        >
          <div className={styles.manifestoLabel}>
            <span>02 / The actual game</span>
            <span>What the room remembers</span>
          </div>
          <div className={styles.manifestoTitleFrame}>
            <m.div
              className={styles.manifestoTitle}
              style={shouldReduceMotion ? undefined : { y: finalY }}
            >
              <span>Build</span>
              <span>what wins.</span>
            </m.div>
          </div>
          <p className={styles.manifestoNote}>
            Conviction, evidence, one deterministic demo, and a story the jury
            can repeat.
          </p>
        </m.div>

        <div className={styles.manifestoProgress} aria-hidden="true">
          <span>Assumption</span>
          <div className={styles.progressTrack}>
            <m.div
              className={styles.progressFill}
              style={shouldReduceMotion ? { scaleY: 1 } : { scaleY: progressScale }}
            />
          </div>
          <span>Signal</span>
        </div>
      </div>
    </section>
  );
}

function ProofSection({ wins }: { wins: LandingWin[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const hasFinePointer = useFinePointer();
  const animatePhotos = hasFinePointer && !shouldReduceMotion;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const leftX = useTransform(scrollYProgress, [0.12, 0.62], [-90, 0]);
  const leftRotate = useTransform(scrollYProgress, [0.12, 0.62], [-7, -2]);
  const rightX = useTransform(scrollYProgress, [0.12, 0.62], [90, 0]);
  const rightRotate = useTransform(scrollYProgress, [0.12, 0.62], [8, 3]);
  const centerY = useTransform(scrollYProgress, [0.18, 0.7], [100, 0]);

  return (
    <section
      id="proof"
      ref={sectionRef}
      className={styles.proofSection}
      aria-labelledby="proof-title"
    >
      <div className={styles.proofIntro}>
        <p className={styles.sectionEyebrow}>02 / Why this exists</p>
        <h2 id="proof-title" className={styles.proofTitle}>
          Field notes became an operating system.
        </h2>
        <p className={styles.proofLead}>
          One team wrote down what worked and failed after competing. A second
          team found the gaps and added what was missing. The internal document
          became a public playbook.
        </p>
      </div>

      <div className={styles.photoStage}>
        <m.figure
          className={`${styles.proofPhoto} ${styles.proofPhotoLeft}`}
          style={animatePhotos ? { x: leftX, rotate: leftRotate } : undefined}
        >
          <Image
            src="/hackathon-proof/good-boys-start.jpg"
            alt="The Good Boys team winning the Syngenta prize at Start Hack"
            fill
            sizes="(max-width: 767px) 88vw, 42vw"
            className={styles.proofImage}
          />
          <figcaption>
            <span>Start Hack / Syngenta</span>
            <span>Winner</span>
          </figcaption>
        </m.figure>

        <m.figure
          className={`${styles.proofPhoto} ${styles.proofPhotoRight}`}
          style={animatePhotos ? { x: rightX, rotate: rightRotate } : undefined}
        >
          <Image
            src="/hackathon-proof/konrad-hack-team.jpeg"
            alt="Konrad's team after winning the Hackathon Pitchbattle"
            fill
            sizes="(max-width: 767px) 88vw, 38vw"
            className={styles.proofImage}
          />
          <figcaption>
            <span>Hackathon Pitchbattle</span>
            <span>Winning team</span>
          </figcaption>
        </m.figure>

        <m.figure
          className={`${styles.proofPhoto} ${styles.proofPhotoCenter}`}
          style={animatePhotos ? { y: centerY, rotate: 1 } : undefined}
        >
          <Image
            src="/hackathon-proof/eth-agentic-systems-lab.jpeg"
            alt="Hackathon team gathered at the ETH Agentic Systems Hack"
            fill
            sizes="(max-width: 767px) 88vw, 44vw"
            className={styles.proofImage}
          />
          <figcaption>
            <span>ETH Agentic Systems Hack</span>
            <span>Winner</span>
          </figcaption>
        </m.figure>
      </div>

      <div className={styles.proofStats} aria-label="Guidebook contents">
        <div>
          <strong>06</strong>
          <span>phases</span>
        </div>
        <div>
          <strong>26</strong>
          <span>sections</span>
        </div>
        <div>
          <strong>64</strong>
          <span>checks</span>
        </div>
        <div>
          <strong>31</strong>
          <span>critical</span>
        </div>
      </div>

      <div className={styles.resultsRail} aria-label="Selected hackathon results">
        <div className={styles.resultsTrack}>
          {[0, 1].map((copyIndex) => (
            <div
              className={styles.resultsSet}
              key={copyIndex}
              aria-hidden={copyIndex === 1 ? "true" : undefined}
            >
              {wins.map((win) => (
                <span className={styles.resultItem} key={`${copyIndex}-${win.event}`}>
                  <b>{win.event}</b>
                  <i>{win.place}</i>
                  <span aria-hidden="true">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MethodSection({ phases }: { phases: LandingPhase[] }) {
  return (
    <section id="method" className={styles.methodSection} aria-labelledby="method-title">
      <div className={styles.methodHeader}>
        <p className={styles.sectionEyebrow}>03 / The complete loop</p>
        <h2 id="method-title">Six phases. Zero folklore.</h2>
        <p>
          From the weeks before to the week after. Every phase has a thesis,
          field rules, moves, failure modes, and a checklist you can run live.
        </p>
      </div>

      <div className={styles.phaseList}>
        {phases.map((phase) => (
          <Link
            key={phase.n}
            href={`/learn?tab=learn&phase=${Number(phase.n)}`}
            className={styles.phaseCard}
          >
            <span className={styles.phaseNumber}>{phase.n}</span>
            <span className={styles.phaseName}>
              <b>{phase.title}</b>
              <i>{phase.sub}</i>
            </span>
            <span className={styles.phaseTime}>{phase.timebox}</span>
            <ArrowUpRight aria-hidden="true" size={23} strokeWidth={1.35} />
          </Link>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className={styles.finalCta} aria-labelledby="final-cta-title">
      <div className={styles.finalCtaTop}>
        <span>04 / Your move</span>
        <span>Free / no sign-up / built to use</span>
      </div>
      <h2 id="final-cta-title">
        You have the weekend.
        <span>Take the system.</span>
      </h2>
      <div className={styles.finalActions}>
        <Link className={styles.finalPrimary} href="/learn?tab=hack&phase=1">
          <span>Run the checklist</span>
          <ArrowUpRight aria-hidden="true" size={24} strokeWidth={1.4} />
        </Link>
        <Link className={styles.finalSecondary} href="/about">
          Meet the teams
        </Link>
      </div>
      <footer className={styles.footer}>
        <span>Hackathon Guidebook</span>
        <span>Ralf Boltshauser × Konrad te Heesen</span>
        <span>Built from field notes / shared openly</span>
      </footer>
    </section>
  );
}

export function LandingExperience({ phases, wins }: LandingExperienceProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <main className={styles.landing}>
          <LandingNav />
          <HeroExperience />
          <ManifestoSection />
          <ProofSection wins={wins} />
          <MethodSection phases={phases} />
          <FinalCta />
        </main>
      </MotionConfig>
    </LazyMotion>
  );
}
