<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { KEYS, FINISHES, isPersianText, normalize, toFa } from './data'
import { useGame } from './composables/useGame'
import LoginScreen from './components/LoginScreen.vue'
import NameScreen from './components/NameScreen.vue'
import StatusBox from './components/StatusBox.vue'
import KeyCap from './components/KeyCap.vue'
import Robot from './components/Robot.vue'
import SideNote from './components/SideNote.vue'
import ResultModal from './components/ResultModal.vue'

const {
  player, started, playing, score, picks, bombHits,
  keyState, tray, status, result, shaking, mood,
  timeText, timePercent, timeColor, hearts, critical,
  begin, newRound, resetAll, press, typeLetter, reject,
} = useGame()

const loggedIn = ref(false)
const typed = ref('')
const inputBad = ref(false)
const hopKey = ref(0)
const inputEl = ref(null)

let locked = false
let clearTimer = null

function clearBoxLater(delay) {
  clearTimeout(clearTimer)
  clearTimer = setTimeout(() => {
    typed.value = ''
    locked = false
    inputBad.value = false
  }, delay)
}

function flashBad(kind, letter) {
  reject(kind, letter)
  inputBad.value = true
  clearBoxLater(450)
}

function onBeforeInput(event) {
  if (!event.data) return
  if (locked) return event.preventDefault()
  if (isPersianText(event.data)) return
  event.preventDefault()
  flashBad(/[0-9۰-۹٠-٩]/.test(event.data) ? 'digit' : 'notPersian')
}

function onInput() {
  const text = normalize(typed.value)
  if (!text) {
    typed.value = ''
    return
  }

  locked = true
  typed.value = text
  if (typeLetter(text)) {
    inputBad.value = true
    clearBoxLater(450)
    return
  }
  clearBoxLater(300)
}

function focusOnTyping(event) {
  if (event.key.length === 1) hopKey.value++
  if (!playing.value || event.ctrlKey || event.metaKey || event.altKey) return
  if (event.key.length === 1 && document.activeElement !== inputEl.value) {
    inputEl.value?.focus()
  }
}

watch(playing, async (isPlaying) => {
  if (!isPlaying) return
  await nextTick()
  inputEl.value?.focus()
})

onMounted(() => window.addEventListener('keydown', focusOnTyping))
onBeforeUnmount(() => window.removeEventListener('keydown', focusOnTyping))
</script>

<template>
  <div
    class="pointer-events-none fixed inset-0 transition-opacity duration-500"
    :class="critical ? 'opacity-100' : 'opacity-0'"
    style="box-shadow: inset 0 0 120px rgba(255, 40, 70, 0.35)"
  ></div>

  <main class="relative mx-auto flex max-w-xl flex-col gap-3 lg:max-w-3xl">
    <LoginScreen v-if="!loggedIn" @login="loggedIn = true" />

    <NameScreen v-else-if="!started" @start="begin" />

    <div v-else class="flex flex-col gap-3" :class="shaking && 'animate-shake'">
      <div class="flex flex-wrap items-center gap-2">
        <div class="flex-1 rounded-2xl border border-white/10 bg-[#0e1632]/80 px-4 py-2 font-bold">سلام {{ player }}، خیلی به بازی خوش اومدی؛ موفق باشی!</div>
        <div class="rounded-2xl border border-white/10 bg-[#0e1632]/80 px-4 py-1 text-2xl text-red-400">{{ hearts }}</div>
        <div class="rounded-2xl border border-white/10 bg-[#0e1632]/80 px-4 py-2 font-extrabold text-bread-300">★ {{ toFa(score) }}</div>
      </div>

      <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0e1632]/80 px-4 py-3">
        <span dir="ltr" class="w-14 text-xl font-extrabold tabular-nums">{{ timeText }}</span>
        <div class="h-2 flex-1 overflow-hidden rounded bg-white/10">
          <i class="block h-full transition-all duration-500" :class="timeColor" :style="{ width: timePercent + '%' }"></i>
        </div>
      </div>

      <StatusBox :key="status.id" :tone="status.tone" :head="status.head" :text="status.text" />

      <div>
        <div class="flex min-h-14 flex-wrap justify-center gap-1.5 rounded-t-2xl border border-b-0 border-bread-200/30 bg-[#0e1632]/80 p-2">
          <small v-if="!tray.length" class="self-center text-slate-500">حرف‌هایی که می‌زنی اینجا جمع می‌شوند.</small>
          <span
            v-for="t in tray"
            :key="t.ch"
            class="animate-pop grid h-9 w-9 place-items-center rounded-lg text-xl font-extrabold text-white"
            :class="t.color"
          >{{ t.ch }}</span>
        </div>
        <input
          ref="inputEl"
          v-model="typed"
          :disabled="!playing"
          maxlength="3"
          placeholder="یک حرف فارسی بزن"
          aria-label="یک حرف فارسی بزن"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          class="block h-16 w-full rounded-b-2xl border-2 bg-[#060a1b]/80 text-center text-4xl font-extrabold text-white placeholder:text-lg placeholder:font-normal placeholder:text-slate-500 lg:h-20"
          :class="inputBad ? 'animate-shake border-red-500 shadow-[0_0_14px_rgba(255,77,94,.6)]' : 'border-blue-500 shadow-[0_0_14px_rgba(60,123,255,.5)]'"
          @beforeinput="onBeforeInput"
          @input="onInput"
        />
      </div>

      <div class="px-1 pb-8">
        <div dir="ltr" class="kbd grid grid-cols-[repeat(24,minmax(0,1fr))] gap-y-2 rounded-lg border border-blue-500/30 bg-[#060a1b]/90 p-3 pb-4 sm:gap-y-3 sm:p-4 lg:gap-y-5 lg:p-6">
          <KeyCap
            v-for="(key, i) in KEYS"
            :key="key.letter"
            :letter="key.letter"
            :finish="FINISHES[i % FINISHES.length]"
            :state="keyState[key.letter] || ''"
            :disabled="!!keyState[key.letter]"
            :style="{ gridRow: key.row, gridColumn: key.col + ' / span 2' }"
            @press="press(key.letter)"
          />

          <div style="grid-row: 4; grid-column: 1 / span 2; aspect-ratio: 2 / 1.08"></div>
          <Robot :mood="mood" :hop="hopKey" style="grid-row: 3 / span 2; grid-column: 1 / span 3" />
          <SideNote
            :key="status.id"
            :tone="status.tone"
            :head="status.head"
            :text="status.text"
            style="grid-row: 3 / span 2; grid-column: 18 / span 7; margin-inline: clamp(2px, 0.7vw, 8px)"
          />
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/10 bg-[#0e1632]/60 px-4 py-2 text-xs text-slate-400">
        <span class="text-cyan-300">● هدف</span>
        <span class="text-bread-300">● عادی: ۲ ثانیه کم</span>
        <span class="text-red-400">● مین: یک جان کم</span>
        <button type="button" class="rounded-lg border border-bread-200/40 px-3 py-1 text-slate-200" @click="resetAll">بازنشانی</button>
      </div>
    </div>

    <ResultModal
      v-if="result"
      :result="result"
      :score="score"
      :picks="picks"
      :bomb-hits="bombHits"
      @again="newRound"
    />
  </main>
</template>
