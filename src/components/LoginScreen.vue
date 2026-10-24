<script setup>
import { ref } from 'vue'
import { toFa } from '../data'
import Robot from './Robot.vue'
import FloatLetters from './FloatLetters.vue'

const emit = defineEmits(['login'])

const MIN_USER = 3
const MIN_PASS = 4

const username = ref('')
const password = ref('')
const showPass = ref(false)
const error = ref('')
const mood = ref('typing')
const hop = ref(0)
const message = ref('سلام! وارد شو تا بازی شروع بشه.')
const shaking = ref(false)
const going = ref(false)

function onType() {
  error.value = ''
  mood.value = 'typing'
  hop.value++
  message.value = 'خوبه، ادامه بده...'
}

function fail(text) {
  error.value = text
  message.value = text
  mood.value = 'angry'
  shaking.value = true
  setTimeout(() => (shaking.value = false), 400)
}

function submit() {
  if (going.value) return

  if (username.value.trim().length < MIN_USER) {
    fail(`نام کاربری باید حداقل ${toFa(MIN_USER)} حرف باشد.`)
    return
  }
  if (password.value.length < MIN_PASS) {
    fail(`رمز عبور باید حداقل ${toFa(MIN_PASS)} حرف باشد.`)
    return
  }

  going.value = true
  mood.value = 'happy'
  message.value = 'آفرین! در را برایت باز می‌کنم...'
  setTimeout(() => emit('login', username.value.trim()), 800)
}

function guest() {
  emit('login', '')
}
</script>

<template>
  <section class="relative mt-[2vh] flex flex-col items-center">
    <FloatLetters />

    <p
      :key="message"
      class="animate-pop relative mb-2 max-w-full rounded-full border border-blue-400/40 bg-[#0e1632]/90 px-5 py-2 text-center text-sm font-bold text-blue-100 shadow-[0_0_18px_rgba(60,123,255,.35)]"
    >
      {{ message }}
    </p>

    <Robot :mood="mood" :hop="hop" class="relative z-10 -mb-5 h-44 w-28" />

    <form
      class="relative flex w-full flex-col gap-3 rounded-3xl border border-blue-400/30 bg-[#0e1632]/80 p-6 pt-8 text-center shadow-[0_0_40px_rgba(60,123,255,.25)] backdrop-blur"
      :class="shaking && 'animate-shake'"
      @submit.prevent="submit"
    >
      <h1 class="bg-gradient-to-l from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-4xl font-extrabold text-transparent">
        ورود به کلیدار
      </h1>
      <p class="text-sm text-slate-400">وارد شو و حرف هدف را پیدا کن.</p>

      <label class="flex flex-col gap-1 text-start text-sm font-bold text-blue-200">
        نام کاربری
        <input
          v-model="username"
          dir="ltr"
          autocomplete="username"
          placeholder="مثلاً hedieh"
          class="rounded-xl border-2 border-blue-500/60 bg-[#060a1b]/80 p-3 text-center text-lg font-semibold text-white shadow-[0_0_14px_rgba(60,123,255,.3)] placeholder:text-sm placeholder:font-normal placeholder:text-slate-500"
          @input="onType"
        />
      </label>

      <label class="flex flex-col gap-1 text-start text-sm font-bold text-blue-200">
        رمز عبور
        <span class="relative block">
          <input
            v-model="password"
            dir="ltr"
            :type="showPass ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="رمزت را بنویس"
            class="w-full rounded-xl border-2 border-blue-500/60 bg-[#060a1b]/80 p-3 px-16 text-center text-lg font-semibold text-white shadow-[0_0_14px_rgba(60,123,255,.3)] placeholder:text-sm placeholder:font-normal placeholder:text-slate-500"
            @input="onType"
          />
          <button
            type="button"
            class="absolute inset-y-0 end-3 text-xs font-bold text-cyan-300"
            @click="showPass = !showPass"
          >
            {{ showPass ? 'پنهان' : 'نمایش' }}
          </button>
        </span>
      </label>

      <p class="min-h-6 text-sm text-red-400">{{ error }}</p>

      <button type="submit" class="btn-navy py-3 text-base" :disabled="going">ورود</button>
      <button type="button" class="text-sm text-slate-400 underline" @click="guest">
        ورود به‌عنوان مهمان
      </button>

      <p class="text-xs text-slate-500">این فقط صفحهٔ ظاهری ورود است و جایی ذخیره نمی‌شود.</p>
    </form>
  </section>
</template>
