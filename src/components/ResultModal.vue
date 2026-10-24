<script setup>
import { toFa } from '../data'

defineProps({
  result: { type: Object, required: true },
  score: { type: Number, default: 0 },
  picks: { type: Number, default: 0 },
  bombHits: { type: Number, default: 0 },
})
defineEmits(['again'])
</script>

<template>
  <div class="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto bg-[#030612]/85 p-4">
    <div class="animate-pop flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-white/15 bg-[#0e1632] p-6 text-center">
      <div class="text-3xl tracking-widest text-bread-300" aria-label="ستاره">
        <span v-for="n in 3" :key="n" :class="n <= result.stars ? '' : 'text-slate-600'">★</span>
      </div>
      <h2 class="text-2xl font-extrabold">{{ result.title }}</h2>
      <p class="text-slate-400">{{ result.line }}</p>

      <div class="grid grid-cols-3 gap-2 text-xs text-slate-400">
        <div class="rounded-xl border border-white/15 py-2">
          <b class="block text-xl text-bread-300">{{ toFa(score) }}</b>امتیاز
        </div>
        <div class="rounded-xl border border-white/15 py-2">
          <b class="block text-xl text-bread-300">{{ toFa(picks) }}</b>حدس‌ها
        </div>
        <div class="rounded-xl border border-white/15 py-2">
          <b class="block text-xl text-bread-300">{{ toFa(bombHits) }}</b>مین‌ها
        </div>
      </div>

      <div class="rounded-xl border p-3" :style="{ borderColor: result.variant[2] }">
        <b class="block text-xl" :style="{ color: result.variant[2] }">{{ result.variant[0] }}</b>
        <span class="text-sm text-slate-300">{{ result.variant[1] }}</span>
      </div>

      <button
        type="button"
        class="btn-navy py-3"
        @click="$emit('again')"
      >
        بازی دوباره
      </button>
    </div>
  </div>
</template>
