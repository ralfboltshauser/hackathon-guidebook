import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About the Hackathon Guidebook",
  description:
    "The origin story behind Hackathon Guidebook and the teams whose hackathon learnings shaped it.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About the Hackathon Guidebook",
    description:
      "The origin story behind Hackathon Guidebook and the teams whose hackathon learnings shaped it.",
    url: "/about",
    type: "website",
  },
};

const navigation = [
  { href: "/learn?tab=hack&phase=1", label: "Hack" },
  { href: "/learn?tab=learn&phase=1", label: "Skills" },
  { href: "/deep-dives", label: "Deep Dives" },
  { href: "/about", label: "About", current: true },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <header className="border-b border-black bg-white">
        <div className="mx-auto flex min-h-12 max-w-[96rem] items-center justify-between gap-4 px-4 sm:min-h-14 sm:px-6 lg:px-10">
          <Link
            href="/"
            className="shrink-0 text-[9px] font-bold uppercase tracking-[0.2em] transition-opacity hover:opacity-55 sm:text-[10px]"
          >
            Hackathon Guidebook
          </Link>

          <nav
            aria-label="Primary"
            className="flex min-w-0 items-center gap-3 overflow-x-auto text-[9px] uppercase tracking-[0.16em] sm:gap-6 sm:text-[10px]"
          >
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={`shrink-0 border-b py-1 transition-opacity hover:opacity-55 ${
                  item.current
                    ? "border-black font-bold"
                    : "border-transparent"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[96rem] px-4 pb-16 sm:px-6 sm:pb-24 lg:px-10">
        <section className="border-b border-black pb-10 pt-8 sm:pb-14 sm:pt-10 lg:pb-16 lg:pt-12">
          <div className="flex items-start justify-between gap-6 text-[10px] uppercase tracking-[0.18em]">
            <p className="font-bold tabular-nums">005</p>
            <p className="text-right text-black/50">About / Hackathon Guidebook</p>
          </div>

          <h1 className="mt-14 text-[clamp(4.5rem,13vw,12rem)] font-normal leading-[0.76] tracking-[-0.075em] sm:mt-20 lg:mt-24">
            Our Story
          </h1>

          <div className="mt-10 grid gap-6 sm:mt-14 sm:grid-cols-12 lg:mt-16">
            <p className="text-sm uppercase tracking-[0.16em] text-black/45 sm:col-span-3">
              From field notes to a public playbook
            </p>
            <p className="max-w-xl text-xl leading-[1.25] tracking-[-0.025em] sm:col-span-7 sm:col-start-6 sm:text-2xl lg:col-span-5 lg:col-start-8">
              Two teams. A few hackathons. One shared document that kept getting
              better.
            </p>
          </div>
        </section>

        <section className="grid gap-8 border-b border-black py-10 sm:py-14 lg:grid-cols-12 lg:gap-10 lg:py-20">
          <figure className="lg:col-span-7">
            <div className="relative aspect-[3/2] overflow-hidden bg-black/5">
              <Image
                src="/hackathon-proof/good-boys-start.jpg"
                alt="The Good Boys team winning at Start Hack with the Syngenta prize"
                fill
                loading="eager"
                sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) calc(100vw - 3rem), 58vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 flex justify-between gap-4 text-[9px] uppercase tracking-[0.16em] text-black/45 sm:text-[10px]">
              <span>Start Hack / Syngenta</span>
              <span>St. Gallen</span>
            </figcaption>
          </figure>

          <div className="flex flex-col justify-between lg:col-span-4 lg:col-start-9">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
                01 / The Good Boys
              </p>
              <h2 className="mt-7 text-[clamp(2.4rem,5vw,4.5rem)] font-normal leading-[0.9] tracking-[-0.055em]">
                The team that started it.
              </h2>
            </div>

            <div className="mt-10 space-y-5 text-[15px] leading-7 text-black/68 lg:mt-16 lg:max-w-md">
              <p>
                Ralf Boltshauser, Samuel Baumgartner, Marco Pagano, and Lionel
                Ding started competing at hackathons together. They kept placing
                well. At Start Hack, ETH AI Hack, BaselHack, Moin Hack. After
                each event they wrote down what had worked and what hadn&apos;t.
              </p>
              <p>
                Over time that document became their operating system. The
                principles, the field rules, the checklists. The first version of
                this guidebook.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 border-b border-black py-10 sm:grid-cols-12 sm:py-14 lg:py-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] sm:col-span-3">
            02 / The handoff
          </p>
          <p className="max-w-4xl text-[clamp(1.8rem,4vw,3.75rem)] leading-[1.08] tracking-[-0.045em] sm:col-span-9">
            At Start Hack they met Konrad and his team. They shared the guidebook.
            Konrad&apos;s team used it and won their next hackathon. They came back
            with things the guide had missed.
          </p>
        </section>

        <section className="grid gap-8 py-10 sm:py-14 lg:grid-cols-12 lg:gap-10 lg:py-20">
          <div className="flex flex-col justify-between lg:col-span-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
                03 / Konrad and the team
              </p>
              <h2 className="mt-7 text-[clamp(2.4rem,5vw,4.5rem)] font-normal leading-[0.9] tracking-[-0.055em]">
                The team that made it better.
              </h2>
            </div>

            <div className="mt-10 space-y-5 text-[15px] leading-7 text-black/68 lg:mt-16 lg:max-w-md">
              <p>
                Konrad te Heesen, Lukas Strickler, Marco Ginaneschi, and Franz
                Dieter added their own experiences and perspectives. A few things
                the original guide had missed. A few things only a different team
                would notice.
              </p>
              <p>
                That is how an internal document from one team became something
                worth sharing publicly.
              </p>
            </div>
          </div>

          <figure className="lg:col-span-7 lg:col-start-6">
            <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
              <Image
                src="/hackathon-proof/konrad-hack-team.jpeg"
                alt="Konrad's team winning the Hackathon Pitchbattle"
                fill
                sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) calc(100vw - 3rem), 58vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 flex justify-between gap-4 text-[9px] uppercase tracking-[0.16em] text-black/45 sm:text-[10px]">
              <span>Hackathon Pitchbattle</span>
              <span>Winning team</span>
            </figcaption>
          </figure>
        </section>
      </main>
    </div>
  );
}
