import { useEffect, useState } from 'react'
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa6'
import { CONTACT, NAV, SOCIAL, focusRing, officeStatus } from '../lib/site.ts'

/*
 * Brand marks come from react-icons/fa6, imported from the per-family subpath so
 * only these three land in the bundle (the full package is ~150MB unpacked).
 *
 * They're the filled brand artwork rather than the stroked outline the rest of
 * the icon set uses, so they sit a little heavier than MenuIcon and Search at
 * the same size — that difference is the brands', not ours, and shrinking them
 * to compensate makes them read worse.
 */
const GLYPHS = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  youtube: FaYoutube,
} as const

/*
 * Three tiers: a full-width status strip, the columns, a hairline baseline.
 *
 * `bg-surface` deliberately bookends the header's surface, so the page reads as
 * chrome above and below one continuous base-coloured field. That is also why
 * this needed no new tokens — everything below already exists in the theme.
 */
export default function Footer() {
  /*
   * One clock, sampled once a minute, feeding both the status strip and the
   * copyright year — so neither can drift from the other, and neither can go
   * stale in a tab someone left open. Reading the clock inside render instead
   * would make the year whatever it was at first paint.
   *
   * Deliberately no aria-live on the strip: it changes at most twice a day, and
   * a polite region that fires on a timer is a screen reader interrupting
   * someone for nothing. Read on demand instead.
   */
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const status = officeStatus(now)

  return (
    <footer className="bg-surface text-ink">
      {/* Status strip — full width, above the columns, so it reads as a utility
          bar rather than as one more link column. */}
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
          {/* Colour repeats the word beside it, so the dot carries no meaning of
              its own — hide it rather than leave an unlabelled shape. */}
          <span
            aria-hidden="true"
            className={`size-2 shrink-0 ${status.open ? 'bg-brand' : 'bg-ink-2'}`}
          />
          <p className="text-xs uppercase tracking-[0.1em] text-ink-2">
            {/* accent, not brand: #fb6818 on this surface is 3.98:1 and fails
                AA for 12px text. #ff8c47 holds 5.10:1. */}
            <span
              className={`font-bold ${status.open ? 'text-accent' : 'text-ink'}`}
            >
              {status.label}
            </span>
            <span aria-hidden="true"> — </span>
            {status.detail}
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-12 lg:px-8 lg:py-20">
        {/* Identity */}
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/ceit-sc_2026.webp"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12"
            />
            {/* The logo is decorative here: the wordmark beside it is the name. */}
            <p className="font-display text-lg font-extrabold tracking-tight">
              CEIT-SC
            </p>
          </div>
          <p className="mt-6 max-w-[34ch] text-sm leading-relaxed text-ink-2">
            College of Engineering and Information Technology Student Council
          </p>

          {/*
            Sits here rather than in the baseline because this column already
            ran short of the other two, and because a row of bordered squares is
            a recognisable shape at 390px where the words would not be.
          */}
          <ul className="mt-8 flex flex-wrap gap-3">
            {SOCIAL.map((channel) => {
              const Icon = GLYPHS[channel.id]
              return (
              <li key={channel.id}>
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`grid size-11 place-items-center border border-line text-ink-2 transition-colors duration-(--duration-fast) hover:border-accent hover:text-accent active:border-brand active:text-brand motion-reduce:transition-none ${focusRing}`}
                >
                  <Icon aria-hidden="true" />
                  {/* The link is icon-only, so this is its accessible name. No
                      aria-label: that would override the visible text a voice
                      control user reads off the page. Announce the new tab here
                      instead of leaving it as a silent surprise. */}
                  <span className="sr-only">
                    {channel.label} (opens in a new tab)
                  </span>
                </a>
              </li>
              )
            })}
          </ul>
        </div>

        {/* Two navs on one page need labels that tell them apart, and the
            header's is already "Sections". */}
        <nav aria-label="Footer">
          <h2 className="text-xs font-bold uppercase tracking-[0.1em] text-ink">
            Sections
          </h2>
          <ul className="mt-5">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`block py-2 text-sm text-ink-2 transition-colors duration-(--duration-fast) hover:text-accent active:text-brand motion-reduce:transition-none ${focusRing}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact. address, not a div: it is contact info for the people who
            published the page. */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.1em] text-ink">
            Contact
          </h2>
          <address className="mt-5 not-italic text-sm text-ink-2">
            <p className="text-ink">{CONTACT.office}</p>
            <p className="mt-1">
              {CONTACT.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <ul className="mt-5">
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className={`block py-2 transition-colors duration-(--duration-fast) hover:text-accent active:text-brand motion-reduce:transition-none ${focusRing}`}
                >
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </address>
        </div>
      </div>

      {/* Baseline */}
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-6 text-2xs uppercase tracking-[0.1em] text-ink-2 sm:px-6 lg:px-8">
          <p>
            © {now.getFullYear()} CEIT-SC · Cavite State University
          </p>
          <p className="text-accent sm:ml-auto">We roar as one</p>
        </div>
      </div>
    </footer>
  )
}