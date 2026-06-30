import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f6f1e7] font-serif text-[#241c12]">
      <header className="sticky top-0 z-30 border-b border-[#241c12]/15 bg-[#f6f1e7]/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#8a6d3b] transition-colors hover:text-[#241c12]"
          >
            ← Hackathon Guidebook
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-28 pt-16 sm:px-6">
        {/* Opening */}
        <div className="border-b border-[#241c12]/15 pb-16">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-[#b4530a]">
            Origin
          </p>
          <h1 className="mt-5 text-[clamp(2.6rem,6.5vw,4.8rem)] font-light leading-[0.92]">
            How this came to be.
          </h1>
          <p className="mt-7 max-w-2xl text-xl font-light leading-snug text-[#241c12]/65">
            Two teams. A few hackathons. One shared document that kept getting
            better.
          </p>
        </div>

        {/* Good Boys section */}
        <section className="border-b border-[#241c12]/15 py-16">
          <div className="relative aspect-[3/2] overflow-hidden rounded-xl">
            <Image
              src="/hackathon-proof/good-boys-start.jpg"
              alt="The Good Boys team winning at Start Hack with the Syngenta prize"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
          </div>

          <div className="mt-10 max-w-2xl">
            <p className="font-sans text-[11px] uppercase tracking-[0.35em] text-[#b4530a]">
              The Good Boys
            </p>
            <h2 className="mt-5 text-[2.2rem] font-light leading-tight">
              The team that started it.
            </h2>
            <div className="mt-6 space-y-5 font-sans text-[16px] leading-7 text-[#241c12]/65">
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

        {/* Bridge */}
        <div className="border-b border-[#241c12]/15 py-14">
          <p className="max-w-2xl text-[1.35rem] font-light leading-[1.55] text-[#241c12]/65">
            At Start Hack they met Konrad and his team. They shared the guidebook.
            Konrad&apos;s team used it and won their next hackathon. They came back
            with things the guide had missed.
          </p>
        </div>

        {/* Konrad's team */}
        <section className="pt-16">
          <div className="relative aspect-[3/2] overflow-hidden rounded-xl">
            <Image
              src="/hackathon-proof/konrad-hack-team.jpeg"
              alt="Konrad's team winning the Hackathon Pitchbattle"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>

          <div className="mt-10 max-w-2xl">
            <p className="font-sans text-[11px] uppercase tracking-[0.35em] text-[#b4530a]">
              Konrad and the team
            </p>
            <h2 className="mt-5 text-[2.2rem] font-light leading-tight">
              The team that made it better.
            </h2>
            <div className="mt-6 space-y-5 font-sans text-[16px] leading-7 text-[#241c12]/65">
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
        </section>
      </main>
    </div>
  );
}
