// Shared risk helpers. Colours come from the CSS tokens in styles/global.css
// so map, badges, table and charts always match.

export const RISK_LEVELS = ['low', 'medium', 'high'];

const FALLBACK = { low: '#3f8f5a', medium: '#d9952b', high: '#c2412d' };
let cache = null;

/** { low, medium, high } hex colours read from --risk-* CSS variables */
export function riskColors() {
  if (cache) return cache;
  const css = getComputedStyle(document.documentElement);
  cache = Object.fromEntries(
    RISK_LEVELS.map((l) => [l, css.getPropertyValue(`--risk-${l}`).trim() || FALLBACK[l]])
  );
  return cache;
}

/** Read any CSS custom property (SVG attributes can't use var() directly) */
export function cssVar(name, fallback = '') {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

export const formatPct =(p) => `${Math.round(p * 100)}%`;

// Khmer dates are formatted by hand: Chrome's built-in Intl data has no Khmer locale
// and silently falls back to English. Names are DRAFT (see KHMER_TO_REVIEW.md).
const KM_MONTHS = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
const KM_WEEKDAYS = ['អាទិត្យ', 'ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
const KM_WEEKDAYS_SHORT = ['អា', 'ច', 'អ', 'ពុ', 'ព្រ', 'សុ', 'ស'];
const KM_DIGITS = '០១២៣៤៥៦៧៨៩';
export const toKhmerDigits = (s) => String(s).replace(/[0-9]/g, (d) => KM_DIGITS[d]);

function formatKhmerDate(date, opts) {
  const parts = [];
  if (opts.weekday) parts.push((opts.weekday === 'short' ? KM_WEEKDAYS_SHORT : KM_WEEKDAYS)[date.getDay()]);
  if (opts.month === 'numeric') {
    parts.push(toKhmerDigits(`${date.getDate()}/${date.getMonth() + 1}`));
  } else {
    if (opts.day) parts.push(toKhmerDigits(date.getDate()));
    if (opts.month) parts.push(KM_MONTHS[date.getMonth()]);
  }
  if (opts.year) parts.push(toKhmerDigits(date.getFullYear()));
  return parts.join(' ');
}

/** "24 Nov 2026" / "២៤ វិច្ឆិកា ២០២៦". `opts` uses Intl.DateTimeFormat option names. */
export function formatDate(iso, lang, opts = { day: 'numeric', month: 'short', year: 'numeric' }) {
  const date = new Date(`${iso}T00:00:00`);
  if (lang === 'km') return formatKhmerDate(date, opts);
  return date.toLocaleDateString('en-GB', opts);
}
