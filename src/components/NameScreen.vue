<script setup>
import { ref } from 'vue'
import { BOMB_COUNT, MAX_LIVES, toFa } from '../data'
import RobotTrio from './RobotTrio.vue'
import FloatLetters from './FloatLetters.vue'

const emit = defineEmits(['start'])

const name = ref('')
const error = ref('')
const active = ref('happy')
const shaking = ref(false)
const going = ref(false)

const says = {
  happy: 'سلام! من کلیدارم. اسمت چیه؟',
  typing: 'دارم اسمت را یادداشت می‌کنم...',
  angry: 'هی! اسمت را ننوشتی!',
}

function onType() {
  error.value = ''
  active.value = 'typing'
}

function go() {
  if (going.value) return

  const n = name.value.trim()
  if (!n) {
    error.value = 'اسمت را بنویس تا بشناسمت.'
    active.value = 'angry'
    shaking.value = true
    setTimeout(() => (shaking.value = false), 400)
    return
  }

  going.value = true
  active.value = 'happy'
  setTimeout(() => emit('start', n), 700)
}
</script>

<template>
  <section class="relative mt-[3vh] flex flex-col items-center gap-3">
    <FloatLetters />

    <RobotTrio :active="active" class="relative" />

    <p
      :key="active"
      class="animate-pop relative rounded-full border border-blue-400/40 bg-[#0e1632]/90 px-5 py-2 text-sm font-bold text-blue-100 shadow-[0_0_18px_rgba(60,123,255,.35)]"
    >
      {{ says[active] }}
    </p>

    <div
      class="relative flex w-full flex-col gap-3 rounded-3xl border border-blue-400/30 bg-[#0e1632]/80 p-6 text-center shadow-[0_0_40px_rgba(60,123,255,.25)] backdrop-blur"
      :class="shaking && 'animate-shake'"
    >
      <h1 class="bg-gradient-to-l from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-5xl font-extrabold text-transparent">
        کلیدار
      </h1>
      <p class="text-sm leading-7 text-slate-400">
        اینجا ۳۰ تا کلید هست و فقط یکی‌شان درست است. حرف هدف را پیدا کن و مواظب مین‌ها باش.
      </p>

      <div class="flex flex-wrap justify-center gap-2 text-xs font-bold">
        <span class="rounded-full border border-red-400/40 bg-red-500/10 px-3 py-1 text-red-300">♥ {{ toFa(MAX_LIVES) }} جان</span>
        <span class="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-cyan-300">⏱ ۲ دقیقه</span>
        <span class="rounded-full border border-bread-300/40 bg-bread-300/10 px-3 py-1 text-bread-300">💣 {{ toFa(BOMB_COUNT) }} مین</span>
      </div>

      <input
        v-model="name"
        maxlength="12"
        placeholder="اسمت چیه؟"
        aria-label="اسمت چیه؟"
        autocomplete="off"
        class="rounded-xl border-2 bg-[#060a1b]/80 p-3 text-center text-xl font-semibold text-white placeholder:text-slate-500"
        :class="error ? 'border-red-500 shadow-[0_0_14px_rgba(255,77,94,.5)]' : 'border-blue-500/60 shadow-[0_0_14px_rgba(60,123,255,.35)]'"
        @input="onType"
        @keydown.enter="go"
      />
      <p class="min-h-6 text-sm text-red-400">{{ error }}</p>

      <button type="button" class="btn-navy py-3 text-base" :disabled="going" @click="go">
        بزن بریم
      </button>
    </div>
  </section>
</template>
