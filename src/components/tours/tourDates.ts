// Compact date ranges for the credits line. Formatted by hand rather than with
// Intl.DateTimeFormat#formatRange: Node and browsers ship different ICU data
// (different spaces around the dash), which breaks hydration.
//
//   en: "5 Dec 2025", "23–28 Nov 2026", "29 Nov – 3 Dec 2026", "29 Dec 2026 – 3 Jan 2027"
//   ja: "2025年12月5日", "2026年11月23日～28日", "2026年11月29日～12月3日"
//
// Sanity dates are plain YYYY-MM-DD, so they are read in UTC to avoid off-by-one days.

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function toDate(value: string): Date | null {
    if (!value) return null;
    const d = new Date(`${value.slice(0, 10)}T00:00:00Z`);
    return Number.isNaN(d.getTime()) ? null : d;
}

function parts(d: Date) {
    return { day: d.getUTCDate(), month: d.getUTCMonth(), year: d.getUTCFullYear() };
}

function formatEn(from: Date, to: Date): string {
    const a = parts(from);
    const b = parts(to);
    if (a.year !== b.year) return `${a.day} ${MONTHS_EN[a.month]} ${a.year} – ${b.day} ${MONTHS_EN[b.month]} ${b.year}`;
    if (a.month !== b.month) return `${a.day} ${MONTHS_EN[a.month]} – ${b.day} ${MONTHS_EN[b.month]} ${b.year}`;
    if (a.day !== b.day) return `${a.day}–${b.day} ${MONTHS_EN[b.month]} ${b.year}`;
    return `${a.day} ${MONTHS_EN[a.month]} ${a.year}`;
}

function formatJa(from: Date, to: Date): string {
    const a = parts(from);
    const b = parts(to);
    const start = `${a.year}年${a.month + 1}月${a.day}日`;
    if (a.year !== b.year) return `${start}～${b.year}年${b.month + 1}月${b.day}日`;
    if (a.month !== b.month) return `${start}～${b.month + 1}月${b.day}日`;
    if (a.day !== b.day) return `${start}～${b.day}日`;
    return start;
}

export function formatTourDates(start: string, end: string, locale: string): string {
    const from = toDate(start);
    const to = toDate(end) ?? from;
    if (!from || !to) return '';
    return locale === 'ja' ? formatJa(from, to) : formatEn(from, to);
}

/** True when the tour starts today or later, compared in UTC like the dates themselves. */
export function isUpcoming(start: string): boolean {
    const from = toDate(start);
    if (!from) return false;
    const now = new Date();
    const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    return from.getTime() >= today;
}
