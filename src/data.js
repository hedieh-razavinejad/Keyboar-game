export const LAYOUT = [
  'ضصثقفغعهخحجچ'.split(''),
  'شسیبلاتنمکگ'.split(''),
  'طزرذدپو'.split(''),
]
export const LETTERS = LAYOUT.flat()

const ROW_START = [1, 2, 4]
export const KEYS = LAYOUT.flatMap((row, r) =>
  row.map((letter, i) => ({ letter, row: r + 1, col: ROW_START[r] + i * 2 })),
)

export const MAX_LIVES = 3
export const TOTAL_TIME = 120
export const TIME_PENALTY = 2
export const SAFE_COUNT = 20
export const BOMB_COUNT = LETTERS.length - SAFE_COUNT - 1

export const FINISHES = ['ink']

export const TONES = {
  ok: 'border-cyan-400 text-cyan-300',
  warn: 'border-bread-400 text-bread-300',
  bad: 'border-red-500 text-red-400',
  info: 'border-blue-400 text-blue-200',
}

export const SIDE_TONES = {
  ok: ['border-emerald-400/70 bg-emerald-500/10 text-emerald-300', '✔'],
  bad: ['border-red-500/70 bg-red-500/10 text-red-400', '✖'],
  warn: ['border-red-400/60 bg-red-500/10 text-red-300', '!'],
  info: ['border-blue-400/70 bg-blue-500/10 text-blue-300', 'i'],
}

export const CHIP = {
  ok: 'bg-cyan-500',
  warn: 'bg-bread-500',
  bad: 'bg-red-500',
}

export const SAY = {
  wrong: ['این نبود، یکی دیگه.', 'نه، این هم نبود.', 'نزدیک نبودی؛ دوباره امتحان کن.', 'این کلید هدف نیست، ادامه بده.', 'حواست باشه، وقت داره می‌گذره.'],
  bomb: ['آخ! مین بود، یک جان رفت.', 'ترکید! ولی هنوز توی بازی هستی.', 'مین خوردی؛ این بار دقیق‌تر.', 'این یکی تله بود.'],
  win: ['پیداش کردی! همین بود.', 'آفرین، درست زدی!', 'دقیقاً همین بود، حرفی نیست.'],
}

export const VARIANTS = {
  first: ['تیرِ اول', 'از همون اولین حدس پیداش کردی؛ باورم نمی‌شه!', '#E8C48A'],
  lastSecond: ['روی خط پایان', 'ده ثانیه هم نمونده بود و رسیدی. نفس‌مون بند اومد!', '#FF4D5E'],
  survivor: ['از دلِ آتش', 'مین خوردی ولی ول نکردی؛ همین مهمه.', '#E8772E'],
  lastLife: ['لبهٔ تیغ', 'با آخرین جانت بردی. قلبمون ایستاد!', '#9A5BFF'],
  clean: ['شکارچی تمیز', 'بدون یک مین، یک‌راست رفتی سراغش.', '#38E3D0'],
  time: ['ساعتِ بی‌رحم', 'وقت زود تموم شد. دفعهٔ بعد یک حدس سریع‌تر بزن.', '#E8C48A'],
  lives: ['دورِ مین‌ها', 'سه مین پشت هم. این دور شانس باهات نبود.', '#FF4D5E'],
}

export function normalize(text) {
  return text.replace(/\s/g, '').replace('ي', 'ی').replace('ك', 'ک').replace('آ', 'ا')
}

export function isPersianText(text) {
  return /^[؀-ۿ]+$/.test(text) && !/[0-9۰-۹٠-٩]/.test(text)
}

export function toFa(n) {
  return String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d])
}

export function pick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

export function shuffle(list) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export const INPUT_ERRORS = {
  digit: [
    ['عدد نه، حرف!', '{n}، اینجا با حرف کار می‌کنیم. یک حرف فارسی بزن.'],
    ['عددها اینجا کار نمی‌کنند', '{n}، برو سراغ حرف‌ها.'],
  ],
  notPersian: [
    ['فقط فارسی', '{n}، کیبوردت را فارسی کن و دوباره بزن.'],
    ['این حرف را نمی‌شناسم', '{n}، فقط حروف فارسی جواب می‌دهند.'],
  ],
  many: [
    ['یکی یکی!', '{n}، هر بار فقط یک حرف.'],
    ['یواش‌تر', '{n}، چند حرف را با هم نمی‌شود فرستاد.'],
  ],
  outside: [
    ['این حرف توی بازی نیست', '{n}، «{c}» جزو سی حرف ما نیست.'],
  ],
  repeated: [
    ['این را زدی', '{n}، «{c}» قبلاً امتحان شده. یکی دیگر.'],
    ['تکراری است', '{n}، «{c}» را دیدیم؛ سراغ حرف تازه برو.'],
  ],
}

export function inputMessage(kind, name, letter) {
  const [title, text] = pick(INPUT_ERRORS[kind])
  return [title, text.replace('{n}', name).replace('{c}', letter || '')]
}
