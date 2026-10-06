import hero960 from "../assets/hero-960.webp";
import hero1920 from "../assets/hero-1920.webp";
import { focusRing } from "../lib/site.ts";

/*
 * TODO: real copy. Layout below is final — only these strings change.
 * The headline is capped at 38ch because the photo's right 40% is burned out
 * to luma 0.96-0.99 by the composited logo, so text cannot cross into it.
 */
const HERO = {
  eyebrow: "WE ROAR AS ONE",
  headline: "College of Engineering and Information Technology Student Council",
  lede: "The highest student governing body of College of Engineering and Information Technology at Cavite State University - Don Severino de las Alas Campus",
  cta: { label: "Apply now", href: "#apply" },
} as const;

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-base"
    >
      {/* Decorative: the photo sits behind text, so it carries no alt text. */}
      <img
        src={hero1920}
        srcSet={`${hero960} 960w, ${hero1920} 1920w`}
        sizes="100vw"
        alt=""
        aria-hidden="true"
        width={1920}
        height={900}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-left"
      />

      {/* Scrim: dense enough for AA on the left, gone by 75% so the logo reads */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-base from-2% via-base/70 via-40% to-base/0 to-75%"
      />

      {/* Fills exactly the space under the sticky header. The two values are the
          header's own measured heights, not guesses: the utility bar is h-18
          (4.5rem) and the nav row adds 3rem, so 7.5625rem below lg. A single
          value would leave a 49px seam on phones, where the nav is hidden. */}
      <div className="mx-auto flex min-h-[calc(100svh-4.5rem)] max-w-[1440px] flex-col justify-end px-4 py-16 sm:px-6 sm:py-20 lg:min-h-[calc(100svh-7.5625rem)] lg:px-8 lg:py-24 [@media(max-height:640px)]:py-8">
        {/* rem, not ch: a ch cap resolves against this element's own 16px font
            and collapsed the headline to ~400px / 4 lines at 1440. */}
        <div className="max-w-[38rem]">
          {/* accent, not brand: brand orange only reaches 4.97:1 here because
              the scrim happens to be dark. accent holds 6.37:1. */}
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
            {HERO.eyebrow}
          </p>

          <h1
            id="hero-heading"
            className="mt-5 font-display text-display font-extrabold leading-[1.05] tracking-[-0.03em] text-balance text-ink [@media(max-height:640px)]:mt-3"
          >
            {HERO.headline}
          </h1>

          <p className="mt-6 max-w-[38ch] text-lede text-ink-2 [@media(max-height:640px)]:mt-3">
            {HERO.lede}
          </p>

          <a
            href={HERO.cta.href}
            className={`mt-9 inline-block bg-brand px-6 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-on-brand transition-colors duration-(--duration-fast) hover:bg-accent [@media(max-height:640px)]:mt-4 ${focusRing}`}
          >
            {HERO.cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
