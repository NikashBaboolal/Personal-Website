import Image from "next/image";
import { Container } from "@/components/container";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { about, person } from "@/lib/content";
import { getMedia } from "@/lib/media";
import { MoleculeLattice } from "@/components/layout/process-art";
import { HighlightCards } from "./highlight-cards";
import { StatsRow } from "./stats-row";

/** About page: the full personal introduction in a two-column editorial layout. */
export function IntroductionEditorial() {
  const [first, ...rest] = about;
  // A plant photo sits behind the monogram; no stock image is presented as a portrait.
  const photo = getMedia("pipes");

  return (
    <section id="introduction" className="bg-background relative overflow-hidden py-24 md:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* left rail */}
          <div className="lg:col-span-4">
            <div className="flex flex-col gap-8 lg:sticky lg:top-28">
              <span className="font-dm-mono text-muted-foreground inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase">
                <span className="bg-flame inline-block size-1.5 rounded-full" />
                About me
              </span>
              <Reveal className="border-line bg-night relative aspect-[4/5] overflow-hidden rounded-3xl border">
                {photo ? (
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, 100vw"
                    placeholder={photo.blurDataURL ? "blur" : "empty"}
                    blurDataURL={photo.blurDataURL}
                    className="object-cover opacity-30"
                  />
                ) : null}
                <FallbackArt />
                <div className="from-night/85 absolute inset-x-0 bottom-0 bg-linear-to-t to-transparent p-6 pt-24">
                  <p className="font-display text-2xl font-extrabold tracking-tight text-white">{person.name}</p>
                  <p className="font-dm-mono mt-1 text-xs tracking-[0.2em] text-white/80 uppercase">
                    {person.role} · {person.ecsa}
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

          {/* editorial copy */}
          <div className="lg:col-span-8">
            <h2 className="font-display text-foreground text-3xl leading-[1.08] font-extrabold tracking-tight text-balance md:text-5xl">
              <TextReveal text="Rigorous, safety-first process engineering, backed by data." />
            </h2>
            <Reveal delay={0.1}>
              <p className="text-foreground first-letter:font-display first-letter:text-teal-600 mt-10 text-lg leading-relaxed first-letter:float-left first-letter:mr-3 first-letter:text-7xl first-letter:leading-[0.8] first-letter:font-black md:text-xl">
                {first}
              </p>
            </Reveal>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {rest.map((paragraph, i) => (
                <Reveal
                  key={paragraph}
                  delay={0.1 + i * 0.08}
                  className={i === rest.length - 1 ? "md:col-span-2" : undefined}
                >
                  <p className="text-muted-foreground border-line border-t pt-6 text-base leading-relaxed">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>
            <StatsRow className="mt-14" />
            <HighlightCards className="mt-4" />
          </div>
        </div>
      </Container>
    </section>
  );
}

function FallbackArt() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <MoleculeLattice opacity={0.18} />
      <div className="absolute top-1/4 left-1/2 size-64 -translate-x-1/2 rounded-full bg-teal-400/25 blur-3xl" />
      <div className="absolute inset-0 grid place-items-center">
        {/* monogram inside a benzene ring */}
        <svg viewBox="0 0 200 200" className="absolute size-[78%]">
          <polygon
            points="100,14 174.48,57 174.48,143 100,186 25.52,143 25.52,57"
            fill="rgba(6,16,30,0.55)"
            stroke="#2dd4bf"
            strokeOpacity="0.7"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="100" cy="100" r="58" fill="none" stroke="#22d3ee" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="2 4" />
        </svg>
        <span className="font-display text-flame relative text-8xl font-black">{person.initials}</span>
      </div>
    </div>
  );
}
