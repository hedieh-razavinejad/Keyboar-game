import { ref, reactive, computed, onUnmounted } from 'vue'
import {
  LETTERS,
  MAX_LIVES,
  TOTAL_TIME,
  TIME_PENALTY,
  BOMB_COUNT,
  CHIP,
  SAY,
  VARIANTS,
  inputMessage,
  normalize,
  isPersianText,
  toFa,
  pick,
  shuffle,
} from '../data'

export function useGame() {
  const player = ref('')
  const started = ref(false)
  const playing = ref(false)
  const score = ref(0)
  const lives = ref(MAX_LIVES)
  const timeLeft = ref(TOTAL_TIME)
  const picks = ref(0)
  const bombHits = ref(0)
  const targetIndex = ref(0)
  const bombIndexes = ref([])
  const keyState = reactive({})
  const tray = ref([])
  const status = ref({ id: 0, tone: 'info', head: '', text: '' })
  const result = ref(null)
  const shaking = ref(false)
  const mood = ref('typing')

  let timer = null
  let statusId = 0
  let moodTimer = null

  function setMood(value, backAfter = 0) {
    clearTimeout(moodTimer)
    mood.value = value
    if (backAfter) moodTimer = setTimeout(() => playing.value && (mood.value = 'typing'), backAfter)
  }

  const timeText = computed(() => {
    const seconds = Math.max(0, timeLeft.value)
    return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0')
  })
  const timePercent = computed(() => (Math.max(0, timeLeft.value) / TOTAL_TIME) * 100)
  const timeColor = computed(() => {
    if (timeLeft.value <= 10) return 'bg-red-500'
    if (timeLeft.value <= 30) return 'bg-bread-400'
    return 'bg-cyan-400'
  })
  const hearts = computed(() => '♥'.repeat(lives.value) + '♡'.repeat(MAX_LIVES - lives.value))
  const critical = computed(() => playing.value && lives.value === 1)

  function say(tone, head, text) {
    status.value = { id: ++statusId, tone, head, text }
  }

  function begin(name) {
    player.value = name
    started.value = true
    newRound()
  }

  function newRound() {
    const order = shuffle(LETTERS.map((_, i) => i))
    targetIndex.value = order[0]
    bombIndexes.value = order.slice(1, 1 + BOMB_COUNT)

    Object.keys(keyState).forEach((letter) => delete keyState[letter])
    tray.value = []
    result.value = null
    lives.value = MAX_LIVES
    timeLeft.value = TOTAL_TIME
    picks.value = 0
    bombHits.value = 0
    playing.value = true
    setMood('typing')

    say('info', 'آماده‌ای؟', `${player.value}، حرف هدف یکی از همین کلیدهاست. ۲ دقیقه وقت داری، موفق باشی!`)
    clearInterval(timer)
    timer = setInterval(tick, 1000)
  }

  function resetAll() {
    score.value = 0
    newRound()
  }

  function tick() {
    timeLeft.value--
    if (timeLeft.value === 10) {
      say('warn', '۱۰ ثانیه مونده!', `${player.value}، عجله کن؛ هنوز می‌شه!`)
    }
    if (timeLeft.value <= 0) finish('time')
  }

  function press(letter) {
    if (!playing.value || keyState[letter]) return
    picks.value++

    const index = LETTERS.indexOf(letter)
    if (index === targetIndex.value) return hitTarget(letter)
    if (bombIndexes.value.includes(index)) return hitBomb(letter)
    hitNormal(letter)
  }

  function hitTarget(letter) {
    const gain = 100 + timeLeft.value
    score.value += gain
    keyState[letter] = 'hit'
    setMood('happy')
    tray.value.push({ ch: letter, color: CHIP.ok })
    say('ok', 'پیداش کردی!', `${player.value}، ${pick(SAY.win)} +${toFa(gain)}`)
    finish('win')
  }

  function hitBomb(letter) {
    bombHits.value++
    lives.value--
    keyState[letter] = 'bomb'
    setMood('angry', 1800)
    tray.value.push({ ch: letter, color: CHIP.bad })

    shaking.value = true
    setTimeout(() => (shaking.value = false), 400)

    if (lives.value <= 0) return finish('lives')
    if (lives.value === 1) {
      say('bad', 'فقط یک جان مونده', `${player.value}، حواست را جمع کن.`)
    } else {
      say('bad', 'مین!', `${player.value}، ${pick(SAY.bomb)}`)
    }
  }

  function hitNormal(letter) {
    timeLeft.value = Math.max(0, timeLeft.value - TIME_PENALTY)
    keyState[letter] = 'wrong'
    setMood('angry', 1500)
    tray.value.push({ ch: letter, color: CHIP.warn })
    say('warn', `نه، این نبود! −${toFa(TIME_PENALTY)} ثانیه`, `${player.value}، ${pick(SAY.wrong)}`)
    if (timeLeft.value <= 0) finish('time')
  }

  function reject(kind, letter) {
    const [head, text] = inputMessage(kind, player.value, letter)
    say('warn', head, text)
    setMood('angry', 1500)
  }

  function typeLetter(raw) {
    if (!playing.value) return ''
    const text = normalize(raw)
    if (!text) return ''

    let error = ''
    if (text.length > 1) error = 'many'
    else if (/[0-9۰-۹٠-٩]/.test(text)) error = 'digit'
    else if (!isPersianText(text)) error = 'notPersian'
    else if (!LETTERS.includes(text)) error = 'outside'
    else if (keyState[text]) error = 'repeated'

    if (error) {
      reject(error, text)
      return error
    }
    press(text)
    return ''
  }

  function pickVariant(won, how) {
    if (!won) return how === 'time' ? VARIANTS.time : VARIANTS.lives
    if (picks.value === 1) return VARIANTS.first
    if (timeLeft.value <= 10) return VARIANTS.lastSecond
    if (bombHits.value > 0) return VARIANTS.survivor
    if (lives.value === 1) return VARIANTS.lastLife
    return VARIANTS.clean
  }

  function finish(how) {
    if (!playing.value) return
    playing.value = false
    clearInterval(timer)

    const won = how === 'win'
    const target = LETTERS[targetIndex.value]
    setMood(won ? 'happy' : 'angry')

    keyState[target] = 'hit'
    bombIndexes.value.forEach((i) => (keyState[LETTERS[i]] = 'bomb'))

    if (how === 'time') {
      say('warn', 'وقت تموم شد', `«${target}» بود. می‌خوای یک دور دیگه امتحان کنی؟`)
    } else if (how === 'lives') {
      say('bad', 'جان‌هات تموم شد', `«${target}» بود. یک دور دیگه؟`)
    }

    let stars = 0
    if (won) {
      stars = 1
      if (bombHits.value === 0) stars++
      if (timeLeft.value >= 60) stars++
    }

    const data = {
      won,
      stars,
      variant: pickVariant(won, how),
      title: won ? `${player.value}، پیداش کردی!` : `${player.value}، این دور نشد`,
      line: won
        ? `«${target}» همون حرفی بود که دنبالش می‌گشتی.`
        : `حرف هدف «${target}» بود. دور بعد حتماً می‌گیریش.`,
    }
    setTimeout(() => (result.value = data), 1000)
  }

  onUnmounted(() => {
    clearInterval(timer)
    clearTimeout(moodTimer)
  })

  return {
    player, started, playing, score, lives, timeLeft, picks, bombHits,
    keyState, tray, status, result, shaking, mood,
    timeText, timePercent, timeColor, hearts, critical,
    begin, newRound, resetAll, press, typeLetter, reject,
  }
}
