/*
 * Shared site IA.
 *
 * Anything two components both need to know lives here, so a content change is
 * one edit: Header and Footer read the same nav, the same CTA, the same focus
 * ring. Kept deliberately flat — no nesting, no helpers beyond the hours maths,
 * which sits next to the schedule it reads.
 */

/*
 * TODO: real IA copy. The layout in the components is final — only these strings
 * and hrefs change.
 */
export const NAV = [
  { label: "Section 01", href: "#section-01" },
  { label: "Section 02", href: "#section-02" },
  { label: "Section 03", href: "#section-03" },
  { label: "Section 04", href: "#section-04" },
  { label: "Section 05", href: "#section-05" },
  { label: "Section 06", href: "#section-06" },
] as const;

export const CTA = { label: "Call to action", href: "#cta" } as const;

/*
 * No phone number on purpose. A placeholder like "+63 900 000 0000" looks
 * dialable, so on a phone it silently calls someone who is not the council.
 * An absent number is honest; a wrong one is worse than no link at all. Add it
 * back here when there is a real one to dial.
 */
export const CONTACT = {
  office: "CEIT-SC Office, CCL 201, DIT Building",
  lines: ["Don Severino de las Alas Campus", "Indang, Cavite"],
  email: "cvsu-ceitsc@gmail.com",
} as const;

/*
 * TODO: real profile URLs. These point at example.com on purpose: a plausible
 * facebook.com/ceitsc would 404 in production while looking like a real link.
 *
 * `id` keys into GLYPHS in Footer.tsx. Adding a network means adding the
 * react-icons import there and one entry here.
 */
export const SOCIAL = [
  {
    id: "facebook",
    label: "Facebook",
    href: "https://facebook.com/ceitsc.cvsumain",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://instagram.com/ceitsc.cvsumain",
  },
] as const;

/*
 * The one focus treatment, hoisted out of Header.tsx and Hero.tsx so three
 * components cannot drift apart on it.
 */
export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/* ---------- Office hours ---------- */

/** A block the council is at its desk. */
type HoursBlock = {
  /** 0 = Sunday … 6 = Saturday, matching Date#getDay. */
  readonly days: readonly number[];
  /** 24h wall-clock `HH:MM`, interpreted in Asia/Manila. */
  readonly opens: string;
  readonly closes: string;
};

/*
 * TODO: the council's real schedule, including holidays. Until then this reads
 * as authoritative on a live strip, so keep the placeholder honest.
 */
export const OFFICE_HOURS: readonly HoursBlock[] = [
  { days: [1, 2, 3, 4, 5], opens: "08:00", closes: "17:00" },
];

/**
 * The council's timezone, pinned. The alternative — the visitor's own clock —
 * is wrong for anyone who is not a student on campus, which is everyone reading
 * this strip from abroad or from a machine set to another zone.
 */
const TZ = "Asia/Manila";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

/**
 * Manila wall time, as a Date whose **UTC** getters read correctly.
 *
 * Manila's fields are formatted once and re-seated as if they were UTC, so the
 * result can be read with getUTCDay/getUTCHours without parsing English
 * short-day abbreviations or worrying that some locale formats midnight as
 * `24`. Reading those UTC getters is also what makes the answer independent of
 * whatever timezone the visitor's machine is set to.
 */
function manilaNow(now: Date): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(now);

  const field = (type: Intl.DateTimeFormatPartTypes): number =>
    Number(parts.find((p) => p.type === type)?.value);

  const manilaAsUtc = Date.UTC(
    field("year"),
    field("month") - 1,
    field("day"),
    field("hour"),
    field("minute"),
    field("second"),
  );

  return new Date(now.getTime() + (manilaAsUtc - now.getTime()));
}

const toMinutes = (hhmm: string): number => {
  const [hours, minutes] = hhmm.split(":").map(Number);
  return hours * 60 + minutes;
};

const formatTime = (hhmm: string): string => {
  const [rawHours, minutes] = hhmm.split(":").map(Number);
  const hours = rawHours % 12 === 0 ? 12 : rawHours % 12;
  const suffix = rawHours >= 12 ? "PM" : "AM";
  return minutes === 0
    ? `${hours} ${suffix}`
    : `${hours}:${String(minutes).padStart(2, "0")} ${suffix}`;
};

const blocksOn = (day: number): HoursBlock[] =>
  OFFICE_HOURS.filter((block) => block.days.includes(day)).sort(
    (a, b) => toMinutes(a.opens) - toMinutes(b.opens),
  );

export type OfficeStatus = {
  /** Drives the accent-vs-muted treatment of the label. */
  open: boolean;
  /** The one word that gets emphasis. */
  label: string;
  /** The rest of the sentence, never carrying meaning on its own. */
  detail: string;
};

/**
 * Open or closed right now, in Manila — and if closed, when it next opens.
 *
 * Looks ahead a full week, so a council with no published hours at all degrades
 * to a plain "no hours published" rather than an empty strip.
 */
export const officeStatus = (now: Date = new Date()): OfficeStatus => {
  // UTC getters, not local ones — see manilaNow.
  const local = manilaNow(now);
  const today = local.getUTCDay();
  const nowMinutes = local.getUTCHours() * 60 + local.getUTCMinutes();

  const openBlock = blocksOn(today).find(
    (block) =>
      nowMinutes >= toMinutes(block.opens) &&
      nowMinutes < toMinutes(block.closes),
  );

  if (openBlock) {
    return {
      open: true,
      label: "Open",
      detail: `until ${formatTime(openBlock.closes)} today`,
    };
  }

  for (let ahead = 0; ahead <= 7; ahead++) {
    const day = (today + ahead) % 7;
    const next = blocksOn(day).find(
      (block) => ahead > 0 || toMinutes(block.opens) > nowMinutes,
    );
    if (next) {
      const when = ahead === 0 ? "opens at" : `opens ${DAY_NAMES[day]}`;
      return {
        open: false,
        label: "Closed",
        detail: `${when} ${formatTime(next.opens)}`,
      };
    }
  }

  return { open: false, label: "Closed", detail: "no office hours published" };
};
