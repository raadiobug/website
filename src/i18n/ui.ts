/**
 * UI strings + language metadata. Persian (fa) is the default locale and lives
 * at the site root; English (en) lives under /en. Add a key to BOTH `fa` and
 * `en` blocks — TypeScript enforces parity via the `UISchema` type.
 */

export const languages = {
  fa: 'فارسی',
  en: 'English'
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'fa';

export const dir: Record<Lang, 'rtl' | 'ltr'> = {
  fa: 'rtl',
  en: 'ltr'
};

export const localeTag: Record<Lang, string> = {
  fa: 'fa-IR',
  en: 'en-US'
};

const fa = {
  'site.name': 'رادیو باگ',
  'site.tagline': 'پادکستی درباره‌ی تست نرم‌افزار و تضمین کیفیت',
  'site.description':
    'رادیو باگ، پادکستی فارسی درباره‌ی تست نرم‌افزار، تضمین کیفیت (QA) و تجربه‌ی مهندسان کیفیت.',

  'nav.home': 'خانه',
  'nav.episodes': 'اپیزودها',
  'nav.about': 'درباره',
  'nav.menu': 'منو',

  'hero.badge': 'پادکست تست و کیفیت نرم‌افزار',
  'hero.listenOn': 'بشنوید در',
  'hero.latest': 'تازه‌ترین اپیزودها',
  'hero.viewAll': 'دیدن همه‌ی اپیزودها',

  'episodes.title': 'اپیزودها',
  'episodes.subtitle': 'همه‌ی گفت‌وگوها در یک‌جا',
  'episodes.count': 'اپیزود',
  'episodes.episode': 'اپیزود',
  'episodes.guest': 'مهمان',
  'episodes.listen': 'مشاهده اپیزود',
  'episodes.showNotes': 'یادداشت‌های اپیزود',
  'episodes.guestProfile': 'پروفایل مهمان',
  'episodes.empty': 'هنوز اپیزودی منتشر نشده است.',
  'episodes.back': 'بازگشت به اپیزودها',

  'about.title': 'درباره‌ی رادیو باگ',
  'about.body':
    'رادیو باگ جایی است برای گفت‌وگو درباره‌ی تست نرم‌افزار، تضمین کیفیت و مسیر حرفه‌ای مهندسان کیفیت. هر اپیزود میزبان یک متخصص است.',

  'theme.label': 'تم',
  'theme.light': 'روشن',
  'theme.dark': 'تیره',
  'theme.system': 'سیستم',

  'lang.label': 'زبان',

  'footer.follow': 'ما را دنبال کنید',
  'footer.tagline': 'ساخته‌شده با ❤ برای جامعه‌ی تست نرم‌افزار',
  'footer.rights': 'همه‌ی حقوق محفوظ است.',

  'state.loading': 'در حال بارگذاری…',
  'state.playerError': 'پخش‌کننده بارگذاری نشد.',
  'state.openInstead': 'در عوض، در پلتفرم باز کنید',

  'notFound.title': 'صفحه پیدا نشد',
  'notFound.body': 'صفحه‌ای که دنبالش بودید وجود ندارد.',
  'notFound.home': 'بازگشت به خانه'
} as const;

type UISchema = Record<keyof typeof fa, string>;

const en: UISchema = {
  'site.name': 'RadioBug',
  'site.tagline': 'A podcast about software testing & quality assurance',
  'site.description':
    'RadioBug is a Persian podcast about software testing, quality assurance (QA), and the craft of quality engineering.',

  'nav.home': 'Home',
  'nav.episodes': 'Episodes',
  'nav.about': 'About',
  'nav.menu': 'Menu',

  'hero.badge': 'Software testing & QA podcast',
  'hero.listenOn': 'Listen on',
  'hero.latest': 'Latest episodes',
  'hero.viewAll': 'View all episodes',

  'episodes.title': 'Episodes',
  'episodes.subtitle': 'Every conversation in one place',
  'episodes.count': 'episodes',
  'episodes.episode': 'Episode',
  'episodes.guest': 'Guest',
  'episodes.listen': 'Open episode',
  'episodes.showNotes': 'Show notes',
  'episodes.guestProfile': 'Guest profile',
  'episodes.empty': 'No episodes published yet.',
  'episodes.back': 'Back to episodes',

  'about.title': 'About RadioBug',
  'about.body':
    'RadioBug is a space to talk about software testing, quality assurance, and the career path of quality engineers. Each episode hosts an expert from the field.',

  'theme.label': 'Theme',
  'theme.light': 'Light',
  'theme.dark': 'Dark',
  'theme.system': 'System',

  'lang.label': 'Language',

  'footer.follow': 'Follow us',
  'footer.tagline': 'Made with ❤ for the software testing community',
  'footer.rights': 'All rights reserved.',

  'state.loading': 'Loading…',
  'state.playerError': 'The player failed to load.',
  'state.openInstead': 'Open on the platform instead',

  'notFound.title': 'Page not found',
  'notFound.body': 'The page you were looking for does not exist.',
  'notFound.home': 'Back to home'
};

export const ui = { fa, en } as const;

export type UIKey = keyof UISchema;
