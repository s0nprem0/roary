import { Search } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { CTA, NAV, focusRing } from '../lib/site.ts'

/* Menu glyph is still hand-rolled because it swaps shape between open/closed. */
function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      {open ? (
        <path d="m4 4 12 12M16 4 4 16" strokeLinecap="square" />
      ) : (
        <path d="M2.5 5.5h15M2.5 14.5h15" strokeLinecap="square" />
      )}
    </svg>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Escape closes the mobile panel and returns focus to the control that opened it.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-50 bg-surface text-ink">
      {/* Utility bar — 72px, so utility 72 + nav 48 ≈ the reference's measured 120px */}
      <div className="mx-auto flex h-18 max-w-[1440px] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <a href="/" className={`shrink-0 ${focusRing}`}>
          <img
            src="/ceit-sc_2026.webp"
            alt="CEIT SC"
            width={48}
            height={48}
            className="h-12 w-12"
          />
        </a>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            aria-label="Search"
            className={`grid size-11 place-items-center text-ink transition-colors duration-(--duration-fast) hover:text-accent ${focusRing}`}
          >
            <Search className="size-5" strokeWidth={1.6} aria-hidden="true" />
          </button>

          {/* The one saturated orange in the header, matching the logo core exactly */}
          <a
            href={CTA.href}
            className={`hidden bg-brand px-4 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-on-brand transition-colors duration-(--duration-fast) hover:bg-accent sm:block ${focusRing}`}
          >
            {CTA.label}
          </a>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className={`grid size-11 place-items-center text-ink transition-colors duration-(--duration-fast) hover:text-accent lg:hidden ${focusRing}`}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      {/* Section nav — the 12px/700 uppercase signature lifted from the reference */}
      <nav aria-label="Sections" className="hidden border-t border-line lg:block">
        <ul className="mx-auto flex max-w-[1440px] items-center px-4 sm:px-6 lg:px-8">
          {NAV.map((item, i) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={i === 0 ? 'page' : undefined}
                className={`relative block px-3 py-4 text-xs font-bold uppercase tracking-[0.1em] transition-colors duration-(--duration-fast) after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-(--duration-fast) hover:text-accent hover:after:scale-x-100 focus-visible:text-accent focus-visible:after:scale-x-100 motion-reduce:after:transition-none lg:after:inset-x-3 ${
                  i === 0 ? 'text-accent after:scale-x-100' : 'text-ink'
                } ${focusRing}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile disclosure panel */}
      <div id={panelId} hidden={!open} className="border-t border-line lg:hidden">
        <ul className="divide-y divide-line">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-4 text-xs font-bold uppercase tracking-[0.1em] transition-colors duration-(--duration-fast) hover:bg-base hover:text-accent ${focusRing}`}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={CTA.href}
              onClick={() => setOpen(false)}
              className={`block bg-brand px-4 py-4 text-xs font-bold uppercase tracking-[0.1em] text-on-brand transition-colors duration-(--duration-fast) hover:bg-accent sm:hidden ${focusRing}`}
            >
              {CTA.label}
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}